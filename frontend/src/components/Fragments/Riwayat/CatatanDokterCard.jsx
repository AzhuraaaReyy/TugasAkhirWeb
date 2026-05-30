import React from "react";
import { MessageSquare, Heart, ShieldAlert, UserCheck } from "lucide-react";

export default function Catatan({ form }) {
  const { status, name, lokasi_posyandu, kader_pemeriksa } = form;

  // 1. Ambil semua string status (karena status di controller berupa array/objek)
  const statusString =
    typeof status === "object" ? Object.values(status).join(" ") : status || "";
  const statusLower = statusString.toLowerCase();

  // 2. Logika Deteksi Status yang Sesuai dengan Controller PHP Anda
  const isPerluRujuk =
    statusLower.includes("stunting") ||
    statusLower.includes("wasting") ||
    statusLower.includes("buruk") ||
    statusLower.includes("kurang") ||
    statusLower.includes("underweight") ||
    statusLower.includes("pendek");

  const isRisikoBB =
    statusLower.includes("risiko") ||
    statusLower.includes("lebih") ||
    statusLower.includes("overweight") ||
    statusLower.includes("obesitas");

  // 3. Konten Dinamis
  const getCatatan = () => {
    if (isRisikoBB)
      return `Berat badan ${name || "anak"} terpantau di atas rata-rata. Perlu perhatian pada proporsi asupan kalori agar tetap seimbang dan tidak berisiko obesitas.`;
    if (isPerluRujuk)
      return `Status pertumbuhan ${name || "anak"} memerlukan perhatian khusus. Pastikan nutrisi tercukupi dan ikuti panduan medis untuk mengejar pertumbuhan ideal.`;
    return `Pertumbuhan ${name || "anak"} bulan ini terpantau baik dan ideal. Tetap berikan ASI/MPASI padat gizi, jemur di pagi hari, dan pastikan hadir kembali di jadwal Posyandu bulan depan.`;
  };

  const getRekomendasi = () => {
    if (isRisikoBB)
      return "Rekomendasi: Atur Pola Asupan. Pantau porsi makan agar tidak berlebih. Diskusikan dengan petugas kesehatan mengenai pola makan seimbang.";
    if (isPerluRujuk)
      return "Rekomendasi: Rujuk & Konsultasi Medis. Harap bawa buku KIA ke Puskesmas/Dokter untuk penanganan klinis yang tepat.";
    return "Rekomendasi: Pemantauan Mandiri. Kondisi aman. Lanjutkan pemantauan tumbuh kembang harian di rumah.";
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Saran & Tindak Lanjut
              </h3>
              <p className="text-[11px] text-slate-400">
                Penyuluhan di {lokasi_posyandu || "Posyandu Wilayah"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/60 border border-slate-100 p-4 rounded-2xl mb-4">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider block mb-1">
            EDUKASI / CATATAN KADER
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {getCatatan()}
          </p>
        </div>

        <div
          className={`p-3.5 rounded-xl border flex gap-3 items-center ${isPerluRujuk || isRisikoBB ? "bg-rose-50/60 border-rose-100 text-rose-800" : "bg-emerald-50/60 border-emerald-100 text-emerald-800"}`}
        >
          <div className="shrink-0">
            {isPerluRujuk || isRisikoBB ? (
              <div className="p-1.5 bg-rose-100 rounded-lg">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
              </div>
            ) : (
              <div className="p-1.5 bg-emerald-100 rounded-lg">
                <Heart className="w-4 h-4 text-emerald-600" />
              </div>
            )}
          </div>
          <div>
            <h4 className="text-xs font-bold">
              {isRisikoBB
                ? "Rekomendasi: Atur Pola Asupan"
                : isPerluRujuk
                  ? "Rekomendasi: Rujuk Faskes"
                  : "Rekomendasi: Pemantauan Mandiri"}
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
              {getRekomendasi()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-dashed border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-slate-400" /> Kader Pemeriksa:
        </span>
        <span className="font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md max-w-[180px] truncate">
          {kader_pemeriksa || "Kader Posyandu"}
        </span>
      </div>
    </div>
  );
}
