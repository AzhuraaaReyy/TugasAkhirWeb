import { useState, useMemo, useEffect } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import { FaEye, FaTrash } from "react-icons/fa";
import Pagination from "@/components/Pagination/pagination";
import api from "@/services/api";
import { Link } from "react-router-dom";
import { Atom } from "react-loading-indicators";
const RiwayatdanGrafik = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/deteksi");
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

  const balitaUnik = useMemo(() => {
    const map = new Map();
    for (const item of data) {
      const key = item.balita_id ?? item.id;
      const ada = map.get(key);
      if (!ada || new Date(item.tgl_deteksi) > new Date(ada.tgl_deteksi)) {
        map.set(key, item);
      }
    }
    return Array.from(map.values());
  }, [data]);

  const filteredData = useMemo(() => {
    const q = search.toLowerCase();
    return balitaUnik.filter((item) =>
      (item.name || "").toLowerCase().includes(q),
    );
  }, [balitaUnik, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

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

  return (
    <MainLayouts type="riwayatdangrafik">
      <div className="relative min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 space-y-8">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <Atom color="#10b981" size="medium" text="Memuat..." />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800">
            Riwayat Deteksi
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Daftar balita yang sudah pernah ditimbang/dideteksi. Klik ikon mata
            untuk melihat riwayat pemeriksaan lengkap balita tersebut.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari nama balita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-4 sm:p-6 lg:p-8 mb-10 border border-gray-300 border-2 ">
            <div className="overflow-x-auto rounded-xl border border-gray-200 hide-scrollbar">
              <table className="w-full min-w-[640px] text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama Balita</th>
                    <th className="px-4 py-3">Pemeriksaan Terakhir</th>
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
                        <td className="px-4 py-3 text-gray-500">
                          {startIndex + index + 1}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {item.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
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
                              to={`/kader/lihatriwayat/${item.balita_id}`}
                              className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                              title="Lihat riwayat lengkap balita"
                            >
                              <FaEye size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                              title="Hapus pemeriksaan terakhir ini"
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
