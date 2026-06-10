import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import MainLayouts from "@/layouts/MainLayouts";
import { Bot, MessageCircle } from "lucide-react";
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

export default function TrenMonitoring() {
  const [chartData, setChartData] = useState([]);
  const [detail, setDetail] = useState([]);
  const [loading, setLoading] = useState(true);
  const { balitaId, deteksiId } = useParams();
  const navigate = useNavigate();
  const [perkembangan, setPerkembangan] = useState(null);
  const [showChatHint, setShowChatHint] = useState(false);
  //Halaman ini dipakai bersama kader & orang tua. Pilih endpoint sesuai
  // dari mana dibuka: /orangtua/... -> varian -snapshot-ortu,
  const isOrtu = location.pathname.startsWith("/orangtua");
  const sufiks = isOrtu ? "-snapshot-ortu" : "-snapshot";

  useEffect(() => {
    const fetchGrafik = async () => {
      try {
        const res = await api.get(`/grafik${sufiks}/${deteksiId}`);
        console.log("API GRAFIK:", res.data);
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
      } finally {
        setLoading(false);
      }
    };

    if (deteksiId) fetchGrafik();
  }, [deteksiId]);

  useEffect(() => {
    const fetchPerkembangan = async () => {
      try {
        const res = await api.get(`/perkembangan${sufiks}/${deteksiId}`);
        setPerkembangan(res.data);
        console.log("Debug Perkembangan:", res.data);
      } catch (err) {
        console.error("Error Perkembangan: ", err);
      } finally {
        setLoading(false);
      }
    };
    if (deteksiId) fetchPerkembangan();
  }, [deteksiId]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/detailmonitoring${sufiks}/${deteksiId}`);
        console.log("API DETAIL:", res.data);
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
        };
        setDetail(formattedData);
        console.log("DEBUG DETAIL:", formattedData);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (deteksiId) fetchDetail();
  }, [deteksiId]);

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
    <MainLayouts type="lihatmonitoring">
      <div className="min-h-screen w-full overflow-x-hidden bg-emerald-50 p-4 sm:p-6 mt-5">
        <div className="space-y-8">
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
      {/* ================= CHATBOT FLOATING BUTTON ================= */}

      {/* Tombol Kanan */}
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
          onClick={() => navigate(`/chatbot/${balitaId}/snapshot/${deteksiId}`)}
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
