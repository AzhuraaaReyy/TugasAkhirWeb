import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayouts from "../../layouts/MainLayouts";

const RiwayatPemeriksaan = () => {
  // =========================
  // DATA BALITA (MULTIPLE)
  // =========================
  const dataRiwayat = [
    {
      tanggal: "2024-01-10",
      usia: 12,
      berat: 7.5,
      tinggi: 68,
      status: "Normal",
      petugas: "Bidan Siti",
      catatan: "Perkembangan baik",
    },
    {
      tanggal: "2024-02-10",
      usia: 13,
      berat: 7.8,
      tinggi: 69,
      status: "Stunting",
      petugas: "Bidan Siti",
      catatan: "Perlu tambahan protein",
    },
    {
      tanggal: "2024-03-10",
      usia: 14,
      berat: 8.0,
      tinggi: 70,
      status: "Risiko",
      petugas: "Bidan Ani",
      catatan: "Pantau pola makan",
    },
  ];

  const [filterTanggal, setFilterTanggal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  const filteredData = dataRiwayat.filter((item) => {
    if (!filterTanggal) return true;
    return item.tanggal === filterTanggal;
  });

  const totalPages = Math.ceil(filteredData.length / dataPerPage);
  const indexOfLast = currentPage * dataPerPage;
  const indexOfFirst = indexOfLast - dataPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const statusStyle = {
    Normal: "bg-emerald-100 text-emerald-700",
    Risiko: "bg-yellow-100 text-yellow-700",
    Stunting: "bg-red-100 text-red-700",
  };

  // ================= PAGINATION =================

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  return (
    <MainLayouts type="riwayatdangrafik">
      <div className="min-h-screen bg-emerald-50 p-8 space-y-8">
        {/* ================= PILIH BALITA ================= */}

        {/* ================= TABEL ================= */}
        <h2 className="font-extrabold mb-4 text-gray-700 text-2xl mt-5">
          Riwayat Penimbangan
        </h2>
        <p className="text-gray-500 text-sm mb-5">
          Data berikut menunjukkan riwayat pertumbuhan anak berdasarkan hasil
          penimbangan di posyandu. Orang tua dapat melihat apakah pertumbuhan
          anak sudah sesuai dengan usianya atau perlu perhatian lebih lanjut.
        </p>
        <div className="bg-white rounded-3xl shadow-lg p-6">
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
                  <th className="px-4 py-3">Aksi</th>
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
                      <td className="px-4 py-3 text-center">
                        <Link to="/">
                          <button className="px-3 py-1.5 rounded-lg bg-gray-200 text-gray-600 text-xs font-medium hover:bg-emerald-100 hover:text-emerald-700 transition duration-200">
                            Lihat Detail
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-400">
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
      </div>
    </MainLayouts>
  );
};

export default RiwayatPemeriksaan;
