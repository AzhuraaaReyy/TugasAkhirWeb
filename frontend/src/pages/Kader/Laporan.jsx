import { useState, useMemo } from "react";

import MainLayouts from "../../layouts/MainLayouts";

const dummyData = [
  {
    id: 1,
    nama: "Aisyah",
    orangtua: "Budiyono Siregar",
    jk: "Perempuan",
    TTL: "Semarang,12-01-2021",
    alamat: "Soka rt02/rw04",
    Posyandu: "Posyandu Anggerek",
    dusun: "Dusun 1",
    umur: 24,
    berat: 8.2,
    tinggi: 78,
    status: "Stunting",
    tanggal: "2025-01-10",
    tbu: 8.9,
    bbu: 10,
    tbbu: 12,
  },
  {
    id: 2,
    nama: "Rafi",
    orangtua: "Angga Geobarac",
    jk: "Laki-Laki",
    TTL: "Ungaran,12-01-2021",
    alamat: "Soka rt04/rw04",
    Posyandu: "Posyandu Melati",
    dusun: "Dusun 2",
    umur: 30,
    berat: 10.5,
    tinggi: 85,
    status: "Normal",
    tanggal: "2025-01-15",
    tbu: 8.9,
    bbu: 10,
    tbbu: 12,
  },
  {
    id: 3,
    nama: "Dina",
    orangtua: "Ahmad Solikin",
    jk: "Perempuan",
    TTL: "Tembalang,12-01-2021",
    alamat: "Banyumanik rt02/rw04",
    Posyandu: "Posyandu Mawar",
    dusun: "Dusun 1",
    umur: 18,
    berat: 7.9,
    tinggi: 74,
    status: "Stunting",
    tanggal: "2025-01-18",
    tbu: 8.9,
    bbu: 10,
    tbbu: 12,
  },
];

export default function Laporan() {
  const [filterTanggal, setFilterTanggal] = useState("");

  // FILTER DATA
  const filteredData = useMemo(() => {
    if (!filterTanggal) return dummyData;
    return dummyData.filter((item) => item.tanggal === filterTanggal);
  }, [filterTanggal]);

  // REKAP PER DUSUN

  // EXPORT CSV (EXCEL)
  const exportCSV = () => {
    if (filteredData.length === 0) {
      alert("Tidak ada data untuk diexport");
      return;
    }

    const headers = "Nama,Dusun,Umur,Berat,Tinggi,Status,Tanggal\n";

    const rows = filteredData
      .map(
        (d) =>
          `${d.nama},${d.dusun},${d.umur},${d.berat},${d.tinggi},${d.status},${d.tanggal}`,
      )
      .join("\n");

    const csvContent = headers + rows;

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.setAttribute(
      "download",
      `laporan_${filterTanggal || "semua_data"}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // EXPORT PDF
  const exportPDF = () => {
    const printContent = document.querySelector(".print-area").innerHTML;

    const newWindow = window.open("", "", "width=900,height=700");

    newWindow.document.write(`
      <html>
        <head>
          <title>Laporan</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            table, th, td { border: 1px solid #ddd; }
            th, td { padding: 8px; text-align: left; }
            h1, h2 { margin-bottom: 10px; }
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

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 5;

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);

  const totalPages = Math.ceil(filteredData.length / dataPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <MainLayouts type="laporan">
      <div className="p-6  min-h-screen">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="print-area">
            <h1 className="text-2xl font-bold mb-6">Laporan & Export Data</h1>

            {/* FILTER */}
            <div className="mb-6 flex gap-4 items-center">
              <input
                type="date"
                value={filterTanggal}
                onChange={(e) => setFilterTanggal(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm"
              />

              {filterTanggal && (
                <button
                  onClick={() => setFilterTanggal("")}
                  className="text-sm bg-gray-100 px-3 py-2 rounded-lg"
                >
                  Reset Filter
                </button>
              )}

              <button
                onClick={exportCSV}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Export Excel
              </button>

              <button
                onClick={exportPDF}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Export PDF
              </button>
            </div>

            {/* SUMMARY */}

            {/* REKAP DUSUN */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg mb-5">
                Laporan Data Balita
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Orang Tua</th>
                      <th className="px-4 py-3">Jenis Kelamin</th>
                      <th className="px-4 py-3">Tempat & Tanggal Lahir</th>
                      <th className="px-4 py-3">Alamat</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {currentData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.nama}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.orangtua}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.jk}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.TTL}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.alamat}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500 ml-3 ">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <div className="flex gap-2 mr-5 ">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg mb-5">
                Laporan Data Penimbangan
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Umur Balita</th>
                      <th className="px-4 py-3">Tanggal Penimbangan</th>
                      <th className="px-4 py-3 text-center">Posyandu</th>
                      <th className="px-4 py-3">Berat Badan(kg)</th>
                      <th className="px-4 py-3">Tinggi Badan(cm)</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.nama}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.umur} Bulan
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.tanggal}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.Posyandu}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.berat}kg
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.tinggi}cm
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500 ml-3 ">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <div className="flex gap-2 mr-5 ">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg mb-5">
                Laporan Data Deteksi
              </h2>
              <div className="overflow-x-auto rounded-xl border border-gray-200 text-center">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Tanggal Deteksi</th>
                      <th className="px-4 py-3">Berat Badan(kg)</th>
                      <th className="px-4 py-3">Tinggi Badan(cm)</th>
                      <th className="px-4 py-3">Z-Score TB/U</th>
                      <th className="px-4 py-3">Z-Score BB/U</th>
                      <th className="px-4 py-3">Z-Score TB/BB</th>
                      <th className="px-4 py-3 text-center">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {filteredData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.nama}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.tanggal}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.berat}kg
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.tinggi}cm
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.tbu}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.bbu}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.tbbu}
                        </td>

                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {item.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500 ml-3 ">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <div className="flex gap-2 mr-5 ">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:bg-gray-700"
                    }`}
                  >
                    Previous
                  </button>

                  <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
