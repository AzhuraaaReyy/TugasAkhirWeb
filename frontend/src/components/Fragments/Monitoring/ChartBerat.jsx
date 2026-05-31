import React from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  AreaChart,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useEffect, useRef } from "react";
import { Maximize2 } from "lucide-react";

// Komponen Custom Tooltip interaktif untuk menampilkan info pencapaian KBM
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  const dataAnak = payload[0].payload;
  const nilaiKenaikan = dataAnak.kenaikanBerat ?? 0;
  const nilaiTarget = dataAnak.targetKbm ?? null;
  const statusPertumbuhan = dataAnak.statusBerat; // status KBM
  const TOOLTIPBB = dataAnak.TooltipBB;
  const awal = statusPertumbuhan === "Data Awal" || statusPertumbuhan === "-";
  const tercapai = nilaiTarget && nilaiKenaikan >= nilaiTarget;
  const persen = nilaiTarget
    ? Math.round((nilaiKenaikan / nilaiTarget) * 100)
    : 0;

  const warna =
    statusPertumbuhan === "Telah Tercapai"
      ? "text-emerald-600"
      : statusPertumbuhan === "Tinggi"
        ? "text-blue-600"
        : awal
          ? "text-gray-800"
          : "text-red-600";

  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-xl w-[215px]">
      {/* HEADER: tanggal + umur + status */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 truncate">
            {dataAnak.fullDate || label}
          </p>
          <p className="text-[10px] text-gray-400">
            Umur {dataAnak.umur} bulan
          </p>
        </div>
        {!awal && (
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold shrink-0 ${
              statusPertumbuhan === "Telah Tercapai"
                ? "bg-emerald-100 text-emerald-600"
                : statusPertumbuhan === "Tinggi"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-500"
            }`}
          >
            {statusPertumbuhan}
          </span>
        )}
      </div>

      {/* NILAI UTAMA (sebaris) */}
      <div className="flex items-end justify-between mb-2">
        <span className="text-[10px] text-gray-400">Berat Badan Saat Ini</span>
        <span className={`text-base font-extrabold ${warna}`}>
          {payload[0].value}
          <span className="text-[11px] font-medium text-gray-500 ml-0.5">
            kg
          </span>
        </span>
      </div>

      {!awal ? (
        <>
          {/* KENAIKAN & TARGET (dua kolom) */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-gray-50 rounded-lg px-2 py-1.5">
              <p className="text-[9px] text-gray-400">Kenaikan BB</p>
              <p
                className={`text-xs font-bold ${
                  nilaiKenaikan >= nilaiTarget
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {nilaiKenaikan > 0 ? "+" : ""}
                {nilaiKenaikan} kg
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg px-2 py-1.5">
              <p className="text-[9px] text-gray-400">Target KBM</p>
              <p className="text-xs font-bold text-gray-700">
                {nilaiTarget ? `${nilaiTarget} kg` : "-"}
              </p>
            </div>
          </div>

          {/* PROGRESS */}
          {nilaiTarget && (
            <div className="mb-1.5">
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    tercapai ? "bg-emerald-500" : "bg-red-400"
                  }`}
                  style={{ width: `${Math.min(persen, 100)}%` }}
                />
              </div>
              <p className="text-[9px] text-gray-400 mt-0.5 text-right">
                {persen}% target tercapai
              </p>
            </div>
          )}

          {/* CATATAN */}
          {TOOLTIPBB && (
            <p className="text-[10px] text-gray-500 italic leading-snug">
              {TOOLTIPBB}
            </p>
          )}
        </>
      ) : (
        <p className="text-[10px] text-gray-400 italic text-center">
          Data awal pengukuran
        </p>
      )}
    </div>
  );
};

export default function ChartBerat({
  title,
  data = [],
  dataKey = "berat",
  statusKey = "statusBerat", // Pastikan properti ini menerima data "statusBerat" dari pemetaan di React parent
}) {
  const scrollRef = useRef(null);

  // 2. Efek untuk memastikan scroll otomatis ke kanan (data terbaru) saat data dimuat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);

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
      {/* Header */}
      <div className=" items-start mb-6">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">
          Grafik Standar WHO: Status Pertumbuhan Berat Badan menurut Umur
        </p>
      </div>

      {/* Chart Area */}
      <div
        ref={chartScrollRef}
        className="w-full overflow-x-auto pb-2 hide-scrollbar"
      >
        <div className="h-60" style={{ width: lebarChart, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBerat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                domain={["auto", "auto"]}
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF" }}
              />

              {/* Menggunakan Custom Tooltip interaktif khusus KBM */}
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="linear"
                dataKey={dataKey}
                stroke="none"
                fillOpacity={1}
                fill="url(#colorBerat)"
              />
              <Line
                type="linear"
                dataKey={dataKey}
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3B82F6" }}
                activeDot={{ r: 6 }}
                label={{
                  position: "top",
                  fill: "#3B82F6",
                  fontSize: 10,
                  fontWeight: 600,
                  offset: 10,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Indikator Status Kenaikan Pertumbuhan (KBM) */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-500 mb-3 block">
          Evaluasi Kenaikan
        </span>

        {/* Container dengan scroll horizontal */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200"
        >
          <div className="flex gap-4">
            {data.map((item, idx) => {
              const currentStatus = item[statusKey];

              // Menentukan warna berdasarkan status
              const getStatusColor = (status) => {
                switch (status) {
                  case "Telah Tercapai":
                    return "bg-emerald-500 shadow-emerald-200";
                  case "Data Awal":
                    return "bg-gray-300";
                  case "Tinggi":
                    return "bg-blue-500";
                  default:
                    return "bg-red-500 shadow-red-200";
                }
              };

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1 min-w-[50px]" // Memastikan ada ruang antar item
                >
                  <div
                    className={`w-3 h-3 rounded-full shadow-sm transition-all ${getStatusColor(currentStatus)}`}
                    title={`${item.name}: ${currentStatus}`}
                  />
                  <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
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
