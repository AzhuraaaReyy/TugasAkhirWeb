import React from "react";
import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Legend,
} from "recharts";
import { useEffect, useRef } from "react";
// CUSTOM TOOLTIP
const CustomTooltipZScore = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataAnak = payload[0].payload;
    const z = parseFloat(dataAnak.zscore);

    const getIndicatorPosition = (score) => {
      if (score < -3) return "12.5%";
      if (score >= -3 && score < -2) return "37.5%";
      if (score >= -2 && score <= 3) return "62.5%";
      return "87.5%";
    };
    const getStatusColor = (val) => {
      if (val < -3) return "text-red-600";
      if (val < -2) return "text-orange-500";
      if (val <= 3) return "text-emerald-600";
      return "text-blue-500";
    };

    const getRecommendation = (score) => {
      if (score < -3)
        return {
          status: "Perlu perhatian medis segera",
          saran:
            "Hasil pengukuran menunjukkan kondisi sangat pendek (stunting). Mohon segera bawa Si Kecil ke dokter spesialis anak atau puskesmas untuk pemeriksaan dan penanganan lebih lanjut.",
          color: "red",
        };
      if (score >= -3 && score < -2)
        return {
          status: "Perlu perhatian dan perbaikan gizi",
          saran:
            "Hasil pengukuran menunjukkan kondisi pendek. Mari tingkatkan kembali asupan protein hewani dan pastikan jadwal makan Si Kecil lebih teratur agar pertumbuhannya optimal.",
          color: "orange",
        };
      if (score >= -2 && score <= 3)
        return {
          status: "Pertumbuhan normal",
          saran:
            "Hebat! Pertumbuhan Si Kecil terpantau sehat dan sesuai dengan standar usianya. Tetap berikan makanan bergizi seimbang dan rutinlah melakukan pemantauan setiap bulan.",
          color: "emerald",
        };
      return {
        status: "Perlu konsultasi lebih lanjut",
        saran:
          "Tinggi badan Si Kecil terpantau berada di atas standar rata-rata usianya. Mari diskusikan hasil ini dengan dokter anak agar Bunda mendapatkan panduan yang tepat.",
        color: "blue",
      };
    };

    const info = getRecommendation(z);
    const badgeMap = {
      red: "bg-red-100 text-red-600",
      orange: "bg-orange-100 text-orange-600",
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
    };
    // Pemetaan warna dinamis untuk box rekomendasi
    const colorMap = {
      red: "bg-red-50 border-red-100 text-red-900",
      orange: "bg-orange-50 border-orange-100 text-orange-900",
      emerald: "bg-emerald-50 border-emerald-100 text-emerald-900",
      blue: "bg-blue-50 border-blue-100 text-blue-900",
    };

    return (
      <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-xl w-[255px]">
        {/* HEADER: nama + status */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">
              {dataAnak.name}
            </p>
            {dataAnak.statusTBU && (
              <p className="text-[10px] text-gray-400 leading-snug">
                {dataAnak.statusTBU}
              </p>
            )}
          </div>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${badgeMap[info.color]}`}
          >
            {info.status}
          </span>
        </div>

        {/* NILAI UTAMA (sebaris) */}
        <div className="flex items-end justify-between mb-2">
          <span className="text-[10px] text-gray-400">Z-Score Pertumbuhan</span>
          <span className={`text-2xl font-black ${getStatusColor(z)}`}>
            {z}
          </span>
        </div>

        {/* BAR INDIKATOR */}
        <div className="relative w-full h-7 flex rounded-lg overflow-hidden border border-gray-200 mb-2">
          <div className="flex-1 bg-red-100 flex items-center justify-center text-[9px] font-bold text-red-600">
            &lt;-3
          </div>
          <div className="flex-1 bg-orange-50 flex items-center justify-center text-[9px] font-bold text-orange-600">
            -3 s/d -2
          </div>
          <div className="flex-1 bg-emerald-50 flex items-center justify-center text-[9px] font-bold text-emerald-700">
            -2 s/d 3
          </div>
          <div className="flex-1 bg-blue-50 flex items-center justify-center text-[9px] font-bold text-blue-600">
            &gt;3
          </div>

          <div
            className="absolute bottom-0 transition-all duration-500 ease-in-out"
            style={{
              left: getIndicatorPosition(z),
              transform: "translateX(-50%)",
            }}
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-gray-800" />
          </div>
        </div>

        {/* REKOMENDASI */}
        <div className={`p-2.5 rounded-lg border ${colorMap[info.color]}`}>
          <p className="text-[10px] leading-relaxed">
            <strong>Keterangan:</strong> {info.saran}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function ChartZScoreTBU({
  data = [],
  title,
  dataKey = "ZScoreTBU",
  statusKey = "statusTBU",
}) {
  const scrollRef = useRef(null);

  // Auto-scroll ke ujung kanan (data terbaru) saat data berubah
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);
  // Tambahkan garis referensi statis ke dalam data agar terbaca oleh chart
  const chartData = data.map((item) => ({
    ...item,
    median1Value: 3,
    medianValue: 0,
    minus2Value: -2,
    minus3Value: -3,
  }));

  const chartScrollRef = useRef(null);
  const LEBAR_PER_TITIK = 70; // px per penimbangan — perbesar bila ingin lebih lebar
  const lebarChart = Math.max(data.length * LEBAR_PER_TITIK, 600);
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
      const maks = el.scrollWidth - el.clientWidth; // dihitung tiap frame
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
      pos = el.scrollLeft; // sinkronkan lagi setelah scroll manual
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
          Grafik Standar WHO: Status Pertumbuhan Tinggi Badan menurut Umur
        </p>
      </div>
      <div
        ref={chartScrollRef}
        className="w-full overflow-x-auto pb-2 hide-scrollbar"
      >
        <div className="h-70" style={{ width: lebarChart, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 20, right: 30, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTinggi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ce855" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0ce855" stopOpacity={0} />
                </linearGradient>
              </defs>

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
                content={<CustomTooltipZScore />}
                wrapperStyle={{ zIndex: 9999 }}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
              <Area
                type="linear"
                dataKey={dataKey}
                stroke="none"
                fill="url(#colorTinggi)"
                fillOpacity={1}
                baseValue={-12}
              />
              {/* Garis Referensi WHO */}
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

              {/* Garis Z-Score Anak */}
              <Line
                type="linear"
                dataKey="zscore"
                name="Z-Score Anak"
                stroke="#0ce855"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0ce855" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* BLOK EVALUASI KENAIKAN BARU */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-500 mb-3 block">
          Evaluasi Kenaikan Status
        </span>

        <div
          ref={scrollRef}
          className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200"
        >
          <div className="flex gap-4 flex-nowrap min-w-max">
            {data.map((item, idx) => {
              const currentStatus = item[statusKey];
              const getStatusColor = (status) => {
                if (!status) return "bg-gray-300"; // Warna default jika status kosong

                const s = status.toLowerCase(); // Ubah ke huruf kecil semua agar tidak case-sensitive

                if (
                  s.includes("sangat pendek") ||
                  s.includes("severely stunted")
                )
                  return "bg-red-500 shadow-red-200";

                if (s.includes("pendek") || s.includes("stunted"))
                  return "bg-orange-500 shadow-orange-200";

                if (s.includes("normal"))
                  return "bg-emerald-500 shadow-emerald-200";

                if (s.includes("tinggi")) return "bg-blue-500 shadow-blue-200";

                return "bg-gray-300";
              };

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1 w-[45px]"
                >
                  <div
                    className={`w-3 h-3 rounded-full shadow-sm transition-all ${getStatusColor(currentStatus)}`}
                    title={`${item.name}: ${currentStatus}`}
                  />
                  <span className="text-[10px] text-gray-400 font-medium truncate w-full text-center">
                    {item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
