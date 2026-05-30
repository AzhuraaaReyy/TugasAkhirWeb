import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Activity,
  ShieldCheck,
} from "lucide-react";

export default function CardKeteranganRekomendasi({ data }) {
  const statusUtama =
    data?.statusTBU?.includes("Sangat pendek") ||
    data?.statusTBU?.includes("Pendek")
      ? "stunting"
      : data?.statusBBTB?.includes("Gizi buruk") ||
          data?.statusBBTB?.includes("Gizi kurang")
        ? "wasting"
        : data?.statusBBU?.includes("sangat kurang") ||
            data?.statusBBU?.includes("kurang")
          ? "underweight"
          : "normal";

  const statusConfig = {
    normal: {
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
      iconBg: "bg-emerald-100",
      icon: <CheckCircle2 className="text-emerald-600" size={20} />,
      titleColor: "text-emerald-900",
      textColor: "text-emerald-700",
      rekomBg: "bg-amber-50/60",
      rekomBorder: "border-amber-100",
      rekomText: "text-amber-800",

      title: `Pertumbuhan ${data?.name || "anak"} saat ini dalam kisaran normal.`,
      description:
        "Pertumbuhan dan status gizi anak berada dalam kondisi baik sesuai indikator WHO. Tetap pertahankan pola hidup sehat dan pemantauan rutin.",
    },

    stunting: {
      bg: "bg-red-50/70",
      border: "border-red-100",
      iconBg: "bg-red-100",
      icon: <AlertTriangle className="text-red-600" size={20} />,
      titleColor: "text-red-900",
      textColor: "text-red-700",
      rekomBg: "bg-orange-50/60",
      rekomBorder: "border-orange-100",
      rekomText: "text-orange-800",

      title: `${data?.name || "Anak"} terindikasi mengalami gangguan pertumbuhan tinggi badan.`,
      description:
        data?.keteranganStunting ||
        "Tinggi badan anak berada di bawah standar usianya sehingga perlu perhatian pada asupan gizi dan pemantauan pertumbuhan.",
    },

    wasting: {
      bg: "bg-yellow-50/70",
      border: "border-yellow-100",
      iconBg: "bg-yellow-100",
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      titleColor: "text-yellow-900",
      textColor: "text-yellow-700",
      rekomBg: "bg-amber-50/60",
      rekomBorder: "border-amber-100",
      rekomText: "text-amber-800",

      title: `${data?.name || "Anak"} mengalami masalah gizi berdasarkan berat badan dan tinggi badan.`,
      description:
        data?.keteranganWasting ||
        "Berat badan anak tidak proporsional terhadap tinggi badannya dan membutuhkan perhatian pada pola makan.",
    },

    underweight: {
      bg: "bg-orange-50/70",
      border: "border-orange-100",
      iconBg: "bg-orange-100",
      icon: <Activity className="text-orange-600" size={20} />,
      titleColor: "text-orange-900",
      textColor: "text-orange-700",
      rekomBg: "bg-amber-50/60",
      rekomBorder: "border-amber-100",
      rekomText: "text-amber-800",

      title: `${data?.name || "Anak"} memiliki berat badan di bawah standar usianya.`,
      description:
        data?.keteranganUnderweight ||
        "Berat badan anak berada di bawah standar WHO sehingga perlu peningkatan asupan gizi.",
    },
  };

  const current = statusConfig[statusUtama];

  const rekomendasi = [
    ...(data?.rekomendasiStunting || []),
    ...(data?.rekomendasiWasting || []),
    ...(data?.rekomendasiUnderweight || []),
  ];

  const uniqueRekomendasi = [...new Set(rekomendasi)].slice(0, 3);
  return (
    // Kartu Utama (Outer Card)
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full ">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Keterangan & Rekomendasi
      </h3>

      <div className="space-y-4">
        {/* Bagian Status */}
        <div
          className={`${current.bg} p-5 rounded-2xl border ${current.border} flex gap-4 items-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${current.iconBg}`}
          >
            {current.icon || <Check className="text-emerald-700" size={20} />}
          </div>
          <div>
            <h4 className={`text-sm font-bold ${current.titleColor} text-justify`}>
              {current.title}
            </h4>
            <p className={`text-xs mt-1 leading-relaxed ${current.textColor} text-justify`}>
              {current.description}
            </p>
          </div>
        </div>

        {/* Bagian Rekomendasi */}
        <div
          className={`${current.rekomBg} p-5 rounded-2xl border ${current.rekomBorder} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative`}
        >
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="text-orange-500" size={20} />
            <h4 className="text-sm font-bold text-orange-900">
              Rekomendasi Sistem
            </h4>
          </div>

          <ul className={`text-xs space-y-2 font-medium ${current.rekomText} text-justify`}>
            {uniqueRekomendasi.length > 0 ? (
              uniqueRekomendasi.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 leading-relaxed"
                >
                  <span className="text-emerald-600 mt-0.5">✔</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500">Tidak ada rekomendasi tersedia.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
