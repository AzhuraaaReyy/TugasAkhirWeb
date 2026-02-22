import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import MainLayouts from "../../layouts/MainLayouts";
import Card from "../../components/Elements/Card/Index";

const RiwayatdanGrafik = () => {
  // =========================
  // DATA BALITA (MULTIPLE)
  // =========================
  const balitaList = [
    {
      id: 1,
      nama: "Aisyah",
      tanggal_lahir: "2023-01-10",
      jk: "Perempuan",
      orang_tua: "Ibu Siti",
      riwayat: [
        { tanggal: "2024-01-10", berat: 7.5, tinggi: 68 },
        { tanggal: "2024-02-10", berat: 7.8, tinggi: 69 },
        { tanggal: "2024-03-10", berat: 8.0, tinggi: 70 },
        { tanggal: "2024-04-10", berat: 8.1, tinggi: 71 },
        { tanggal: "2024-05-10", berat: 8.2, tinggi: 72 },
        { tanggal: "2024-06-10", berat: 8.1, tinggi: 72 },
      ],
    },
    {
      id: 2,
      nama: "Rafi",
      tanggal_lahir: "2022-05-15",
      jk: "Laki-Laki",
      orang_tua: "Bapak Andi",
      riwayat: [
        { tanggal: "2024-01-15", berat: 9.5, tinggi: 75 },
        { tanggal: "2024-02-15", berat: 9.7, tinggi: 76 },
        { tanggal: "2024-03-15", berat: 9.6, tinggi: 76 },
        { tanggal: "2024-04-15", berat: 9.8, tinggi: 77 },
      ],
    },
  ];

  const [selectedId, setSelectedId] = useState("");

  const balita = balitaList.find((b) => b.id === parseInt(selectedId));

  // =========================
  // FUNCTION HITUNG USIA
  // =========================
  const hitungUsia = (lahir, tanggal) => {
    const l = new Date(lahir);
    const t = new Date(tanggal);
    return (
      (t.getFullYear() - l.getFullYear()) * 12 + (t.getMonth() - l.getMonth())
    );
  };

  const dataWithUsia = useMemo(() => {
    if (!balita) return [];

    return balita.riwayat.map((item) => ({
      ...item,
      usia: hitungUsia(balita.tanggal_lahir, item.tanggal),
    }));
  }, [balita]);

  const terakhir =
    dataWithUsia.length > 0 ? dataWithUsia[dataWithUsia.length - 1] : null;

  const totalRiwayat = dataWithUsia.length;

  // =========================
  // DETEKSI TREN OTOMATIS
  // =========================
  const alert = useMemo(() => {
    if (dataWithUsia.length < 2) return null;

    const last = dataWithUsia[dataWithUsia.length - 1];
    const prev = dataWithUsia[dataWithUsia.length - 2];

    if (last.berat < prev.berat) {
      return "⚠ Berat badan menurun dibanding bulan sebelumnya";
    }

    if (last.tinggi === prev.tinggi) {
      return "⚠ Tinggi badan tidak bertambah bulan ini";
    }

    return null;
  }, [dataWithUsia]);

  return (
    <MainLayouts type="riwayatdangrafik">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8">
        {/* ================= PILIH BALITA ================= */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <label className="text-sm text-gray-600">Pilih Balita</label>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full mt-2 border rounded-xl px-4 py-3"
          >
            <option value="">-- Pilih Balita --</option>
            {balitaList.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nama}
              </option>
            ))}
          </select>
        </div>

        {/* ================= TAMPILKAN DATA JIKA DIPILIH ================= */}
        {balita && (
          <>
            {/* ================= HEADER ================= */}
            <div className="bg-white rounded-3xl shadow-lg p-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{balita.nama}</h1>
                <p className="text-gray-500">
                  {balita.jk} • Orang Tua: {balita.orang_tua}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Usia Saat Ini</p>
                <p className="text-xl font-semibold">
                  {hitungUsia(balita.tanggal_lahir, new Date().toISOString())}{" "}
                  bulan
                </p>
              </div>
            </div>

            {/* ================= SUMMARY ================= */}
            {terakhir && (
              <div className="grid md:grid-cols-4 gap-6">
                <Card title="Total Penimbangan" desc={totalRiwayat} />
                <Card title="Berat Terakhir" desc={`${terakhir.berat} kg`} />
                <Card title="Tinggi Terakhir" desc={`${terakhir.tinggi} cm`} />
                <Card title="Usia Terakhir" desc={`${terakhir.usia} bulan`} />
              </div>
            )}

            {/* ================= ALERT ================= */}
            {alert && (
              <div className="bg-red-100 text-red-700 p-4 rounded-2xl font-medium">
                {alert}
              </div>
            )}

            {/* ================= GRAFIK ================= */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="font-semibold mb-4">
                  Grafik Tinggi Badan vs Usia
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataWithUsia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="usia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="tinggi"
                      stroke="#10B981"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="font-semibold mb-4">
                  Grafik Berat Badan vs Usia
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataWithUsia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="usia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="berat"
                      stroke="#3B82F6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* ================= TABEL ================= */}
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="font-semibold mb-4">Riwayat Penimbangan</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 text-left">Tanggal</th>
                      <th className="px-4 py-3 text-left">Usia</th>
                      <th className="px-4 py-3 text-left">Berat</th>
                      <th className="px-4 py-3 text-left">Tinggi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataWithUsia.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3">{item.tanggal}</td>
                        <td className="px-4 py-3">{item.usia} bulan</td>
                        <td className="px-4 py-3">{item.berat} kg</td>
                        <td className="px-4 py-3">{item.tinggi} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayouts>
  );
};

export default RiwayatdanGrafik;
