import MainLayouts from "../../layouts/MainLayouts";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Check, Bot, Baby } from "lucide-react";
import CardKeteranganRekomendasi from "@/components/Fragments/Monitoring/CardKeteranganRekomendasi";
import CardEdukasiStatusGizi from "@/components/Fragments/Monitoring/CardEdukasiStatus";
import { CardGiziIndikator } from "@/components/Fragments/Monitoring/CardGiziIndikator";
import Profile from "@/components/Fragments/Monitoring/Profile";
import CardBerat from "@/components/Fragments/Monitoring/CardBerat";
import CardTinggi from "@/components/Fragments/Monitoring/CardTinggi";
import CardTotalPenimbangan from "@/components/Fragments/Monitoring/CardPenimbangan";
import CardStatus from "@/components/Fragments/Monitoring/CardStatus";
import EventCalendar from "@/components/Fragments/Dashboard/EventCalander";
import CardPerkembanganAnak from "./CardPerkembanganAnak";
import { useAuth } from "../../context/useAuth";
import ChartGrowth from "./ChartGrowth ";
import ChartGrowthZScore from "./ChartGrowthZscore";
import { Atom } from "react-loading-indicators";
const BASE_PATH = "/orangtua/dashboard";

// Hitung umur ringkas dari tgl_lahir (untuk kartu pemilih anak)
const hitungUmur = (tglLahir) => {
  if (!tglLahir) return "-";
  const lahir = new Date(tglLahir);
  const now = new Date();
  let bulan =
    (now.getFullYear() - lahir.getFullYear()) * 12 +
    (now.getMonth() - lahir.getMonth());
  if (now.getDate() < lahir.getDate()) bulan -= 1;
  if (bulan < 0) return "-";
  return bulan < 24
    ? `${bulan} bulan`
    : `${Math.floor(bulan / 12)} tahun ${bulan % 12} bulan`;
};

// Overlay loading dengan Atom (dipakai di beberapa tahap)
const LayarMemuat = ({ type = "dashboardOrtu", text = "Memuat..." }) => (
  <MainLayouts type={type}>
    <div className="relative min-h-[70vh] w-full overflow-x-hidden bg-emerald-50">
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <Atom color="#10b981" size="medium" text={text} />
      </div>
    </div>
  </MainLayouts>
);

export default function DashboardOrtu() {
  const [chartData, setChartData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChatHint, setShowChatHint] = useState(false);
  const [perkembangan, setPerkembangan] = useState(null);
  const { user } = useAuth();
  // Daftar anak milik orang tua yang login (null = masih dimuat)
  const [anakSaya, setAnakSaya] = useState(null);

  /* ============ AMBIL DAFTAR ANAK MILIK SENDIRI ============ */
  useEffect(() => {
    api
      .get("/balita-saya")
      .then((res) => {
        const anak = res.data || [];
        setAnakSaya(anak);

        if (!id && anak.length === 1) {
          navigate(`${BASE_PATH}/${anak[0].id}`, { replace: true });
        }
      })
      .catch((err) => {
        console.error("Error ambil daftar anak:", err);
        setAnakSaya([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============ FETCH DATA MONITORING (per anak terpilih) ============ */
  useEffect(() => {
    if (!id) return;
    let aktif = true;

    const ambilGrafik = async () => {
      try {
        const res = await api.get(`/grafik-ortu/${id}`);
        const formattedData = (res.data || []).map((item) => ({
          id: item.id,
          name: item.bulan,
          tanggal: item.tgl_deteksi,
          tinggi: item.tinggi,
          berat: item.berat,

          // TOOLTIP
          kenaikanBerat: item.kenaikan_berat,
          targetKbm: item.targetKbm,

          kenaikanTinggi: item.kenaikan_tinggi,
          targetKpt: item.targetKpt,

          // STATUS
          statusTinggi: item.statusTinggi,
          statusBerat: item.statusBBU,
          statusTBU: item.statustbu,
          statusBBU: item.statusbbu,

          //Tooltip
          TooltipBB: item.tooltipBB,
          TooltipTB: item.tooltipTB,
          WarnaTB: item.warnaTB,
          WarnaBB: item.warnaBB,
          // WHO
          statusWHO_TBU: item.status,
          zscore: item.zscore,
          ZScoreBBU: item.ZScoreBBU,

          // TANGGAL
          fullDate: item.tgl_label,
          umur: item.umur,

          // WHO LINE
          medianTb: item.median_tb,
          minus2Tb: item.minus2_tb,
          minus3Tb: item.minus3_tb,
        }));
        if (aktif) setChartData(formattedData);
      } catch (err) {
        console.error("Error ambil grafik:", err);
        if (aktif) setChartData([]);
      }
    };

    const ambilPerkembangan = async () => {
      try {
        const res = await api.get(`/perkembangan-ortu/${id}`);
        if (aktif) setPerkembangan(res.data);
      } catch (err) {
        console.error("Error Perkembangan: ", err);
        if (aktif) setPerkembangan(null);
      }
    };

    const ambilDetail = async () => {
      try {
        const res = await api.get(`/detailmonitoring-ortu/${id}`);
        const item = res.data.data;

        const formattedData = {
          name: item.name,
          orang_tua: item.orang_tua,
          umur: item.umur,
          jk: item.jk,
          tgl_lahir: item.tgl_lahir,
          ZscoreTBU: item.zscore_tbu,
          ZscoreBBU: item.zscore_bbu,
          ZscoreBBTB: item.zscore_bbtb,
          berat: item.berat,
          tinggi: item.tinggi,
          total: item.total_deteksi,
          tanggal: item.tgl_deteksi,
          // STATUS
          statusBBU: item.status.bbu,
          statusTBU: item.status.tbu,
          statusBBTB: item.status.bbtb,

          keteranganStunting: item.keterangangizi.stunting,
          keteranganWasting: item.keterangangizi.wasting,
          keteranganUnderweight: item.keterangangizi.underweight,

          rekomendasiStunting: item.rekomendasigizi.stunting,
          rekomendasiWasting: item.rekomendasigizi.wasting,
          rekomendasiUnderweight: item.rekomendasigizi.underweight,
          riwayat: item.riwayat,
          kebutuhanGizi: item.kebutuhan_gizi,
          tingkatRekomendasi: item.tingkat_rekomendasi,
        };
        if (aktif) setDetail(formattedData);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    const muat = async () => {
      setLoading(true);
      // Ketiganya jalan paralel; loading baru mati setelah semua selesai.
      await Promise.allSettled([
        ambilGrafik(),
        ambilPerkembangan(),
        ambilDetail(),
      ]);
      if (aktif) setLoading(false);
    };

    muat();
    return () => {
      aktif = false;
    };
  }, [id]);

  //TAHAP 1 — BELUM ADA ANAK DIPILIH (tanpa :id di URL)
  if (!id) {
    // masih memuat daftar anak
    if (anakSaya === null) {
      return <LayarMemuat text="MEMUAT..." />;
    }

    // tidak punya anak terdaftar
    if (anakSaya.length === 0) {
      return (
        <MainLayouts type="dashboardOrtu">
          <div className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="max-w-lg text-center">
              <div className="mb-4 text-6xl">👶</div>
              <h2 className="text-2xl font-bold text-gray-800">
                Belum Ada Data Anak
              </h2>
              <p className="mt-3 text-gray-600">
                Akun Anda belum terhubung dengan data balita. Silakan hubungi
                kader Posyandu untuk mendaftarkan anak Anda.
              </p>
            </div>
          </div>
        </MainLayouts>
      );
    }

    // 1 anak -> sedang dialihkan otomatis oleh useEffect di atas
    if (anakSaya.length === 1) {
      return <LayarMemuat text={`Membuka data ${anakSaya[0].name}...`} />;
    }

    // 2 anak atau lebih -> KARTU PILIH ANAK (bukan dropdown)
    return (
      <MainLayouts type="dashboardOrtu">
        <div className="min-h-[80vh] bg-emerald-50 p-6 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-gray-800">
                Pilih Anak
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Anda memiliki {anakSaya.length} anak terdaftar. Pilih salah satu
                untuk melihat hasil monitoring pertumbuhannya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {anakSaya.map((anak) => (
                <button
                  key={anak.id}
                  onClick={() => navigate(`${BASE_PATH}/${anak.id}`)}
                  className="group bg-white rounded-3xl border-2 border-gray-100 p-6 text-left shadow-sm hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white ${
                        anak.jk === "L" ? "bg-blue-400" : "bg-pink-400"
                      }`}
                    >
                      {anak.name?.charAt(0)?.toUpperCase() || (
                        <Baby size={28} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg truncate">
                        {anak.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {anak.jk === "L" ? "Laki-laki" : "Perempuan"} •{" "}
                        {hitungUmur(anak.tgl_lahir)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    Lihat Monitoring →
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </MainLayouts>
    );
  }

  /*TAHAP 2 — ADA :id, TAPI BUKAN ANAK MILIK SENDIRI(backend juga menolak lewat middleware; ini lapisan tampilan) */
  if (anakSaya && !anakSaya.some((a) => String(a.id) === String(id))) {
    return (
      <MainLayouts type="dashboardOrtu">
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <div className="mb-4 text-6xl">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Akses Tidak Diizinkan
            </h2>
            <p className="mt-3 text-gray-600">
              Data balita ini bukan milik akun Anda.
            </p>
            <button
              onClick={() => navigate(BASE_PATH, { replace: true })}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700"
            >
              Kembali ke Anak Saya
            </button>
          </div>
        </div>
      </MainLayouts>
    );
  }

  // Loading data monitoring (Atom)
  if (loading) {
    return <LayarMemuat type="lihatmonitoring" text="MEMUAT..." />;
  }

  if (!chartData.length) {
    return (
      <MainLayouts type="lihatmonitoring">
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <div className="mb-4 text-6xl">📊</div>

            <h2 className="text-2xl font-bold text-gray-800">
              Belum Ada Data Monitoring
            </h2>

            <p className="mt-3 text-gray-600">
              Data pertumbuhan anak belum tersedia. Silakan lakukan pemeriksaan
              atau deteksi terlebih dahulu agar grafik pertumbuhan, status gizi,
              dan rekomendasi dapat ditampilkan.
            </p>

            <button
              onClick={() => navigate("/deteksi")}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700"
            >
              Lakukan Pemeriksaan
            </button>
          </div>
        </div>
      </MainLayouts>
    );
  }
  return (
    <MainLayouts type="dashboardOrtu">
      <div className="min-h-screen w-full overflow-x-hidden bg-emerald-50 p-4 sm:p-6 mt-5">
        <div className="space-y-8">
          {/* ===== PENGGANTI ANAK (tab/pill, hanya jika anak > 1) ===== */}
          {anakSaya && anakSaya.length > 1 && (
            <div className="rounded-3xl border border-gray-100 bg-white/70 backdrop-blur p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Baby size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold leading-none text-gray-800">
                    Pilih Anak
                  </p>
                  <p className="mt-1 text-[11px] text-gray-400">
                    Pantau tumbuh kembang tiap anak Anda
                  </p>
                </div>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-1 hide-scrollbar">
                {anakSaya.map((anak) => {
                  const aktif = String(anak.id) === String(id);
                  return (
                    <button
                      key={anak.id}
                      onClick={() =>
                        !aktif && navigate(`${BASE_PATH}/${anak.id}`)
                      }
                      className={`group flex shrink-0 items-center gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-300 ${
                        aktif
                          ? "border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-500/30"
                          : "border-gray-200 bg-white hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/40 hover:shadow"
                      }`}
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold text-white ${
                          anak.jk === "L" ? "bg-blue-400" : "bg-pink-400"
                        }`}
                      >
                        {anak.name?.charAt(0)?.toUpperCase() || (
                          <Baby size={18} />
                        )}
                      </span>

                      <span className="text-left">
                        <span
                          className={`block text-sm font-bold leading-tight ${
                            aktif ? "text-emerald-700" : "text-gray-800"
                          }`}
                        >
                          {anak.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-gray-400">
                          {anak.jk === "L" ? "Laki-laki" : "Perempuan"} •{" "}
                          {hitungUmur(anak.tgl_lahir)}
                        </span>
                      </span>

                      {aktif && (
                        <span className="ml-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check size={12} strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
            {/* Profil (sidebar kiri) */}

            <div className="min-w-0 lg:col-span-3 h-full  ">
              <Profile data={detail} />
            </div>

            {/* Konten kanan */}
            <div className="min-w-0 space-y-6 lg:col-span-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-extrabold text-gray-800 sm:text-2xl">
                    Dashboard Monitoring
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Selamat datang, {user?.name || "Bunda"}! Berikut ringkasan
                    tumbuh kembang {detail?.name || "si kecil"} berdasarkan
                    pemeriksaan terbaru. Pantau pertumbuhan dan status gizinya
                    secara rutin agar setiap perkembangannya selalu terjaga.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <CardTotalPenimbangan total={detail.total} />
                <CardBerat berat={detail.berat} />
                <CardTinggi tinggi={detail.tinggi} />
                <CardStatus status={detail.statusTBU} />
              </div>
              <div className="min-w-0">
                <CardGiziIndikator
                  data={{
                    tbu: detail.ZscoreTBU,
                    bbu: detail.ZscoreBBU,
                    bbtb: detail.ZscoreBBTB,
                  }}
                />
              </div>
              {/* Indikator status gizi */}
            </div>
            <div className="min-w-0 lg:col-span-12">
              <CardEdukasiStatusGizi />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-extrabold text-gray-800">
                Tren Grafik Pertumbuhan
              </h2>

              <p className="mt-3 text-sm text-gray-500 leading-relaxed w-full">
                Grafik berikut membantu Bunda melihat perkembangan tinggi badan,
                berat badan, dan status gizi si kecil dari waktu ke waktu.
                Dengan pemantauan rutin, perubahan pertumbuhan dapat diketahui
                lebih awal sehingga dukungan gizi dan perawatan yang tepat dapat
                segera diberikan.
              </p>
            </div>

            {/* Grid Grafik */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="min-w-0 lg:col-span-1">
                <ChartGrowth data={chartData} />
              </div>

              <div className="min-w-0 lg:col-span-1">
                <ChartGrowthZScore data={chartData} />
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-5 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
                Status gizi setiap bulan berdasarkan standar WHO (Z-Score)
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 ">
            <div className="lg:col-span-8">
              <CardPerkembanganAnak data={perkembangan} />
            </div>
            <div className="lg:col-span-4">
              <EventCalendar />
            </div>
          </div>

          <div className="min-w-0">
            <CardKeteranganRekomendasi
              data={{
                ...perkembangan,
                rekomendasiStunting: detail.rekomendasiStunting,
                rekomendasiWasting: detail.rekomendasiWasting,
                rekomendasiUnderweight: detail.rekomendasiUnderweight,
                tingkatRekomendasi: detail.tingkatRekomendasi,
              }}
              gizi={detail.kebutuhanGizi}
              riwayat={detail.riwayat}
            />
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-center text-xs text-gray-400">
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            Data diperbarui dari hasil pemeriksaan rutin. Pastikan pengukuran
            akurat untuk hasil yang lebih baik.
          </div>
          {/* ===== AJAKAN TANYA AI ===== */}
        </div>
      </div>

      {/* Tombol Kanan */}
      {/* CHATBOT FLOATING */}
      <div
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3"
        onMouseEnter={() => setShowChatHint(true)}
        onMouseLeave={() => setShowChatHint(false)}
      >
        <div
          className={`overflow-hidden transition-all duration-500 ease-out ${
            showChatHint
              ? "max-w-[calc(100vw-6rem)] sm:max-w-sm opacity-100 translate-x-0"
              : "max-w-0 opacity-0 translate-x-4"
          }`}
        >
          <div className="flex items-center gap-3 rounded-3xl bg-emerald-600 px-5 py-3 shadow-2xl">
            <Bot size={18} className="text-white shrink-0" />
            <span className="text-sm font-medium text-white">
              Ada istilah atau hasil yang belum dipahami? Tanya GrowthAI
              sekarang.
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/chatbot/${id}`)}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-full bg-emerald-600 text-white shadow-xl flex items-center justify-center hover:scale-110 transition-all duration-300"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
          <Bot
            size={28}
            className={`relative z-10 transition-transform duration-700 ${showChatHint ? "rotate-[360deg]" : ""}`}
          />
        </button>
      </div>
    </MainLayouts>
  );
}
