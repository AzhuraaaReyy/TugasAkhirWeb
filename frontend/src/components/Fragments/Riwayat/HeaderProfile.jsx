import React from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import gambar1 from "../../../assets/images/lanang.png";
import gambar2 from "../../../assets/images/wedok.png";
import { NavLink } from "react-router-dom";
export default function HeaderProfile({ form }) {
  const statusColor = {
    // TBU
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",

    "Pendek (stunted)": "bg-yellow-400 text-white",

    Normal: "bg-green-500 text-white",

    Tinggi: "bg-blue-500 text-white",

    // BBU
    "Berat badan sangat kurang (severely underweight)": "bg-red-600 text-white",

    "Berat badan kurang (underweight)": "bg-yellow-400 text-white",

    "Berat badan normal": "bg-green-500 text-white",

    "Risiko berat badan lebih": "bg-blue-500 text-white",

    // BBTB
    "Gizi buruk (severely wasted)": "bg-red-600 text-white",

    "Gizi kurang (wasted)": "bg-yellow-400 text-white",

    "Gizi baik (normal)": "bg-green-500 text-white",

    "Berisiko gizi lebih (possible risk of overweight)":
      "bg-blue-300 text-white",

    "Gizi lebih (overweight)": "bg-blue-500 text-white",

    "Obesitas (obese)": "bg-purple-600 text-white",
  };

  const profileImage =
    form.jk === "L" ? gambar1 : form.jk === "P" ? gambar2 : gambar1;
  return (
    <div className="w-full md:w-80 flex flex-col gap-6">
      {/* Card Utama Profil */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm flex flex-col items-center">
        <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-emerald-200 bg-gray-100 mb-4">
          <img
            src={profileImage}
            alt={form.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800">{form.name}</h2>
        <span
          className={`mt-2 px-4 py-1 text-xs font-bold rounded-full ${
            statusColor[form.status] ||
            "bg-gray-100 text-gray-700 border border-gray-200"
          }`}
        >
          {form.status}
        </span>

        <div className="w-full mt-6 space-y-4 text-sm">
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Ibu</span>
            <span className="font-semibold text-gray-700">
              {form.orang_tua}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-gray-400">Usia</span>
            <span className="font-semibold text-gray-700">
              {form.umur} Bulan
            </span>
          </div>
          <div className="flex justify-between pb-1">
            <span className="text-gray-400">Jenis Kelamin</span>
            <span className="font-semibold text-gray-700">
              {form.jk === "L"
                ? "Laki-laki"
                : form.jk === "P"
                  ? "Perempuan"
                  : ""}{" "}
            </span>
          </div>
        </div>
        <NavLink to="/kader/deteksidini">
          <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm shadow-emerald-200">
            <Plus size={18} />
            Input Pemeriksaan Baru
          </button>
        </NavLink>
      </div>
    </div>
  );
}
