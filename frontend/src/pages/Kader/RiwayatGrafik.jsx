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
import Select from "react-select";
import CardTotalPenimbangan from "../../components/Fragments/Riwayat&Grafik/CardPenimbangan";
import CardBerat from "../../components/Fragments/Riwayat&Grafik/CardBerat";
import CardTinggi from "../../components/Fragments/Riwayat&Grafik/CardTinggi";
import CardStatus from "../../components/Fragments/Riwayat&Grafik/CardStatus";

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
        {
          tanggal: "2024-01-10",
          berat: 7.5,
          tinggi: 68,
          status: "Normal",
          petugas: "Budiyono",
        },
        {
          tanggal: "2024-02-10",
          berat: 7.8,
          tinggi: 69,
          status: "Stunting",
          petugas: "Siti",
        },
        {
          tanggal: "2024-03-10",
          berat: 8.0,
          tinggi: 70,
          status: "Risiko",
          petugas: "Budiyono",
        },
        {
          tanggal: "2024-04-10",
          berat: 8.1,
          tinggi: 71,
          status: "Normal",
          petugas: "Siti",
        },
        {
          tanggal: "2024-05-10",
          berat: 8.2,
          tinggi: 72,
          status: "Normal",
          petugas: "Ainun",
        },
        {
          tanggal: "2024-06-10",
          berat: 8.1,
          tinggi: 72,
          status: "Risiko",
          petugas: "Budiyono",
        },
      ],
    },
    {
      id: 2,
      nama: "Rafi",
      tanggal_lahir: "2022-05-15",
      jk: "Laki-Laki",
      orang_tua: "Bapak Andi",
      riwayat: [
        {
          tanggal: "2024-01-15",
          berat: 9.5,
          tinggi: 75,
          status: "Normal",
          petugas: "Budiyono",
        },
        {
          tanggal: "2024-02-15",
          berat: 9.7,
          tinggi: 76,
          status: "Normal",
          petugas: "Budiyono",
        },
        {
          tanggal: "2024-03-15",
          berat: 9.6,
          tinggi: 76,
          status: "Normal",
          petugas: "Budiyono",
        },
        {
          tanggal: "2024-04-15",
          berat: 9.8,
          tinggi: 77,
          status: "Normal",
          petugas: "Budiyono",
        },
      ],
      status: "Stunting",
      petugas: "Bagusyono",
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

  const [filterTanggal, setFilterTanggal] = useState("");

  const filteredData = dataWithUsia.filter((item) => {
    if (!filterTanggal) return true;
    return item.tanggal === filterTanggal;
  });

  const getStatusGizi = (berat, tinggi) => {
    // SIMULASI SEDERHANA (bukan standar WHO asli)

    const bmi = berat / ((tinggi / 100) * (tinggi / 100));

    if (bmi < 14) return { status: "Severely Stunting", color: "text-red-700" };
    if (bmi < 15) return { status: "Stunting", color: "text-orange-600" };
    if (bmi >= 15 && bmi <= 18)
      return { status: "Normal", color: "text-green-600" };
    if (bmi > 18 && bmi <= 20)
      return { status: "Overweight", color: "text-yellow-600" };
    if (bmi > 20) return { status: "Obesitas", color: "text-red-600" };

    return { status: "Tidak Diketahui", color: "text-gray-500" };
  };

  const statusGizi = terakhir
    ? getStatusGizi(terakhir.berat, terakhir.tinggi, terakhir.usia)
    : null;

  const statusStyle = {
    Normal: "bg-green-100 text-green-700",
    Risiko: "bg-orange-100 text-orange-600",
    Stunting: "bg-red-100 text-red-700",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 10;

  // ================= PAGINATION =================

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const balitaOptions = balitaList.map((b) => ({
    value: b.id,
    label: b.nama,
  }));
  return (
    <MainLayouts type="riwayatdangrafik">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8">
        {/* ================= PILIH BALITA ================= */}
        <div>
          <label className="text-sm text-gray-600">Pilih Balita</label>
          <Select
            options={balitaOptions}
            placeholder="Cari Balita..."
            className="mt-1 text-gray-500"
            noOptionsMessage={() => "Balita tidak ditemukan"}
            onChange={(selected) => setSelectedId(selected.value)}
            filterOption={(option, inputValue) => {
              const search = inputValue.toLowerCase();
              const nama = option.data.label?.toLowerCase() || "";
              return nama.includes(search);
            }}
            unstyled
            classNames={{
              control: () => "w-full mt-1 border rounded-xl px-2 py-1 bg-white",
              menu: () => "border mt-1 rounded-xl shadow-md bg-white",
              menuList: () => "max-h-40 overflow-y-auto",
              option: ({ isFocused, isSelected }) =>
                `px-4 py-2 cursor-pointer ${
                  isSelected
                    ? "bg-emerald-500 text-white"
                    : isFocused
                      ? "bg-emerald-100"
                      : ""
                }`,
            }}
          />
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
              <div className="grid md:grid-cols-4 gap-6 ">
                <CardTotalPenimbangan total={totalRiwayat} />
                <CardBerat berat={`${terakhir.berat} kg`} />
                <CardTinggi tinggi={`${terakhir.tinggi} cm`} />
                <CardStatus
                  umur={
                    statusGizi ? (
                      <span className={`font-extrabold ${statusGizi.color}`}>
                        {statusGizi.status}
                      </span>
                    ) : (
                      "-"
                    )
                  }
                />
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
              <h2 className="font-extrabold mb-4 text-gray-700 text-xl">
                Riwayat Penimbangan
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Menampilkan data hasil penimbangan berat badan balita secara
                berkala untuk memantau pertumbuhan dan status gizinya.
              </p>
              {/* FILTER SECTION */}
              <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
                <input
                  type="date"
                  value={filterTanggal}
                  onChange={(e) => {
                    setFilterTanggal(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {filterTanggal && (
                  <button
                    onClick={() => setFilterTanggal("")}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
              {/* FILTER */}

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Tanggal Penimbangan</th>
                      <th className="px-4 py-3">Usia</th>
                      <th className="px-4 py-3">Berat Badan (kg)</th>
                      <th className="px-4 py-3">Tinggi Badan (cm)</th>
                      <th className="px-4 py-3">Status Gizi</th>
                      <th className="px-4 py-3">Dicatat Oleh</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {filteredData.length > 0 ? (
                      currentData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-gray-500">
                            {indexOfFirstData + index + 1}
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.tanggal}
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.usia} bulan
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.berat} kg
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.tinggi} cm
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                statusStyle[item.status]
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {item.petugas}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="text-center py-6 text-gray-400"
                        >
                          Data tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                <div className="flex justify-between items-center mt-6 p-6">
                  <p className="text-sm text-gray-500">
                    Menampilkan {indexOfFirstData + 1} -{" "}
                    {Math.min(indexOfLastData, filteredData.length)} dari{" "}
                    {filteredData.length} data
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md text-sm border ${
                          currentPage === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md border text-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayouts>
  );
};

export default RiwayatdanGrafik;
