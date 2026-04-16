import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useEffect, useState } from "react";
import api from "@/services/api";

// ✅ FIX PENTING: import yang benar
import "leaflet.heat/dist/leaflet-heat.js";

/* FIX DEFAULT ICON */
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ================= HEATMAP COMPONENT ================= */
const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !data.length || !L.heatLayer) {
      console.log("Heatmap belum siap:", {
        map: !!map,
        data: data.length,
        heat: !!L.heatLayer,
      });
      return;
    }

    // ✅ mapping data
    const points = data
      .filter((item) => item.coordinates && item.stunting > 0)
      .map((item) => [
        item.coordinates[0], // lat
        item.coordinates[1], // lng
        Number(item.stunting) || 1, // weight minimal 1
      ]);

    console.log("POINTS HEATMAP:", points);

    if (!points.length) return;

    const heat = L.heatLayer(points, {
      radius: 50,
      blur: 30,
      maxZoom: 17,
      max: 10, // biar tetap terlihat walau data kecil
      gradient: {
        0.2: "green",
        0.5: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    });

    heat.addTo(map);

    // cleanup biar tidak double
    return () => {
      map.removeLayer(heat);
    };
  }, [map, data]);

  return null;
};

/* ================= MAIN COMPONENT ================= */
const ContentMap = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/mapposyandu").then((res) => {
      console.log("DATA API:", res.data);
      setData(res.data);
    });
  }, []);
  console.log(
    "COORDINATES:",
    data.map((d) => d.coordinates),
  );

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

        {/* ================= MAP ================= */}
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

            {/* ✅ HEATMAP */}
            <HeatmapLayer data={data} />

            {/* ✅ MARKER */}
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
                      ? "#EF4444"
                      : item.stunting > 3
                        ? "#F59E0B"
                        : "#10B981",
                  fillOpacity: 1,
                }}
              >
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
