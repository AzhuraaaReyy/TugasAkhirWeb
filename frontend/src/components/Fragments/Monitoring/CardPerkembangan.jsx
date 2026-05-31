import React from "react";
import {
  Scale,
  Ruler,
  ArrowUpRight,
  Minus,
  ArrowDownRight,
  Target,
  AlertTriangle,
  CheckCircle2,
  CircleCheck,
  CircleX,
  Info,
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

const warnaPertumbuhan = (status) => {
  if (status === "Kenaikan Pertumbuhan")
    return {
      text: "text-emerald-500",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    };
  if (status === "Penurunan Pertumbuhan")
    return { text: "text-red-500", bg: "bg-red-50", border: "border-red-100" };
  return {
    text: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-100",
  };
};

const ikonPertumbuhan = (status) => {
  if (status === "Kenaikan Pertumbuhan")
    return <ArrowUpRight size={14} className="mr-0.5" />;
  if (status === "Penurunan Pertumbuhan")
    return <ArrowDownRight size={14} className="mr-0.5" />;
  return <Minus size={14} className="mr-0.5" />;
};

const GAYA_GIZI = {
  normal: {
    wrap: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-700",
    icon: <CheckCircle2 size={16} className="text-emerald-600" />,
  },
  waspada: {
    wrap: "bg-amber-50 border-amber-200",
    badge: "bg-amber-500 text-white",
    text: "text-amber-700",
    icon: <Info size={16} className="text-amber-600" />,
  },
  bahaya: {
    wrap: "bg-red-50 border-red-200",
    badge: "bg-red-500 text-white",
    text: "text-red-700",
    icon: <AlertTriangle size={16} className="text-red-600" />,
  },
};

function MetrikCard({ icon, label, unit, metrik }) {
  const m = metrik || {};
  const warna = warnaPertumbuhan(m.status);

  const bulanLalu = Number(m.bulan_lalu) || 0;
  const bulanIni = Number(m.bulan_ini) || 0;
  const target = Number(m.target) || 0;
  const adaTarget = m.target != null && target > 0;

  // Kenaikan minimal (KBM/KPT) dari backend; fallback ke selisih target-bulan lalu
  const kenaikanDibutuhkan =
    m.kenaikan_dibutuhkan != null
      ? Number(m.kenaikan_dibutuhkan)
      : Math.max(0, Number((target - bulanLalu).toFixed(2)));
  const kenaikanAktual = Number((bulanIni - bulanLalu).toFixed(2));

  const memenuhi =
    typeof m.memenuhi_standar === "boolean"
      ? m.memenuhi_standar
      : kenaikanDibutuhkan > 0
        ? kenaikanAktual >= kenaikanDibutuhkan
        : null;

  const stagnan = m.status === "Stagnan" || kenaikanAktual === 0;

  const statusKenaikan =
    m.perubahan == null
      ? null
      : stagnan
        ? "Mengalami Pertumbuhan Stagnan"
        : kenaikanAktual > 0
          ? "Mengalami Kenaikan Pertumbuhan"
          : "Mengalami Penurunan Pertumbuhan";

  const sisaKeTarget = Math.max(
    0,
    Number((kenaikanDibutuhkan - kenaikanAktual).toFixed(2)),
  );
  const progres =
    kenaikanDibutuhkan > 0
      ? Math.min(100, Math.max(0, (kenaikanAktual / kenaikanDibutuhkan) * 100))
      : memenuhi
        ? 100
        : 0;

  const deadline = m.tanggal_target ? new Date(m.tanggal_target) : null;
  const hariIni = new Date();
  hariIni.setHours(0, 0, 0, 0);

  const lewatDeadline =
    deadline &&
    !isNaN(deadline.getTime()) &&
    hariIni > deadline &&
    m.memenuhi_standar === false;

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
        <hr className="border-gray-100 my-1" />
        <div className="flex justify-between items-center pt-1">
          <span className="text-gray-500">Perubahan</span>
          <span
            className={`${warna.text} font-bold flex items-center text-xs ${warna.bg} px-2 py-0.5 rounded-lg`}
          >
            {ikonPertumbuhan(m.status)}
            {Math.abs(m.perubahan || 0)} {unit}
          </span>
        </div>
      </div>

      {/* TARGET PERTUMBUHAN (berbasis KBM/KPT) */}
      {adaTarget && (
        <div className="bg-white border border-gray-100 rounded-xl p-3 mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Target size={15} className="text-indigo-500" />
              <span className="text-xs font-bold text-gray-700">
                Target Pertumbuhan
              </span>
            </div>
            {statusKenaikan && (
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
            {m.target != null && (
              <div className="flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1 text-gray-500">
                  Target sebelumnya
                </span>
                <span className="font-bold text-gray-800 text-right">
                  {m.target} {unit}
                  <span className="block font-normal text-gray-500">
                    {m.tanggal_ini
                      ? `dinilai ${formatTanggal(m.tanggal_ini)}`
                      : ""}
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
            <div className="flex justify-between">
              <span className="flex items-center gap-1 text-gray-500">
                Kenaikan minimal
                {m.interval_bulan ? ` (dalam ${m.interval_bulan} bln)` : ""}
              </span>
              <span className="font-bold text-gray-800">
                {kenaikanDibutuhkan} {unit}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">Kenaikan Pertumbuhan</span>
              <span
                className={`font-bold ${memenuhi ? "text-emerald-600" : "text-red-500"}`}
              >
                {kenaikanAktual} {unit}
              </span>
            </div>
            {m.target_berikutnya != null && m.tanggal_target && (
              <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[12px]">
                <span className="flex items-center gap-1 text-gray-500">
                  {m.memenuhi_standar === false
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

          <div className="mt-2.5">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  memenuhi ? "bg-emerald-500" : "bg-indigo-400"
                }`}
                style={{ width: `${progres}%` }}
              />
            </div>
            <p className="text-[11px] text-red-600 mt-1 font-semibold ">
              {memenuhi ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CircleCheck size={12} />
                  Kenaikan memenuhi standar (Sudah Tercapai)
                </span>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <CircleX size={12} />
                    Kurang{" "}
                    <span className="font-bold text-gray-700">
                      {sisaKeTarget} {unit}
                    </span>{" "}
                    lagi dari kenaikan minimal (Belum Tercapai).
                  </div>
                </>
              )}
            </p>
          </div>
        </div>
      )}
      {lewatDeadline && (
        <div className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-2 py-1.5">
          <AlertTriangle size={13} className="mt-0.5 shrink-0" />
          <span>
            Batas waktu target terlewat
            {hariTerlambat > 0 ? ` ${hariTerlambat} hari` : ""}. Anak belum
            ditimbang ulang atau target belum tercapai — segera lakukan
            penimbangan dan konsultasikan ke Posyandu/tenaga kesehatan.
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
      <h3 className=" text-xl font-extrabold text-gray-800 mb-4">
        Perkembangan Berat &amp; Tinggi Badan
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-5">
        Berikut adalah hasil Perkembangan berat badan dan tinggi badan anak
        dibandingkan bulan sebelumnya yang dapat digunakan sebagai acuan untuk
        melihat apakah pertumbuhan anak berjalan sesuai harapan atau memerlukan
        perhatian lebih lanjut.
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
