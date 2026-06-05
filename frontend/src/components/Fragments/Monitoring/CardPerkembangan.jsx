import React from "react";
import {
  Scale,
  Ruler,
  ArrowUpRight,
  Minus,
  ArrowDownRight,
  Target,
  AlertTriangle,
  CircleCheck,
  CircleX,
  Info,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const d = new Date(tanggal);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ARAH_TURUN = "turun";

const warnaPerubahan = (perubahan, arah) => {
  const baik =
    arah === ARAH_TURUN ? Number(perubahan) < 0 : Number(perubahan) > 0;
  const buruk =
    arah === ARAH_TURUN ? Number(perubahan) > 0 : Number(perubahan) < 0;
  if (baik) return { text: "text-emerald-500", bg: "bg-emerald-50" };
  if (buruk) return { text: "text-red-500", bg: "bg-red-50" };
  return { text: "text-yellow-500", bg: "bg-yellow-50" };
};

const ikonPerubahan = (perubahan) => {
  if (Number(perubahan) > 0)
    return <ArrowUpRight size={14} className="mr-0.5" />;
  if (Number(perubahan) < 0)
    return <ArrowDownRight size={14} className="mr-0.5" />;
  return <Minus size={14} className="mr-0.5" />;
};

const GAYA_STATUS_GIZI = (statusGizi = "") => {
  const s = statusGizi.toLowerCase();
  if (s.includes("baik") || s.includes("normal"))
    return "bg-emerald-100 text-emerald-700";
  if (
    s.includes("kurang") ||
    s.includes("lebih") ||
    s.includes("risiko") ||
    s.includes("pendek")
  )
    return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

const GAYA_TREN = {
  membaik: {
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    icon: <TrendingUp size={13} />,
  },
  memburuk: {
    text: "text-red-600",
    bg: "bg-red-50",
    icon: <TrendingDown size={13} />,
  },
  tetap: { text: "text-gray-500", bg: "bg-gray-50", icon: <Minus size={13} /> },
};

function MetrikCard({ icon, label, unit, metrik }) {
  const m = metrik || {};

  const bulanLalu = Number(m.bulan_lalu) || 0;
  const bulanIni = Number(m.bulan_ini) || 0;
  const target = Number(m.target) || 0;
  const adaTarget = m.target != null && target > 0;

  const arah = m.arah_target === ARAH_TURUN ? ARAH_TURUN : "naik";

  // Rentang ideal (hanya berat)
  const idealMin = m.ideal_min != null ? Number(m.ideal_min) : null;
  const idealMax = m.ideal_max != null ? Number(m.ideal_max) : null;
  const punyaRentangIdeal = idealMin != null && idealMax != null;
  const dalamRentangIdeal =
    punyaRentangIdeal && bulanIni >= idealMin && bulanIni <= idealMax;

  const perubahanAktual = Number((bulanIni - bulanLalu).toFixed(2));
  const perubahanEfektif =
    arah === ARAH_TURUN ? -perubahanAktual : perubahanAktual;

  const kebutuhan =
    arah === ARAH_TURUN
      ? m.penurunan_dibutuhkan != null
        ? Number(m.penurunan_dibutuhkan)
        : punyaRentangIdeal
          ? Math.max(0, Number((bulanIni - idealMax).toFixed(2)))
          : 0
      : m.kenaikan_dibutuhkan != null
        ? Number(m.kenaikan_dibutuhkan)
        : 0;

  const memenuhi = dalamRentangIdeal
    ? true
    : typeof m.memenuhi_standar === "boolean"
      ? m.memenuhi_standar
      : kebutuhan > 0
        ? perubahanEfektif >= kebutuhan
        : null;

  const stagnan = perubahanAktual === 0 && !dalamRentangIdeal;

  const statusKenaikan = dalamRentangIdeal
    ? "Berat Badan Ideal"
    : stagnan
      ? "Pertumbuhan Stagnan"
      : perubahanEfektif > 0
        ? arah === ARAH_TURUN
          ? "Penurunan Sesuai Target"
          : "Mengalami Kenaikan"
        : arah === ARAH_TURUN
          ? "Berat Masih Naik"
          : "Mengalami Penurunan";

  // Untuk arah turun: sisa = selisih ke ideal; untuk naik: kebutuhan - perubahan
  const sisaKeTarget = Math.max(
    0,
    Number((kebutuhan - perubahanEfektif).toFixed(2)),
  );
  const sisaTampil =
    arah === ARAH_TURUN
      ? m.penurunan_dibutuhkan != null
        ? Number(m.penurunan_dibutuhkan)
        : kebutuhan
      : sisaKeTarget;

  const progres = dalamRentangIdeal
    ? 100
    : kebutuhan > 0
      ? Math.min(100, Math.max(0, (perubahanEfektif / kebutuhan) * 100))
      : memenuhi
        ? 100
        : 0;

  const warna = warnaPerubahan(perubahanAktual, arah);

  // ---- Catch-up & catatan ----
  const modeKejar = m.mode_target === "kejar";

  const catatan = m.catatan || null;

  // Standar KBM/KPT berlaku? (false = usia > 24 bln)
  const berlakuRaw = m.kbm_berlaku ?? m.kpt_berlaku;
  const standarBerlaku = berlakuRaw == null ? true : berlakuRaw;

  const pakaiIdeal = arah === ARAH_TURUN || dalamRentangIdeal;
  const tampilkanEvaluasi = pakaiIdeal || standarBerlaku;

  const adaTargetBerikutnya = m.target_berikutnya != null && m.tanggal_target;
  const tampilkanBox =
    adaTarget || arah === ARAH_TURUN || catatan || adaTargetBerikutnya;

  // Label baris evaluasi
  const labelKebutuhan =
    arah === ARAH_TURUN ? "Selisih ke berat ideal" : "Kenaikan minimal";
  const labelAktual =
    arah === ARAH_TURUN ? "Perubahan periode ini" : "Kenaikan saat ini";

  // ---- Deadline ----
  const deadline = m.tanggal_target ? new Date(m.tanggal_target) : null;
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  const lewatDeadline =
    deadline &&
    !isNaN(deadline.getTime()) &&
    hariIni > deadline &&
    memenuhi === false;
  const hariTerlambat = lewatDeadline
    ? Math.floor((hariIni - deadline) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="border border-gray-200 border-2 rounded-2xl p-4 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-500">{icon}</div>
          <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {modeKejar && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700">
              Catch-up
            </span>
          )}
          {m.status_gizi && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${GAYA_STATUS_GIZI(m.status_gizi)}`}
            >
              {m.status_gizi}
            </span>
          )}
        </div>
      </div>

      {/* PENGUKURAN */}
      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Bulan Lalu
            <span className="ml-1">({formatTanggal(m.tanggal_lalu)})</span>
          </span>
          <span className="font-bold text-black">
            {bulanLalu} {unit}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-black font-semibold">
            Bulan Ini
            <span className="ml-1">({formatTanggal(m.tanggal_ini)})</span>
          </span>
          <span className="font-bold text-black">
            {bulanIni} {unit}
          </span>
        </div>

        {punyaRentangIdeal && (
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-500">Rentang ideal (status gizi)</span>
            <span
              className={`font-bold ${dalamRentangIdeal ? "text-emerald-600" : "text-gray-700"}`}
            >
              {idealMin} – {idealMax} {unit}
            </span>
          </div>
        )}

        <hr className="border-gray-100 my-1" />
        <div className="flex justify-between items-center pt-1">
          <span className="text-gray-500">Perubahan</span>
          <span
            className={`${warna.text} font-bold flex items-center text-xs ${warna.bg} px-2 py-0.5 rounded-lg`}
          >
            {ikonPerubahan(perubahanAktual)}
            {Math.abs(m.perubahan ?? perubahanAktual)} {unit}
          </span>
        </div>
      </div>

      {/* TREN Z-SCORE (khusus tinggi / catch-up) */}

      {/* TARGET */}
      {tampilkanBox && (
        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Target size={15} className="text-indigo-500" />
              <span className="text-xs font-bold text-gray-700">
                {arah === ARAH_TURUN
                  ? "Target Berat Ideal"
                  : "Target Pertumbuhan"}
              </span>
            </div>
            {tampilkanEvaluasi && statusKenaikan && (
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${
                  stagnan
                    ? "bg-amber-500 text-white"
                    : memenuhi
                      ? "bg-emerald-500 text-white"
                      : "bg-red-500 text-white"
                }`}
              >
                {statusKenaikan}
              </span>
            )}
          </div>

          <div className="space-y-1.5 text-[12px] text-gray-600">
            {m.target != null && m.bulan_lalu != null && (
              <div className="flex items-start justify-between text-[12px]">
                <span className="text-gray-500">Target sebelumnya</span>
                <span className="font-bold text-gray-800 text-right">
                  {m.target} {unit}
                  <span className="block font-normal text-gray-500">
                    dinilai {formatTanggal(m.tanggal_ini)}
                    {m.memenuhi_standar != null && (
                      <span
                        className={
                          m.memenuhi_standar
                            ? "text-emerald-600"
                            : "text-red-500"
                        }
                      >
                        {" "}
                        • {m.memenuhi_standar ? "tercapai" : "belum tercapai"}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            )}
            {tampilkanEvaluasi && (
              <>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1 text-gray-500">
                    {labelKebutuhan}
                    {arah !== ARAH_TURUN && m.interval_bulan
                      ? ` (dalam ${m.interval_bulan} bln)`
                      : ""}
                  </span>
                  <span className="font-bold text-gray-800">
                    {kebutuhan} {unit}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{labelAktual}</span>
                  <span
                    className={`font-bold ${
                      memenuhi
                        ? "text-emerald-600"
                        : memenuhi === false
                          ? "text-red-500"
                          : "text-gray-700"
                    }`}
                  >
                    {perubahanAktual > 0 ? "+" : ""}
                    {perubahanAktual} {unit}
                  </span>
                </div>
              </>
            )}

            {adaTargetBerikutnya && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1 text-gray-500">
                  {tampilkanEvaluasi && memenuhi === false
                    ? "Target yang harus dikejar"
                    : "Target berikutnya"}
                  {m.interval_target ? ` (${m.interval_target} bln lagi)` : ""}
                </span>
                <span className="font-bold text-gray-800 text-right">
                  {m.target_berikutnya} {unit}
                  <span className="block font-normal text-gray-500">
                    sebelum {formatTanggal(m.tanggal_target)}
                  </span>
                </span>
              </div>
            )}
          </div>

          {tampilkanEvaluasi && (
            <div className="mt-2.5">
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    memenuhi ? "bg-emerald-500" : "bg-indigo-400"
                  }`}
                  style={{ width: `${progres}%` }}
                />
              </div>
              <p className="text-[11px] mt-1 font-semibold">
                {memenuhi ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CircleCheck size={12} />
                    {dalamRentangIdeal
                      ? "Berat sudah ideal sesuai status gizi (Tercapai)"
                      : arah === ARAH_TURUN
                        ? "Berat sudah masuk rentang ideal (Tercapai)"
                        : "Kenaikan memenuhi standar (Tercapai)"}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-red-600">
                    <CircleX size={12} />
                    {arah === ARAH_TURUN ? (
                      <>
                        Masih perlu turun{" "}
                        <span className="font-bold text-gray-700">
                          {sisaTampil} {unit}
                        </span>{" "}
                        menuju berat ideal (Belum Tercapai).
                      </>
                    ) : (
                      <>
                        Kurang{" "}
                        <span className="font-bold text-gray-700">
                          {sisaTampil} {unit}
                        </span>{" "}
                        lagi dari kenaikan minimal (Belum Tercapai).
                      </>
                    )}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* CATATAN */}
          {catatan && (
            <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>{catatan}</span>
            </div>
          )}
        </div>
      )}

      {lewatDeadline && (
        <div className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            Batas waktu target terlewat
            {hariTerlambat > 0 ? ` ${hariTerlambat} hari` : ""}. Segera lakukan
            penimbangan ulang dan konsultasikan ke Posyandu/tenaga kesehatan.
          </span>
        </div>
      )}
    </div>
  );
}

export default function CardPerkembangan({ data }) {
  const berat = data?.berat_badan || {};
  const tinggi = data?.tinggi_badan || {};

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-xl font-extrabold text-gray-800 mb-4">
        Perkembangan Berat &amp; Tinggi Badan
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Penilaian target disesuaikan dengan status gizi anak — berat berlebih
        dinilai dari penurunan menuju berat ideal, berat kurang/normal dari
        kenaikan minimal (KBM), dan anak pendek memakai target kejar (catch-up)
        untuk tinggi badan.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetrikCard
          icon={<Ruler size={18} />}
          label="Tinggi Badan"
          unit="cm"
          metrik={tinggi}
        />
        <MetrikCard
          icon={<Scale size={18} />}
          label="Berat Badan"
          unit="kg"
          metrik={berat}
        />
      </div>
    </div>
  );
}
