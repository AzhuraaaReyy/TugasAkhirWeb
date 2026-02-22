import Card from "../../components/Elements/Card/Index";
import Barchart from "../../components/Elements/Chart/BartChart";
import LineChart from "../../components/Elements/Chart/LineChart";
import { Icon } from "../../assets/icons";
import CardTotal from "../../components/Fragments/Dashboard/CardTotal";
import MainLayouts from "../../layouts/MainLayouts";
import CardStunting from "../../components/Fragments/Dashboard/CardStunting";
import CardTidakStunting from "../../components/Fragments/Dashboard/CardTidakStunting";
import CardSeverely from "../../components/Fragments/Dashboard/CardSeverely";
import Content from "../../components/Fragments/Dashboard/ContentGambar";
import ContentMap from "../../components/Fragments/Dashboard/ContentMap";

const Dashboard = () => {
  return (
    <MainLayouts type="dashboard">
      <div className="px-6 py-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <CardTotal />
          <CardTidakStunting />
          <CardStunting />
          <CardSeverely />
        </div>

        {/* ================= CHART SECTION ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">
          {/* Chart 1 */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Website Views
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Last Campaign Performance
            </p>

            <Barchart />

            <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
              <Icon.Waktu className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Campaign sent 2 days ago
              </span>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-1">
              Website Views
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              Last Campaign Performance
            </p>

            <LineChart />

            <div className="border-t border-gray-100 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
              <Icon.Waktu className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Campaign sent 2 days ago
              </span>
            </div>
          </div>
        </div>

        {/* ================= CONTENT IMAGE ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-10">
          <Content />
        </div>

        {/* ================= MAP SECTION ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <ContentMap />
        </div>
      </div>
    </MainLayouts>
  );
};

export default Dashboard;
