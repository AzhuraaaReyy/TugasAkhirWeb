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

// ============================================================
// Peringatan "batas waktu target terlewat" membandingkan tenggat
// dengan TANGGAL KOMPUTER HARI INI, sehingga data uji bertanggal
// lampau akan selalu memicunya. Matikan (false) selama pengujian,
// nyalakan (true) saat aplikasi dipakai dengan data sungguhan.
// ============================================================
const PERINGATAN_TENGGAT_AKTIF = true;

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
    label: "Membaik",
    icon: <TrendingUp size={13} />,
  },
  memburuk: {
    text: "text-red-600",
    label: "Perlu perhatian",
    icon: <TrendingDown size={13} />,
  },
  tetap: {
    text: "text-gray-500",
    label: "Stabil",
    icon: <Minus size={13} />,
  },
};

function MetrikCard({ icon, label, unit, metrik }) {
  const m = metrik || {};
  const [lihatDetail, setLihatDetail] = useState(false);

  const bulanLalu = Number(m.bulan_lalu) || 0;
  const bulanIni = Number(m.bulan_ini) || 0;

  const arah = m.arah_target === ARAH_TURUN ? ARAH_TURUN : "naik";
  const jenis = unit === "cm" ? "tinggi" : "berat";

  // ---- Rentang ideal ----
  const idealMin = m.ideal_min != null ? Number(m.ideal_min) : null;
  const idealMax = m.ideal_max != null ? Number(m.ideal_max) : null;
  const punyaRentangIdeal = idealMin != null && idealMax != null;

  const posisi = punyaRentangIdeal
    ? bulanIni < idealMin
      ? "bawah"
      : bulanIni > idealMax
        ? "atas"
        : "dalam"
    : null;
  const dalamRentang = posisi === "dalam";

  const infoSaja = m.ideal_info === true;
  const dalamRentangIdeal = !infoSaja && dalamRentang;

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

  const modeKejar = m.mode_target === "kejar";
  const catatan = m.catatan || null;
  const peringatan = m.peringatan || null;

  const berlakuRaw = m.kbm_berlaku ?? m.kpt_berlaku;
  const standarBerlaku = berlakuRaw == null ? true : berlakuRaw;

  const pakaiIdeal = arah === ARAH_TURUN || dalamRentangIdeal;
  const tampilkanEvaluasi = pakaiIdeal || standarBerlaku;

  const adaTargetBerikutnya = m.target_berikutnya != null && m.tanggal_target;

  const labelKebutuhan =
    arah === ARAH_TURUN
      ? "Harus turun (menuju berat ideal)"
      : "Harus naik minimal";

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

  // ============================================================
  //  RINGKASAN SEDERHANA
  // ============================================================
  let ringkasan = null;
  if (peringatan) {
    ringkasan =
      "Mohon periksa kembali kebenaran data pengukuran di atas sebelum membaca hasil lainnya.";
  } else if (jenis === "berat") {
    if (arah === ARAH_TURUN) {
      ringkasan = dalamRentang
        ? "Berat badan anak telah kembali ke rentang ideal. Pertahankan pola makan sehat dan lakukan penimbangan secara rutin."
        : "Berat badan anak melebihi rentang ideal. Penurunan tidak perlu dilakukan secara drastis; jaga agar berat tidak terus bertambah seiring pertambahan tinggi, dan konsultasikan ke Posyandu.";
    } else if (dalamRentangIdeal) {
      ringkasan =
        "Berat badan anak sudah ideal terhadap tinggi badannya. Pertahankan pola makan dan lakukan penimbangan setiap bulan.";
    } else if (memenuhi === true) {
      ringkasan =
        "Kenaikan berat badan anak telah memenuhi standar. Lanjutkan pola makan yang sudah berjalan.";
    } else if (memenuhi === false) {
      ringkasan =
        "Kenaikan berat badan anak belum memenuhi standar. Tambahkan porsi makan dan lauk berprotein (telur, ikan, ayam), kemudian timbang kembali sesuai jadwal.";
    } else {
      ringkasan =
        "Hasil kenaikan berat badan akan dinilai pada penimbangan berikutnya.";
    }
  } else {
    if (modeKejar) {
      ringkasan =
        "Tinggi badan anak masih di bawah standar usianya sehingga diberikan target kejar (catch-up). Penuhi asupan protein hewani setiap hari dan ukur tinggi anak secara rutin di Posyandu.";
    } else if (memenuhi === true) {
      ringkasan =
        "Pertambahan tinggi badan anak telah memenuhi standar. Pertahankan asupan gizi dan pengukuran rutin.";
    } else if (memenuhi === false) {
      ringkasan =
        "Pertambahan tinggi badan anak belum mencapai target minimal. Perbanyak makanan berprotein dan ukur kembali sesuai jadwal di Posyandu.";
    } else {
      ringkasan =
        "Tinggi badan anak masih sesuai dengan usianya. Pertambahan tinggi akan dinilai pada pengukuran berikutnya.";
    }
  }

  return (
    <div className="border border-gray-200 border-2 rounded-2xl p-4 bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative">
      {/* ===================== TAMPILAN UTAMA (RINGKAS) ===================== */}

      {/* HEADER: nama metrik + status gizi */}
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

      {/* UKURAN: lalu, ini, perubahan */}
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

      {/* TARGET BERIKUTNYA — satu baris paling penting */}
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
      {/* PERINGATAN DATA — selalu tampil karena mendesak */}
      {peringatan && (
        <div className="mb-3 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>{peringatan}</span>
        </div>
      )}
      {/* LEWAT DEADLINE — selalu tampil karena mendesak */}
      {lewatDeadline && (
        <div className="mb-3 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            Batas waktu target terlewat
            {hariTerlambat > 0 ? ` ${hariTerlambat} hari` : ""}. Segera lakukan
            penimbangan ulang dan konsultasikan ke Posyandu/tenaga kesehatan.
          </span>
        </div>
      )}

      {/* RINGKASAN SEDERHANA */}
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

      {/* ===================== DETAIL (DILIPAT) ===================== */}
      {lihatDetail && (
        <div className="mt-2 pt-3 border-t border-gray-100 space-y-3">
          {/* Rentang ideal & arah kurva */}
          <div className="space-y-2 text-[12px] text-gray-600">
            {punyaRentangIdeal && (
              <div className="flex justify-between">
                <span className="text-gray-500">
                  {jenis === "tinggi"
                    ? "Tinggi ideal untuk usianya"
                    : "Berat ideal untuk tingginya"}
                </span>
                <span className="text-right">
                  <span
                    className={`font-bold ${dalamRentang ? "text-emerald-600" : "text-gray-700"}`}
                  >
                    {idealMin} – {idealMax} {unit}
                  </span>
                  <span
                    className={`block text-[11px] font-semibold ${
                      posisi === "dalam"
                        ? "text-emerald-600"
                        : posisi === "atas"
                          ? "text-amber-600"
                          : "text-red-500"
                    }`}
                  >
                    {posisi === "dalam"
                      ? "✓ sesuai rentang"
                      : posisi === "atas"
                        ? "di atas rentang"
                        : "di bawah rentang"}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Rincian target */}
          <div className="bg-white border border-gray-100 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-700">
                Rincian Target
              </span>
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

            {jenis === "tinggi" && punyaRentangIdeal && (
              <p className="text-[11px] text-gray-400 leading-snug mb-2">
                Target dihitung dari pertumbuhan anak itu sendiri (tinggi
                terakhir ditambah kenaikan minimal). Rentang ideal di atas hanya
                pembanding dengan anak seusianya.
              </p>
            )}

            <div className="space-y-1.5 text-[12px] text-gray-600">
              {m.target != null && m.bulan_lalu != null && (
                <div className="flex items-start justify-between">
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
                    <span className="text-gray-500">
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
                    <span className="text-gray-500">Kenaikan pertumbuhan</span>
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

              {arah !== ARAH_TURUN && m.kenaikan_berikutnya != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Naik minimal berikutnya ({m.interval_target ?? 3} bln,{" "}
                    {unit === "cm" ? "KPT" : "KBM"})
                  </span>
                  <span className="font-bold text-gray-800">
                    {m.kenaikan_berikutnya} {unit}
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

            {catatan && (
              <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>{catatan}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CardPerkembanganAnak({ data }) {
  const berat = data?.berat_badan || {};
  const tinggi = data?.tinggi_badan || {};

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full">
      <h3 className="text-xl font-extrabold text-gray-800 mb-4">
        Perkembangan Berat &amp; Tinggi Badan
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Penilaian target disesuaikan dengan status gizi anak, berat berlebih
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
