import { BarChart } from "@mui/x-charts/BarChart";

const Barchart = () => {
  const data = [
    { day: "M", views2016: 50, views2017: 15 },
    { day: "T", views2016: 45, views2017: 40 },
    { day: "W", views2016: 20, views2017: 50 },
    { day: "T", views2016: 30, views2017: 70 },
    { day: "F", views2016: 50, views2017: 80 },
    { day: "S", views2016: 60, views2017: 90 },
    { day: "S", views2016: 75, views2017: 100 },
  ];

  return (
    <div className="bg-white rounded-2xl p-4">
      <BarChart
        height={260}
        dataset={data}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "day",
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
            dataKey: "views2016",
            label: "2016",
            color: "#6366f1", // indigo modern
          },
          {
            dataKey: "views2017",
            label: "2017",
            color: "#22d3ee", // cyan modern
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
          "& .MuiBarElement-root": {
            borderRadius: 6, // rounded bar
          },
        }}
      />
    </div>
  );
};

export default Barchart;
