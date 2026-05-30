import React from "react";
import {
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  AreaChart,
} from "recharts";
import { Maximize2 } from "lucide-react";
import { useEffect, useRef } from "react";

//custom Tooltip
const CustomTooltipTinggi = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const dataAnak = payload[0].payload;
    // data dari API
    const nilaiKenaikan = dataAnak.kenaikanTinggi ?? 0;
    const nilaiTarget = dataAnak.targetKpt ?? null;
    const statusPertumbuhan = dataAnak.statusTinggi;
    const TOOLTIPTB = dataAnak.TooltipTB;
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
          return "text-red-600";
      }
    };
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-2xl border border-gray-100 shadow-2xl min-w-[230px]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-gray-800">
              {dataAnak.fullDate || label}
            </p>

            <p className="text-[11px] text-gray-400 mt-0.5">
              Umur {dataAnak.umur} bulan
            </p>
          </div>

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
          <p className="text-[11px] text-gray-400 mb-1">
            Tinggi Badan Saat Ini
          </p>

          <div className="flex items-end gap-1">
            {/* Gunakan fungsi pemetaan warna di sini */}
            <span
              className={`text-2xl font-extrabold ${getStatusColorClass(statusPertumbuhan)}`}
            >
              {payload[0].value}
            </span>

            <span className="text-sm text-gray-500 mb-0.5">cm</span>
          </div>
        </div>

        {/* DATA KPT */}
        {statusPertumbuhan !== "Data Awal" && statusPertumbuhan !== "-" && (
          <div className="space-y-2">
            {/* KENAIKAN */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Kenaikan TB</span>

              <span
                className={`text-xs font-bold ${
                  nilaiKenaikan >= nilaiTarget
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >
                {nilaiKenaikan > 0 ? "+" : ""}
                {nilaiKenaikan} cm
              </span>
            </div>

            {/* TARGET */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">Target KPT</span>

              <span className="text-xs font-semibold text-gray-700">
                {nilaiTarget ? `${nilaiTarget} cm` : "-"}
              </span>
            </div>
            <p className="text-[11px] text-gray-500 mt-2 italic">{TOOLTIPTB}</p>
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

export default function ChartTinggi({
  title,
  data = [],
  dataKey = "tinggi",
  statusKey = "statusTinggi",
}) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [data]);
  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      {/* HEADER */}
      <div className=" items-start mb-6">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-400">
          Grafik Standar WHO: Status Pertumbuhan Tinggi Badan menurut Umur
        </p>
      </div>

      {/* CHART */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 20,
              right: 10,
              left: -20,
              bottom: 0,
            }}
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
              dataKey="id"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF" }}
              tickFormatter={(value, index) => {
                const item = data[index];
                return item ? item.name : "";
              }}
            />

            <YAxis
              domain={["auto", "auto"]}
              fontSize={11}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9CA3AF" }}
            />

            {/* TOOLTIP */}
            <Tooltip content={<CustomTooltipTinggi />} />
            <Area
              type="linear"
              dataKey={dataKey}
              stroke="none"
              fillOpacity={1}
              fill="url(#colorTinggi)"
            />
            {/* LINE */}
            <Line
              type="linear"
              dataKey={dataKey}
              stroke="#0ce855"
              strokeWidth={3}
              dot={{
                r: 4,
                fill: "#0ce855",
              }}
              activeDot={{ r: 6 }}
              label={{
                position: "top",
                fill: "#0ce855",
                fontSize: 10,
                fontWeight: 600,
                offset: 10,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* STATUS GIZI */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="text-sm font-semibold text-gray-500 mb-3 block">
          Evalausi Kenaikan
        </span>

        <div
          ref={scrollRef}
          className="w-full overflow-x-auto pb-2 scroll-smooth scrollbar-thin scrollbar-thumb-gray-200"
        >
          <div className="flex gap-4 flex-nowrap min-w-max">
            {data.map((item, idx) => {
              const currentStatus = item[statusKey];
              const getStatusColor = (status) => {
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
