import { LineChart } from "@mui/x-charts/LineChart";

const Linechart = () => {
  const data = [
    { month: 1, sales2016: 20000, sales2017: 10000 },
    { month: 2, sales2016: 15000, sales2017: 12000 },
    { month: 3, sales2016: 18000, sales2017: 30000 },
    { month: 4, sales2016: 12000, sales2017: 40000 },
    { month: 5, sales2016: 35000, sales2017: 45000 },
    { month: 6, sales2016: 10000, sales2017: 15000 },
    { month: 7, sales2016: 70000, sales2017: 30000 },
    { month: 8, sales2016: 10000, sales2017: 20000 },
    { month: 9, sales2016: 30000, sales2017: 70000 },
    { month: 10, sales2016: 20000, sales2017: 10000 },
    { month: 11, sales2016: 60000, sales2017: 50000 },
    { month: 12, sales2016: 30000, sales2017: 30000 },
    { month: 13, sales2016: 20000, sales2017: 10000 },
    { month: 14, sales2016: 15000, sales2017: 12000 },
    { month: 15, sales2016: 18000, sales2017: 30000 },
    { month: 16, sales2016: 12000, sales2017: 40000 },
    { month: 17, sales2016: 35000, sales2017: 45000 },
    { month: 18, sales2016: 10000, sales2017: 15000 },
    { month: 19, sales2016: 70000, sales2017: 30000 },
    { month: 20, sales2016: 10000, sales2017: 20000 },
    { month: 21, sales2016: 30000, sales2017: 70000 },
    { month: 22, sales2016: 20000, sales2017: 10000 },
    { month: 23, sales2016: 60000, sales2017: 50000 },
    { month: 24, sales2016: 30000, sales2017: 30000 },
  ];

  return (
    <div className="bg-white rounded-2xl p-4">
      <LineChart
        height={350}
        dataset={data}
        xAxis={[
          {
            scaleType: "point",
            dataKey: "month",
            tickLabelStyle: {
              fill: "#94a3b8",
              fontSize: 11,
            },
          },
        ]}
        yAxis={[
          {
            tickLabelStyle: {
              fill: "#94a3b8",
              fontSize: 11,
            },
          },
        ]}
        series={[
          {
            dataKey: "sales2016",
            label: "2016",
            color: "#6366f1", // indigo modern
            curve: "natural",
            showMark: false,
            area: true,
          },
          {
            dataKey: "sales2017",
            label: "2017",
            color: "#22d3ee", // cyan modern
            curve: "natural",
            showMark: false,
            area: true,
          },
        ]}
        grid={{ horizontal: true, vertical: false }}
        margin={{ top: 20, bottom: 20, left: 10, right: 10 }}
        slotProps={{
          legend: {
            direction: "row",
            position: { vertical: "top", horizontal: "right" },
            labelStyle: {
              fill: "#475569",
              fontSize: 12,
              fontWeight: 500,
            },
          },
        }}
        sx={{
          "& .MuiChartsAxis-line": {
            stroke: "#e5e7eb",
          },
          "& .MuiChartsGrid-line": {
            stroke: "#f1f5f9",
          },
          "& .MuiAreaElement-root": {
            opacity: 0.15,
          },
          "& .MuiLineElement-root": {
            strokeWidth: 3,
          },
        }}
      />
    </div>
  );
};

export default Linechart;
