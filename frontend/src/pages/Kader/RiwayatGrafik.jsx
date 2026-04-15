import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import { FaEye, FaTrash } from "react-icons/fa";
import Pagination from "@/components/Pagination/pagination";
import api from "@/services/api";
import { useEffect } from "react";
import { Link } from "react-router-dom";
const RiwayatdanGrafik = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/deteksi"); // endpoint index
        setData(res.data.data || res.data || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data?")) return;

    try {
      await api.delete(`/deteksi/delete/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
  };

  const filteredData = data.filter((item) => {
    const nama = item.name || "";

    const matchSearch = nama.toLowerCase().includes(search.toLowerCase());

    return matchSearch;
  });

  const statusWarna = {
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",
    "Pendek (stunted)": "bg-yellow-400 text-white",
    Normal: "bg-green-500 text-white",
    Tinggi: "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };

  const baseStyle =
    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);

  if (loading)
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  return (
    <MainLayouts type="riwayatdangrafik">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold tracking-tight  text-gray-800">
            Riwayat Deteksi
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Halaman ini menampilkan riwayat pemeriksaan dan hasil deteksi risiko
            stunting berdasarkan data pertumbuhan balita dari waktu ke waktu.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari nama balita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          {/* FORM INPUT */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-gray-300 border-2">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama Balita</th>
                    <th className="px-4 py-3">Tanggal Deteksi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-center">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-6 text-gray-400">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500">{startIndex + index + 1}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.tgl_deteksi
                            ? new Date(item.tgl_deteksi).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`${baseStyle} ${
                              statusWarna[item.status_tb_u] ||
                              "bg-gray-300 text-black"
                            }`}
                          >
                            {item.status_tb_u || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-3">
                            <Link
                              to={`/kader/detaildeteksi/${item.id}`}
                              className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                            >
                              <FaEye size={14} />
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default RiwayatdanGrafik;
