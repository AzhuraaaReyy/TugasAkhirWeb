import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useMemo } from "react";

const Linechart = () => {
  const [selectedPosyandu, setSelectedPosyandu] = useState("Semua");

  // 🔹 Data Mentah (Simulasi Database)
  const rawData = [
    { month: "Jan", posyandu: "Melati", stunting: 5, tidakStunting: 45 },
    { month: "Jan", posyandu: "Anggrek", stunting: 10, tidakStunting: 60 },

    { month: "Feb", posyandu: "Melati", stunting: 4, tidakStunting: 48 },
    { month: "Feb", posyandu: "Anggrek", stunting: 9, tidakStunting: 62 },

    { month: "Mar", posyandu: "Melati", stunting: 3, tidakStunting: 50 },
    { month: "Mar", posyandu: "Anggrek", stunting: 8, tidakStunting: 65 },

    { month: "Apr", posyandu: "Melati", stunting: 3, tidakStunting: 52 },
    { month: "Apr", posyandu: "Anggrek", stunting: 7, tidakStunting: 68 },

    { month: "Mei", posyandu: "Melati", stunting: 2, tidakStunting: 55 },
    { month: "Mei", posyandu: "Anggrek", stunting: 6, tidakStunting: 70 },

    { month: "Jun", posyandu: "Melati", stunting: 2, tidakStunting: 58 },
    { month: "Jun", posyandu: "Anggrek", stunting: 5, tidakStunting: 72 },
  ];

  // 🔹 Data Setelah Difilter
  const filteredData = useMemo(() => {
    if (selectedPosyandu === "Semua") {
      const grouped = {};

      rawData.forEach((item) => {
        if (!grouped[item.month]) {
          grouped[item.month] = {
            month: item.month,
            stunting: 0,
            tidakStunting: 0,
          };
        }

        grouped[item.month].stunting += item.stunting;
        grouped[item.month].tidakStunting += item.tidakStunting;
      });

      return Object.values(grouped);
    }

    return rawData.filter((item) => item.posyandu === selectedPosyandu);
  }, [selectedPosyandu]);

  return (
    <div className="bg-white rounded-3xl shadow-xl">
      <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-lg">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-800 text-xl font-semibold tracking-wide">
            STATUS GIZI TAHUN INI
          </h2>

          {/* 🔹 Dropdown Filter */}
          <select
            value={selectedPosyandu}
            onChange={(e) => setSelectedPosyandu(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="Semua">Semua Posyandu</option>
            <option value="Melati">Posyandu Melati</option>
            <option value="Anggrek">Posyandu Anggrek</option>
          </select>
        </div>

        {/* 🔹 Chart */}
        <LineChart
          height={350}
          dataset={filteredData}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "month",
              tickLabelStyle: {
                fill: "#64748b",
                fontSize: 11,
              },
            },
          ]}
          yAxis={[
            {
              tickLabelStyle: {
                fill: "#64748b",
                fontSize: 11,
              },
              valueFormatter: (value) => `${value} anak`,
            },
          ]}
          series={[
            {
              dataKey: "stunting",
              label: "Anak Stunting",
              curve: "natural",
              showMark: false,
              area: true,
              color: "#2006cd",
            },
            {
              dataKey: "tidakStunting",
              label: "Tidak Stunting",
              curve: "natural",
              showMark: false,
              area: true,
              color: "#00cf8a",
            },
          ]}
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
          }}
          sx={{
            "& .MuiChartsAxis-line": {
              stroke: "#e2e8f0",
            },
            "& .MuiChartsGrid-line": {
              stroke: "#f1f5f9",
            },
            "& .MuiAreaElement-root:nth-of-type(1)": {
              fill: "url(#gradientEmerald1)",
            },
            "& .MuiAreaElement-root:nth-of-type(2)": {
              fill: "url(#gradientEmerald2)",
            },
            "& .MuiLineElement-root:nth-of-type(1)": {
              strokeWidth: 3,
              filter: "drop-shadow(0px 0px 8px rgba(5,150,105,0.5))",
            },
            "& .MuiLineElement-root:nth-of-type(2)": {
              strokeWidth: 3,
              filter: "drop-shadow(0px 0px 10px rgba(16,185,129,0.5))",
            },
          }}
        >
          <defs>
            <linearGradient id="gradientEmerald1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(5,150,105,0.4)" />
              <stop offset="100%" stopColor="rgba(5,150,105,0)" />
            </linearGradient>

            <linearGradient id="gradientEmerald2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(16,185,129,0.4)" />
              <stop offset="100%" stopColor="rgba(16,185,129,0)" />
            </linearGradient>
          </defs>
        </LineChart>
      </div>
    </div>
  );
};

export default Linechart;
