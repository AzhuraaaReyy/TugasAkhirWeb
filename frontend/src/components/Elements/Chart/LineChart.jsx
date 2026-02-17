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
    <LineChart
      height={250}
      dataset={data}
      xAxis={[
        {
          scaleType: "point",
          dataKey: "month",
          tickFormatter: (v) => `${v}`,
        },
      ]}
      series={[
        {
          dataKey: "sales2016",
          label: "2016",
          color: "#fbbf24", // kuning-orange
          curve: "monotoneX",

          showMark: true,
          markSize: 4,
        },
        {
          dataKey: "sales2017",
          label: "2017",
          color: "#14b8a6", // teal / hijau kebiruan
          curve: "monotoneX",

          showMark: true,
          markSize: 4,
        },
      ]}
      grid={{ horizontal: true }}
      slotProps={{
        legend: {
          direction: "row",
          position: { vertical: "top", horizontal: "right" },
        },
      }}
      sx={{
        "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel": {
          fill: "#9F9F9F",
          fontSize: 11,
        },
        "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": {
          fill: "#9F9F9F",
          fontSize: 11,
        },
        "& .MuiChartsLine-series": {
          strokeWidth: 2, // ketebalan garis
        },
      }}
    />
  );
};
export default Linechart;
