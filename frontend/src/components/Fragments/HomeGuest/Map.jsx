import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useState, useMemo, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import melatiImg from "../../../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import mawarImg from "../../../assets/images/6342b1cd-16a7-4330-b8b8-95e5f94db39e.png";
import anggrekImg from "../../../assets/images/ae9726d1-a139-4f6b-99f8-8230a88c7e65.png";
import dahliaImg from "../../../assets/images/Foto-by-UM-Surabaya.jpg";
import FadeUp from "../../Animations/FadeUp";
import { motion } from "framer-motion";
import FadeSlide from "../../Animations/FadeSlide";
/* FIX ICON */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

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

  /* DATA */
  const locations = [
    {
      name: "Posyandu Melati",
      kota: "Semarang",
      position: [-6.9932, 110.4203],
      alamat: "Jl. Pandanaran No. 10",
      jadwal: "Senin, 08.00 - 11.00",
      image: melatiImg,
      telepon: "0899999999999",
    },
    {
      name: "Posyandu Mawar",
      kota: "Semarang",
      position: [-6.9854, 110.4093],
      alamat: "Jl. Gajahmada No. 22",
      jadwal: "Rabu, 08.00 - 11.00",
      image: mawarImg,
      telepon: "0899999999999",
    },
    {
      name: "Posyandu Anggrek",
      kota: "Kendal",
      position: [-6.9787, 110.4171],
      alamat: "Jl. Raya Kendal No. 5",
      jadwal: "Selasa, 09.00 - 12.00",
      image: anggrekImg,
      telepon: "0899999999999",
    },
    {
      name: "Posyandu Dahlia",
      kota: "Demak",
      position: [-6.8913, 110.6396],
      alamat: "Jl. Sultan Fatah No. 8",
      jadwal: "Jumat, 08.00 - 10.00",
      image: dahliaImg,
      telepon: "0899999999999",
    },
  ];

  /* STATE */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("Semua");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  /* LIST KOTA */
  const cities = useMemo(() => {
    const unique = [...new Set(locations.map((loc) => loc.kota))];
    return unique;
  }, []);

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
    <section className="py-30 px-6 bg-emerald-50 relative overflow-hidden"  id="map">
      {/* 🌊 FLOATING WAVE */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
        {/* Layer 1 */}
        <svg
          className="block w-full h-[160px] wave-float"
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
          className="absolute bottom-0 block w-full h-[150px] wave-float-slow"
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

      <div className="max-w-7xl mx-auto">
        {/* TITLE */}

        <div className="text-center mb-12">
          <div className="mb-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                Lokasi Posyandu
              </span>
            </motion.div>
          </div>
          <FadeUp delay={200}>
            <h2 className="text-4xl font-bold text-gray-800">
              Cari Posyandu Terdekat
            </h2>
          </FadeUp>
          <FadeSlide direction="right" delay={200}>
            <p className="mt-4 text-gray-600">
              Temukan lokasi dan informasi posyandu berdasarkan kota.
            </p>
          </FadeSlide>
        </div>

        {/* SEARCH PROFESSIONAL */}
        <div className="relative w-96 mx-auto mb-12 z-[9999]" ref={dropdownRef}>
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
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-10">
          {/* MAP */}
          <div className="md:col-span-2 rounded-3xl shadow-xl overflow-hidden border-2 ">
            <FadeUp delay={200}>
              <MapContainer
                center={mapCenter}
                zoom={13}
                style={{ height: "500px", width: "100%" }}
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
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Informasi Posyandu
              </h3>

              {selectedLocation ? (
                <div className="space-y-4 text-sm text-gray-700">
                  <FadeUp delay={200}>
                    <div className="w-full h-48 rounded-2xl overflow-hidden">
                      <img
                        src={selectedLocation.image}
                        alt={selectedLocation.name}
                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      />
                    </div>

                    <div className="space-y-2 justify-center text-justify">
                      <p>
                        🩺 <strong>Nama Posyandu:</strong>{" "}
                        {selectedLocation.name}
                      </p>
                      <p>
                        🏙 <strong>Kota:</strong> {selectedLocation.kota}
                      </p>
                      <p>
                        📍<strong>Alamat:</strong> {selectedLocation.alamat}
                      </p>
                      <p>
                        🕒 <strong>Jadwal:</strong> {selectedLocation.jadwal}
                      </p>
                      <p>
                        📞 <strong>Telepon:</strong> {selectedLocation.telepon}
                      </p>
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
