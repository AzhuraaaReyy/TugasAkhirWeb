import Card from "../components/Elements/Card/Index";
import Barchart from "../components/Elements/Chart/BartChart";
import LineChart from "../components/Elements/Chart/LineChart";
import { Icon } from "../assets/icons";
import CardTotal from "../components/Fragments/Dashboard/CardTotal";
import MainLayouts from "../layouts/MainLayouts";
import CardStunting from "../components/Fragments/Dashboard/CardStunting";
import CardTidakStunting from "../components/Fragments/Dashboard/CardTidakStunting";
import CardSeverely from "../components/Fragments/Dashboard/CardSeverely";
import ContentCard from "../components/Elements/Card/ContentCard";
import Content from "../components/Fragments/Dashboard/ContentGambar";
import ContentMap from "../components/Fragments/Dashboard/ContentMap";
const Dashboard = () => {
  return (
    <MainLayouts type="dashboard">
      <div className="p-6 bg-gray-100 min-h-screen">
        {/* ====== CARD TOTAL SECTION ====== */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="flex-1">
            <CardTotal />
          </div>
          <div className="flex-1">
            <CardTidakStunting />
          </div>
          <div className="flex-1">
            <CardStunting />
          </div>
          <div className="flex-1">
            <CardSeverely />
          </div>
        </div>
        {/* ====== CHART SECTION ====== */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-stretch">
          {/* Chart 1 */}
          <div className="flex-1">
            <Card
              title="Website Views"
              desc={
                <>
                  <p className="text-sm text-gray-400 mb-4">
                    Last Campaign Performance
                  </p>
                  <Barchart />
                  <div className="border-t border-gray-200 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Icon.Waktu className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Campaign sent 2 days ago
                    </span>
                  </div>
                </>
              }
            />
          </div>

          {/* Chart 2 */}
          <div className="flex-1">
            <Card
              title="Website Views"
              desc={
                <>
                  <p className="text-sm text-gray-400 mb-4">
                    Last Campaign Performance
                  </p>
                  <LineChart />
                  <div className="border-t border-gray-200 mt-6 pt-4 flex items-center gap-2 text-xs text-gray-500">
                    <Icon.Waktu className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      Campaign sent 2 days ago
                    </span>
                  </div>
                </>
              }
            />
          </div>
        </div>
        {/* ====== ContentGambar SECTION ====== */}
        <Content />
        {/* ====== ContentMap SECTION ====== */}
        <div className="">
          <ContentMap />
        </div>
      </div>
    </MainLayouts>
  );
};
export default Dashboard;
