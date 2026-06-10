import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ============================================================
 * CardPerkembangan — fokus: monitoring pertumbuhan balita.
 *
 * Bagian "Lihat detail perhitungan" disusun runtut:
 *   1) Perbandingan bulan lalu vs bulan ini (+ laju per bulan)
 *   2) Rentang ideal (pembanding terhadap standar WHO)
 *   3) Pencapaian terhadap KBM/KPT (tercapai / belum)
 *   4) Kenaikan / penurunan yang masih dibutuhkan
 *   5) Target 3 bulan ke depan (dari data KBM/KPT di database)
 *   6) Status gizi & tren
 *
 * Semua nilai berasal dari backend (susunPerkembangan). Card hanya
 * menampilkan dan memberi konteks; warna pencapaian (badge, progress,
 * centang/silang) digerakkan satu nilai `tone` agar tidak kontradiktif.
 * ============================================================ */

const ARAH_TURUN = "turun";
const TOLERANSI_STAGNAN = 0.05;

// Peringatan tenggat dibandingkan dengan tanggal hari ini. Saat pengujian/UAT
// dengan data contoh bertanggal lampau, biarkan false. Set true saat produksi.
const PERINGATAN_TENGGAT_AKTIF = false;

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

const angka = (x) => {
  if (x === null || x === undefined || x === "") return null;
  const n = Number(x);
  return isNaN(n) ? null : n;
};

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));
const round1 = (x) => Math.round(x * 10) / 10;
const tandai = (x) => (x > 0 ? `+${x}` : `${x}`);

const warnaPerubahan = (perubahan, arah) => {
  if (perubahan === null) return { text: "text-gray-500", bg: "bg-gray-50" };
  const baik = arah === ARAH_TURUN ? perubahan < 0 : perubahan > 0;
  const buruk = arah === ARAH_TURUN ? perubahan > 0 : perubahan < 0;
  if (baik) return { text: "text-emerald-500", bg: "bg-emerald-50" };
  if (buruk) return { text: "text-red-500", bg: "bg-red-50" };
  return { text: "text-yellow-500", bg: "bg-yellow-50" };
};

const ikonPerubahan = (perubahan) => {
  if (perubahan === null) return <Minus size={14} className="mr-0.5" />;
  if (perubahan > 0) return <ArrowUpRight size={14} className="mr-0.5" />;
  if (perubahan < 0) return <ArrowDownRight size={14} className="mr-0.5" />;
  return <Minus size={14} className="mr-0.5" />;
};

const GAYA_STATUS_GIZI = (statusGizi = "") => {
  const s = String(statusGizi).toLowerCase();
  if (!s) return "bg-gray-100 text-gray-600";
  if (/(buruk|severe|sangat|parah|obes)/.test(s))
    return "bg-red-100 text-red-700";
  if (/(baik|normal|ideal|cukup)/.test(s))
    return "bg-emerald-100 text-emerald-700";
  if (/(kurang|lebih|risiko|resiko|pendek|gemuk|kurus|tinggi)/.test(s))
    return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
};

const GAYA_TREN = {
  membaik: {
    text: "text-emerald-700",
    bg: "bg-emerald-100",
    label: "Tren membaik",
    icon: <TrendingUp size={12} />,
  },
  memburuk: {
    text: "text-red-700",
    bg: "bg-red-100",
    label: "Perlu perhatian",
    icon: <TrendingDown size={12} />,
  },
  tetap: {
    text: "text-gray-600",
    bg: "bg-gray-100",
    label: "Tren stabil",
    icon: <Minus size={12} />,
  },
};

/* ---------- Komponen kecil untuk detail ---------- */
const Eyebrow = ({ children }) => (
  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-1.5">
    {children}
  </p>
);

const Baris = ({ label, children, kuat = false }) => (
  <div className="flex justify-between gap-3">
    <span className={kuat ? "text-gray-700 font-semibold" : "text-gray-500"}>
      {label}
    </span>
    <span className="font-bold text-gray-800 text-right">{children}</span>
  </div>
);

function MetrikCard({ icon, label, unit, metrik }) {
  const m = metrik || {};
  const [lihatDetail, setLihatDetail] = useState(false);

  const jenis = unit === "cm" ? "tinggi" : "berat";
  const arah = m.arah_target === ARAH_TURUN ? ARAH_TURUN : "naik";
  const labelStandar = unit === "cm" ? "KPT" : "KBM";
  const glosStandar =
    unit === "cm"
      ? "KPT = Kenaikan Panjang/Tinggi badan minimum"
      : "KBM = Kenaikan Berat badan Minimum";
  const indeksZ = unit === "cm" ? "TB/U" : "BB/TB";

  // ---- Nilai dasar (langsung dari backend) ----
  const adaPembanding = m.tanggal_lalu != null && m.bulan_lalu != null;
  const bulanLalu = adaPembanding ? angka(m.bulan_lalu) : null;
  const bulanIni = angka(m.bulan_ini);
  const perubahan = angka(m.perubahan);
  const interval = angka(m.interval_bulan);

  // Laju per bulan (perkiraan, hanya untuk membantu pemahaman).
  const lajuPerBulan =
    perubahan !== null && interval && interval > 1
      ? round1(perubahan / interval)
      : null;

  // ---- Rentang ideal ----
  const idealMin = angka(m.ideal_min);
  const idealMax = angka(m.ideal_max);
  const punyaRentangIdeal = idealMin !== null && idealMax !== null;
  const infoSaja = m.ideal_info === true;

  const posisi =
    punyaRentangIdeal && bulanIni !== null
      ? bulanIni < idealMin
        ? "bawah"
        : bulanIni > idealMax
          ? "atas"
          : "dalam"
      : null;
  const dalamRentang = posisi === "dalam";
  const dalamRentangIdeal = !infoSaja && dalamRentang;

  // ---- Kebutuhan & arah efektif ----
  const perubahanEfektif =
    perubahan === null ? null : arah === ARAH_TURUN ? -perubahan : perubahan;
  const penurunanDibutuhkan = angka(m.penurunan_dibutuhkan);
  const kenaikanDibutuhkan = angka(m.kenaikan_dibutuhkan);
  const kebutuhan =
    arah === ARAH_TURUN
      ? (penurunanDibutuhkan ?? 0)
      : (kenaikanDibutuhkan ?? 0);

  // ---- Pencapaian (otoritas: memenuhi_standar) ----
  const memenuhi = dalamRentangIdeal
    ? true
    : typeof m.memenuhi_standar === "boolean"
      ? m.memenuhi_standar
      : null;

  const stagnan =
    adaPembanding &&
    perubahan !== null &&
    Math.abs(perubahan) < TOLERANSI_STAGNAN &&
    memenuhi !== true &&
    !dalamRentangIdeal;

  const tone =
    dalamRentangIdeal || memenuhi === true
      ? "ok"
      : memenuhi === false
        ? "bad"
        : "netral";

  const toneBadge =
    tone === "ok"
      ? "bg-emerald-500 text-white"
      : tone === "bad"
        ? "bg-red-500 text-white"
        : "bg-gray-400 text-white";
  const toneText =
    tone === "ok"
      ? "text-emerald-600"
      : tone === "bad"
        ? "text-red-500"
        : "text-gray-500";

  let statusKenaikan;
  if (dalamRentangIdeal) {
    statusKenaikan = jenis === "berat" ? "Berat sudah ideal" : "Sesuai rentang";
  } else if (memenuhi === true) {
    statusKenaikan =
      arah === ARAH_TURUN ? "Penurunan sesuai target" : "Memenuhi standar";
  } else if (memenuhi === false) {
    statusKenaikan = stagnan
      ? "Pertumbuhan stagnan"
      : arah === ARAH_TURUN
        ? "Belum mencapai berat ideal"
        : "Belum memenuhi standar";
  } else {
    statusKenaikan = "Belum dapat dinilai";
  }

  const progres =
    dalamRentangIdeal || memenuhi === true
      ? 100
      : memenuhi === false
        ? kebutuhan > 0 && perubahanEfektif !== null
          ? clamp((perubahanEfektif / kebutuhan) * 100)
          : 0
        : 0;

  const sisaTampil =
    arah === ARAH_TURUN
      ? (penurunanDibutuhkan ?? Math.max(0, round1(kebutuhan)))
      : Math.max(0, round1(kebutuhan - (perubahanEfektif ?? 0)));

  const modeKejar = m.mode_target === "kejar";
  const catatan = m.catatan || null;
  const peringatan = m.peringatan || null;

  const berlakuRaw = m.kbm_berlaku ?? m.kpt_berlaku;
  const standarBerlaku = berlakuRaw == null ? true : berlakuRaw;
  const pakaiIdeal = arah === ARAH_TURUN || dalamRentangIdeal;
  const tampilkanEvaluasi = adaPembanding && (pakaiIdeal || standarBerlaku);

  const adaTargetBerikutnya = m.target_berikutnya != null && m.tanggal_target;
  const kenaikanBerikutnya = angka(m.kenaikan_berikutnya);
  const intervalTarget = angka(m.interval_target) ?? 3;
  const targetPerBulan =
    kenaikanBerikutnya !== null && intervalTarget > 1
      ? round1(kenaikanBerikutnya / intervalTarget)
      : null;

  const tren =
    m.tren_zscore && GAYA_TREN[m.tren_zscore] ? GAYA_TREN[m.tren_zscore] : null;

  // ---- Deadline ----
  const deadline = m.tanggal_target ? new Date(m.tanggal_target) : null;
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);
  const lewatDeadline =
    PERINGATAN_TENGGAT_AKTIF &&
    deadline &&
    !isNaN(deadline.getTime()) &&
    hariIni > deadline &&
    memenuhi === false;
  const hariTerlambat = lewatDeadline
    ? Math.floor((hariIni - deadline) / (1000 * 60 * 60 * 24))
    : 0;

  const warna = warnaPerubahan(perubahan, arah);

  // ============================================================
  //  RINGKASAN UNTUK ORANG TUA
  // ============================================================
  let ringkasan;
  if (peringatan) {
    ringkasan =
      "Mohon periksa kembali kebenaran data pengukuran di atas sebelum membaca hasil lainnya.";
  } else if (!adaPembanding) {
    ringkasan =
      "Ini data pengukuran pertama sehingga belum ada pembanding. Lakukan pengukuran rutin bulan depan di Posyandu agar perkembangan anak dapat dinilai.";
  } else if (jenis === "berat") {
    if (arah === ARAH_TURUN) {
      ringkasan = dalamRentangIdeal
        ? "Berat badan anak sudah kembali ke rentang ideal. Pertahankan pola makan sehat dan timbang anak secara rutin."
        : "Berat badan anak melebihi rentang ideal. Penurunan tidak perlu drastis; jaga agar berat tidak terus bertambah seiring pertambahan tinggi, dan konsultasikan ke Posyandu.";
    } else if (dalamRentangIdeal) {
      ringkasan =
        "Berat badan anak sudah ideal terhadap tinggi badannya. Pertahankan pola makan dan timbang anak setiap bulan.";
    } else if (memenuhi === true) {
      ringkasan =
        "Kenaikan berat badan anak sudah memenuhi standar. Lanjutkan pola makan yang sudah berjalan.";
    } else if (memenuhi === false) {
      ringkasan = stagnan
        ? "Berat badan anak tidak bertambah pada periode ini. Tambahkan porsi makan dan lauk berprotein (telur, ikan, ayam), lalu timbang kembali sesuai jadwal Posyandu."
        : "Kenaikan berat badan anak belum memenuhi standar. Tambahkan porsi makan dan lauk berprotein, kemudian timbang kembali sesuai jadwal Posyandu.";
    } else {
      ringkasan =
        "Kenaikan berat badan akan dinilai pada penimbangan berikutnya.";
    }
  } else {
    if (modeKejar) {
      ringkasan =
        "Tinggi badan anak masih di bawah standar usianya, sehingga diberikan target kejar (catch-up). Penuhi asupan protein hewani setiap hari dan ukur tinggi anak secara rutin di Posyandu.";
    } else if (memenuhi === true) {
      ringkasan =
        "Pertambahan tinggi badan anak sudah memenuhi standar. Pertahankan asupan gizi dan pengukuran rutin.";
    } else if (memenuhi === false) {
      ringkasan =
        "Pertambahan tinggi badan anak belum mencapai target minimal. Perbanyak makanan berprotein dan ukur kembali sesuai jadwal di Posyandu.";
    } else {
      ringkasan =
        "Tinggi badan anak masih sesuai usianya. Pertambahan tinggi akan dinilai pada pengukuran berikutnya.";
    }
  }

  return (
    <div className="border-2 border-gray-200 rounded-2xl p-4 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative">
      {/* ===================== HEADER ===================== */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-500">{icon}</div>
          <span className="text-sm font-bold text-gray-700">{label}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {modeKejar && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700">
              Catch-up
            </span>
          )}
          {tren && (
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-1 ${tren.bg} ${tren.text}`}
            >
              {tren.icon}
              {tren.label}
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

      {/* ===================== UKURAN (RINGKAS) ===================== */}
      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex justify-between">
          <span className="text-gray-500">
            Bulan Lalu
            {adaPembanding && (
              <span className="ml-1">({formatTanggal(m.tanggal_lalu)})</span>
            )}
          </span>
          <span className="font-bold text-black">
            {adaPembanding ? (
              <>
                {bulanLalu} {unit}
              </>
            ) : (
              <span className="text-gray-400 font-semibold">
                Belum ada data
              </span>
            )}
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
        <hr className="border-gray-100 my-1" />
        <div className="flex justify-between items-center pt-1">
          <span className="text-gray-500">Perubahan</span>
          {perubahan === null ? (
            <span className="text-gray-400 font-semibold text-xs">
              Belum dapat dihitung
            </span>
          ) : (
            <span
              className={`${warna.text} font-bold flex items-center text-xs ${warna.bg} px-2 py-0.5 rounded-lg`}
            >
              {ikonPerubahan(perubahan)}
              {Math.abs(perubahan)} {unit}
            </span>
          )}
        </div>
      </div>

      {/* ===================== TARGET BERIKUTNYA (RINGKAS) ===================== */}
      {adaTargetBerikutnya && (
        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <Target size={15} className="text-indigo-500" />
              Target {arah === ARAH_TURUN ? "berat ideal" : "berikutnya"}
              {m.interval_target ? ` (${m.interval_target} bln lagi)` : ""}
            </span>
            <span className="font-bold text-gray-800 text-right text-[13px]">
              {m.target_berikutnya} {unit}
              <span className="block text-[11px] font-normal text-gray-500">
                sebelum {formatTanggal(m.tanggal_target)}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* ===================== PERINGATAN ===================== */}
      {peringatan && (
        <div className="mb-3 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>{peringatan}</span>
        </div>
      )}
      {lewatDeadline && (
        <div className="mb-3 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            Batas waktu target terlewat
            {hariTerlambat > 0 ? ` ${hariTerlambat} hari` : ""}. Segera lakukan
            pengukuran ulang dan konsultasikan ke Posyandu/tenaga kesehatan.
          </span>
        </div>
      )}

      {/* ===================== RINGKASAN ===================== */}
      {ringkasan && (
        <div className="text-[12px] text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 leading-relaxed mb-3">
          <span className="font-bold text-gray-800">Singkatnya: </span>
          {ringkasan}
        </div>
      )}

      {/* ===================== TOMBOL DETAIL ===================== */}
      <button
        type="button"
        onClick={() => setLihatDetail((v) => !v)}
        className="w-full flex items-center justify-center gap-1 text-[12px] font-semibold text-gray-500 hover:text-gray-700 py-1"
      >
        {lihatDetail ? (
          <>
            Sembunyikan detail <ChevronUp size={14} />
          </>
        ) : (
          <>
            Lihat detail perhitungan <ChevronDown size={14} />
          </>
        )}
      </button>

      {/* ===================== DETAIL PERHITUNGAN ===================== */}
      {lihatDetail && (
        <div className="mt-2 pt-3 border-t border-gray-100 space-y-4 text-[12px]">
          {/* 1) PERBANDINGAN PENGUKURAN */}
          <section>
            <Eyebrow>Perbandingan pengukuran</Eyebrow>
            <div className="space-y-1.5 text-gray-600">
              <Baris
                label={`Bulan lalu${adaPembanding ? ` (${formatTanggal(m.tanggal_lalu)})` : ""}`}
              >
                {adaPembanding ? (
                  `${bulanLalu} ${unit}`
                ) : (
                  <span className="text-gray-400">Belum ada data</span>
                )}
              </Baris>
              <Baris label={`Bulan ini (${formatTanggal(m.tanggal_ini)})`} kuat>
                {bulanIni} {unit}
              </Baris>
              {adaPembanding && perubahan !== null && (
                <Baris
                  label={`Selisih${interval ? ` (jarak ${interval} bln)` : ""}`}
                >
                  <span className={warna.text}>
                    {tandai(perubahan)} {unit}
                  </span>
                  {lajuPerBulan !== null && (
                    <span className="block text-[11px] font-normal text-gray-400">
                      ≈ {tandai(lajuPerBulan)} {unit}/bln
                    </span>
                  )}
                </Baris>
              )}
            </div>
          </section>

          {/* 2) RENTANG IDEAL */}
          {punyaRentangIdeal && (
            <section>
              <Eyebrow>
                Rentang ideal{" "}
                {jenis === "tinggi"
                  ? "(TB/U — sesuai usia)"
                  : "(BB/TB — sesuai tinggi)"}
              </Eyebrow>
              <div className="space-y-1">
                <Baris label="Rentang sehat">
                  <span
                    className={
                      dalamRentang ? "text-emerald-600" : "text-gray-800"
                    }
                  >
                    {idealMin} – {idealMax} {unit}
                  </span>
                </Baris>
                {bulanIni !== null && (
                  <Baris label="Posisi anak saat ini">
                    <span
                      className={
                        posisi === "dalam"
                          ? "text-emerald-600"
                          : posisi === "atas"
                            ? "text-amber-600"
                            : "text-red-500"
                      }
                    >
                      {posisi === "dalam"
                        ? "✓ di dalam rentang"
                        : posisi === "atas"
                          ? "di atas rentang"
                          : "di bawah rentang"}
                    </span>
                  </Baris>
                )}
              </div>
              {jenis === "tinggi" && (
                <p className="text-[11px] text-gray-400 leading-snug mt-1.5">
                  Rentang ini hanya pembanding terhadap anak seusianya.
                  Penilaian utama tinggi memakai target kenaikan (KPT) di bawah.
                </p>
              )}
            </section>
          )}

          {/* 3) PENCAPAIAN TERHADAP KBM / KPT */}
          {tampilkanEvaluasi ? (
            <section>
              <div className="flex items-center justify-between mb-1.5">
                <Eyebrow>
                  {arah === ARAH_TURUN
                    ? "Pencapaian berat ideal"
                    : `Pencapaian standar ${labelStandar}`}
                </Eyebrow>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${toneBadge}`}
                >
                  {statusKenaikan}
                </span>
              </div>

              <div className="space-y-1.5 text-gray-600">
                {arah === ARAH_TURUN ? (
                  <Baris label="Penurunan yang dibutuhkan">
                    {penurunanDibutuhkan ?? sisaTampil} {unit}
                  </Baris>
                ) : (
                  <>
                    <Baris
                      label={`Kenaikan minimal seharusnya${interval ? ` (${interval} bln)` : ""}`}
                    >
                      {kebutuhan} {unit}
                    </Baris>
                    <Baris label="Pertumbuhan tercatat">
                      <span className={toneText}>
                        {perubahan !== null ? tandai(perubahan) : "-"} {unit}
                      </span>
                    </Baris>
                  </>
                )}
              </div>

              {/* Progress bar + status (sumber tunggal: tone) */}
              <div className="mt-2.5">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      tone === "ok" ? "bg-emerald-500" : "bg-indigo-400"
                    }`}
                    style={{ width: `${progres}%` }}
                  />
                </div>
                <p className="text-[11px] mt-1 font-semibold">
                  {tone === "ok" ? (
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CircleCheck size={12} />
                      {dalamRentangIdeal
                        ? "Sudah ideal sesuai status gizi (Tercapai)"
                        : arah === ARAH_TURUN
                          ? "Berat sudah masuk rentang ideal (Tercapai)"
                          : `Kenaikan memenuhi standar ${labelStandar} (Tercapai)`}
                    </span>
                  ) : tone === "bad" ? (
                    <span className="flex items-center gap-1 text-red-600">
                      <CircleX size={12} />
                      {arah === ARAH_TURUN ? (
                        <>
                          Masih perlu turun{" "}
                          <span className="font-bold text-gray-700">
                            {sisaTampil} {unit}
                          </span>{" "}
                          menuju berat ideal (Belum tercapai).
                        </>
                      ) : (
                        <>
                          Kurang{" "}
                          <span className="font-bold text-gray-700">
                            {sisaTampil} {unit}
                          </span>{" "}
                          lagi dari kenaikan minimal (Belum tercapai).
                        </>
                      )}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500">
                      <Info size={12} />
                      Belum dapat dinilai pada periode ini.
                    </span>
                  )}
                </p>
              </div>

              {arah !== ARAH_TURUN && (
                <p className="text-[10px] text-gray-400 mt-1.5">
                  {glosStandar}.
                </p>
              )}
            </section>
          ) : (
            catatan && (
              <section>
                <Eyebrow>Catatan penilaian</Eyebrow>
                <div className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  <span>{catatan}</span>
                </div>
              </section>
            )
          )}

          {/* 4) TARGET 3 BULAN KE DEPAN */}
          {adaTargetBerikutnya && (
            <section>
              <Eyebrow>Target {intervalTarget} bulan ke depan</Eyebrow>
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 space-y-1.5 text-gray-700">
                <Baris
                  label={
                    arah === ARAH_TURUN ? "Capai berat ideal" : "Capai minimal"
                  }
                  kuat
                >
                  {m.target_berikutnya} {unit}
                </Baris>
                <Baris label="Sebelum tanggal">
                  {formatTanggal(m.tanggal_target)}
                </Baris>
                {arah !== ARAH_TURUN && kenaikanBerikutnya !== null && (
                  <Baris
                    label={`Minimal bertambah (${labelStandar}${modeKejar ? ", catch-up" : ""})`}
                  >
                    {kenaikanBerikutnya} {unit}
                    {targetPerBulan !== null && (
                      <span className="block text-[11px] font-normal text-gray-500">
                        ≈ {targetPerBulan} {unit}/bln
                      </span>
                    )}
                  </Baris>
                )}
              </div>
            </section>
          )}

          {/* 5) STATUS GIZI & TREN */}
          <section>
            <Eyebrow>Status gizi &amp; tren</Eyebrow>
            <div className="space-y-1.5">
              {m.zscore != null && (
                <Baris label={`Z-score ${indeksZ}`}>
                  {round1(Number(m.zscore))}
                </Baris>
              )}
              {m.status_gizi && (
                <Baris label="Status gizi">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${GAYA_STATUS_GIZI(m.status_gizi)}`}
                  >
                    {m.status_gizi}
                  </span>
                </Baris>
              )}
              {tren && (
                <Baris label="Tren pertumbuhan">
                  <span
                    className={`inline-flex items-center gap-1 ${tren.text}`}
                  >
                    {tren.icon}
                    {tren.label}
                  </span>
                </Baris>
              )}
            </div>
          </section>

          {/* Catatan tambahan (jika evaluasi tampil & ada catatan) */}
          {tampilkanEvaluasi && catatan && (
            <div className="flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
              <Info size={13} className="mt-0.5 shrink-0" />
              <span>{catatan}</span>
            </div>
          )}

          {/* Penutup: alat bantu, bukan pengganti tenaga kesehatan */}
          <p className="text-[10px] text-gray-400 leading-snug pt-1 border-t border-gray-100">
            Hasil ini adalah alat bantu pemantauan. Untuk keputusan penanganan
            gizi anak, konsultasikan ke kader Posyandu atau tenaga kesehatan.
          </p>
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
        Penilaian target disesuaikan dengan status gizi anak: berat berlebih
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
