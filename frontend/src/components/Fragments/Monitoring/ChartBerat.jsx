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
  if (active && payload && payload.length) {
    const dataAnak = payload[0].payload;

    // Ambil data yang dikirim oleh GrafikController Laravel
    const nilaiKenaikan = dataAnak.kenaikanBerat ?? 0;
    const nilaiTarget = dataAnak.targetKbm ?? null;
    const statusPertumbuhan = dataAnak.statusBerat; // Merujuk ke status KBM
    const TOOLTIPBB = dataAnak.TooltipBB;

    const getStatusColorClass = (status) => {
      switch (status) {
        case "Telah Tercapai":
          return "text-emerald-600";
        case "Tinggi":
          return "text-blue-600";
        case "Data Awal":
        case "-":
          return "text-gray-800";
        default:
          // Diasumsikan untuk status kurang/merah
          return "text-red-600";
      }
    };
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-2xl min-w-[230px]">
        {/* HEADER */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-800">
              {dataAnak.fullDate || label}
            </p>

            <p className="text-[11px] text-gray-400 mt-0.5">
              Umur {dataAnak.umur} bulan
            </p>
          </div>

          {/* BADGE STATUS */}
          {statusPertumbuhan !== "Data Awal" && statusPertumbuhan !== "-" && (
            <span
              className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
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

        {/* NILAI UTAMA */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3">
          <p className="text-[11px] text-gray-400 mb-1">Berat Badan Saat Ini</p>

          <div className="flex items-end gap-1">
            <span
              className={`text-2xl font-extrabold ${getStatusColorClass(statusPertumbuhan)}`}
            >
              {payload[0].value}
            </span>

            <span className="text-sm text-gray-500 mb-0.5">kg</span>
          </div>
        </div>

        {/* DATA KPT */}
        {statusPertumbuhan !== "Data Awal" && statusPertumbuhan !== "-" && (
          <div className="space-y-2">
            {/* KENAIKAN */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Kenaikan BB</span>

              <span
                className={`text-xs font-bold ${
                  nilaiKenaikan >= nilaiTarget
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {nilaiKenaikan > 0 ? "+" : ""}
                {nilaiKenaikan} kg
              </span>
            </div>

            {/* TARGET */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Target KBM</span>

              <span className="text-xs font-semibold text-gray-700">
                {nilaiTarget ? `${nilaiTarget} kg` : "-"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 italic">{TOOLTIPBB}</p>

            {/* PROGRESS */}
            {nilaiTarget && (
              <div className="pt-2">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      nilaiKenaikan >= nilaiTarget
                        ? "bg-emerald-500"
                        : "bg-red-400"
                    }`}
                    style={{
                      width: `${Math.min(
                        (nilaiKenaikan / nilaiTarget) * 100,
                        100,
                      )}%`,
                    }}
                  />
                </div>

                <p className="text-[10px] text-gray-400 mt-1 text-right">
                  {Math.round((nilaiKenaikan / nilaiTarget) * 100)}% target
                  tercapai
                </p>
              </div>
            )}
          </div>
        )}

        {/* DATA AWAL */}
        {(statusPertumbuhan === "Data Awal" || statusPertumbuhan === "-") && (
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-[11px] text-gray-400 italic">
              Data awal pengukuran
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
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
      <div className="h-48 w-full">
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
