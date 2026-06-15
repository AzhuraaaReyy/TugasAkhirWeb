import React, { useEffect, useRef } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const warnaTeks = (status, awal) =>
  status === "Telah Tercapai"
    ? "text-emerald-600"
    : status === "Tinggi"
      ? "text-blue-600"
      : awal
        ? "text-gray-800"
        : "text-red-600";

const BlokMetrik = ({
  label,
  satuan,
  nilai,
  kenaikan,
  target,
  status,
  catatan,
}) => {
  const awal = status === "Data Awal" || status === "-";
  const tercapai = target && kenaikan >= target;
  const persen = target ? Math.round((kenaikan / target) * 100) : 0;
  return (
    <div className="rounded-lg border border-gray-100 p-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-gray-500">{label}</span>
        {!awal && (
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
              status === "Telah Tercapai"
                ? "bg-emerald-100 text-emerald-600"
                : status === "Tinggi"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-red-100 text-red-500"
            }`}
          >
            {status}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-[10px] text-gray-400">Saat ini</span>
        <span className={`text-sm font-extrabold ${warnaTeks(status, awal)}`}>
          {nilai}
          <span className="text-[10px] font-medium text-gray-500 ml-0.5">
            {satuan}
          </span>
        </span>
      </div>
      {!awal ? (
        <>
          <div className="mt-1 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded px-2 py-1">
              <p className="text-[9px] text-gray-400">Kenaikan</p>
              <p
                className={`text-[11px] font-bold ${kenaikan >= target ? "text-emerald-600" : "text-red-500"}`}
              >
                {kenaikan > 0 ? "+" : ""}
                {kenaikan} {satuan}
              </p>
            </div>
            <div className="bg-gray-50 rounded px-2 py-1">
              <p className="text-[9px] text-gray-400">Target</p>
              <p className="text-[11px] font-bold text-gray-700">
                {target ? `${target} ${satuan}` : "-"}
              </p>
            </div>
          </div>
          {target && (
            <div className="mt-1 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${tercapai ? "bg-emerald-500" : "bg-red-400"}`}
                style={{ width: `${Math.min(persen, 100)}%` }}
              />
            </div>
          )}
          {catatan && (
            <p className="mt-1 text-[9px] text-gray-500 italic leading-snug">
              {catatan}
            </p>
          )}
        </>
      ) : (
        <p className="mt-1 text-[9px] text-gray-400 italic text-center">
          Data awal pengukuran
        </p>
      )}
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-100 shadow-xl w-[240px] space-y-2">
      <div>
        <p className="text-xs font-bold text-gray-800 truncate">
          {d.fullDate || label}
        </p>
        <p className="text-[10px] text-gray-400">Umur {d.umur} bulan</p>
      </div>
      <BlokMetrik
        label="Tinggi Badan"
        satuan="cm"
        nilai={d.tinggi}
        kenaikan={d.kenaikanTinggi ?? 0}
        target={d.targetKpt}
        status={d.statusTinggi}
        catatan={d.TooltipTB}
      />
      <BlokMetrik
        label="Berat Badan"
        satuan="kg"
        nilai={d.berat}
        kenaikan={d.kenaikanBerat ?? 0}
        target={d.targetKbm}
        status={d.statusBerat}
        catatan={d.TooltipBB}
      />
    </div>
  );
};

const warnaDot = (status) => {
  switch (status) {
    case "Telah Tercapai":
      return "bg-emerald-500 shadow-emerald-200";
    case "Tinggi":
      return "bg-blue-500";
    case "Data Awal":
    case "-":
      return "bg-gray-300";
    default:
      return "bg-red-500 shadow-red-200";
  }
};

// Komponen top-level (menerima `data` lewat prop) agar tidak dibuat ulang
// tiap render -> menghindari error react-hooks/static-components.
const BarisEvaluasi = ({ judul, statusKey, data }) => (
  <div>
    <span className="text-[11px] font-semibold text-gray-500 mb-1 block">
      {judul}
    </span>
    <div className="w-full overflow-x-auto pb-2 hide-scrollbar">
      <div className="flex gap-4 min-w-max">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1 w-[45px]">
            <div
              className={`w-3 h-3 rounded-full shadow-sm transition-all ${warnaDot(item[statusKey])}`}
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

export default function ChartGrowth({
  title = "Tinggi Badan vs Berat Badan",
  data = [],
}) {
  const chartScrollRef = useRef(null);
  const LEBAR_PER_TITIK = 70;
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
      <div className="items-start mb-6">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">
          Grafik Standar WHO: Tinggi Badan (cm) &amp; Berat Badan (kg) menurut
          Umur
        </p>
      </div>

      <div
        ref={chartScrollRef}
        className="w-full overflow-x-auto pb-2 hide-scrollbar"
      >
        <div className="h-72" style={{ width: lebarChart, minWidth: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="gTinggi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ce855" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#0ce855" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBerat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.18} />
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
                yAxisId="tb"
                orientation="left"
                domain={["auto", "auto"]}
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#0ce855" }}
              />
              <YAxis
                yAxisId="bb"
                orientation="right"
                domain={["auto", "auto"]}
                fontSize={11}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#3B82F6" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area
                yAxisId="tb"
                type="linear"
                dataKey="tinggi"
                stroke="none"
                fill="url(#gTinggi)"
                fillOpacity={1}
                legendType="none"
              />
              <Area
                yAxisId="bb"
                type="linear"
                dataKey="berat"
                stroke="none"
                fill="url(#gBerat)"
                fillOpacity={1}
                legendType="none"
              />
              <Line
                yAxisId="tb"
                type="linear"
                dataKey="tinggi"
                name="Tinggi (cm)"
                stroke="#0ce855"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0ce855" }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="bb"
                type="linear"
                dataKey="berat"
                name="Berat (kg)"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ r: 4, fill: "#3B82F6" }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
        <span className="text-sm font-semibold text-gray-500 block">
          Evaluasi Kenaikan
        </span>
        <BarisEvaluasi
          judul="Tinggi Badan (KPT)"
          statusKey="statusTinggi"
          data={data}
        />
        <BarisEvaluasi
          judul="Berat Badan (KBM)"
          statusKey="statusBerat"
          data={data}
        />
      </div>
    </div>
  );
}
