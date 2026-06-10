import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useMemo, useState } from "react";
import api from "@/services/api";
import { OrbitProgress } from "react-loading-indicators";

// Tinggi grafik dibuat sama dengan LineChart & PieChart.
const TINGGI_GRAFIK = 320;

const CORAK_STUNTING = ["#fca5a5", "#dc2626", "#f87171", "#7f1d1d"];
const CORAK_TIDAK_STUNTING = ["#6ee7b7", "#059669", "#34d399", "#065f46"];

// Tooltip: "-" bila tahun itu tidak ada data. Nilai 0 tetap "0 anak".
const formatNilai = (value) =>
  value === null || value === undefined ? "-" : `${value} anak`;

const Barchart = () => {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/grafiktahunan");
        setRawData(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const comparedData = useMemo(() => {
    const grouped = {};
    rawData.forEach((item) => {
      if (!grouped[item.month]) {
        grouped[item.month] = {
          month: item.month,
          monthNum: item.monthNum ?? 0,
        };
      }
      grouped[item.month][`stunting${item.year}`] = item.stunting;
      grouped[item.month][`tidakStunting${item.year}`] = item.tidakStunting;
    });
    return Object.values(grouped).sort(
      (a, b) => (a.monthNum ?? 0) - (b.monthNum ?? 0),
    );
  }, [rawData]);

  const years = useMemo(
    () => [...new Set(rawData.map((item) => item.year))].sort((a, b) => a - b),
    [rawData],
  );

  const series = useMemo(
    () =>
      years.flatMap((year, index) => [
        {
          id: `stunting${year}`,
          dataKey: `stunting${year}`,
          label: `Stunting ${year}`,
          color: CORAK_STUNTING[index % CORAK_STUNTING.length],
          valueFormatter: formatNilai,
        },
        {
          id: `tidakStunting${year}`,
          dataKey: `tidakStunting${year}`,
          label: `Tidak Stunting ${year}`,
          color: CORAK_TIDAK_STUNTING[index % CORAK_TIDAK_STUNTING.length],
          valueFormatter: formatNilai,
        },
      ]),
    [years],
  );

  const gradId = (id) => `barGrad-${id}`;
  const sxGradien = useMemo(
    () =>
      Object.fromEntries(
        series.map((s) => [
          `& .MuiBarElement-series-${s.id}`,
          { fill: `url(#${gradId(s.id)})` },
        ]),
      ),
    [series],
  );

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
    <BarChart
      height={TINGGI_GRAFIK}
      dataset={comparedData}
      borderRadius={8}
      xAxis={[
        {
          scaleType: "band",
          dataKey: "month",
          categoryGapRatio: 0.5,
          barGapRatio: 0.2,
          tickLabelStyle: { fill: "#64748b", fontSize: 11 },
        },
      ]}
      yAxis={[
        {
          min: 0,
          tickLabelStyle: { fill: "#64748b", fontSize: 11 },
          valueFormatter: (value) => `${value} anak`,
        },
      ]}
      series={series}
      grid={{ horizontal: true, vertical: false }}
      margin={{ top: 24, bottom: 20, left: 24, right: 24 }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "top", horizontal: "right" },
          labelStyle: { fill: "#334155", fontSize: 12, fontWeight: 500 },
        },
        tooltip: { trigger: "axis" },
      }}
      sx={{
        "& .MuiChartsAxis-line": { stroke: "#e2e8f0" },
        "& .MuiChartsGrid-line": { stroke: "#f1f5f9" },
        ...sxGradien,
      }}
    >
      <defs>
        {series.map((s) => (
          <linearGradient
            key={s.id}
            id={gradId(s.id)}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor={s.color} stopOpacity={1} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0.5} />
          </linearGradient>
        ))}
      </defs>
    </BarChart>
  );
};

export default Barchart;
