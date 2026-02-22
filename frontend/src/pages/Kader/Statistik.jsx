import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import Card from "../../components/Elements/Card/Index";
import MainLayouts from "../../layouts/MainLayouts";
const Statistik = () => {
  // ===============================
  // Dummy Data
  // ===============================
  const dataBalita = [
    {
      nama: "Aisyah",
      dusun: "Dusun A",
      usia: 24,
      status: "Stunting",
      bulan: "Jan",
    },
    {
      nama: "Budi",
      dusun: "Dusun A",
      usia: 30,
      status: "Stunting",
      bulan: "Jan",
    },
    {
      nama: "Citra",
      dusun: "Dusun B",
      usia: 18,
      status: "Stunting",
      bulan: "Feb",
    },
    {
      nama: "Dimas",
      dusun: "Dusun B",
      usia: 40,
      status: "Normal",
      bulan: "Feb",
    },
    {
      nama: "Eka",
      dusun: "Dusun C",
      usia: 12,
      status: "Stunting",
      bulan: "Mar",
    },
    {
      nama: "Fajar",
      dusun: "Dusun C",
      usia: 50,
      status: "Normal",
      bulan: "Mar",
    },
  ];

  const [selectedDusun, setSelectedDusun] = useState("Semua");

  // ===============================
  // Filter Dusun
  // ===============================
  const filteredData =
    selectedDusun === "Semua"
      ? dataBalita
      : dataBalita.filter((d) => d.dusun === selectedDusun);

  // ===============================
  // Summary
  // ===============================
  const totalBalita = filteredData.length;

  const totalStunting = filteredData.filter(
    (d) => d.status === "Stunting",
  ).length;

  const persenStunting =
    totalBalita > 0 ? ((totalStunting / totalBalita) * 100).toFixed(1) : 0;

  // ===============================
  // Statistik Per Dusun
  // ===============================
  const resultDusun = {};

  dataBalita.forEach((item) => {
    if (!resultDusun[item.dusun]) {
      resultDusun[item.dusun] = {
        dusun: item.dusun,
        total: 0,
        stunting: 0,
      };
    }

    resultDusun[item.dusun].total += 1;

    if (item.status === "Stunting") {
      resultDusun[item.dusun].stunting += 1;
    }
  });

  const statistikDusun = Object.values(resultDusun);

  // ===============================
  // Grafik Bulanan
  // ===============================
  const bulanMap = {};

  dataBalita.forEach((item) => {
    if (!bulanMap[item.bulan]) {
      bulanMap[item.bulan] = { bulan: item.bulan, stunting: 0 };
    }

    if (item.status === "Stunting") {
      bulanMap[item.bulan].stunting += 1;
    }
  });

  const grafikBulanan = Object.values(bulanMap);

  // ===============================
  // Kelompok Umur
  // ===============================
  const groups = {
    "0-12": 0,
    "13-24": 0,
    "25-36": 0,
    "37-59": 0,
  };

  filteredData.forEach((item) => {
    if (item.status === "Stunting") {
      if (item.usia <= 12) groups["0-12"] += 1;
      else if (item.usia <= 24) groups["13-24"] += 1;
      else if (item.usia <= 36) groups["25-36"] += 1;
      else groups["37-59"] += 1;
    }
  });

  const kelompokUmur = Object.keys(groups).map((key) => ({
    kelompok: key,
    jumlah: groups[key],
  }));

  return (
    <MainLayouts type="statistik">
      <div className="p-6 bg-gray-100 min-h-screen space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Statistik & Monitoring Desa
        </h1>

        {/* Filter */}
        <div>
          <select
            value={selectedDusun}
            onChange={(e) => setSelectedDusun(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="Semua">Semua Dusun</option>
            <option value="Dusun A">Dusun A</option>
            <option value="Dusun B">Dusun B</option>
            <option value="Dusun C">Dusun C</option>
          </select>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card title="Total Balita" desc={totalBalita} />
          <Card title="Total Stunting" desc={totalStunting} />
          <Card title="Persentase Stunting" desc={`${persenStunting}%`} />
          <Card title="Jumlah Dusun" desc={statistikDusun.length} />
        </div>

        {/* Grafik Bulanan */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Grafik Stunting Per Bulan</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={grafikBulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="stunting" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Statistik Per Dusun */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">Jumlah Stunting per Dusun</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statistikDusun}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dusun" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stunting" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Kelompok Umur */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-4">
            Distribusi Stunting Berdasarkan Kelompok Umur
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={kelompokUmur}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kelompok" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </MainLayouts>
  );
};
export default Statistik;
