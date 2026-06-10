import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useEffect } from "react";
import api from "@/services/api";
import { OrbitProgress } from "react-loading-indicators";

// Tinggi grafik dibuat sama dengan BarChart & PieChart.
const TINGGI_GRAFIK = 320;

const fmtAngka = new Intl.NumberFormat("id-ID");
const fmtRingkas = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const Linechart = () => {
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/grafikstunting");
        setRawData(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatSeri = (v, ctx) => {
    const row = rawData[ctx?.dataIndex];
    const total = row?.total ?? 0;
    const persen = total > 0 ? Math.round(((v ?? 0) / total) * 100) : 0;
    return `${fmtAngka.format(v ?? 0)} anak (${persen}%)`;
  };

  const lebarPerTitik = 90;
  const banyakData = rawData.length > 8;
  const lebarChart = banyakData ? rawData.length * lebarPerTitik : undefined;

  if (loading) {
    return (
      <div
        className="flex justify-center items-center"
        style={{ height: TINGGI_GRAFIK }}
      >
        <OrbitProgress
          dense
          color="#32cd32"
          size="medium"
          text=""
          textColor=""
        />
      </div>
    );
  }

  return (
    <div
      className={
        banyakData ? "w-full overflow-x-auto" : "w-full overflow-hidden"
      }
    >
      <div style={banyakData ? { minWidth: lebarChart } : undefined}>
        <LineChart
          height={TINGGI_GRAFIK}
          {...(banyakData ? { width: lebarChart } : {})}
          dataset={rawData}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "month",
              tickLabelStyle: { fill: "#64748b", fontSize: 11 },
            },
          ]}
          yAxis={[
            {
              min: 0,
              tickMinStep: 1,
              tickLabelStyle: { fill: "#64748b", fontSize: 11 },
              valueFormatter: (value) => fmtRingkas.format(value),
            },
          ]}
          series={[
            {
              id: "stunting",
              dataKey: "stunting",
              label: "Anak Stunting",
              curve: "natural",
              showMark: true,
              area: true,
              color: "#ef4444",
              valueFormatter: formatSeri,
            },
            {
              id: "tidakStunting",
              dataKey: "tidakStunting",
              label: "Tidak Stunting",
              curve: "natural",
              showMark: true,
              area: true,
              color: "#10b981",
              valueFormatter: formatSeri,
            },
          ]}
          grid={{ horizontal: true, vertical: false }}
          margin={{ top: 24, bottom: 24, left: 56, right: 24 }}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "right" },
              labelStyle: { fill: "#334155", fontSize: 12, fontWeight: 500 },
            },
            tooltip: { trigger: "axis" },
          }}
          sx={{
            "& .MuiMarkElement-root": { strokeWidth: 2, r: 4 },
            "& .MuiChartsAxis-line": { stroke: "#e2e8f0" },
            "& .MuiChartsGrid-line": { stroke: "#f1f5f9" },
            "& .MuiAreaElement-series-stunting": {
              fill: "url(#gradientStunting)",
            },
            "& .MuiAreaElement-series-tidakStunting": {
              fill: "url(#gradientNormal)",
            },
            "& .MuiLineElement-series-stunting": {
              strokeWidth: 3,
              filter: "drop-shadow(0px 0px 8px rgba(239,68,68,0.45))",
            },
            "& .MuiLineElement-series-tidakStunting": {
              strokeWidth: 3,
              filter: "drop-shadow(0px 0px 10px rgba(16,185,129,0.45))",
            },
          }}
        >
          <defs>
            <linearGradient id="gradientStunting" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(239,68,68,0.40)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0)" />
            </linearGradient>
            <linearGradient id="gradientNormal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,185,129,0.40)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </linearGradient>
          </defs>
        </LineChart>
      </div>
    </div>
  );
};

export default Linechart;
