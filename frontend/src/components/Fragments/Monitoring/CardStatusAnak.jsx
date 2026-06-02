import React from "react";
import {
  Activity,
  Ruler,
  Weight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

// STYLE STATUS
const getStatusStyle = (status) => {
  const styles = {
    // TBU
    "Sangat pendek (severely stunted)": {
      badge: "bg-red-100 text-red-700 border border-red-200",
      row: "hover:bg-red-50",
      icon: <XCircle size={14} />,
    },

    "Pendek (stunted)": {
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      row: "hover:bg-amber-50",
      icon: <AlertTriangle size={14} />,
    },

    Normal: {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      row: "hover:bg-emerald-50",
      icon: <CheckCircle2 size={14} />,
    },

    Tinggi: {
      badge: "bg-blue-100 text-blue-700 border border-blue-200",
      row: "hover:bg-blue-50",
      icon: <CheckCircle2 size={14} />,
    },

    // BBU
    "Berat badan sangat kurang (severely underweight)": {
      badge: "bg-red-100 text-red-700 border border-red-200",
      row: "hover:bg-red-50",
      icon: <XCircle size={14} />,
    },

    "Berat badan kurang (underweight)": {
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      row: "hover:bg-amber-50",
      icon: <AlertTriangle size={14} />,
    },

    "Berat badan normal": {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      row: "hover:bg-emerald-50",
      icon: <CheckCircle2 size={14} />,
    },

    "Risiko berat badan lebih": {
      badge: "bg-blue-100 text-blue-700 border border-blue-200",
      row: "hover:bg-blue-50",
      icon: <CheckCircle2 size={14} />,
    },

    // BBTB
    "Gizi buruk (severely wasted)": {
      badge: "bg-red-100 text-red-700 border border-red-200",
      row: "hover:bg-red-50",
      icon: <XCircle size={14} />,
    },

    "Gizi kurang (wasted)": {
      badge: "bg-amber-100 text-amber-700 border border-amber-200",
      row: "hover:bg-amber-50",
      icon: <AlertTriangle size={14} />,
    },

    "Gizi baik (normal)": {
      badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      row: "hover:bg-emerald-50",
      icon: <CheckCircle2 size={14} />,
    },

    "Berisiko gizi lebih (possible risk of overweight)": {
      badge: "bg-sky-100 text-sky-700 border border-sky-200",
      row: "hover:bg-sky-50",
      icon: <CheckCircle2 size={14} />,
    },

    "Gizi lebih (overweight)": {
      badge: "bg-blue-100 text-blue-700 border border-blue-200",
      row: "hover:bg-blue-50",
      icon: <CheckCircle2 size={14} />,
    },

    "Obesitas (obese)": {
      badge: "bg-purple-100 text-purple-700 border border-purple-200",
      row: "hover:bg-purple-50",
      icon: <AlertTriangle size={14} />,
    },
  };

  return (
    styles[status] || {
      badge: "bg-gray-100 text-gray-600 border border-gray-200",
      row: "hover:bg-gray-50",
      icon: <ShieldAlert size={14} />,
    }
  );
};

const getIndicatorIcon = (indicator) => {
  const text = indicator?.toLowerCase() || "";

  if (text.includes("tb/u")) {
    return <Ruler size={15} />;
  }

  if (text.includes("bb/u")) {
    return <Weight size={15} />;
  }

  if (text.includes("bb/tb")) {
    return <Activity size={15} />;
  }

  return <ShieldAlert size={15} />;
};

const legends = [
  {
    label: "Normal",
    desc: "Pertumbuhan sesuai standar WHO.",
    color: "bg-green-500",
  },

  {
    label: "Gizi Kurang / Pendek / Underweight",
    desc: "Perlu perhatian dan perbaikan gizi.",
    color: "bg-yellow-400",
  },

  {
    label: "Gizi Buruk / Sangat Pendek",
    desc: "Memerlukan penanganan segera.",
    color: "bg-red-600",
  },

  {
    label: "Risiko / Gizi Lebih",
    desc: "Perlu pemantauan pola makan dan aktivitas.",
    color: "bg-blue-500",
  },

  {
    label: "Berisiko Gizi Lebih",
    desc: "Mulai perhatikan keseimbangan nutrisi anak.",
    color: "bg-sky-400",
  },

  {
    label: "Obesitas",
    desc: "Disarankan konsultasi dengan tenaga kesehatan.",
    color: "bg-purple-600",
  },
];

export default function CardStatusAnak({ data }) {
  const safeZScores = [
    {
      indicator: "Stunting (TB/U)",
      score: data?.ZscoreTBU,
      status: data?.statusTBU,
      interpretation: data?.keteranganStunting,
    },

    {
      indicator: "Underweight (BB/U)",
      score: data?.ZscoreBBU,
      status: data?.statusBBU,
      interpretation: data?.keteranganUnderweight,
    },

    {
      indicator: "Wasting (BB/TB)",
      score: data?.ZscoreBBTB,
      status: data?.statusBBTB,
      interpretation: data?.keteranganWasting,
    },
  ];

  return (
    <div className="bg-white p-7 rounded-[30px] border border-gray-100 shadow-sm w-full">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <h3 className="text-xl font-extrabold text-gray-800">Status Anak</h3>

          <p className="text-sm text-gray-600 leading-relaxed mt-3 text-justify">
            Ringkasan status gizi berikut membantu memahami kondisi pertumbuhan
            anak berdasarkan standar WHO. Nilai Z-Score digunakan untuk
            membandingkan tinggi badan dan berat badan anak dengan anak lain
            seusianya, sehingga risiko stunting, underweight, maupun wasting
            dapat terdeteksi secara lebih cepat dan ditangani dengan tepat.
          </p>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
          <Activity size={22} />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-separate border-spacing-y-3">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-black">
              <th className="w-[260px] text-left font-bold px-4 py-2">
                Indikator
              </th>

              <th className="w-[120px] text-left font-bold px-4 py-2">
                Z-Score
              </th>

              <th className="w-[290px] text-left font-bold px-4 py-2">
                Status
              </th>

              <th className="w-[380px] text-left font-bold px-4 py-2">
                Interpretasi
              </th>
            </tr>
          </thead>

          <tbody>
            {safeZScores.map((row, idx) => {
              const style = getStatusStyle(row.status);

              return (
                <tr
                  key={idx}
                  className={`bg-gray-50/60 transition-all duration-200 rounded-2xl ${style.row} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative`}
                >
                  {/* INDIKATOR */}
                  <td className="px-4 py-5 ">
                    <div className="flex items-center gap-3 text-justify ">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm ">
                        {getIndicatorIcon(row.indicator)}
                      </div>

                      <span className="font-semibold text-gray-700 text-sm">
                        {row.indicator}
                      </span>
                    </div>
                  </td>

                  {/* Z SCORE */}
                  <td className="px-4 py-5">
                    <span className="text-sm font-bold text-gray-700">
                      {row.score ?? "-"}
                    </span>
                  </td>

                  {/* STATUS */}
                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${style.badge}`}
                    >
                      {style.icon}
                      {row.status || "-"}
                    </span>
                  </td>

                  {/* INTERPRETASI */}
                  <td className="px-4 py-5">
                    <p className="text-[12px] leading-relaxed text-gray-500 min-w-[320px]">
                      {row.interpretation || "-"}
                    </p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* LEGEND STATUS */}
      <div className="mt-7 pt-5 border-t border-gray-200">
        <h2 className="text-xl font-extrabold text-gray-700 mb-5">
          Keterangan Status
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed mb-5 text-justify">
          Warna dan kategori berikut digunakan untuk membantu memahami hasil
          pemantauan status gizi anak secara lebih mudah. Setiap indikator
          menunjukkan kondisi pertumbuhan berdasarkan standar WHO, mulai dari
          kondisi normal, risiko gangguan pertumbuhan, hingga kondisi yang
          memerlukan perhatian khusus. Dengan memahami arti setiap status, orang
          tua dapat mengambil langkah yang tepat untuk mendukung tumbuh kembang
          anak secara optimal.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {legends.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative"
            >
              <div
                className={`w-3.5 h-3.5 rounded-full mt-1 shrink-0 ${item.color}`}
              />

              <div>
                <p className="font-semibold text-gray-700 text-xs">
                  {item.label}
                </p>

                <p className="text-gray-400 mt-1 text-[11px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-7 pt-5 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Interpretasi status gizi anak dihitung menggunakan standar
          antropometri WHO 2006 berdasarkan indikator tinggi badan menurut umur
          (TB/U), berat badan menurut umur (BB/U), dan berat badan menurut
          tinggi badan (BB/TB).
        </p>
      </div>
    </div>
  );
}
