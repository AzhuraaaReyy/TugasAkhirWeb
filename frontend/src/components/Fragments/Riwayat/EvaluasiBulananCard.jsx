import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  HelpCircle,
  Info,
} from "lucide-react";

export default function EvaluasiKenaikanBulanan({ form }) {
  const { riwayat, umur } = form;
  const [showEdu, setShowEdu] = useState(false);

  // 1. Validasi jika data belum siap
  if (!riwayat || riwayat.length < 2) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-slate-400" />
          <h3 className="text-sm font-semibold text-slate-700">
            Evaluasi Kenaikan Bulanan
          </h3>
        </div>
        <p className="text-xs text-slate-400 italic">
          Dibutuhkan minimal 2 riwayat pemeriksaan untuk mulai menghitung
          ketepatan target pertumbuhan bulanan.
        </p>
      </div>
    );
  }
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });
  };
  // 2. Ambil data pemeriksaan Terakhir (Bulan Ini) vs Sebelumnya (Bulan Lalu)
  const dataBulanIni = riwayat[riwayat.length - 1];
  const dataBulanLalu = riwayat[riwayat.length - 2];

  const bbIni = parseFloat(dataBulanIni.berat || dataBulanIni.bb || 0);
  const tbIni = parseFloat(dataBulanIni.tinggi || dataBulanIni.tb || 0);
  const blnIniLabel = formatDate(dataBulanIni.tgl_deteksi) || "Bulan Ini";

  const bbLalu = parseFloat(dataBulanLalu.berat || dataBulanLalu.bb || 0);
  const tbLalu = parseFloat(dataBulanLalu.tinggi || dataBulanLalu.tb || 0);
  const blnLaluLabel = formatDate(dataBulanLalu.tgl_deteksi) || "Bulan Lalu";

  const usiaAnak = parseInt(umur) || 0;

  // 3. Standar Target KBM & KPT Kemenkes RI
  const getTargetKBM = (usia) => {
    if (usia === 1) return 0.8;
    if (usia === 2) return 0.9;
    if (usia === 3) return 0.8;
    if (usia === 4) return 0.6;
    if (usia === 5) return 0.5;
    if (usia === 6) return 0.4;
    if (usia >= 7 && parseInt(usia) <= 11) return 0.3;
    return 0.2; // 12 - 24 Bulan
  };

  const getTargetKPT = (usia) => {
    if (usia <= 3) return 2.5;
    if (usia <= 6) return 1.5;
    if (usia <= 12) return 1.0;
    return 0.5; // 12 - 24 Bulan
  };

  const targetBB = getTargetKBM(usiaAnak);
  const targetTB = getTargetKPT(usiaAnak);

  const deltaBB = parseFloat((bbIni - bbLalu).toFixed(2));
  const deltaTB = parseFloat((tbIni - tbLalu).toFixed(2));

  const bbLolos = deltaBB >= targetBB;
  const tbLolos = deltaTB >= targetTB;
  const semuaLolos = bbLolos && tbLolos;

  const getStatusConfig = (delta, target, isLolos, jenis) => {
    if (delta < 0) {
      return {
        badgeBg: "bg-rose-50 text-rose-700 border-rose-200",
        textStyle: "text-rose-600",
        label: "Berat Turun",
        detail: `Mengalami penurunan sebanyak ${Math.abs(delta)} ${jenis}. Waspadai gejala sakit atau penurunan nafsu makan.`,
        icon: <ArrowDownRight className="w-4 h-4 text-rose-500" />,
      };
    }
    if (!isLolos) {
      return {
        badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
        textStyle: "text-amber-600",
        label: "Tumbuh Kurang Optimal",
        detail: `Tumbuh +${delta} ${jenis}, sedikit lagi mengejar target minimal Kemenkes (+${target} ${jenis}).`,
        icon: <ArrowUpRight className="w-4 h-4 text-amber-500" />,
      };
    }
    return {
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      textStyle: "text-emerald-600",
      label: "Lolos Target Minimal",
      detail: `Pertumbuhan luar biasa (+${delta} ${jenis}), berhasil melampaui standar minimal sebesar +${target} ${jenis}.`,
      icon: <ArrowUpRight className="w-4 h-4 text-emerald-600" />,
    };
  };

  const bbConfig = getStatusConfig(deltaBB, targetBB, bbLolos, "kg");
  const tbConfig = getStatusConfig(deltaTB, targetTB, tbLolos, "cm");

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 p-5 shadow-xs flex flex-col justify-between h-full relative">
      <div>
        {/* Header dengan tombol bantuan */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Evaluasi Kenaikan Bulanan
              </h3>
              <p className="text-[11px] text-slate-400">
                Menilai kualitas laju tumbuh anak
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowEdu(!showEdu)}
            className="text-slate-400 hover:text-teal-600 transition-colors p-1 rounded-full hover:bg-slate-50"
            title="Klik untuk info standar Kemenkes"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Edu Popover panel jika di klik */}
        {showEdu && (
          <div className="mb-4 p-3 bg-teal-50/60 border border-teal-100 rounded-xl text-[11px] text-teal-900 leading-relaxed">
            <div className="font-semibold flex items-center gap-1 mb-1">
              <Info className="w-3..5 h-3.5 text-teal-600" /> Apa itu KBM & KPT?
            </div>
            Sesuai standar <strong>Buku KIA Kemenkes RI</strong>, anak tidak
            hanya dinilai dari berat totalnya saja, melainkan berapa banyak
            beratnya naik tiap bulan. Rentang usia {usiaAnak} bulan mewajibkan
            kenaikan minimal <strong>+{targetBB} kg</strong> untuk Berat Badan,
            dan <strong>+{targetTB} cm</strong> untuk Tinggi Badan.
          </div>
        )}

        {/* Indikator Berpenjelasan */}
        <div className="space-y-4">
          {/* Bagian Berat Badan */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider">
                BERAT BADAN (BB)
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${bbConfig.badgeBg}`}
              >
                {bbConfig.label}
              </span>
            </div>

            <div className="flex items-baseline justify-between border-b border-dashed border-slate-200/60 pb-1.5 mb-1.5">
              <div className="flex items-center gap-0.5">
                <span
                  className={`text-lg font-extrabold ${bbConfig.textStyle}`}
                >
                  {deltaBB >= 0 ? `+${deltaBB}` : deltaBB} kg
                </span>
                {bbConfig.icon}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Target KBM Kemenkes:{" "}
                <span className="text-slate-600 font-semibold">
                  +{targetBB} kg
                </span>
              </span>
            </div>

            {/* Keterangan Detail Alur Hitungan */}
            <p className="text-[11px] text-slate-500 leading-normal">
              {bbConfig.detail}{" "}
              <span className="text-[10px] text-slate-400 block mt-0.5">
                (Hitungan: {bbIni}kg{" "}
                <span className="text-slate-300">-{blnIniLabel}</span> dikurangi{" "}
                {bbLalu}kg{" "}
                <span className="text-slate-300">-{blnLaluLabel}</span>)
              </span>
            </p>
          </div>

          {/* Bagian Tinggi Badan */}
          <div className="p-3 bg-slate-50/50 rounded-xl border border-slate-100/80">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-slate-500 tracking-wider">
                TINGGI BADAN (TB)
              </span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tbConfig.badgeBg}`}
              >
                {tbConfig.label}
              </span>
            </div>

            <div className="flex items-baseline justify-between border-b border-dashed border-slate-200/60 pb-1.5 mb-1.5">
              <div className="flex items-center gap-0.5">
                <span
                  className={`text-lg font-extrabold ${tbConfig.textStyle}`}
                >
                  {deltaTB >= 0 ? `+${deltaTB}` : deltaTB} cm
                </span>
                {tbConfig.icon}
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                Target KPT Standar:{" "}
                <span className="text-slate-600 font-semibold">
                  +{targetTB} cm
                </span>
              </span>
            </div>

            {/* Keterangan Detail Alur Hitungan */}
            <p className="text-[11px] text-slate-500 leading-normal">
              {tbConfig.detail}{" "}
              <span className="text-[10px] text-slate-400 block mt-0.5">
                (Hitungan: {tbIni}cm{" "}
                <span className="text-slate-300">-{blnIniLabel}</span> dikurangi{" "}
                {tbLalu}cm{" "}
                <span className="text-slate-300">-{blnLaluLabel}</span>)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Dynamic Banner Insight (Kesimpulan Akhir) */}
      <div
        className={`mt-4 p-3 rounded-xl border flex gap-2 items-start ${
          semuaLolos
            ? "bg-emerald-50/50 border-emerald-100 text-emerald-800"
            : deltaBB < 0 || deltaTB < 0
              ? "bg-rose-50/50 border-rose-100 text-rose-800"
              : "bg-amber-50/50 border-amber-100 text-amber-800"
        }`}
      >
        {semuaLolos ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        )}
        <p className="text-xs leading-relaxed font-semibold">
          {semuaLolos
            ? "Kesimpulan: Laju pertumbuhan fisik anak berjalan sangat baik dan sehat karena berhasil mengungguli kecepatan tumbuh minimal bulanan."
            : deltaBB < 0 || deltaTB < 0
              ? "Kesimpulan: Deteksi mendeteksi adanya penurunan fisik. Jika anak tidak sedang masa penyembuhan pasca-sakit, disarankan untuk memantau porsi makan harian."
              : "Kesimpulan: Anak tumbuh naik, namun kecepatannya masih berada sedikit di bawah ambang acuan emas. Tingkatkan variasi MPASI kaya protein hewan."}
        </p>
      </div>
    </div>
  );
}
