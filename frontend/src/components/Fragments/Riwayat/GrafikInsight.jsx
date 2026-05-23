import React from 'react';
import { SlidersHorizontal, Download } from 'lucide-react';

export default function GrafikInsight() {
  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Riwayat Pemeriksaan</h2>
          <p className="text-sm text-gray-400">Pantau pertumbuhan bulanan Arkan dengan data klinis yang akurat.</p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"><SlidersHorizontal size={18} /></button>
          <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50"><Download size={18} /></button>
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">Tren Pertumbuhan</h3>
            {/* Legend info indikator */}
            <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span> Berat Badan (kg)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span> Tinggi Badan (cm)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block"></span> Lingkar Kepala (cm)</span>
            </div>
          </div>
          <div className="bg-gray-50 p-1 rounded-xl flex gap-1 text-xs font-semibold text-gray-500">
            <button className="px-3 py-1.5 rounded-lg">1M</button>
            <button className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white shadow-sm">3M</button>
            <button className="px-3 py-1.5 rounded-lg">6M</button>
            <button className="px-3 py-1.5 rounded-lg">1Y</button>
          </div>
        </div>

        {/* Layout Visual Grafik & Insight Box */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Placeholder Area Grafik */}
          <div className="lg:col-span-3 h-56 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <span className="text-xs text-gray-400">[ Area Chart / Grafik Recharts Disini ]</span>
          </div>

          {/* Kotak Insight */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-5 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm mb-2">
              <span>💡</span> Insight
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Semua parameter pertumbuhan Arkan menunjukkan tren positif dan berada dalam kisaran normal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}