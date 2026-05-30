import React from "react";

export default function CardKeteranganStatus() {
  const legends = [
    { label: "Normal (Z-Score -2 s.d. +2)", desc: "Pertumbuhan sesuai standar WHO.", color: "bg-emerald-500" },
    { label: "Gizi Kurang (Z-Score -3 s.d. -2)", desc: "Perlu perhatian dan perbaikan gizi.", color: "bg-amber-500" },
    { label: "Gizi Buruk (Z-Score < -3)", desc: "Memerlukan penanganan segera.", color: "bg-red-500" },
  ];

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-sm font-bold text-gray-800 mb-4">Keterangan Status</h3>
      <div className="space-y-3">
        {legends.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 text-xs font-medium">
            <div className={`w-3 h-3 rounded-full mt-0.5 shrink-0 ${item.color}`} />
            <div>
              <p className="text-gray-700 font-bold">{item.label}</p>
              <p className="text-gray-400 mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}