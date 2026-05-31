import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Activity,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react";

const MIN_BERTURUT = 2;

const EPS_BERAT = 0.05;

const urutkanRiwayat = (riwayat = []) =>
  [...riwayat].sort((a, b) => {
    const ta = new Date(a?.tanggal).getTime();
    const tb = new Date(b?.tanggal).getTime();
    if (!isNaN(ta) && !isNaN(tb)) return ta - tb;
    return (a?.umur ?? 0) - (b?.umur ?? 0);
  });

/**
 * Hitung tren dari deret nilai (urut waktu menaik).
 * @returns {{ arah: "naik"|"turun"|"tetap"|null, panjang: number }}
 */
const hitungTren = (nilai = [], eps = EPS_BERAT) => {
  const arr = nilai.map((v) => Number(v)).filter((v) => !isNaN(v));
  if (arr.length < 2) return { arah: null, panjang: 0 };

  let arah = null;
  let panjang = 0;

  for (let i = arr.length - 1; i > 0; i--) {
    const delta = arr[i] - arr[i - 1];
    const stepArah = delta <= -eps ? "turun" : delta >= eps ? "naik" : "tetap";

    if (arah === null) {
      arah = stepArah;
      panjang = 1;
    } else if (stepArah === arah) {
      panjang++;
    } else {
      break;
    }
  }

  return { arah, panjang };
};

export default function CardKeteranganRekomendasi({ data, riwayat }) {
  const nama = data?.name || "Anak";
  const riwayatFinal =
    (Array.isArray(riwayat) && riwayat.length ? riwayat : data?.riwayat) || [];
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
      title: `Pertumbuhan ${nama} saat ini dalam kisaran normal.`,
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
      title: `${nama} terindikasi mengalami gangguan pertumbuhan tinggi badan.`,
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
      title: `${nama} mengalami masalah gizi berdasarkan berat badan dan tinggi badan.`,
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
      title: `${nama} memiliki berat badan di bawah standar usianya.`,
      description:
        data?.keteranganUnderweight ||
        "Berat badan anak berada di bawah standar WHO sehingga perlu peningkatan asupan gizi.",
    },
  };

  const current = statusConfig[statusUtama];
  const riwayatTerurut = urutkanRiwayat(riwayatFinal);
  const trenBerat = hitungTren(riwayatTerurut.map((r) => r.berat));

  const TREN_INFO = {
    turun: {
      wrap: "bg-red-50 border-red-200",
      icon: <TrendingDown className="text-red-600" size={20} />,
      titleColor: "text-red-800",
      title: "Peringatan: berat badan menurun berturut-turut",
      desc: `Berat badan ${nama} turun pada ${trenBerat.panjang} penimbangan terakhir secara berturut-turut. Kondisi ini perlu perhatian — segera konsultasikan ke kader Posyandu atau tenaga kesehatan untuk mencari penyebabnya.`,
    },
    tetap: {
      wrap: "bg-amber-50 border-amber-200",
      icon: <Minus className="text-amber-600" size={20} />,
      titleColor: "text-amber-800",
      title: "Perhatian: pertumbuhan stagnan",
      desc: `Berat badan ${nama} cenderung tidak bertambah (stagnan) pada ${trenBerat.panjang} penimbangan terakhir berturut-turut. Pertumbuhan yang stagnan juga perlu diperhatikan — pastikan asupan gizi tercukupi dan konsultasikan ke Posyandu.`,
    },
    naik: {
      wrap: "bg-emerald-50 border-emerald-200",
      icon: <TrendingUp className="text-emerald-600" size={20} />,
      titleColor: "text-emerald-800",
      title: "Pertumbuhan positif",
      desc: `Berat badan ${nama} naik pada ${trenBerat.panjang} penimbangan terakhir secara berturut-turut. Pertahankan pola asuh dan asupan gizinya, serta lanjutkan pemantauan rutin.`,
    },
  };

  const trenConfig = trenBerat.arah ? TREN_INFO[trenBerat.arah] : null;
  const adaPeringatanTren = trenConfig && trenBerat.panjang >= MIN_BERTURUT;

  // ===== REKOMENDASI =====
  const perluPerbaikan =
    adaPeringatanTren &&
    (trenBerat.arah === "turun" || trenBerat.arah === "tetap");

  const rekomendasiTren = perluPerbaikan
    ? [
        "Periksakan anak ke Posyandu/Puskesmas untuk evaluasi penyebab berat badan tidak naik.",
        "Tingkatkan pemberian makanan bergizi seimbang dan padat energi sesuai usia anak.",
        "Lakukan penimbangan rutin setiap bulan untuk memantau tren pertumbuhan.",
      ]
    : [];

  const rekomendasi = [
    ...rekomendasiTren,
    ...(data?.rekomendasiStunting || []),
    ...(data?.rekomendasiWasting || []),
    ...(data?.rekomendasiUnderweight || []),
  ];

  const uniqueRekomendasi = [...new Set(rekomendasi)].slice(0, 4);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Keterangan & Rekomendasi
      </h3>

      <div className="space-y-4">
        {/* BANNER TREN PENIMBANGAN */}
        {adaPeringatanTren && (
          <div
            className={`p-5 rounded-2xl border flex gap-4 items-start ${trenConfig.wrap} hover:-translate-y-1 hover:shadow-lg transition-all duration-300`}
          >
            <div className="w-10 h-10 rounded-full bg-white/70 flex items-center justify-center shrink-0">
              {trenConfig.icon}
            </div>
            <div>
              <h4 className={`text-sm font-bold ${trenConfig.titleColor}`}>
                {trenConfig.title}
              </h4>
              <p className="text-xs mt-1 leading-relaxed text-gray-700 text-justify">
                {trenConfig.desc}
              </p>
            </div>
          </div>
        )}

        {/* Bagian Status */}
        <div
          className={`${current.bg} p-5 rounded-2xl border ${current.border} flex gap-4 items-start hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${current.iconBg}`}
          >
            {current.icon}
          </div>
          <div>
            <h4
              className={`text-sm font-bold ${current.titleColor} text-justify`}
            >
              {current.title}
            </h4>
            <p
              className={`text-xs mt-1 leading-relaxed ${current.textColor} text-justify`}
            >
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

          <ul
            className={`text-xs space-y-2 font-medium ${current.rekomText} text-justify`}
          >
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
