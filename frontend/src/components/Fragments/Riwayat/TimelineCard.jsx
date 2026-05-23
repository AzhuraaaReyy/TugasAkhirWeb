import React from "react";
import { ArrowUpRight, CheckCircle2, ChevronDown } from "lucide-react";

const historyData = [
  {
    id: 1,
    date: "2024 Mei",
    age: "24 Bulan",
    isLatest: true,
    status: "Pemeriksaan Rutin Selesai",
    bb: "12.4 kg",
    bbDiff: "+0.4 kg",
    tb: "88.5 cm",
    tbDiff: "+1.5 cm",
    lk: "48.2 cm",
    lkDiff: "+0.2 kg",
  },
  {
    id: 2,
    date: "2024 Apr",
    age: "23 Bulan",
    isLatest: false,
    status: "Pemeriksaan Rutin",
    bb: "12.0 kg",
    bbDiff: "+0.2 kg",
    tb: "87.0 cm",
    tbDiff: "+1.0 cm",
    lk: "48.0 cm",
    lkDiff: "+0.1 kg",
  },
  {
    id: 3,
    date: "2024 Mar",
    age: "22 Bulan",
    isLatest: false,
    status: "Pemeriksaan Rutin",
    bb: "11.8 kg",
    bbDiff: "+0.3 kg",
    tb: "86.0 cm",
    tbDiff: "+0.8 cm",
    lk: "47.9 cm",
    lkDiff: "+0.0 kg",
  },
];

export default function TimelineCard() {
  return (
    <div className="mt-6 flex flex-col gap-6 relative pl-4 sm:pl-24">
      {/* Garis Vertikal Timeline */}
      <div className="absolute left-[19px] sm:left-[115px] top-4 bottom-4 w-0.5 bg-gray-100" />

      {historyData.map((log) => (
        <div
          key={log.id}
          className="relative flex flex-col sm:flex-row gap-4 sm:gap-8"
        >
          {/* Tanggal di Samping Kiri */}
          <div className="sm:absolute sm:-left-24 sm:w-20 text-left sm:text-right font-bold text-gray-700 text-sm pt-1">
            {log.date}
          </div>

          {/* Node Bulatan Indikator */}
          <div
            className={`absolute left-0 sm:left-4 z-10 w-3 h-3 rounded-full mt-2.5 -translate-x-[5px] ${log.isLatest ? "bg-emerald-500 ring-4 ring-emerald-100" : "bg-gray-300"}`}
          />

          {/* Card Data Pemeriksaan */}
          <div className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm ml-4 sm:ml-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                <CheckCircle2 size={16} />
                <span>{log.status}</span>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                Usia: {log.age}
              </span>
            </div>

            {/* Grid 3 Parameter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Berat Badan */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
                  Berat Badan (BB)
                </span>
                <span className="text-lg font-bold text-gray-800 block mt-1">
                  {log.bb}
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                  <ArrowUpRight size={12} /> {log.bbDiff}{" "}
                  <span className="text-gray-400 font-normal text-[10px]">
                    vs bulan lalu
                  </span>
                </span>
              </div>
              {/* Tinggi Badan */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
                  Tinggi Badan (TB)
                </span>
                <span className="text-lg font-bold text-gray-800 block mt-1">
                  {log.tb}
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                  <ArrowUpRight size={12} /> {log.tbDiff}{" "}
                  <span className="text-gray-400 font-normal text-[10px]">
                    vs bulan lalu
                  </span>
                </span>
              </div>
              {/* Lingkar Kepala */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
                  Lingkar Kepala (LK)
                </span>
                <span className="text-lg font-bold text-gray-800 block mt-1">
                  {log.lk}
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5 mt-1">
                  <ArrowUpRight size={12} /> {log.lkDiff}{" "}
                  <span className="text-gray-400 font-normal text-[10px]">
                    vs bulan lalu
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Tombol Muat Riwayat Sebelumnya */}
      <div className="flex justify-center mt-4">
        <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition">
          Muat Riwayat Sebelumnya
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
}
