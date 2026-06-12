import Barchart from "../../components/Elements/Chart/BartChart";
import LineChart from "../../components/Elements/Chart/LineChart";
import Status from "../../components/Elements/Chart/StatusChart";
import { Icon } from "../../assets/icons/Index";
import CardTotal from "../../components/Fragments/Dashboard/CardTotal";
import CardStunting from "../../components/Fragments/Dashboard/CardStunting";
import CardTidakStunting from "../../components/Fragments/Dashboard/CardTidakStunting";
import MainLayouts from "../../layouts/MainLayouts";
import Content from "../../components/Fragments/Dashboard/ContentGambar";
import ContentMap from "../../components/Fragments/Dashboard/ContentMap";
import { useEffect, useState } from "react";
import api from "@/services/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "../../context/useAuth";
import { Atom } from "react-loading-indicators";
import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

const Dashboard = () => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    total_balita: 0,
    stunting: 0,
    tidak_stunting: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/balitas");

        setLastUpdate(res.data.last_update);

        setSummary({
          total_balita: res.data.total_balita,
          stunting: res.data.stunting,
          tidak_stunting: res.data.tidak_stunting,
        });
      } catch (error) {
        console.error("Gagal fetch dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);

  // Footer "update terakhir" dipakai 3x — komponen kecil agar konsisten & menempel ke bawah.
  const FooterUpdate = () => (
    <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
      <Icon.Waktu className="w-4 h-4 text-gray-400" />
      <span className="text-sm text-gray-400">
        {lastUpdate
          ? `Update terakhir ${dayjs(lastUpdate).fromNow()}`
          : "Memuat..."}
      </span>
    </div>
  );

  return (
    <MainLayouts type="dashboard">
      <div className="bg-emerald-50 rounded-2xl shadow-md p-6">
        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <Atom color="#10b981" size="medium" text="Memuat..." />
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="mb-8 mt-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Selamat Datang, Kader {user?.name || "User"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau perkembangan pertumbuhan, status gizi, dan kondisi kesehatan
            balita secara real-time.
          </p>
        </div>

        {/* ================= CARD TOTAL ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          <CardTotal total={summary.total_balita} />
          <CardTidakStunting total={summary.tidak_stunting} />
          <CardStunting total={summary.stunting} />
        </div>

        {/* ================= CHART SECTION ================= */}
        {/* items-stretch (default) + setiap kartu flex-col + footer mt-auto = tinggi kartu sejajar */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-10 items-stretch">
          {/* ================= LINE CHART ================= */}
          <div className="bg-white rounded-2xl hover:shadow-xl hover:-translate-y-1 duration-300 transition p-6 border border-gray-100 min-h-[450px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Monitoring Pertumbuhan
            </h2>
            <p className="text-gray-500 text-sm mb-6">Status Gizi Tahun Ini</p>

            <LineChart />

            <div className="mt-auto">
              <FooterUpdate />
            </div>
          </div>

          {/* ================= BAR CHART ================= */}
          <div className="bg-white rounded-2xl hover:shadow-xl hover:-translate-y-1 duration-300 transition p-6 border border-gray-100 min-h-[450px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Perbandingan Status Gizi
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Tahun Lalu vs Tahun Ini
            </p>

            <Barchart />

            <div className="mt-auto">
              <FooterUpdate />
            </div>
          </div>

          {/* ================= STATUS CHART ================= */}
          <div className="bg-white rounded-2xl hover:shadow-xl hover:-translate-y-1 duration-300 transition p-6 border border-gray-100 min-h-[450px] flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              Persentase Status Gizi
            </h2>
            <p className="text-gray-500 text-sm mb-6">Grafik Status Gizi (%)</p>

            <Status />

            <div className="mt-auto">
              <FooterUpdate />
            </div>
          </div>
        </div>

        {/* ================= CONTENT & MAP ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-md transition">
            <Content />
          </div>
          <div className="bg-white rounded-2xl shadow-xl hover:shadow-md transition overflow-hidden">
            <ContentMap />
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default Dashboard;
