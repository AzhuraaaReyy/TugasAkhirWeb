import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/services/api";

import "leaflet.heat/dist/leaflet-heat.js";

/* FIX DEFAULT ICON */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* STATUS CONFIG */
const STUNTING_STATUS = [
  {
    label: "Normal",
    color: "#10B981",
    description:
      "Anak-anak di wilayah ini tumbuh normal. Wilayah tampil hijau pada peta.",
  },
  {
    label: "Berisiko",
    color: "#FB923C",
    description:
      "Terdapat anak pendek (stunted) yang perlu dipantau dan dibina. Wilayah tampil kuning-orange pada peta.",
  },
  {
    label: "Stunting Tinggi",
    color: "#EF4444",
    description:
      "Terdapat anak sangat pendek (severely stunted) yang butuh penanganan segera. Wilayah tampil merah pekat pada peta.",
  },
];

/* HELPER */
const getMarkerStyle = (item) => {
  const persen = item.persen_stunting ?? 0;
  const kasus = item.stunting ?? 0;
  const berisiko = item.berisiko ?? 0;

  if (persen >= 30 || kasus >= 3) {
    return { color: "#EF4444", label: "Stunting Tinggi" };
  }
  if (kasus > 0 || berisiko > 0) {
    return { color: "#FB923C", label: "Berisiko" };
  }
  return { color: "#10B981", label: "Normal" };
};

/* HEATMAP COMPONENT */
const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length || !L.heatLayer) return;

    const points = data
      .filter((item) => item.coordinates && (item.terdeteksi ?? 0) > 0)
      .map((item) => [
        item.coordinates[0],
        item.coordinates[1],
        Math.max(Number(item.intensitas) || 0, 0.12),
      ]);

    if (!points.length) return;

    const heat = L.heatLayer(points, {
      radius: 80, // lebih lebar agar gradasinya halus
      blur: 55,
      maxZoom: 15,
      max: 1, // skor sudah 0..1, jadi max tetap 1
      minOpacity: 0.35, // wilayah normal (hijau) tetap terlihat
      gradient: {
        0.12: "#22C55E", // hijau   : normal
        0.3: "#84CC16", // hijau-kuning
        0.5: "#FACC15", // kuning  : mulai berisiko
        0.65: "#FB923C", // orange  : berisiko
        0.85: "#EF4444", // merah   : stunting
        1.0: "#7F1D1D", // merah tua: sangat parah
      },
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

/* AUTO FIT KE SEMUA TITIK */
const FitBounds = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    const titik = data.filter((d) => d.coordinates).map((d) => d.coordinates);
    if (titik.length) {
      map.fitBounds(titik, { padding: [40, 40], maxZoom: 16 });
    }
  }, [map, data]);

  return null;
};

/* LEGEND COMPONENT */
const MapLegend = () => {
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="border-b border-gray-100 px-5 py-4 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-800">
          Klasifikasi Indikator Stunting
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Merah berarti banyak anak terindikasi stunting, orange berarti
          berisiko, dan hijau berarti normal.
        </p>
      </div>

      {/* Gradasi warna heatmap (mirip skala atlas) */}
      <div className="px-5 pt-4">
        <div
          className="h-3 w-full rounded-full"
          style={{
            background:
              "linear-gradient(to right, #22C55E, #84CC16, #FACC15, #FB923C, #EF4444, #7F1D1D)",
          }}
        />
        <div className="flex justify-between text-[11px] text-gray-500 mt-1">
          <span>Normal</span>
          <span>Berisiko</span>
          <span>Stunting Tinggi</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3">
        {STUNTING_STATUS.map((status, index) => (
          <div
            key={index}
            className="p-5 border-r last:border-r-0 border-gray-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: status.color }}
              />
              <h4 className="font-semibold text-gray-800">{status.label}</h4>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              {status.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* MAIN COMPONENT */
const ContentMap = () => {
  const [data, setData] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    api.get("/heatmap").then((res) => {
      const bersih = (res.data || [])
        .map((d) => ({
          ...d,
          coordinates:
            d.coordinates &&
            d.coordinates.length === 2 &&
            Number(d.coordinates[0]) &&
            Number(d.coordinates[1])
              ? [Number(d.coordinates[0]), Number(d.coordinates[1])]
              : null,
        }))
        .filter((d) => d.coordinates);

      setData(bersih);
    });
  }, []);

  const scrollByPage = (dir) => {
    const el = sliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Sebaran Kasus Stunting
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Semakin merah warna wilayah, semakin banyak anak terindikasi stunting.
          Orange berarti berisiko, hijau berarti normal.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* ================= MAP ================= */}
        <div className="relative z-0 h-[450px] w-full rounded-2xl overflow-hidden border border-gray-100">
          <MapContainer
            center={[-6.9904, 110.4229]}
            zoom={15}
            scrollWheelZoom={false}
            className="h-full w-full"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <HeatmapLayer data={data} />
            <FitBounds data={data} />

            {/* ================= MARKER ================= */}
            {data.map((item, index) => {
              const marker = getMarkerStyle(item);

              return (
                <CircleMarker
                  key={index}
                  center={item.coordinates}
                  radius={12}
                  pathOptions={{
                    color: "#ffffff",
                    weight: 2,
                    fillColor: marker.color,
                    fillOpacity: 0.9,
                  }}
                >
                  <Popup>
                    <div className="min-w-[190px]">
                      <h3 className="font-semibold text-gray-800 mb-1">
                        {item.wilayah}
                      </h3>
                      {item.alamat && (
                        <p className="text-xs text-gray-500 mb-3">
                          {item.alamat}
                        </p>
                      )}

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between gap-4">
                          <span>Status</span>
                          <span className="font-medium">{marker.label}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Total Balita</span>
                          <span className="font-medium">{item.balita}</span>
                        </div>

                        {item.terdeteksi != null && (
                          <div className="flex justify-between gap-4">
                            <span>Sudah Dideteksi</span>
                            <span className="font-medium">
                              {item.terdeteksi}
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between gap-4">
                          <span>Stunting</span>
                          <span className="font-medium text-red-500">
                            {item.stunting}
                            {item.persen_stunting != null
                              ? ` (${item.persen_stunting}%)`
                              : ""}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Berisiko</span>
                          <span className="font-medium text-amber-500">
                            {item.berisiko}
                            {item.persen_berisiko != null
                              ? ` (${item.persen_berisiko}%)`
                              : ""}
                          </span>
                        </div>

                        {item.normal != null && (
                          <div className="flex justify-between gap-4">
                            <span>Normal</span>
                            <span className="font-medium text-emerald-600">
                              {item.normal}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* ================= LIST DATA (SLIDER) ================= */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-gray-800">
              Ringkasan Posyandu
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByPage(-1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                aria-label="Sebelumnya"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() => scrollByPage(1)}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                aria-label="Berikutnya"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth pb-2"
          >
            {data.length === 0 && (
              <p className="text-sm text-gray-400 py-6">
                Belum ada data posyandu.
              </p>
            )}

            {data.map((item, index) => {
              const marker = getMarkerStyle(item);

              return (
                <div
                  key={index}
                  className="snap-start shrink-0 w-[85%] sm:w-[60%] md:w-[calc(50%-0.5rem)] rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-base">
                        {item.wilayah}
                      </h3>
                      {item.alamat && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.alamat}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Status wilayah: {marker.label}
                      </p>
                    </div>

                    <div
                      className="w-4 h-4 rounded-full mt-1"
                      style={{ backgroundColor: marker.color }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-5">
                    <div className="rounded-xl bg-red-50 p-3 text-center">
                      <p className="text-xs text-red-500">Stunting</p>
                      <h4 className="text-lg font-semibold text-red-600 mt-1">
                        {item.stunting}
                      </h4>
                    </div>

                    <div className="rounded-xl bg-amber-50 p-3 text-center">
                      <p className="text-xs text-amber-500">Berisiko</p>
                      <h4 className="text-lg font-semibold text-amber-600 mt-1">
                        {item.berisiko}
                      </h4>
                    </div>

                    <div className="rounded-xl bg-emerald-50 p-3 text-center">
                      <p className="text-xs text-emerald-600">Normal</p>
                      <h4 className="text-lg font-semibold text-emerald-700 mt-1">
                        {item.normal}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= LEGEND ================= */}
        <MapLegend />
      </div>
    </div>
  );
};

export default ContentMap;
