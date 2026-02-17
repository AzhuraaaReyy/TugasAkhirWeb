import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  const locations = [
    {
      name: "Posyandu Melati",
      position: [-6.9932, 110.4203],
    },
    {
      name: "Posyandu Mawar",
      position: [-6.9854, 110.4093],
    },
    {
      name: "Posyandu Anggrek",
      position: [-6.9787, 110.4171],
    },
  ];
  return (
    <section
      id="map"
      className="relative py-28 px-6 bg-gray-50 overflow-hidden"
    >
      {/* Background Blob */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40"></div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
          Lokasi Posyandu
        </span>

        <h2 className="mt-5 text-4xl font-bold text-gray-800">
          Posyandu Terdekat
        </h2>

        <p className="mt-5 max-w-2xl mx-auto text-gray-600">
          Temukan lokasi posyandu dan lihat informasi layanan kesehatan balita.
        </p>

        {/* MAP */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-xl border">
          <MapContainer
            center={[-6.99, 110.42]}
            zoom={13}
            style={{ height: "450px", width: "100%" }}
          >
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* LOOP MARKER */}
            {locations.map((loc, index) => (
              <Marker key={index} position={loc.position}>
                <Popup>
                  <strong>{loc.name}</strong>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};
export default Map;
