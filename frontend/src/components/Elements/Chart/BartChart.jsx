import { BarChart } from "@mui/x-charts/BarChart";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { OrbitProgress } from "react-loading-indicators";
const Barchart = () => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/grafiktahunan");
        setRawData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  // 🔹 Pivot Data per Bulan
  const comparedData = useMemo(() => {
    const grouped = {};

    rawData.forEach((item) => {
      if (!grouped[item.month]) {
        grouped[item.month] = {
          month: item.month,
        };
      }

      grouped[item.month][`stunting${item.year}`] = item.stunting;
      grouped[item.month][`tidakStunting${item.year}`] = item.tidakStunting;
    });

    return Object.values(grouped);
  }, [rawData]);

  const years = [...new Set(rawData.map((item) => item.year))];

  const series = [];

  years.forEach((year) => {
    series.push({
      dataKey: `stunting${year}`,
      label: `Stunting ${year}`,
    });

    series.push({
      dataKey: `tidakStunting${year}`,
      label: `Tidak Stunting ${year}`,
    });
  });

  return (
    <div className="bg-white border border-emerald-500 rounded-3xl p-6">
      {loading ? (
        <div className="flex justify-center items-center h-[350px]">
          <OrbitProgress
            dense
            color="#32cd32"
            size="medium"
            text=""
            textColor=""
          />
        </div>
      ) : (
        <BarChart
          height={400}
          dataset={comparedData}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "month",
              tickLabelStyle: {
                fill: "#64748b",
                fontSize: 11,
              },
            },
          ]}
          yAxis={[
            {
              min: 0,
              tickLabelStyle: {
                fill: "#64748b",
                fontSize: 11,
              },
              valueFormatter: (value) => `${value} anak`,
            },
          ]}
          // 🔥 SERIES DINAMIS
          series={years.flatMap((year, index) => [
            {
              dataKey: `stunting${year}`,
              label: `Stunting ${year}`,
              color: index % 2 === 0 ? "#f59e0b" : "#ef4444",
            },
            {
              dataKey: `tidakStunting${year}`,
              label: `Tidak Stunting ${year}`,
              color: index % 2 === 0 ? "#10b981" : "#22c55e",
            },
          ])}
          grid={{ horizontal: true, vertical: false }}
          margin={{ top: 20, bottom: 20, left: 20, right: 20 }}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "right" },
              labelStyle: {
                fill: "#334155",
                fontSize: 12,
                fontWeight: 500,
              },
            },
            tooltip: {
              trigger: "axis",
            },
          }}
          sx={{
            "& .MuiChartsAxis-line": {
              stroke: "#e2e8f0",
            },
            "& .MuiChartsGrid-line": {
              stroke: "#f1f5f9",
            },
          }}
        />
      )}
    </div>
  );
};

export default Barchart;
