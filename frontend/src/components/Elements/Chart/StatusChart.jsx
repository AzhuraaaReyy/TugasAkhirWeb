import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const StatusChart = () => {
  const data = [
    { name: "Normal", value: 60 },
    { name: "Berisiko", value: 25 },
    { name: "Stunting", value: 15 },
  ];

  const COLORS = [
    "#10B981", // emerald
    "#F59E0B", // amber
    "#EF4444", // red
  ];

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl border border-emerald-500  p-6 w-full">
      {/* Header */}
      <div className="mb-6">
       
       
      </div>

      {/* Chart */}
      <div className="w-full h-90">
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
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
              }}
            />

            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Numbers */}
      <div className="grid grid-cols-3 gap-4 mt-6 text-center">
        {data.map((item, index) => (
          <div key={index}>
            <p className="text-sm font-medium" style={{ color: COLORS[index] }}>
              {item.name}
            </p>
            <h3 className="text-lg font-bold text-gray-800">{item.value}%</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
