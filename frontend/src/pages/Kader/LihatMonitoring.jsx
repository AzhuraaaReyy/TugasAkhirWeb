import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/services/api";
import MainLayouts from "@/layouts/MainLayouts";
import { Bot, MessageCircle } from "lucide-react";

// Komponen
import ChartTinggi from "@/components/Fragments/Monitoring/ChartTinggi";
import ChartBerat from "@/components/Fragments/Monitoring/ChartBerat";
import CardPerkembangan from "@/components/Fragments/Monitoring/CardPerkembangan";
import CardKeteranganRekomendasi from "@/components/Fragments/Monitoring/CardKeteranganRekomendasi";
import CardStatusAnak from "@/components/Fragments/Monitoring/CardStatusAnak";
import CardEdukasiStatusGizi from "@/components/Fragments/Monitoring/CardEdukasiStatus";
import CardKeteranganStatus from "@/components/Fragments/Monitoring/CardKeterenganStatus";
import { CardGiziIndikator } from "@/components/Fragments/Monitoring/CardGiziIndikator";
import HeaderProfile from "@/components/Fragments/Riwayat/HeaderProfile";
import Profile from "@/components/Fragments/Monitoring/Profile";
import CardBerat from "@/components/Fragments/Monitoring/CardBerat";
import CardTinggi from "@/components/Fragments/Monitoring/CardTinggi";
import CardTotalPenimbangan from "@/components/Fragments/Monitoring/CardPenimbangan";
import CardStatus from "@/components/Fragments/Monitoring/CardStatus";
import ChartZScoreTBU from "@/components/Fragments/Monitoring/ChartZscoreTb";
import ChartZscoreBb from "@/components/Fragments/Monitoring/ChartZscoreBb";

export default function LihatMonitoring() {
  const [chartData, setChartData] = useState([]);
  const [detail, setDetail] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [perkembangan, setPerkembangan] = useState(null);

  useEffect(() => {
    const fetchGrafik = async () => {
      try {
        const res = await api.get(`/grafik/${id}`);

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
      }
    };

    if (id) fetchGrafik();
  }, [id]);

  useEffect(() => {
    const fetchPerkembangan = async () => {
      try {
        const res = await api.get(`/perkembangan/${id}`);
        setPerkembangan(res.data);
        console.log("Debug Perkembangan:", res.data);
      } catch (err) {
        console.error("Error Perkembangan: ", err);
      }
    };
    if (id) fetchPerkembangan();
  }, [id]);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/detaildeteksi/${id}`);

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
        };

        setDetail(formattedData);

        console.log("DEBUG DETAIL:", formattedData);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    if (id) fetchDetail();
  }, [id]);

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
            <CardKeteranganRekomendasi data={detail}  riwayat={chartData} />
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
        </div>
      </div>
      {/* ================= CHATBOT FLOATING BUTTON ================= */}

      {/* Tombol Kiri */}
      <button
        onClick={() => navigate(`/chatbot/${id}`)}
        className="
          fixed bottom-6 left-6 z-50
          px-5 py-3
          rounded-full
          bg-white
          border border-emerald-200
          text-emerald-700
          shadow-xl
          hover:bg-emerald-50
          hover:scale-105
          transition-all duration-300
          flex items-center gap-2
          font-semibold text-sm
        "
      >
        <MessageCircle size={18} />
        Tanya AI
      </button>

      {/* Tombol Kanan */}
      <button
        onClick={() => navigate(`/chatbot/${id}`)}
        className="
    fixed bottom-6 right-6 z-50
    w-16 h-16 rounded-full
    bg-emerald-600 text-white
    shadow-xl
    hover:scale-110
    transition-all duration-300
    flex items-center justify-center
  "
      >
        <Bot size={28} />
      </button>
    </MainLayouts>
  );
}
