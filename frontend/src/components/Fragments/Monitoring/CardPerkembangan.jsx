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

const ARAH_TURUN = "turun";
const TOLERANSI_STAGNAN = 0.05;
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
const addBulan = (tgl, n) => {
  if (!tgl) return null;
  const d = new Date(tgl);
  if (isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + n);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const da = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
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

// status_gizi -> kelas
const klasifikasiGizi = (s) => {
  const x = String(s || "").toLowerCase();
  if (!x) return "tidak";
  if (/(buruk|sangat|severe|parah)/.test(x)) return "buruk";
  if (/(obes|gemuk)/.test(x)) return "lebih";
  if (/lebih/.test(x)) return "lebih";
  if (/(pendek|kurus|kurang|wasting|stunt)/.test(x)) return "kurang";
  if (/tinggi/.test(x)) return "lebih";
  if (/(normal|baik|ideal|cukup)/.test(x)) return "normal";
  return "tidak";
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

function MetrikCard({ icon, label, unit, metrik, usiaBulan, tinggiRef }) {
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

  // ---- Nilai dasar ----
  const adaPembanding = m.tanggal_lalu != null && m.bulan_lalu != null;
  const bulanLalu = adaPembanding ? angka(m.bulan_lalu) : null;
  const bulanIni = angka(m.bulan_ini);
  const perubahan = angka(m.perubahan);
  const interval = angka(m.interval_bulan) || 1;
  const lajuPerBulan =
    perubahan !== null && interval > 1 ? round1(perubahan / interval) : null;

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
  const diAtasIdeal = posisi === "atas";

  // Konteks rentang: tinggi -> usia (TB/U), berat -> tinggi anak (BB/TB)
  const rentangKonteks =
    jenis === "tinggi"
      ? usiaBulan != null
        ? ` (usia ${usiaBulan} bln)`
        : ""
      : tinggiRef != null
        ? ` (untuk tinggi ${round1(Number(tinggiRef))} cm)`
        : "";

  // ---- Kebutuhan ----
  const perubahanEfektif =
    perubahan === null ? null : arah === ARAH_TURUN ? -perubahan : perubahan;
  const penurunanDibutuhkan = angka(m.penurunan_dibutuhkan);
  const kenaikanDibutuhkan = angka(m.kenaikan_dibutuhkan);
  const kebutuhan =
    arah === ARAH_TURUN
      ? (penurunanDibutuhkan ?? 0)
      : (kenaikanDibutuhkan ?? 0);

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

  // ---- Status gizi (stunting/wasting/lebih) ----
  const giziKelas = klasifikasiGizi(m.status_gizi);
  const giziKurang = giziKelas === "kurang" || giziKelas === "buruk";
  const alertLebih =
    jenis === "berat" && (diAtasIdeal || giziKelas === "lebih");

  const tone =
    dalamRentangIdeal || memenuhi === true
      ? "ok"
      : memenuhi === false
        ? "bad"
        : "netral";

  // ---- KONDISI pertumbuhan (badge utama, ganti status "Normal") ----
  let kondisiLabel = "Belum dinilai";
  let kondisiCls = "bg-gray-100 text-gray-600";
  if (m.peringatan) {
    kondisiLabel = "Periksa data";
    kondisiCls = "bg-amber-100 text-amber-700";
  } else if (!adaPembanding) {
    kondisiLabel = "Data pertama";
    kondisiCls = "bg-gray-100 text-gray-600";
  } else if (m.gagal_berturut === true) {
    kondisiLabel = "Segera rujuk";
    kondisiCls = "bg-red-100 text-red-700";
  } else if (alertLebih) {
    kondisiLabel = "Perlu perhatian";
    kondisiCls = "bg-amber-100 text-amber-700";
  } else if (stagnan) {
    kondisiLabel = "Pertumbuhan stagnan";
    kondisiCls = "bg-amber-100 text-amber-700";
  } else if (tone === "ok") {
    kondisiLabel = giziKurang ? "Membaik" : "Tumbuh optimal";
    kondisiCls = "bg-emerald-100 text-emerald-700";
  } else if (tone === "bad") {
    kondisiLabel = "Perlu perhatian";
    kondisiCls = "bg-red-100 text-red-700";
  } else if (diAtasIdeal && jenis === "tinggi") {
    kondisiLabel = "Di atas rata-rata";
    kondisiCls = "bg-amber-100 text-amber-700";
  }

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
  if (dalamRentangIdeal)
    statusKenaikan = jenis === "berat" ? "Berat sudah ideal" : "Sesuai rentang";
  else if (memenuhi === true)
    statusKenaikan =
      arah === ARAH_TURUN ? "Penurunan sesuai target" : "Memenuhi standar";
  else if (memenuhi === false)
    statusKenaikan = stagnan
      ? "Pertumbuhan stagnan"
      : arah === ARAH_TURUN
        ? "Belum mencapai berat ideal"
        : "Belum memenuhi standar";
  else statusKenaikan = "Belum dapat dinilai";

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
  // sembunyikan catatan "jendela 3 bulan" (posyandu bulanan)
  const catatan =
    m.catatan && !/jendela 3 bulan/i.test(m.catatan) ? m.catatan : null;
  const peringatan = m.peringatan || null;
  const gagalBerturut = m.gagal_berturut === true;

  const berlakuRaw = m.kbm_berlaku ?? m.kpt_berlaku;
  const standarBerlaku = berlakuRaw == null ? true : berlakuRaw;
  const pakaiIdeal = arah === ARAH_TURUN || dalamRentangIdeal;
  const tampilkanEvaluasi =
    adaPembanding && !peringatan && (pakaiIdeal || standarBerlaku);

  // ---- TARGET PER BULAN (konsisten: KPT/KBM 3 bln ÷ 3) ----
  const kenaikanBerikutnya = angka(m.kenaikan_berikutnya);
  const intervalTarget = angka(m.interval_target) || 3;
  const targetNaikPerBulan =
    kenaikanDibutuhkan != null && interval
      ? round1(kenaikanDibutuhkan / interval)
      : kenaikanBerikutnya != null && intervalTarget
        ? round1(kenaikanBerikutnya / intervalTarget)
        : null;
  const capaiBulanDepan =
    targetNaikPerBulan != null && bulanIni != null
      ? round1(bulanIni + targetNaikPerBulan)
      : null;
  const tglBulanDepan = addBulan(m.tanggal_ini, 1);
  const adaTargetBulanDepan =
    arah === ARAH_TURUN ? idealMax != null : capaiBulanDepan != null;

  // Arah Z-score terhadap standar WHO — KONTEKSTUAL (khusus TINGGI / TB/U).
  const zNow = angka(m.zscore);
  let trenZ = null;
  if (jenis === "tinggi" && m.tren_zscore && adaPembanding && !peringatan) {
    const dekatRisiko = (zNow != null && zNow < -1) || giziKurang;
    if (m.tren_zscore === "membaik") {
      trenZ = {
        cls: "text-emerald-700",
        icon: <TrendingUp size={12} />,
        label: giziKurang ? "Membaik, mendekati normal" : "Naik",
        ket: giziKurang
          ? "Posisi tinggi anak terhadap standar membaik mendekati normal. Pertahankan."
          : null,
      };
    } else if (m.tren_zscore === "memburuk") {
      trenZ = dekatRisiko
        ? {
            cls: "text-amber-700",
            icon: <TrendingDown size={12} />,
            label: "Menurun perlu dipantau",
            ket: "Posisi anak menurun mendekati batas bawah standar. Pantau ketat dan tambah asupan protein agar tidak jatuh ke bawah −2 SD (pendek).",
          }
        : {
            cls: "text-gray-500",
            icon: <Minus size={12} />,
            label: "Stabil di rentang aman",
            ket: "Sedikit mendekati rata-rata, tetapi masih jauh dari batas bawah wajar dan tidak perlu dikhawatirkan.",
          };
    } else {
      trenZ = {
        cls: "text-gray-500",
        icon: <Minus size={12} />,
        label: "Stabil",
        ket: null,
      };
    }
  }

  // Arah menuju BERAT IDEAL — sadar dua sisi (khusus BERAT / BB/TB).
  let arahIdeal = null;
  if (
    jenis === "berat" &&
    adaPembanding &&
    punyaRentangIdeal &&
    perubahan != null &&
    !peringatan
  ) {
    const TOL = TOLERANSI_STAGNAN;
    if (dalamRentangIdeal) {
      arahIdeal = {
        cls: "text-emerald-700",
        icon: <CircleCheck size={12} />,
        label: "Di rentang ideal",
        ket: "Berat anak berada di rentang ideal terhadap tingginya. Pertahankan pola makan bergizi.",
      };
    } else if (posisi === "bawah") {
      if (perubahan > TOL)
        arahIdeal = {
          cls: "text-emerald-700",
          icon: <TrendingUp size={12} />,
          label: "Bergerak menuju ideal",
          ket: "Berat naik mendekati rentang ideal. Lanjutkan pemberian makan bergizi.",
        };
      else if (perubahan < -TOL)
        arahIdeal = {
          cls: "text-red-600",
          icon: <TrendingDown size={12} />,
          label: "Menjauh dari ideal",
          ket: "Berat menurun sehingga makin jauh dari ideal. Tambah asupan protein dan konsultasikan ke Posyandu.",
        };
      else
        arahIdeal = {
          cls: "text-amber-700",
          icon: <Minus size={12} />,
          label: "Belum bergerak naik",
          ket: "Berat belum bertambah menuju ideal. Tambah porsi makan bergizi, lalu timbang lagi bulan depan.",
        };
    } else {
      // posisi atas
      if (perubahan < -TOL)
        arahIdeal = {
          cls: "text-emerald-700",
          icon: <TrendingDown size={12} />,
          label: "Bergerak menuju ideal",
          ket: "Berat menurun perlahan mendekati ideal. Lanjutkan pola makan sehat, jangan diet ketat.",
        };
      else if (perubahan > TOL)
        arahIdeal = {
          cls: "text-red-600",
          icon: <TrendingUp size={12} />,
          label: "Menjauh dari ideal",
          ket: "Berat bertambah sehingga makin jauh dari ideal (risiko gizi lebih). Perlu penanganan, bukan dibiarkan naik.",
        };
      else
        arahIdeal = {
          cls: "text-gray-500",
          icon: <Minus size={12} />,
          label: "Bertahan",
          ket: "Berat tidak bertambah; seiring anak makin tinggi, berat akan lebih mendekati ideal. Jaga pola makan.",
        };
    }
  }

  const arahInfo = jenis === "tinggi" ? trenZ : arahIdeal;
  const warna = warnaPerubahan(perubahan, arah);

  // ============================================================
  //  RINGKASAN UNTUK ORANG TUA
  // ============================================================
  let ringkasan;
  const anjuranEskalasi =
    " Jika bulan depan masih belum tercapai, sebaiknya segera konsultasikan/rujuk ke Posyandu atau Puskesmas.";
  if (peringatan) {
    ringkasan =
      "Mohon periksa kembali kebenaran data pengukuran di atas sebelum membaca hasil lainnya.";
  } else if (!adaPembanding) {
    ringkasan =
      "Ini data pengukuran pertama sehingga belum ada pembanding. Lakukan pengukuran rutin bulan depan di Posyandu agar perkembangan anak dapat dinilai.";
  } else if (jenis === "berat") {
    if (alertLebih) {
      ringkasan =
        "Berat badan anak berada di atas rentang ideal (berisiko gizi lebih/obesitas). Kurangi camilan manis & gorengan, perbanyak sayur dan buah, ajak anak aktif bergerak, dan konsultasikan ke Posyandu. Jangan lakukan diet ketat.";
    } else if (dalamRentangIdeal || memenuhi === true) {
      ringkasan =
        "Kenaikan berat badan anak sudah sesuai. Lanjutkan pemberian makan bergizi seimbang dan timbang anak setiap bulan.";
    } else if (memenuhi === false) {
      ringkasan =
        (stagnan
          ? "Berat badan anak tidak bertambah pada periode ini. Tambahkan porsi makan dan lauk berprotein (telur, ikan, ayam), lalu timbang kembali bulan depan."
          : "Kenaikan berat badan anak belum mencukupi. Tambahkan porsi makan dan lauk berprotein, lalu timbang kembali bulan depan.") +
        anjuranEskalasi;
    } else {
      ringkasan =
        "Kenaikan berat badan akan dinilai pada penimbangan berikutnya.";
    }
  } else {
    if (diAtasIdeal) {
      ringkasan =
        "Tinggi badan anak di atas rata-rata usianya. Umumnya tidak perlu dikhawatirkan dan tinggi tidak diturunkan. Bila ragu, konsultasikan ke tenaga kesehatan.";
    } else if (modeKejar) {
      ringkasan =
        "Tinggi badan anak masih di bawah standar usianya, sehingga diberi target kejar (catch-up). Penuhi protein hewani setiap hari dan ukur tinggi anak rutin di Posyandu.";
    } else if (memenuhi === true) {
      ringkasan =
        "Pertambahan tinggi badan anak sudah memenuhi standar. Pertahankan asupan gizi dan pengukuran rutin.";
    } else if (memenuhi === false) {
      ringkasan =
        "Pertambahan tinggi badan anak belum mencapai target minimal. Perbanyak makanan berprotein dan ukur kembali bulan depan." +
        anjuranEskalasi;
    } else {
      ringkasan =
        "Tinggi badan anak masih sesuai usianya. Pertambahan tinggi akan dinilai pada pengukuran berikutnya.";
    }
  }

  return (
    <div className="border-2 border-gray-200 rounded-2xl p-4 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative">
      {/* HEADER */}
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
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${kondisiCls}`}
          >
            {kondisiLabel}
          </span>
          {m.status_gizi && giziKelas !== "normal" && (
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-lg ${GAYA_STATUS_GIZI(m.status_gizi)}`}
            >
              {m.status_gizi}
            </span>
          )}
        </div>
      </div>

      {/* UKURAN (RINGKAS) */}
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

      {/* TARGET BULAN DEPAN (RINGKAS) */}
      {!peringatan && adaTargetBulanDepan && (
        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
              <Target size={15} className="text-indigo-500" />
              {arah === ARAH_TURUN
                ? "Target berat ideal"
                : "Target bulan depan"}
            </span>
            <span className="font-bold text-gray-800 text-right text-[13px]">
              {arah === ARAH_TURUN
                ? `${idealMax} ${unit}`
                : `${capaiBulanDepan} ${unit}`}
              <span className="block text-[11px] font-normal text-gray-500">
                {arah === ARAH_TURUN
                  ? "turunkan perlahan"
                  : `sebelum ${formatTanggal(tglBulanDepan)}`}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* PERINGATAN DATA */}
      {peringatan && (
        <div className="mb-3 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>{peringatan}</span>
        </div>
      )}

      {/* PERINGATAN 2T (dua bulan berturut) */}
      {!peringatan && gagalBerturut && (
        <div className="mb-3 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            {arah === ARAH_TURUN
              ? "Sudah 2 bulan berturut berat badan belum berkurang menuju ideal. Segera konsultasikan penanganan gizi lebih ke Posyandu atau Puskesmas."
              : `Sudah 2 bulan berturut ${jenis === "tinggi" ? "tinggi" : "berat"} badan anak tidak naik cukup (tanda 2T). Segera bawa anak ke Posyandu atau Puskesmas untuk pemeriksaan lanjutan.`}
          </span>
        </div>
      )}

     

      {/* RINGKASAN */}
      {ringkasan && (
        <div className="text-[12px] text-gray-700 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 leading-relaxed mb-3">
          <span className="font-bold text-gray-800">Singkatnya: </span>
          {ringkasan}
        </div>
      )}

      {/* TOMBOL DETAIL */}
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

      {/* DETAIL */}
      {lihatDetail && (
        <div className="mt-2 pt-3 border-t border-gray-100 space-y-4 text-[12px]">
          {/* 1) PERBANDINGAN */}
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
                  ? "(TB/U sesuai usia)"
                  : "(BB/TB sesuai tinggi)"}
              </Eyebrow>
              <div className="space-y-1">
                <Baris label={`Rentang sehat${rentangKonteks}`}>
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
              {diAtasIdeal && jenis === "berat" && (
                <p className="text-[11px] text-amber-600 leading-snug mt-1.5">
                  Berat di atas ideal, berisiko gizi lebih/obesitas. Perlu
                  penanganan, bukan dibiarkan terus naik.
                </p>
              )}
              {diAtasIdeal && jenis === "tinggi" && (
                <p className="text-[11px] text-gray-400 leading-snug mt-1.5">
                  Tinggi di atas rata-rata; ini aman dari stunting dan tidak
                  perlu diturunkan.
                </p>
              )}
              {jenis === "tinggi" && !diAtasIdeal && (
                <p className="text-[11px] text-gray-400 leading-snug mt-1.5">
                  Rentang ini pembanding terhadap anak seusianya. Penilaian
                  utama tinggi memakai target kenaikan (KPT) di bawah.
                </p>
              )}
            </section>
          )}

          {/* 3) PENCAPAIAN KPT/KBM (per bulan) */}
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
                    <Baris label="Kenaikan minimal per bulan">
                      {round1(kebutuhan)} {unit}
                    </Baris>
                    <Baris label="Pertumbuhan tercatat">
                      <span className={toneText}>
                        {perubahan !== null ? tandai(perubahan) : "-"} {unit}
                      </span>
                    </Baris>
                  </>
                )}
              </div>
              <div className="mt-2.5">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${tone === "ok" ? "bg-emerald-500" : "bg-indigo-400"}`}
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
                      <Info size={12} /> Belum dapat dinilai pada periode ini.
                    </span>
                  )}
                </p>
              </div>
              {arah !== ARAH_TURUN && memenuhi === false && !gagalBerturut && (
                <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 mt-2 flex items-start gap-1.5">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  <span>
                    Bila bulan depan masih belum tercapai (dua bulan berturut),
                    segera konsultasikan/rujuk ke Posyandu atau Puskesmas.
                  </span>
                </p>
              )}
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

          {/* 4) TARGET BULAN DEPAN (per bulan) */}
          {!peringatan && adaTargetBulanDepan && (
            <section>
              <Eyebrow>Target bulan depan</Eyebrow>
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 space-y-1.5 text-gray-700">
                {arah === ARAH_TURUN ? (
                  <>
                    <Baris label="Capai berat ideal" kuat>
                      {idealMax} {unit}
                    </Baris>
                    <Baris label="Perlu turun (perlahan)">
                      {penurunanDibutuhkan ?? sisaTampil} {unit}
                    </Baris>
                  </>
                ) : (
                  <>
                    <Baris label="Capai minimal" kuat>
                      {capaiBulanDepan} {unit}
                    </Baris>
                    <Baris label="Sebelum tanggal">
                      {formatTanggal(tglBulanDepan)}
                    </Baris>
                    <Baris
                      label={`Minimal bertambah / bulan (${labelStandar}${modeKejar ? ", catch-up" : ""})`}
                    >
                      {targetNaikPerBulan} {unit}
                    </Baris>
                  </>
                )}
              </div>
              {arah !== ARAH_TURUN && (
                <p className="text-[10px] text-gray-400 mt-1.5">
                  Dihitung dari standar {labelStandar} 3 bulan (Permenkes)
                  dibagi 3, sesuai jadwal posyandu bulanan.
                </p>
              )}
            </section>
          )}

          {/* 5) STATUS GIZI & ARAH */}
          <section>
            <Eyebrow>Status gizi &amp; arah pertumbuhan</Eyebrow>
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
              {arahInfo && (
                <Baris
                  label={
                    jenis === "tinggi"
                      ? "Arah terhadap standar"
                      : "Arah menuju berat ideal"
                  }
                >
                  <span
                    className={`inline-flex items-center gap-1 ${arahInfo.cls}`}
                  >
                    {arahInfo.icon}
                    {arahInfo.label}
                  </span>
                </Baris>
              )}
            </div>
            {arahInfo && (
              <p className="text-[11px] text-gray-400 leading-snug mt-1.5">
                {jenis === "tinggi"
                  ? "Arah ini menunjukkan bahwa posisi tinggi anak dibanding anak seusianya (standar WHO) membaik, stabil, atau menurun. Ini berbeda dari sekadar bertambah/tidaknya tinggi."
                  : "Arah ini menunjukkan bahwa apakah berat anak bergerak mendekati atau menjauhi rentang berat ideal untuk tingginya."}
                {arahInfo.ket ? ` ${arahInfo.ket}` : ""}
              </p>
            )}
          </section>

        

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
  const usiaBulan = data?.balita?.usia_bulan ?? null;
  const tinggiRef = tinggi?.bulan_ini ?? null;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-xl font-extrabold text-gray-800 mb-4">
        Perkembangan Berat &amp; Tinggi Badan
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Penilaian disesuaikan dengan status gizi anak: berat berlebih dinilai
        dari penurunan menuju berat ideal, berat kurang/normal dari kenaikan
        minimal (KBM), dan anak pendek memakai target kejar (catch-up) untuk
        tinggi badan. Target dihitung per bulan sesuai jadwal posyandu.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MetrikCard
          icon={<Ruler size={18} />} 
          label="Tinggi Badan"
          unit="cm"
          metrik={tinggi}
          usiaBulan={usiaBulan}
        />
        <MetrikCard
          icon={<Scale size={18} />}
          label="Berat Badan"
          unit="kg"
          metrik={berat}
          usiaBulan={usiaBulan}
          tinggiRef={tinggiRef}
        />
      </div>
    </div>
  );
}
