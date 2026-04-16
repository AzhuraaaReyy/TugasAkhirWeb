import Barchart from "../../components/Elements/Chart/BartChart";
import LineChart from "../../components/Elements/Chart/LineChart";
import { Icon } from "../../assets/icons";
import CardTotal from "../../components/Fragments/Dashboard/CardTotal";
import MainLayouts from "../../layouts/MainLayouts";
import CardStunting from "../../components/Fragments/Dashboard/CardStunting";
import CardTidakStunting from "../../components/Fragments/Dashboard/CardTidakStunting";
import { useEffect, useState } from "react";
import Content from "../../components/Fragments/Dashboard/ContentGambar";
import ContentMap from "../../components/Fragments/Dashboard/ContentMap";
import api from "@/services/api";
import Status from "../../components/Elements/Chart/StatusChart";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import "dayjs/locale/id";

dayjs.extend(relativeTime);
dayjs.locale("id");

const Dashboard = () => {
  const [lastUpdate, setLastUpdate] = useState(null);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    total_balita: 0,
    stunting: 0,
    tidak_stunting: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/balitas");
      setLastUpdate(res.data.last_update);
    };

    fetchData();

    const interval = setInterval(fetchData, 10000); // tiap 10 detik

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/balitas"); // endpoint kamu

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
  }, []);
  if (loading) {
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  }
  return (
    <MainLayouts type="dashboard">
      <div className="px-6 py-8 bg-slate-100 min-h-screen">
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* ================= HEADER ================= */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Dashboard Monitoring
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ringkasan data dan statistik kondisi balita
            </p>
          </div>

          {/* ================= CARD TOTAL ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
            <CardTotal total={summary.total_balita} />
            <CardTidakStunting total={summary.tidak_stunting} />
            <CardStunting total={summary.stunting} />
          </div>

          {/* ================= CHART SECTION ================= */}
          <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-10">
            {/* Chart 2 */}
            <div className="bg-white rounded-2xl hover:shadow-xl transition p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Monitoring Pertumbuhan Balita
              </h2>
              <p className="text-gray-500 text-sm  mb-6">
                Status Gizi Tahun Ini
              </p>

              <LineChart />

              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
                <Icon.Waktu className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {lastUpdate
                    ? `Update terakhir ${dayjs(lastUpdate).fromNow()}`
                    : "Memuat..."}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
            {/* Chart Monitoring */}
            <div className="bg-white rounded-2xl hover:shadow-xl transition p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Monitoring Pertumbuhan Balita
              </h2>
              <p className="text-gray-500 text-sm  mb-6">
                Status Gizi Tahun Lalu vs Tahun Ini
              </p>

              <Barchart />

              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
                <Icon.Waktu className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {lastUpdate
                    ? `Update terakhir ${dayjs(lastUpdate).fromNow()}`
                    : "Memuat..."}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl  hover:shadow-xl transition p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">
                Monitoring Pertumbuhan Balita
              </h2>
              <p className="text-gray-500 text-sm font-bold mb-6">
                Grafik Status Gizi Dalam %
              </p>

              <Status />

              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
                <Icon.Waktu className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">
                  {lastUpdate
                    ? `Update terakhir ${dayjs(lastUpdate).fromNow()}`
                    : "Memuat..."}
                </span>
              </div>
            </div>
          </div>
          {/* ================= CONTENT IMAGE ================= */}
          <div className="bg-white rounded-2xl p-6 mb-10 shadow-xl border border-gray-100 shadow-sm hover:shadow-md transition">
            <Content />
          </div>

          {/* ================= MAP SECTION ================= */}
          <div className="bg-white rounded-2xl shadow-xl mb-10 hover:shadow-md transition ">
            <ContentMap />
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default Dashboard;
