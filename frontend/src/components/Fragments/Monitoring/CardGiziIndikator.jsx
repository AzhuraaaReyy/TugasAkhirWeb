import React, { useState } from "react";

export const CardGiziIndikator = ({ data }) => {
  const [aktif, setAktif] = useState("stunting");

  // Mendukung data lama (angka = TB/U) maupun objek { tbu, bbu, bbtb }
  const zMap = typeof data === "number" ? { tbu: data } : data || {};
  const key =
    aktif === "stunting" ? "tbu" : aktif === "underweight" ? "bbu" : "bbtb";
  const raw = zMap[key];
  const score = Number(raw);
  const adaZ = raw !== null && raw !== undefined && raw !== "" && !isNaN(score);

  // ===== Posisi pointer per indikator (struktur sama seperti kode awal) =====
  const getPosisiStunting = (s) => {
    if (s < -3) return { label: "Sangat pendek", left: "12.5%" };
    if (s >= -3 && s < -2) return { label: "Pendek", left: "37.5%" };
    if (s >= -2 && s <= 3) return { label: "Normal", left: "62.5%" };
    return { label: "Tinggi", left: "87.5%" };
  };

  const getPosisiUnderweight = (s) => {
    if (s < -3) return { label: "Sangat kurang", left: "12.5%" };
    if (s >= -3 && s < -2) return { label: "BB kurang", left: "37.5%" };
    if (s >= -2 && s <= 1) return { label: "Normal", left: "62.5%" };
    return { label: "Risiko BB lebih", left: "87.5%" };
  };

  // Wasting punya 6 segmen -> tiap segmen ~16.67%, titik tengahnya:
  const getPosisiWasting = (s) => {
    if (s < -3) return { label: "Gizi buruk", left: "8.33%" };
    if (s >= -3 && s < -2) return { label: "Gizi kurang", left: "25%" };
    if (s >= -2 && s <= 1) return { label: "Gizi baik", left: "41.67%" };
    if (s > 1 && s <= 2) return { label: "Berisiko lebih", left: "58.33%" };
    if (s > 2 && s <= 3) return { label: "Gizi lebih", left: "75%" };
    return { label: "Obesitas", left: "91.67%" };
  };

  const indicator =
    aktif === "stunting"
      ? getPosisiStunting(score)
      : aktif === "underweight"
        ? getPosisiUnderweight(score)
        : getPosisiWasting(score);

  const deskripsi = {
    stunting:
      "Indikator ini membantu memantau pertumbuhan tinggi badan si kecil dibandingkan anak seusianya berdasarkan standar WHO. Semakin dekat dengan area hijau, semakin sesuai pertumbuhan anak dengan usianya.",
    underweight:
      "Indikator ini membandingkan berat badan si kecil dengan anak seusianya berdasarkan standar WHO. Area hijau menandakan berat badan yang sesuai dengan usianya.",
    wasting:
      "Indikator ini membandingkan berat badan si kecil dengan tinggi badannya berdasarkan standar WHO. Area hijau menandakan gizi yang baik dan proporsional.",
  }[aktif];

  const tabs = [
    { id: "stunting", judul: "Stunting (TB/U)" },
    { id: "underweight", judul: "Underweight (BB/U)" },
    { id: "wasting", judul: "Wasting (BB/TB)" },
  ];

  return (
    <div className="w-full p-6 bg-white rounded-3xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7 border-2 border-gray-100">
      <h4 className="text-lg font-extrabold text-gray-800 mb-2 ">
        Indikator Status Gizi{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
          (Berdasarkan Z-Score WHO)
        </span>
      </h4>

      {/* FILTER INDIKATOR */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setAktif(t.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              aktif === t.id
                ? "bg-emerald-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t.judul}
          </button>
        ))}
      </div>

      <p className="text-sm text-black leading-relaxed mb-5 text-justify">
        {deskripsi}
      </p>

      {/* Bar Indikator */}
      <div className="relative w-full h-20 flex rounded-xl overflow-hidden border border-gray-100">
        {/* ===== STUNTING (TB/U) ===== */}
        {aktif === "stunting" && (
          <>
            <div className="flex-1 bg-red-100 flex items-center justify-center text-[12px] font-bold text-red-500 flex-col">
              <span>&lt;-3 SD</span> <span>Sangat Pendek</span>
            </div>
            <div className="flex-1 bg-orange-50 flex items-center justify-center text-[12px] font-bold text-orange-600 flex-col">
              <span>-3 s.d &lt;-2 SD</span> <span>Pendek</span>
            </div>
            <div className="flex-1 bg-emerald-50 border-x border-emerald-200 flex items-center justify-center text-[12px] font-bold text-emerald-700 flex-col">
              <span>-2 s.d 3 SD</span> <span>Normal</span>
            </div>
            <div className="flex-1 bg-blue-50 flex items-center justify-center text-[12px] font-bold text-blue-600 flex-col">
              <span>&gt;3 SD</span> <span>Tinggi</span>
            </div>
          </>
        )}

        {/* ===== UNDERWEIGHT (BB/U) ===== */}
        {aktif === "underweight" && (
          <>
            <div className="flex-1 bg-red-100 flex items-center justify-center text-[12px] font-bold text-red-500 flex-col">
              <span>&lt;-3 SD</span> <span>Sangat Kurang</span>
            </div>
            <div className="flex-1 bg-orange-50 flex items-center justify-center text-[12px] font-bold text-orange-600 flex-col">
              <span>-3 s.d &lt;-2 SD</span> <span>BB Kurang</span>
            </div>
            <div className="flex-1 bg-emerald-50 border-x border-emerald-200 flex items-center justify-center text-[12px] font-bold text-emerald-700 flex-col">
              <span>-2 s.d +1 SD</span> <span>Normal</span>
            </div>
            <div className="flex-1 bg-blue-50 flex items-center justify-center text-[12px] font-bold text-blue-600 flex-col">
              <span>&gt;+1 SD</span> <span>Risiko Lebih</span>
            </div>
          </>
        )}

        {/* ===== WASTING (BB/TB) ===== */}
        {aktif === "wasting" && (
          <>
            <div className="flex-1 bg-red-100 flex items-center justify-center text-[11px] font-bold text-red-500 flex-col text-center px-0.5">
              <span>&lt;-3 SD</span> <span>Gizi Buruk</span>
            </div>
            <div className="flex-1 bg-orange-50 flex items-center justify-center text-[11px] font-bold text-orange-600 flex-col text-center px-0.5">
              <span>-3 s.d &lt;-2</span> <span>Gizi Kurang</span>
            </div>
            <div className="flex-1 bg-emerald-50 border-x border-emerald-200 flex items-center justify-center text-[11px] font-bold text-emerald-700 flex-col text-center px-0.5">
              <span>-2 s.d +1</span> <span>Gizi Baik</span>
            </div>
            <div className="flex-1 bg-amber-50 flex items-center justify-center text-[11px] font-bold text-amber-600 flex-col text-center px-0.5">
              <span>+1 s.d +2</span> <span>Berisiko Lebih</span>
            </div>
            <div className="flex-1 bg-blue-50 flex items-center justify-center text-[11px] font-bold text-blue-600 flex-col text-center px-0.5">
              <span>+2 s.d +3</span> <span>Gizi Lebih</span>
            </div>
            <div className="flex-1 bg-purple-100 flex items-center justify-center text-[11px] font-bold text-purple-700 flex-col text-center px-0.5">
              <span>&gt;+3 SD</span> <span>Obesitas</span>
            </div>
          </>
        )}

        {/* Pointer */}
        {adaZ && (
          <div
            className="absolute bottom-0 transition-all duration-500 ease-in-out"
            style={{
              left: indicator.left,
              transform: "translateX(-50%)",
            }}
          >
            <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-800"></div>
          </div>
        )}
      </div>

      <p className="text-xs text-center mt-3 text-gray-500 font-medium">
        {adaZ ? (
          <>
            Nilai Z-Score saat ini:{" "}
            <span className="font-bold text-gray-800">{score}</span> —{" "}
            <span className="font-bold text-gray-800">{indicator.label}</span>
          </>
        ) : (
          "Data z-score untuk indikator ini belum tersedia."
        )}
      </p>
    </div>
  );
};
