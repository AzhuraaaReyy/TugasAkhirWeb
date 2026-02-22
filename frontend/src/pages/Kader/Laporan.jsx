import { useState, useMemo } from "react";
import Card from "../../components/Elements/Card/Index";
import MainLayouts from "../../layouts/MainLayouts";
const dummyData = [
  {
    id: 1,
    nama: "Aisyah",
    dusun: "Dusun 1",
    umur: 24,
    berat: 8.2,
    tinggi: 78,
    status: "Stunting",
    tanggal: "2025-01-10",
  },
  {
    id: 2,
    nama: "Rafi",
    dusun: "Dusun 2",
    umur: 30,
    berat: 10.5,
    tinggi: 85,
    status: "Normal",
    tanggal: "2025-01-15",
  },
  {
    id: 3,
    nama: "Dina",
    dusun: "Dusun 1",
    umur: 18,
    berat: 7.9,
    tinggi: 74,
    status: "Stunting",
    tanggal: "2025-01-18",
  },
];

export default function Laporan() {
  const [bulan, setBulan] = useState("2025-01");

  const filteredData = useMemo(() => {
    return dummyData.filter((item) => item.tanggal.startsWith(bulan));
  }, [bulan]);

  const totalBalita = filteredData.length;
  const totalStunting = filteredData.filter(
    (d) => d.status === "Stunting",
  ).length;
  const totalNormal = filteredData.filter((d) => d.status === "Normal").length;

  const persenStunting =
    totalBalita > 0 ? ((totalStunting / totalBalita) * 100).toFixed(1) : 0;

  // Rekap per dusun
  const rekapDusun = useMemo(() => {
    const group = {};
    filteredData.forEach((item) => {
      if (!group[item.dusun]) {
        group[item.dusun] = {
          total: 0,
          stunting: 0,
        };
      }
      group[item.dusun].total++;
      if (item.status === "Stunting") {
        group[item.dusun].stunting++;
      }
    });
    return group;
  }, [filteredData]);

  // Export CSV (Excel)
  const exportCSV = () => {
    const headers = "Nama,Dusun,Umur,Berat,Tinggi,Status,Tanggal\n";

    const rows = filteredData
      .map(
        (d) =>
          `${d.nama},${d.dusun},${d.umur},${d.berat},${d.tinggi},${d.status},${d.tanggal}`,
      )
      .join("\n");

    const blob = new Blob([headers + rows], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `laporan_${bulan}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const printContent = document.querySelector(".print-area").innerHTML;

    const newWindow = window.open("", "", "width=900,height=700");
    newWindow.document.write(`
    <html>
      <head>
        <title>Laporan</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
          h1, h2 {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
    </html>
  `);

    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <MainLayouts type="laporan">
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="print-area">
          <h1 className="text-2xl font-bold mb-6">Laporan & Export Data</h1>

          {/* Filter */}
          <div className="mb-6 flex gap-4 items-center">
            <input
              type="month"
              value={bulan}
              onChange={(e) => setBulan(e.target.value)}
              className="border px-3 py-2 rounded-lg"
            />

            <button
              onClick={exportCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Export Excel
            </button>

            <button
              onClick={exportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Export PDF
            </button>
          </div>

          {/* Summary */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card title="Total Balita" desc={totalBalita} />
            <Card title="Total Stunting" desc={totalStunting} />
            <Card title="Total Normal" desc={totalNormal} />
            <Card title="Persentase Stunting" desc={`${persenStunting}%`} />
          </div>

          {/* Rekap Per Dusun */}
          <div className="bg-white p-4 rounded-xl shadow mb-6">
            <h2 className="font-semibold mb-4">Rekap Per Dusun</h2>

            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2">Dusun</th>
                  <th className="p-2">Total</th>
                  <th className="p-2">Stunting</th>
                  <th className="p-2">%</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(rekapDusun).map(([dusun, data], i) => {
                  const persen = ((data.stunting / data.total) * 100).toFixed(
                    1,
                  );
                  return (
                    <tr key={i} className="border-b">
                      <td className="p-2">{dusun}</td>
                      <td className="p-2">{data.total}</td>
                      <td className="p-2">{data.stunting}</td>
                      <td className="p-2">{persen}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Detail Table */}
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-semibold mb-4">Detail Data</h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Nama</th>
                    <th className="p-2">Dusun</th>
                    <th className="p-2">Umur</th>
                    <th className="p-2">Berat</th>
                    <th className="p-2">Tinggi</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.nama}</td>
                      <td className="p-2">{item.dusun}</td>
                      <td className="p-2">{item.umur} bln</td>
                      <td className="p-2">{item.berat} kg</td>
                      <td className="p-2">{item.tinggi} cm</td>
                      <td
                        className={`p-2 font-medium ${
                          item.status === "Stunting"
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.status}
                      </td>
                      <td className="p-2">{item.tanggal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
