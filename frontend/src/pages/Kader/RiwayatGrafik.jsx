import { useState } from "react";
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
import api from "@/services/api";
import EarlyWarning from "@/components/Fragments/Riwayat&Grafik/EarlyWarning";
import { useEffect } from "react";
const RiwayatdanGrafik = () => {
  const [balitaList, setBalitaList] = useState([]);
  const [balitaDetail, setBalitaDetail] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataWithUsia, setDataWithUsia] = useState([]);
  const [filterTanggal, setFilterTanggal] = useState("");
  const itemsPerPage = 10;

  //ambil balita
  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.get("/balitas"); // endpoint list
        setBalitaList(res.data);
      } catch (err) {
        console.error("Error ambil balita:", err);
      }
    };

    fetchBalita();
  }, []);

  //ambildata setelah pilih balita
  useEffect(() => {
    if (!selectedId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/riwayat/${selectedId}`);
        setBalitaDetail(res.data);
      } catch (err) {
        console.error("Error ambil detail:", err);
        setBalitaDetail(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedId]);
  console.log(balitaDetail);
  //data grafik
  useEffect(() => {
    if (!selectedId) return;

    const fetchGrafik = async () => {
      try {
        const res = await api.get(`/grafik/${selectedId}`);
        setDataWithUsia(res.data);
      } catch (err) {
        console.error("Error ambil grafik:", err);
      }
    };

    fetchGrafik();
  }, [selectedId]);
  const balitaOptions = balitaList.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const balita = balitaDetail;

  const filteredData = (balitaDetail?.penimbangans || []).filter((item) => {
    const tgl = item.tgl_penimbangan || "";
    return !filterTanggal || tgl.startsWith(filterTanggal);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);
  //warna
  const statusWarna = {
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",
    "Pendek (stunted)": "bg-yellow-400 text-white",
    Normal: "bg-green-500 text-white",
    Tinggi: "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const baseStyle =
    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

  if (loading)
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );

    
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
                <h1 className="text-2xl font-bold">{balita.name}</h1>
                <p className="text-gray-500">
                  {balita.jk} • Orang Tua: {balita.orang_tua || ""}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Usia Saat Ini</p>
                <p className="text-xl font-semibold">
                  {balita.umur}
                  bulan
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 ">
              <CardTotalPenimbangan total={balita.total_penimbangan} />
              <CardBerat berat={`${balita.berat} kg`} />
              <CardTinggi tinggi={`${balita.tinggi} cm`} />
              <CardStatus>
                <span
                  className={`${baseStyle} ${
                    statusWarna[balita.status_tbu] || statusWarna.default
                  }`}
                >
                  {balita.status_tbu}
                </span>
              </CardStatus>
            </div>

            {/* ================= ALERT ================= */}
            <EarlyWarning
              berat_sekarang={balita.berat_sekarang}
              berat_sebelumnya={balita.berat_sebelumnya}
              tinggi_sekarang={balita.tinggi_sekarang}
              tinggi_sebelumnya={balita.tinggi_sebelumnya}
            />

            {/* ================= GRAFIK ================= */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl shadow-lg p-6">
                <h2 className="font-semibold mb-4">
                  Grafik Tinggi Badan vs Usia
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dataWithUsia}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="umur" />
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
                    <XAxis dataKey="umur" />
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
                            {startIndex + index + 1}
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.tgl_penimbangan
                              ? new Date(
                                  item.tgl_penimbangan,
                                ).toLocaleDateString("id-ID")
                              : "-"}
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.umur} bulan
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.berat} kg
                          </td>

                          <td className="px-4 py-3 text-gray-500">
                            {item.tinggi} cm
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span
                              className={`${baseStyle} ${
                                statusWarna[balita.status_tbu] ||
                                statusWarna.default
                              }`}
                            >
                              {balita.status_tbu}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {item.user?.name || ""}
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
                    Menampilkan {filteredData.length === 0 ? 0 : startIndex + 1}{" "}
                    - {Math.min(endIndex, filteredData.length)} dari{" "}
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
