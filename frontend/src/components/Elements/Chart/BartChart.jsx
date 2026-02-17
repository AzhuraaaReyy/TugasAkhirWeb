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
    <BarChart
      height={220}
      dataset={data}
      xAxis={[{ scaleType: "band", dataKey: "day" }]}
      series={[
        {
          dataKey: "views2016",
          label: "2016",
          color: "#fbbf24",
        },
        {
          dataKey: "views2017",
          label: "2017",
          color: "#14b8a6",
        },
      ]}
      grid={{ horizontal: true }}
      barGapRatio={-1} // 🔥 bikin overlap
    />
  );
};
export default Barchart;
