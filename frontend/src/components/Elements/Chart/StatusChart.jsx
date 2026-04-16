import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useEffect } from "react";
import api from "@/services/api";

const StatusChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/grafikpersen");

        const normal = res.data.normal ?? 0;
        const stunting = res.data.stunting ?? 0;

        const total = normal + stunting;

        // ❗ Hindari NaN
        if (total === 0) {
          setData([]);
          return;
        }

        const formatted = [
          {
            name: "Normal",
            value: Math.round((normal / total) * 100),
            jumlah: normal,
          },
          {
            name: "Stunting",
            value: Math.round((stunting / total) * 100),
            jumlah: stunting,
          },
        ];

        setData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const COLORS = ["#10B981", "#EF4444"];

  // ❗ Loading state
  if (!data.length) {
    return <div className="text-center p-6">Memuat data...</div>;
  }

  return (
    <div className="bg-white rounded-2xl border border-emerald-500 p-6 w-full">
      {/* Chart */}
      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, name, props) =>
                `${props.payload.jumlah} anak (${value}%)`
              }
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            />

            <Legend verticalAlign="bottom" iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6 text-center">
        {data.map((item, index) => (
          <div key={index}>
            <p className="text-sm font-medium" style={{ color: COLORS[index] }}>
              {item.name}
            </p>
            <h3 className="text-lg font-bold text-gray-800">
              {item.jumlah} anak
            </h3>
            <p className="text-xs text-gray-500">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
