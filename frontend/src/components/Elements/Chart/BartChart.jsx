import { BarChart } from "@mui/x-charts/BarChart";
import { useMemo } from "react";

const Barchart = () => {
  // 🔹 Simulasi Data 2 Tahun
  const rawData = [
    { month: "Jan", year: 2024, stunting: 6, tidakStunting: 40 },
    { month: "Jan", year: 2025, stunting: 5, tidakStunting: 45 },

    { month: "Feb", year: 2024, stunting: 5, tidakStunting: 42 },
    { month: "Feb", year: 2025, stunting: 4, tidakStunting: 48 },

    { month: "Mar", year: 2024, stunting: 4, tidakStunting: 45 },
    { month: "Mar", year: 2025, stunting: 3, tidakStunting: 50 },

    { month: "Apr", year: 2024, stunting: 4, tidakStunting: 47 },
    { month: "Apr", year: 2025, stunting: 3, tidakStunting: 52 },
  ];

  // 🔹 Pivot Data per Bulan
  const comparedData = useMemo(() => {
    const grouped = {};

    rawData.forEach((item) => {
      if (!grouped[item.month]) {
        grouped[item.month] = {
          month: item.month,
          stunting2024: 0,
          stunting2025: 0,
          tidakStunting2024: 0,
          tidakStunting2025: 0,
        };
      }

      if (item.year === 2024) {
        grouped[item.month].stunting2024 = item.stunting;
        grouped[item.month].tidakStunting2024 = item.tidakStunting;
      }

      if (item.year === 2025) {
        grouped[item.month].stunting2025 = item.stunting;
        grouped[item.month].tidakStunting2025 = item.tidakStunting;
      }
    });

    return Object.values(grouped);
  }, []);

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-lg rounded-3xl shadow-xl p-6">
      <h2 className="text-gray-800 text-xl font-semibold mb-6">
         Status Gizi Tahun Lalu vs Tahun Ini
      </h2>

      <BarChart
        height={400}
        dataset={comparedData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "month",
          },
        ]}
        yAxis={[
          {
            min: 0,
            valueFormatter: (value) => `${value} anak`,
          },
        ]}
        series={[
          {
            dataKey: "stunting2024",
            label: "Stunting 2024",
            color: "#f4bd5e",
          },
          {
            dataKey: "tidakStunting2024",
            label: "Tidak Stunting 2024",
            color: "#ed9704",
          },
          {
            dataKey: "stunting2025",
            label: "Stunting 2025",
            color: "#68ff93",
          },
          {
            dataKey: "tidakStunting2025",
            label: "Tidak Stunting 2025",
            color: "#00b643",
          },
        ]}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "right" },
          },
        }}
      />
    </div>
  );
};

export default Barchart;
