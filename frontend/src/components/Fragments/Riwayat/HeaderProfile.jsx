import React from "react";
import { Plus, ArrowUpRight } from "lucide-react";
import gambar1 from "../../../assets/images/lanang.png";
import gambar2 from "../../../assets/images/wedok.png";
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
              {Math.floor(form.umur)} Bulan
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

        <button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm shadow-emerald-200">
          <Plus size={18} />
          Input Pemeriksaan Baru
        </button>
      </div>

      {/* Ringkasan Tumbuh Kembang */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-base mb-4">
          Ringkasan Tumbuh Kembang
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Perkembangan <span className="text-gray-300">(vs bulan lalu)</span>
        </p>

        <div className="space-y-4 text-sm">
          {["Berat Badan", "Tinggi Badan", "Lingkar Kepala"].map((item) => (
            <div key={item} className="flex justify-between items-center">
              <span className="text-gray-600">{item}</span>
              <span className="text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                Naik <ArrowUpRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Catatan Dokter */}
      <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
        <h3 className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2">
          <span>📋</span> Catatan Dokter
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          "{form.doctorNotes}"
        </p>
        <span className="block mt-3 text-xs text-gray-400 font-medium">
          — {form.doctorName}
        </span>
      </div>
    </div>
  );
}
