import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useState, useMemo, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import FadeUp from "../../Animations/FadeUp";
import FadeSlide from "../../Animations/FadeSlide";
import api from "@/services/api";

/* FIX ICON */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* BASE URL BACKEND (untuk gambar di public/) */
const BASE = (api.defaults.baseURL || "").replace(/\/api\/?$/, "");

const urlGambar = (g) => {
  if (!g) return `${BASE}/posyandu/default.jpg`;
  return g.startsWith("http") ? g : `${BASE}/${g}`;
};

/* AUTO MOVE MAP */
function ChangeMapView({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

const Map = () => {
  const dropdownRef = useRef(null);

  /* DATA DARI BACKEND */
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api
      .get("/posyanduguest")
      .then((res) => {
        const data = res.data.data || [];
        const mapped = data
          .filter((p) => p.latitude && p.longitude)
          .map((p) => ({
            name: p.nama_posyandu,
            kota: p.kota,
            position: [Number(p.latitude), Number(p.longitude)],
            alamat: p.alamat,
            jadwal: p.jadwal,
            image: urlGambar(p.gambar),
            telepon: p.telepon,
          }));
        setLocations(mapped);
      })
      .catch((err) => console.error(err.response?.data || err.message));
  }, []);

  /* STATE */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  /* LIST KOTA */
  const cities = useMemo(() => {
    const unique = [...new Set(locations.map((loc) => loc.kota))];
    return unique;
  }, [locations]);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  /* FILTER MARKER */
  const filteredLocations =
    selectedCity === "Semua"
      ? locations
      : locations.filter((loc) => loc.kota === selectedCity);

  /* AUTO CENTER */
  const mapCenter =
    filteredLocations.length > 0
      ? filteredLocations[0].position
      : [-6.99, 110.42];

  /* CLOSE DROPDOWN */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className="py-16 md:py-28 px-4 sm:px-6 bg-emerald-50 relative overflow-hidden"
      id="map"
    >
      <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
      <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
      <div className="absolute -top-20 right-130 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
      {/* 🌊 FLOATING WAVE */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        {/* Layer 1 */}
        <svg
          className="block w-full h-[90px] sm:h-[160px] wave-float"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#9bf4ca"
            fillOpacity="0.5"
            d="M0,224L80,176C160,128,320,128,480,170.7C640,213,800,299,960,293.3C1120,288,1280,192,1360,144L1440,96L1440,320L0,320Z"
          />
        </svg>

        {/* Layer 2 */}
        <svg
          className="absolute bottom-0 block w-full h-[80px] sm:h-[150px] wave-float-slow"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#00ff80"
            fillOpacity="0.3"
            d="M0,192L120,208C240,224,480,256,720,229.3C960,203,1200,117,1320,74.7L1440,32L1440,320L0,320Z"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* TITLE */}

        <div className="text-center mb-10 md:mb-12">
          <div className="mb-5"></div>
          <FadeUp delay={200}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Cari Posyandu Terdekat
            </h2>
          </FadeUp>
          <FadeSlide direction="right" delay={200}>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Temukan lokasi dan informasi posyandu berdasarkan kota.
            </p>
          </FadeSlide>
        </div>

        {/* SEARCH PROFESSIONAL */}
        <div
          className="relative w-full max-w-sm mx-auto mb-10 md:mb-12 z-[9999]"
          ref={dropdownRef}
        >
          <FadeUp delay={300}>
            <input
              type="text"
              placeholder="Cari kota..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setOpenDropdown(true);
              }}
              onFocus={() => setOpenDropdown(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const found = cities.find(
                    (city) => city.toLowerCase() === searchTerm.toLowerCase(),
                  );
                  if (found) {
                    setSelectedCity(found);
                    setSearchTerm(found);
                    setOpenDropdown(false);
                    setSelectedLocation(null);
                  }
                }
              }}
              className="w-full px-5 py-3 rounded-2xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            {openDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border max-h-64 overflow-y-auto z-[9999]">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedCity(city);
                        setSearchTerm(city);
                        setOpenDropdown(false);
                        setSelectedLocation(null);
                      }}
                      className="px-4 py-3 hover:bg-emerald-50 cursor-pointer transition text-sm"
                    >
                      {city}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400 text-sm">
                    Kota tidak ditemukan
                  </div>
                )}
              </div>
            )}
          </FadeUp>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-10">
          {/* MAP */}
          <div className="md:col-span-2 rounded-3xl shadow-xl overflow-hidden border-2 ">
            <FadeUp delay={200}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                className="h-[380px] sm:h-[500px] w-full"
              >
                <ChangeMapView center={mapCenter} />

                <TileLayer
                  attribution="© OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredLocations.map((loc, index) => (
                  <Marker
                    key={index}
                    position={loc.position}
                    eventHandlers={{
                      click: () => setSelectedLocation(loc),
                    }}
                  >
                    <Popup>
                      <strong>{loc.name}</strong>
                      <br />
                      {loc.kota}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </FadeUp>
          </div>

          {/* SIDEBAR */}
          <div className="bg-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.5)] p-6 border-2">
            <FadeUp delay={200}>
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">
                Informasi Posyandu
              </h3>

              {selectedLocation ? (
                <div className="space-y-4 text-sm text-gray-700">
                  <FadeUp delay={200}>
                    <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden">
                      <img
                        src={selectedLocation.image}
                        alt={selectedLocation.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="mt-5 space-y-2">
                      <div className="grid grid-cols-[140px_1fr]">
                        <strong>Nama Posyandu</strong>
                        <span>: {selectedLocation.name}</span>
                      </div>

                      <div className="grid grid-cols-[140px_1fr]">
                        <strong>Kota</strong>
                        <span>: {selectedLocation.kota}</span>
                      </div>

                      <div className="grid grid-cols-[140px_1fr]">
                        <strong>Alamat</strong>
                        <span>: {selectedLocation.alamat}</span>
                      </div>

                      <div className="grid grid-cols-[140px_1fr]">
                        <strong>Jadwal</strong>
                        <span>: {selectedLocation.jadwal}</span>
                      </div>

                      <div className="grid grid-cols-[140px_1fr]">
                        <strong>Telepon</strong>
                        <span>: {selectedLocation.telepon}</span>
                      </div>
                    </div>
                  </FadeUp>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Pilih kota atau klik marker untuk melihat detail.
                </p>
              )}
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;
