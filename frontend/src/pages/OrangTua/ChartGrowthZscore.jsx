import React, { useEffect, useRef } from "react";
import {
  AreaChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const posisiIndikator = (score) => {
  if (score < -3) return "12.5%";
  if (score >= -3 && score < -2) return "37.5%";
  if (score >= -2 && score <= 3) return "62.5%";
  return "87.5%";
};
const warnaTeksZ = (val) => {
  if (val < -3) return "text-red-600";
  if (val < -2) return "text-orange-500";
  if (val <= 3) return "text-emerald-600";
  return "text-blue-500";
};

const rekomendasiTBU = (score) => {
  if (score < -3)
    return {
      status: "Perlu perhatian medis segera",
      saran:
        "Kondisi sangat pendek (stunting). Mohon segera bawa Si Kecil ke dokter spesialis anak atau puskesmas untuk pemeriksaan dan penanganan lebih lanjut.",
      color: "red",
    };
  if (score >= -3 && score < -2)
    return {
      status: "Perlu perbaikan gizi",
      saran:
        "Kondisi pendek. Tingkatkan asupan protein hewani dan jaga jadwal makan agar pertumbuhannya optimal.",
      color: "orange",
    };
  if (score >= -2 && score <= 3)
    return {
      status: "Pertumbuhan normal",
      saran:
        "Tinggi badan Si Kecil sesuai standar usianya. Tetap berikan gizi seimbang dan pantau rutin tiap bulan.",
      color: "emerald",
    };
  return {
    status: "Perlu konsultasi lanjut",
    saran:
      "Tinggi badan di atas standar rata-rata usianya. Diskusikan dengan dokter anak untuk panduan yang tepat.",
    color: "blue",
  };
};

const rekomendasiBBU = (score) => {
  if (score < -3)
    return {
      status: "Perlu perhatian medis segera",
      saran:
        "Berat badan sangat kurang (severely underweight). Mohon segera bawa Si Kecil ke dokter atau puskesmas untuk penanganan gizi lebih lanjut.",
      color: "red",
    };
  if (score >= -3 && score < -2)
    return {
      status: "Perlu perbaikan gizi",
      saran:
        "Berat badan di bawah standar (underweight). Tingkatkan asupan nutrisi padat gizi dan atur jadwal makan lebih teratur.",
      color: "orange",
    };
  if (score >= -2 && score <= 3)
    return {
      status: "Berat badan normal",
      saran:
        "Berat badan Si Kecil sehat dan sesuai standar usianya. Tetap berikan makanan bergizi seimbang dan pantau rutin.",
      color: "emerald",
    };
  return {
    status: "Perlu konsultasi lanjut",
    saran:
      "Berat badan di atas standar rata-rata. Diskusikan pola makan dan aktivitas fisik dengan dokter anak.",
    color: "blue",
  };
};

const badgeMap = {
  red: "bg-red-100 text-red-600",
  orange: "bg-orange-100 text-orange-600",
  emerald: "bg-emerald-100 text-emerald-600",
  blue: "bg-blue-100 text-blue-600",
};
const boxMap = {
  red: "bg-red-50 border-red-100 text-red-900",
  orange: "bg-orange-50 border-orange-100 text-orange-900",
  emerald: "bg-emerald-50 border-emerald-100 text-emerald-900",
  blue: "bg-blue-50 border-blue-100 text-blue-900",
};

const BlokZScore = ({ label, nilai, statusText, info }) => {
  if (nilai === undefined || nilai === null || isNaN(nilai)) return null;
  return (
    <div className="rounded-lg border border-gray-100 p-2">
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-gray-700">{label}</p>
          {statusText && (
            <p className="text-[9px] text-gray-400 leading-snug">
              {statusText}
            </p>
          )}
        </div>
        <span
          className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${badgeMap[info.color]}`}
        >
          {info.status}
        </span>
      </div>
      <div className="flex items-end justify-between mb-1.5">
        <span className="text-[9px] text-gray-400">Z-Score</span>
        <span className={`text-lg font-black ${warnaTeksZ(nilai)}`}>
          {nilai}
        </span>
      </div>
      <div className="relative w-full h-5 flex rounded-md overflow-hidden border border-gray-200 mb-1.5">
        <div className="flex-1 bg-red-100 flex items-center justify-center text-[8px] font-bold text-red-600">
          &lt;-3
        </div>
        <div className="flex-1 bg-orange-50 flex items-center justify-center text-[8px] font-bold text-orange-600">
          -3..-2
        </div>
        <div className="flex-1 bg-emerald-50 flex items-center justify-center text-[8px] font-bold text-emerald-700">
          -2..3
        </div>
        <div className="flex-1 bg-blue-50 flex items-center justify-center text-[8px] font-bold text-blue-600">
          &gt;3
        </div>
        <div
          className="absolute bottom-0 transition-all duration-500"
          style={{
            left: posisiIndikator(nilai),
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-gray-800" />
        </div>
      </div>
      <div className={`p-2 rounded-md border ${boxMap[info.color]}`}>
        <p className="text-[9px] leading-relaxed">
          <strong>Keterangan:</strong> {info.saran}
        </p>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  const zTBU = parseFloat(d.zscore);
  const zBBU = parseFloat(d.ZScoreBBU);
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-xl w-[255px] space-y-2">
      <div>
        <p className="text-xs font-bold text-gray-800 truncate">{d.name}</p>
        <p className="text-[10px] text-gray-400">Umur {d.umur} bulan</p>
      </div>
      <BlokZScore
        label="Tinggi Badan (TB/U)"
        nilai={zTBU}
        statusText={d.statusTBU}
        info={rekomendasiTBU(zTBU)}
      />
      <BlokZScore
        label="Berat Badan (BB/U)"
        nilai={zBBU}
        statusText={d.statusBBU}
        info={rekomendasiBBU(zBBU)}
      />
    </div>
  );
};

const warnaDotTBU = (status) => {
  if (!status) return "bg-gray-300";
  const s = status.toLowerCase();
  if (s.includes("sangat pendek") || s.includes("severely stunted"))
    return "bg-red-500 shadow-red-200";
  if (s.includes("pendek") || s.includes("stunted"))
    return "bg-orange-500 shadow-orange-200";
  if (s.includes("normal")) return "bg-emerald-500 shadow-emerald-200";
  if (s.includes("tinggi")) return "bg-blue-500 shadow-blue-200";
  return "bg-gray-300";
};
const warnaDotBBU = (status) => {
  if (!status) return "bg-gray-300";
  const s = status.toLowerCase();
  if (s.includes("sangat kurang") || s.includes("severely underweight"))
    return "bg-red-500 shadow-red-200";
  if (s.includes("berat badan kurang") || s.includes("underweight"))
    return "bg-orange-500 shadow-orange-200";
  if (s.includes("berat badan normal"))
    return "bg-emerald-500 shadow-emerald-200";
  if (s.includes("risiko berat badan lebih"))
    return "bg-blue-500 shadow-blue-200";
  return "bg-gray-300";
};

const BarisEvaluasi = ({ judul, statusKey, data, warna }) => (
  <div>
    <span className="text-[11px] font-semibold text-gray-500 mb-1 block">
      {judul}
    </span>
    <div className="w-full overflow-x-auto pb-2 hide-scrollbar">
      <div className="flex gap-4 flex-nowrap min-w-max">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 w-[45px]">
            <div
              className={`w-3 h-3 rounded-full shadow-sm transition-all ${warna(item[statusKey])}`}
              title={`${item.name}: ${item[statusKey]}`}
            />
            <span className="text-[10px] text-gray-400 font-medium truncate w-full text-center">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function ChartGrowthZScore({
  title = "Z-Score TB/U vs BB/U",
  data = [],
}) {
  const chartScrollRef = useRef(null);
  const LEBAR_PER_TITIK = 70;
  const lebarChart = Math.max(data.length * LEBAR_PER_TITIK, 600);

  const chartData = data.map((item) => ({
    ...item,
    medianValue: 0,
    minus2Value: -2,
    minus3Value: -3,
  }));

  useEffect(() => {
    const el = chartScrollRef.current;
    if (!el) return;
    let arah = 1;
    const kecepatan = 0.2;
    const jedaUjung = 700;
    let pausedUntil = 0;
    let paused = false;
    let pos = el.scrollLeft;
    let frame;
    const animasi = (t) => {
      const maks = el.scrollWidth - el.clientWidth;
      if (maks > 0 && !paused && t >= pausedUntil) {
        pos += arah * kecepatan;
        if (pos >= maks) {
          pos = maks;
          arah = -1;
          pausedUntil = t + jedaUjung;
        } else if (pos <= 0) {
          pos = 0;
          arah = 1;
          pausedUntil = t + jedaUjung;
        }
        el.scrollLeft = pos;
      }
      frame = requestAnimationFrame(animasi);
    };
    frame = requestAnimationFrame(animasi);
    const stop = () => (paused = true);
    const go = () => {
      paused = false;
      pos = el.scrollLeft;
    };
    el.addEventListener("mouseenter", stop);
    el.addEventListener("mouseleave", go);
    el.addEventListener("touchstart", stop, { passive: true });
    el.addEventListener("touchend", go, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("mouseenter", stop);
      el.removeEventListener("mouseleave", go);
      el.removeEventListener("touchstart", stop);
      el.removeEventListener("touchend", go);
    };
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">
          Grafik Standar WHO: Z-Score Tinggi Badan (TB/U) &amp; Berat Badan
          (BB/U) menurut Umur
        </p>
      </div>

      <div
        ref={chartScrollRef}
        className="w-full overflow-x-auto pb-2 hide-scrollbar"
      >
        <div className="h-72" style={{ width: lebarChart, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="name"
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF" }}
              />
              <YAxis
                domain={[-4, 3]}
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF" }}
              />
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 9999 }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />

              {/* Garis referensi WHO */}
              <Line
                type="monotone"
                dataKey="medianValue"
                name="Median (0)"
                stroke="#94A3B8"
                strokeDasharray="5 5"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="minus2Value"
                name="-2 SD"
                stroke="#FBBF24"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="minus3Value"
                name="-3 SD"
                stroke="#EF4444"
                strokeWidth={2}
                dot={false}
              />

              {/* Z-Score anak */}
              <Line
                type="linear"
                dataKey="zscore"
                name="Z-Score TB/U"
                stroke="#0ce855"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0ce855" }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="linear"
                dataKey="ZScoreBBU"
                name="Z-Score BB/U"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3B82F6" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
        <span className="text-sm font-semibold text-gray-500 block">
          Evaluasi Kenaikan Status
        </span>
        <BarisEvaluasi
          judul="Tinggi Badan (TB/U)"
          statusKey="statusTBU"
          data={data}
          warna={warnaDotTBU}
        />
        <BarisEvaluasi
          judul="Berat Badan (BB/U)"
          statusKey="statusBBU"
          data={data}
          warna={warnaDotBBU}
        />
      </div>
    </div>
  );
}
