import MainLayouts from "../../layouts/MainLayouts";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { Bot, Baby } from "lucide-react";
import ChartTinggi from "@/components/Fragments/Monitoring/ChartTinggi";
import ChartBerat from "@/components/Fragments/Monitoring/ChartBerat";
import CardPerkembangan from "@/components/Fragments/Monitoring/CardPerkembangan";
import CardKeteranganRekomendasi from "@/components/Fragments/Monitoring/CardKeteranganRekomendasi";
import CardStatusAnak from "@/components/Fragments/Monitoring/CardStatusAnak";
import CardEdukasiStatusGizi from "@/components/Fragments/Monitoring/CardEdukasiStatus";
import { CardGiziIndikator } from "@/components/Fragments/Monitoring/CardGiziIndikator";
import Profile from "@/components/Fragments/Monitoring/Profile";
import CardBerat from "@/components/Fragments/Monitoring/CardBerat";
import CardTinggi from "@/components/Fragments/Monitoring/CardTinggi";
import CardTotalPenimbangan from "@/components/Fragments/Monitoring/CardPenimbangan";
import CardStatus from "@/components/Fragments/Monitoring/CardStatus";
import ChartZScoreTBU from "@/components/Fragments/Monitoring/ChartZscoreTb";
import ChartZscoreBb from "@/components/Fragments/Monitoring/ChartZscoreBb";

// SESUAIKAN dengan path route dashboard orang tua Anda.
// Daftarkan DUA route ke komponen ini:
//   <Route path="/dashboardortu" element={<DashboardOrtu />} />
//   <Route path="/dashboardortu/:id" element={<DashboardOrtu />} />
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

export default function DashboardOrtu() {
  const [chartData, setChartData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChatHint, setShowChatHint] = useState(false);
  const [perkembangan, setPerkembangan] = useState(null);

  // Daftar anak milik orang tua yang login (null = masih dimuat)
  const [anakSaya, setAnakSaya] = useState(null);

  /* ============ AMBIL DAFTAR ANAK MILIK SENDIRI ============ */
  useEffect(() => {
    api
      .get("/balita-saya")
      .then((res) => {
        const anak = res.data || [];
        setAnakSaya(anak);

        // Kalau orang tua hanya punya 1 anak dan belum memilih,
        // langsung arahkan ke dashboard anak tersebut.
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
    const fetchGrafik = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/grafik-ortu/${id}`);

        const formattedData = res.data.map((item) => ({
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

        setChartData(formattedData);
        console.log("DEBUG GRAFIK:", res.data);
      } catch (err) {
        console.error("Error ambil grafik:", err);
        setChartData([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchGrafik();
  }, [id]);

  useEffect(() => {
    const fetchPerkembangan = async () => {
      try {
        const res = await api.get(`/perkembangan-ortu/${id}`);
        setPerkembangan(res.data);
        console.log("Debug Perkembangan:", res.data);
      } catch (err) {
        console.error("Error Perkembangan: ", err);
        setPerkembangan(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPerkembangan();
  }, [id]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/detailmonitoring-ortu/${id}`);

        const item = res.data.data;

        const formattedData = {
          name: item.name,
          orang_tua: item.orang_tua,
          umur: item.umur,
          jk: item.jk,
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
        };
        setDetail(formattedData);
        console.log("DEBUG DETAIL:", formattedData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  /* ============================================================
     TAHAP 1 — BELUM ADA ANAK DIPILIH (tanpa :id di URL)
     ============================================================ */
  if (!id) {
    // masih memuat daftar anak
    if (anakSaya === null) {
      return (
        <MainLayouts type="dashboardOrtu">
          <div className="flex min-h-[70vh] items-center justify-center">
            <p>Memuat data anak Anda...</p>
          </div>
        </MainLayouts>
      );
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
      return (
        <MainLayouts type="dashboardOrtu">
          <div className="flex min-h-[70vh] items-center justify-center">
            <p>Membuka data {anakSaya[0].name}...</p>
          </div>
        </MainLayouts>
      );
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

  /* ============================================================
     TAHAP 2 — ADA :id, TAPI BUKAN ANAK MILIK SENDIRI
     (backend juga menolak lewat middleware; ini lapisan tampilan)
     ============================================================ */
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

  if (loading) {
    return (
      <MainLayouts type="lihatmonitoring">
        <div className="flex min-h-[70vh] items-center justify-center">
          <p>Memuat data monitoring...</p>
        </div>
      </MainLayouts>
    );
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-600 mr-1">
                Anak:
              </span>
              {anakSaya.map((anak) => {
                const aktif = String(anak.id) === String(id);
                return (
                  <button
                    key={anak.id}
                    onClick={() =>
                      !aktif && navigate(`${BASE_PATH}/${anak.id}`)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      aktif
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                  >
                    {anak.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
            {/* Profil (sidebar kiri) */}
            <div className="min-w-0 lg:col-span-3">
              <Profile data={detail} />
            </div>

            {/* Konten kanan */}
            <div className="min-w-0 space-y-6 lg:col-span-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-extrabold text-gray-800 sm:text-2xl">
                    Lihat Hasil Tren Monitoring
                  </h1>
                  <p className="mt-1 text-sm text-black">
                    Yuk pantau tumbuh kembang {detail?.name || "anak"} hari ini.
                    Setiap langkah kecil sangat berarti untuk masa depannya!
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
              <div className="min-w-0">
                <ChartTinggi
                  title="Tinggi Badan vs Usia"
                  data={chartData}
                  dataKey="tinggi"
                  statusKey="statusTinggi"
                />
              </div>

              <div className="min-w-0">
                <ChartBerat
                  title="Berat Badan vs Usia"
                  data={chartData}
                  dataKey="berat"
                  statusKey="statusBerat"
                />
              </div>

              <div className="min-w-0">
                <ChartZScoreTBU
                  title="Z-Score TB/U vs Usia"
                  data={chartData}
                  dataKey="zscore"
                  statusKey="statusTBU"
                />
              </div>

              <div className="min-w-0">
                <ChartZscoreBb
                  title="Z-Score BB/U vs Usia"
                  data={chartData}
                  dataKey="ZScoreBBU"
                  statusKey="statusBBU"
                />
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
          <div className="min-w-0">
            <CardPerkembangan data={perkembangan} />
          </div>
          <div className="flex min-w-0">
            <CardStatusAnak data={detail} />
          </div>
          <div className="min-w-0">
            <CardKeteranganRekomendasi data={detail} />
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        onMouseEnter={() => setShowChatHint(true)}
        onMouseLeave={() => setShowChatHint(false)}
      >
        {/* Bubble */}
        <div
          className={`
      overflow-hidden
      transition-all duration-500 ease-out
      ${
        showChatHint
          ? "max-w-lg opacity-100 translate-x-0"
          : "max-w-0 opacity-0 translate-x-4"
      }
    `}
        >
          <div
            className="
        flex items-center gap-3
        whitespace-nowrap
        rounded-full
        bg-emerald-600
        px-5 py-3
        shadow-2xl
      "
          >
            <Bot size={18} className="text-white shrink-0" />

            <span className="text-sm font-medium text-white">
              Ada istilah atau hasil yang belum dipahami? Tanya Tunas sekarang.
            </span>
          </div>
        </div>

        {/* Tombol Bot */}
        <button
          onClick={() => navigate(`/chatbot/${id}`)}
          className="
        group
        relative
        w-16 h-16
        rounded-full
        bg-emerald-600
        text-white
        shadow-xl
        flex items-center justify-center
        hover:scale-110
        transition-all duration-300
      "
        >
          <span
            className="
          absolute inset-0
          rounded-full
          bg-emerald-500
          animate-ping
          opacity-20
        "
          />

          <Bot
            size={28}
            className={`
          relative z-10
          transition-transform duration-700
          ${showChatHint ? "rotate-[360deg]" : ""}
        `}
          />
        </button>
      </div>
    </MainLayouts>
  );
}
