import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

/* FIX DEFAULT ICON (jaga-jaga kalau pakai Marker di masa depan) */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* =========================
   DATA WILAYAH POSYANDU
========================= */
const data = [
  {
    wilayah: "RW 01",
    balita: 40,
    stunting: 6,
    berisiko: 8,
    coordinates: [-6.9904, 110.4229],
  },
  {
    wilayah: "RW 02",
    balita: 35,
    stunting: 4,
    berisiko: 5,
    coordinates: [-6.9915, 110.4245],
  },
  {
    wilayah: "RW 03",
    balita: 28,
    stunting: 2,
    berisiko: 6,
    coordinates: [-6.9892, 110.4208],
  },
  {
    wilayah: "RW 04",
    balita: 32,
    stunting: 7,
    berisiko: 4,
    coordinates: [-6.9885, 110.4236],
  },
];

const ContentMap = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-10">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800">
        🗺️ Sebaran Kasus Stunting
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Monitoring jumlah balita, kasus stunting, dan risiko per wilayah.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= LEFT SIDE ================= */}
        <div className="space-y-6">
          {data.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">{item.wilayah}</h3>
                <span className="text-sm text-gray-500">
                  {item.balita} Balita
                </span>
              </div>

              <div className="flex gap-4 mt-3 text-sm">
                <span className="text-red-500 font-medium">
                  🔴 {item.stunting} Stunting
                </span>
                <span className="text-amber-500 font-medium">
                  🟠 {item.berisiko} Berisiko
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT SIDE MAP ================= */}
        <div className="h-[400px] w-full rounded-2xl overflow-hidden">
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

            {data.map((item, i) => (
              <CircleMarker
                key={i}
                center={item.coordinates}
                radius={14}
                pathOptions={{
                  color: "#ffffff",
                  weight: 3,
                  fillColor:
                    item.stunting > 5
                      ? "#EF4444" // merah (tinggi)
                      : item.stunting > 3
                        ? "#F59E0B" // kuning (sedang)
                        : "#10B981", // hijau (rendah)
                  fillOpacity: 1,
                }}
              >
                {/* ICON STATUS DI ATAS MARKER */}
                <Tooltip
                  direction="top"
                  offset={[0, -12]}
                  opacity={1}
                  permanent
                  className="!bg-transparent !border-none !shadow-none"
                >
                  <div className="text-lg">
                    {item.stunting > 5 ? "🚨" : item.stunting > 3 ? "⚠️" : "📍"}
                  </div>
                </Tooltip>

                {/* POPUP DETAIL */}
                <Popup>
                  <strong>{item.wilayah}</strong>
                  <br />
                  Total Balita: {item.balita}
                  <br />
                  Stunting: {item.stunting}
                  <br />
                  Berisiko: {item.berisiko}
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default ContentMap;
