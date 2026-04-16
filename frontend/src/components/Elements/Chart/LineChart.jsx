import { LineChart } from "@mui/x-charts/LineChart";
import { useState, useMemo } from "react";
import { useEffect } from "react";
import api from "@/services/api";

const Linechart = () => {
  const [selectedPosyandu, setSelectedPosyandu] = useState("Semua");
  const [rawData, setRawData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/grafikstunting");
        setRawData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

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
  }, [selectedPosyandu, rawData]);

  return (
    <div className="bg-white rounded-3xl ">
      <div className="rounded-3xl p-6 bg-white border border-emerald-500 ">
        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-gray-800 text-xl font-semibold tracking-wide"></h2>

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
              showMark: true,
              area: true,
              color: "#2006cd",
              valueFormatter: (v) => `${v} anak`,
            },
            {
              dataKey: "tidakStunting",
              label: "Tidak Stunting",
              curve: "natural",
              showMark: true,
              area: true,
              color: "#00cf8a",
              valueFormatter: (v) => `${v} anak`,
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
            tooltip: {
              trigger: "axis", // tampil semua data di bulan yg sama
            },
          }}
          sx={{
            "& .MuiMarkElement-root": {
              strokeWidth: 2,
              r: 4, // ukuran titik
            },
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
