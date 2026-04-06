import { useState } from "react";

import MainLayouts from "../../layouts/MainLayouts";
import { useEffect } from "react";
import api from "@/services/api";
import Pagination from "@/components/Pagination/pagination";
import { exportExcel } from "@/utils/exportExcel";
import { exportPDF } from "@/utils/exportPDF";
export default function Laporan() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [, setLoading] = useState(false);

  const [balita, setBalita] = useState([]);
  const [penimbangan, setPenimbangan] = useState([]);
  const [deteksi, setDeteksi] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/laporan", {
          params: {
            page: currentPage,
            search: search,
            tanggal: tanggal,
          },
        });

        const result = res.data.penimbangan;

        setData(result.data);
        setCurrentPage(result.current_page);
        setTotalPages(result.last_page);
        setBalita(res.data.balita.data);
        setPenimbangan(res.data.penimbangan.data);
        setDeteksi(res.data.deteksi.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, search, tanggal]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, tanggal]);

  const statusWarnaTBU = {
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",
    "Pendek (stunted)": "bg-yellow-400 text-white",
    Normal: "bg-green-500 text-white",
    Tinggi: "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const statusWarnaBBU = {
    "Berat badan sangat kurang (severely underweight)": "bg-red-600 text-white",
    "Berat badan kurang (underweight)": "bg-yellow-400 text-white",
    "Berat badan normal": "bg-green-500 text-white",
    "Risiko Berat badan lebih": "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const statusWarnaBBTB = {
    "Gizi buruk (severely wasted)": "bg-red-600 text-white",
    "Gizi kurang (wasted)": "bg-yellow-400 text-white",
    "Gizi baik (normal)": "bg-green-500 text-white",
    "Berisiko gizi lebih (possible risk of overweight)":
      "bg-blue-300 text-white",
    "Gizi lebih (overweight)": "bg-blue-500 text-white",
    "Obesitas (obese)": "bg-purple-600 text-white",
    default: "bg-gray-300 text-black",
  };

  const baseStyle =
    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

  return (
    <MainLayouts type="laporan">
      <div className="p-6  min-h-screen">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="print-area">
            <h1 className="text-2xl font-bold mb-6">Laporan & Export Data</h1>

            {/* FILTER */}
            <div className="mb-6 flex gap-4 items-center">
              <input
                type="text"
                placeholder="Cari nama balita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />

              {tanggal && (
                <button
                  onClick={() => setTanggal("")}
                  className="text-sm bg-gray-100 px-3 py-2 rounded-lg"
                >
                  Reset Filter
                </button>
              )}

              <button
                onClick={() => exportExcel(balita, penimbangan, deteksi)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Export Excel
              </button>

              <button
                onClick={() => exportPDF(balita, penimbangan, deteksi)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Export PDF
              </button>
            </div>

            {/* SUMMARY */}

            {/* REKAP DUSUN */}
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg ">Laporan Data Balita</h2>
              <p className="text-gray-500 text-sm mb-5">
                Data identitas balita yang terdaftar pada sistem Posyandu
              </p>

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
                      <th className="px-4 py-3">Posyandu</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {data.length > 0 ? (
                      balita.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {(currentPage - 1) * 10 + index + 1}
                          </td>

                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.orangtua}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.jk}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.tmp_lahir},{" "}
                            {new Date(item.tgl_lahir).toLocaleDateString(
                              "id-ID",
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.alamat}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.posyandu}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-6 text-gray-400"
                        >
                          Data tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500 ml-3 ">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">
                Laporan Data Penimbangan
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Data monitoring berat dan tinggi badan balita.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Umur Balita</th>
                      <th className="px-4 py-3">Tanggal Penimbangan</th>
                      <th className="px-4 py-3">Berat Badan(kg)</th>
                      <th className="px-4 py-3">Tinggi Badan(cm)</th>
                      <th className="px-4 py-3">Lingkar Lengan Atas(cm)</th>
                      <th className="px-4 py-3">Lingkar Kepala(cm)</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 text-center">
                    {data.length > 0 ? (
                      penimbangan.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {(currentPage - 1) * 10 + index + 1}
                          </td>

                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.balita}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.umur} Bulan
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {new Date(item.tanggal).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.berat}kg
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.tinggi}cm
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.lingkar_lengan}cm
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.lingkar_kepala}cm
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
              </div>
              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500 ml-3 ">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-lg p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">Laporan Data Deteksi</h2>
              <p className="text-gray-500 text-sm mb-5">
                Hasil klasifikasi status gizi balita berdasarkan indikator
                antropometri.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 text-center">
                <table className="w-full text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Tanggal Deteksi</th>
                      <th className="px-4 py-3">Z-Score TB/U</th>
                      <th className="px-4 py-3">Z-Score BB/U</th>
                      <th className="px-4 py-3">Z-Score TB/BB</th>
                      <th className="px-4 py-3 text-center">
                        Status Stunting (TB / U)
                      </th>
                      <th className="px-4 py-3 text-center">
                        Status Wasting (BB / TB){" "}
                      </th>
                      <th className="px-4 py-3 text-center">
                        Status Underweight (BB / U){" "}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 ">
                    {data.length > 0 ? (
                      deteksi.map((item, index) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {(currentPage - 1) * 10 + index + 1}
                          </td>

                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.balitaname}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {new Date(item.tanggal).toLocaleDateString("id-ID")}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.zscore_tb_u}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.zscore_bb_u}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.zscore_tb_bb}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            <span
                              className={`${baseStyle} ${
                                statusWarnaTBU[item.status_tb_u] ||
                                "bg-gray-300 text-black"
                              }`}
                            >
                              {item.status_tb_u || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            <span
                              className={`${baseStyle} ${
                                statusWarnaBBTB[item.status_tb_bb] ||
                                "bg-gray-300 text-black"
                              }`}
                            >
                              {item.status_tb_bb || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            <span
                              className={`${baseStyle} ${
                                statusWarnaBBU[item.status_bb_u] ||
                                "bg-gray-300 text-black"
                              }`}
                            >
                              {item.status_bb_u || "-"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="text-center py-6 text-gray-400"
                        >
                          Data tidak ditemukan
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* PAGINATION */}
              <div className="flex justify-between items-center mt-6">
                <p className="text-sm text-gray-500 ml-3 ">
                  Halaman {currentPage} dari {totalPages}
                </p>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
