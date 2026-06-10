import React from "react";
import { Info } from "lucide-react";

// Pemetaan warna persis mengikuti warnaTBU / warnaBBU / warnaBBTB di backend.
// Label dipisah: bagian Indonesia (tebal) + istilah WHO (kecil, abu-abu).
const TBU = [
  { color: "bg-red-600", label: "Sangat pendek", en: "severely stunted" },
  { color: "bg-yellow-400", label: "Pendek", en: "stunted" },
  { color: "bg-green-500", label: "Normal", en: null },
  { color: "bg-blue-500", label: "Tinggi", en: null },
];

const BBU = [
  {
    color: "bg-red-600",
    label: "Berat badan sangat kurang",
    en: "severely underweight",
  },
  { color: "bg-yellow-400", label: "Berat badan kurang", en: "underweight" },
  { color: "bg-green-500", label: "Berat badan normal", en: null },
  { color: "bg-blue-500", label: "Risiko berat badan lebih", en: null },
];

const BBTB = [
  { color: "bg-red-600", label: "Gizi buruk", en: "severely wasted" },
  { color: "bg-yellow-400", label: "Gizi kurang", en: "wasted" },
  { color: "bg-green-500", label: "Gizi baik", en: "normal" },
  {
    color: "bg-blue-300",
    label: "Berisiko gizi lebih",
    en: "possible risk of overweight",
  },
  { color: "bg-blue-500", label: "Gizi lebih", en: "overweight" },
  { color: "bg-purple-600", label: "Obesitas", en: "obese" },
];

// Satu baris: batang warna vertikal (persegi panjang ke atas) + keterangan.
const BarisLegend = ({ color, label, en }) => (
  <div className="flex items-stretch gap-3">
    <span className={`w-3 shrink-0 rounded-md ${color}`} />
    <div className="py-0.5 leading-tight">
      <p className="text-sm font-semibold text-slate-700">{label}</p>
      {en && <p className="text-xs italic text-slate-400">{en}</p>}
    </div>
  </div>
);

const Kolom = ({ judul, subjudul, items }) => (
  <div>
    <h4 className="text-sm font-bold text-slate-800">{judul}</h4>
    <p className="mb-3 text-xs text-slate-400">{subjudul}</p>
    <div className="space-y-2.5">
      {items.map((it) => (
        <BarisLegend key={it.label} {...it} />
      ))}
    </div>
  </div>
);

export default function KeteranganWarna() {
  return (
    <div className="w-full rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Info size={20} strokeWidth={2.2} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Keterangan Warna Status
          </h3>
          <p className="text-sm text-slate-500">
            Panduan warna pada hasil pemeriksaan pertumbuhan anak. Merah berarti
            perlu perhatian khusus, hijau berarti baik.
          </p>
        </div>
      </div>

      {/* Tiga indikator */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Kolom
          judul="Tinggi Badan / Umur"
          subjudul="Indikator stunting (TB/U)"
          items={TBU}
        />
        <Kolom
          judul="Berat Badan / Umur"
          subjudul="Indikator berat badan (BB/U)"
          items={BBU}
        />
        <Kolom
          judul="Berat Badan / Tinggi"
          subjudul="Indikator status gizi (BB/TB)"
          items={BBTB}
        />
      </div>
    </div>
  );
}
