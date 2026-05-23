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
import { useEffect, useState } from "react";
import api from "@/services/api";

import "leaflet.heat/dist/leaflet-heat.js";

/* ================= FIX DEFAULT ICON ================= */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ================= STATUS CONFIG ================= */
const STUNTING_STATUS = [
  {
    label: "Normal",
    color: "#10B981",
    description:
      "Jumlah kasus stunting tergolong rendah dan kondisi wilayah masih terkendali.",
  },
  {
    label: "Waspada",
    color: "#F59E0B",
    description:
      "Terdapat peningkatan risiko stunting sehingga perlu dilakukan pemantauan.",
  },
  {
    label: "Stunting Tinggi",
    color: "#EF4444",
    description:
      "Jumlah kasus stunting relatif tinggi dan memerlukan perhatian khusus.",
  },
];

/* ================= HELPER ================= */
const getMarkerStyle = (stunting) => {
  if (stunting > 5) {
    return {
      color: "#EF4444",
      label: "Stunting Tinggi",
    };
  }

  if (stunting > 3) {
    return {
      color: "#F59E0B",
      label: "Waspada",
    };
  }

  return {
    color: "#10B981",
    label: "Normal",
  };
};

/* ================= HEATMAP COMPONENT ================= */
const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length || !L.heatLayer) return;

    const points = data
      .filter((item) => item.coordinates && item.stunting > 0)
      .map((item) => [
        item.coordinates[0],
        item.coordinates[1],
        Number(item.stunting) || 1,
      ]);

    if (!points.length) return;

    const heat = L.heatLayer(points, {
      radius: 50,
      blur: 30,
      maxZoom: 17,
      max: 10,
      gradient: {
        0.2: "#10B981",
        0.5: "#F59E0B",
        0.8: "#FB923C",
        1.0: "#EF4444",
      },
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

/* ================= LEGEND COMPONENT ================= */
const MapLegend = () => {
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4 bg-gray-50">
        <h3 className="text-base font-semibold text-gray-800">
          Klasifikasi Indikator Stunting
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Keterangan warna pada peta berdasarkan tingkat kasus stunting di
          setiap wilayah.
        </p>
      </div>

      {/* Content */}
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

/* ================= MAIN COMPONENT ================= */
const ContentMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/mapposyandu").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* ================= HEADER ================= */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Sebaran Kasus Stunting
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Monitoring jumlah balita, kasus stunting, dan risiko wilayah
          berdasarkan data posyandu.
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

            {/* ================= HEATMAP ================= */}
            <HeatmapLayer data={data} />

            {/* ================= MARKER ================= */}
            {data.map((item, index) => {
              const marker = getMarkerStyle(item.stunting);

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
                    <div className="min-w-[180px]">
                      <h3 className="font-semibold text-gray-800 mb-3">
                        {item.wilayah}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between gap-4">
                          <span>Status</span>
                          <span className="font-medium">{marker.label}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Total Balita</span>
                          <span className="font-medium">{item.balita}</span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Stunting</span>
                          <span className="font-medium text-red-500">
                            {item.stunting}
                          </span>
                        </div>

                        <div className="flex justify-between gap-4">
                          <span>Berisiko</span>
                          <span className="font-medium text-amber-500">
                            {item.berisiko}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* ================= LIST DATA ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.map((item, index) => {
            const marker = getMarkerStyle(item.stunting);

            return (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base">
                      {item.wilayah}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Status wilayah: {marker.label}
                    </p>
                  </div>

                  <div
                    className="w-4 h-4 rounded-full mt-1"
                    style={{ backgroundColor: marker.color }}
                  />
                </div>

                {/* Statistik */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-500">Balita</p>

                    <h4 className="text-lg font-semibold text-gray-800 mt-1">
                      {item.balita}
                    </h4>
                  </div>

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
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= LEGEND ================= */}
        <MapLegend />
      </div>
    </div>
  );
};

export default ContentMap;
