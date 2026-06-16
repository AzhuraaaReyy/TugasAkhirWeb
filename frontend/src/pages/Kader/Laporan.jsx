import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import { useEffect } from "react";
import api from "@/services/api";
import Pagination from "@/components/Pagination/pagination";
import { exportExcel } from "@/utils/exportExcel";
import { exportPDF } from "@/utils/exportPDF";
import { Atom } from "react-loading-indicators";
export default function Laporan() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(false);
  const [balita, setBalita] = useState([]);
  const [deteksi, setDeteksi] = useState([]);

  // ===== Tambahan: data rujukan, belum ditimbang, dan bermasalah gizi =====
  const [rujukan, setRujukan] = useState([]);
  const [belumTimbang, setBelumTimbang] = useState([]);
  
  // Paginasi lokal masing-masing tabel tambahan (independen dari paginasi utama).
  const [pageRujukan, setPageRujukan] = useState(1);
  const [pageBelum, setPageBelum] = useState(1);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get("/laporan", {
          params: { page: currentPage, search: search, tanggal: tanggal },
        });
        const balitaPg = res.data.balita;
        setBalita(balitaPg?.data || []);
        setDeteksi(res.data.deteksi?.data || []);
        setCurrentPage(balitaPg?.current_page || 1);
        setTotalPages(balitaPg?.last_page || 1);

        // Tambahan: dukung respons berbentuk array biasa maupun objek paginasi.
        setRujukan(res.data.rujukan?.data || res.data.rujukan || []);
        setBelumTimbang(
          res.data.belum_timbang?.data || res.data.belum_timbang || [],
        );
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

  // Tambahan: reset paginasi lokal tabel tambahan saat filter berubah.
  useEffect(() => {
    setPageRujukan(1);
    setPageBelum(1);
   
  }, [search, tanggal, deteksi]);

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
    "Risiko berat badan lebih": "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const statusWarnaBBTB = {
    "Gizi buruk (severely wasted)": "bg-red-600 text-white",
    "Gizi kurang (wasted)": "bg-yellow-400 text-white",
    "Gizi baik (normal)": "bg-green-500 text-white",
    "Berisiko gizi lebih (possible risk of overweight)":
      "bg-blue-500 text-white",
    "Gizi lebih (overweight)": "bg-blue-500 text-white",
    "Obesitas (obese)": "bg-purple-600 text-white",
    default: "bg-gray-300 text-black",
  };

  const baseStyle =
    "inline-block max-w-[180px] whitespace-normal break-words text-center leading-snug px-4 py-1.5 rounded-2xl text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

  // ===== Tambahan: helper paginasi lokal & penurunan data (fallback) =====
  const perPage = 10;
  const paginate = (arr = [], page = 1) =>
    arr.slice((page - 1) * perPage, page * perPage);
  const totalPagesOf = (arr = []) =>
    Math.max(1, Math.ceil((arr?.length || 0) / perPage));

  // Fallback bila backend belum mengirim daftar khusus: turunkan dari deteksi.
  const STATUS_NORMAL_TBU = ["Normal", "Tinggi"];
  const isRujukan = (d) =>
    d?.status_tb_u === "Sangat pendek (severely stunted)" ||
    ["Gizi buruk (severely wasted)", "Obesitas (obese)"].includes(
      d?.status_tb_bb,
    ) ||
    d?.status_bb_u === "Berat badan sangat kurang (severely underweight)";
 
  const alasanRujukan = (d) => {
    const a = [];
    if (d?.status_tb_u === "Sangat pendek (severely stunted)")
      a.push("stunting berat");
    if (d?.status_tb_bb === "Gizi buruk (severely wasted)")
      a.push("gizi buruk");
    if (d?.status_tb_bb === "Obesitas (obese)") a.push("obesitas");
    if (d?.status_bb_u === "Berat badan sangat kurang (severely underweight)")
      a.push("berat badan sangat kurang");
    return a.join(", ") || "perlu evaluasi lanjutan";
  };

  const rujukanData =
    (rujukan.length ? rujukan : deteksi.filter(isRujukan)) || [];

  const belumData = belumTimbang || [];

  return (
    <MainLayouts type="laporan">

      <div className=" p-4 sm:p-6 min-h-screen">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <Atom color="#10b981" size="medium" text="Memuat..." />
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <div className="print-area">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">
              Laporan & Export Data
            </h1>

            {/* FILTER */}
            <div className="mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-center">
              <input
                type="text"
                placeholder="Cari nama balita..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full sm:w-auto border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
              />
              {tanggal && (
                <button
                  onClick={() => setTanggal("")}
                  className="w-full sm:w-auto text-sm bg-gray-100 px-3 py-2 rounded-lg"
                >
                  Reset Filter
                </button>
              )}
              <button
                onClick={() => exportExcel(balita, [], deteksi)}
                className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Export Excel
              </button>
              <button
                onClick={() => exportPDF(balita, [], deteksi)}
                className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Export PDF
              </button>
            </div>

            {/* REKAP BALITA */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">Laporan Data Balita</h2>
              <p className="text-gray-500 text-sm mb-5">
                Data identitas balita yang terdaftar pada sistem Posyandu
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 hide-scrollbar">
                <table className="w-full min-w-[800px] text-sm text-left border-collapse">
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
                    {balita.length > 0 ? (
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
                            {item.tgl_lahir
                              ? new Date(item.tgl_lahir).toLocaleDateString(
                                  "id-ID",
                                )
                              : "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.alamat || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.posyandu}
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
              <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
                <p className="text-sm text-gray-500 ml-3">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>

            {/* PENIMBANGAN */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">
                Laporan Data Penimbangan
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Data monitoring umur, berat, dan tinggi badan balita dari hasil
                pemeriksaan.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 hide-scrollbar">
                <table className="w-full min-w-[700px] text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Umur Balita</th>
                      <th className="px-4 py-3">Tanggal Penimbangan</th>
                      <th className="px-4 py-3">Berat Badan(kg)</th>
                      <th className="px-4 py-3">Tinggi Badan(cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-center">
                    {deteksi.length > 0 ? (
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
              <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
                <p className="text-sm text-gray-500 ml-3">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>

            {/* DETEKSI */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">Laporan Data Deteksi</h2>
              <p className="text-gray-500 text-sm mb-5">
                Hasil klasifikasi status gizi balita berdasarkan indikator
                antropometri.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 text-center hide-scrollbar">
                <table className="w-full min-w-[1000px] text-sm text-left border-collapse">
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
                  <tbody className="divide-y divide-gray-200">
                    {deteksi.length > 0 ? (
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
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`${baseStyle} ${statusWarnaTBU[item.status_tb_u] || "..."}`}
                            >
                              {item.status_tb_u || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`${baseStyle} ${statusWarnaBBTB[item.status_tb_bb] || "..."}`}
                            >
                              {item.status_tb_bb || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`${baseStyle} ${statusWarnaBBU[item.status_bb_u] || "..."}`}
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
              <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
                <p className="text-sm text-gray-500 ml-3">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            </div>

            {/* ====== TAMBAHAN: DATA RUJUKAN ====== */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">Laporan Data Rujukan</h2>
              <p className="text-gray-500 text-sm mb-5">
                Balita dengan status gizi berat yang perlu dirujuk ke Puskesmas
                untuk penanganan lebih lanjut.
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 hide-scrollbar">
                <table className="w-full min-w-[1000px] text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Umur</th>
                      <th className="px-4 py-3">Tanggal Deteksi</th>
                      <th className="px-4 py-3 text-center">
                        Status Stunting (TB / U)
                      </th>
                      <th className="px-4 py-3 text-center">
                        Status Wasting (BB / TB)
                      </th>
                      <th className="px-4 py-3 text-center">
                        Status Underweight (BB / U)
                      </th>
                      <th className="px-4 py-3">Alasan Rujukan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-center">
                    {rujukanData.length > 0 ? (
                      paginate(rujukanData, pageRujukan).map((item, index) => (
                        <tr
                          key={item.id ?? index}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {(pageRujukan - 1) * perPage + index + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.balitaname}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.umur} Bulan
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.tanggal
                              ? new Date(item.tanggal).toLocaleDateString(
                                  "id-ID",
                                )
                              : "-"}
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`${baseStyle} ${statusWarnaTBU[item.status_tb_u] || statusWarnaTBU.default}`}
                            >
                              {item.status_tb_u || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`${baseStyle} ${statusWarnaBBTB[item.status_tb_bb] || statusWarnaBBTB.default}`}
                            >
                              {item.status_tb_bb || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 align-top">
                            <span
                              className={`${baseStyle} ${statusWarnaBBU[item.status_bb_u] || statusWarnaBBU.default}`}
                            >
                              {item.status_bb_u || "-"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-[200px] whitespace-normal break-words">
                            {item.alasan || alasanRujukan(item)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="text-center py-6 text-gray-400"
                        >
                          Tidak ada balita yang perlu dirujuk
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
                <p className="text-sm text-gray-500 ml-3">
                  Halaman {pageRujukan} dari {totalPagesOf(rujukanData)}
                </p>
                <Pagination
                  currentPage={pageRujukan}
                  totalPages={totalPagesOf(rujukanData)}
                  onPageChange={(page) => setPageRujukan(page)}
                />
              </div>
            </div>

            {/* ====== TAMBAHAN: DATA BELUM DITIMBANG ====== */}
            <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 mb-10 border border-gray-200 border-2">
              <h2 className="font-extrabold text-lg">
                Laporan Data Belum Ditimbang
              </h2>
              <p className="text-gray-500 text-sm mb-5">
                Balita terdaftar yang belum melakukan penimbangan pada periode
                ini (perlu dikirim dari backend pada key{" "}
                <code>belum_timbang</code>).
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200 hide-scrollbar">
                <table className="w-full min-w-[800px] text-sm text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                    <tr>
                      <th className="px-4 py-3">No</th>
                      <th className="px-4 py-3">Nama Balita</th>
                      <th className="px-4 py-3">Orang Tua</th>
                      <th className="px-4 py-3">Posyandu</th>
                      <th className="px-4 py-3">Terakhir Ditimbang</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-center">
                    {belumData.length > 0 ? (
                      paginate(belumData, pageBelum).map((item, index) => (
                        <tr
                          key={item.id ?? index}
                          className="hover:bg-gray-50 transition"
                        >
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {(pageBelum - 1) * perPage + index + 1}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.name || item.balitaname}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.orangtua || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.posyandu || "-"}
                          </td>
                          <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                            {item.terakhir_timbang
                              ? new Date(
                                  item.terakhir_timbang,
                                ).toLocaleDateString("id-ID")
                              : "Belum pernah ditimbang"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-6 text-gray-400"
                        >
                          Semua balita sudah ditimbang / data belum tersedia
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap justify-between items-center gap-3 mt-6">
                <p className="text-sm text-gray-500 ml-3">
                  Halaman {pageBelum} dari {totalPagesOf(belumData)}
                </p>
                <Pagination
                  currentPage={pageBelum}
                  totalPages={totalPagesOf(belumData)}
                  onPageChange={(page) => setPageBelum(page)}
                />
              </div>
            </div>

            {/* ====== TAMBAHAN: DATA ANAK BERMASALAH (BERAT / TINGGI BADAN) ====== */}
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
