import { useState } from "react";
import MainLayouts from "../../../layouts/MainLayouts";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { useEffect } from "react";
import api from "../../../services/api";
import Pagination from "@/components/Pagination/pagination";
const ManajemenPenimbangan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/penimbangans"); // endpoint index
        setData(res.data.data || res.data || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete balita
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data?")) return;

    try {
      await api.delete(`/penimbangans/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
  };

  //filter
  const filteredData = data.filter((item) => {
    const nama = item.nama_balita || "";
    const tgl = item.tgl_penimbangan || "";

    const matchSearch = nama.toLowerCase().includes(search.toLowerCase());

    const matchTanggal = tanggal === "" || tgl.startsWith(tanggal);

    return matchSearch && matchTanggal;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);

  if (loading) {
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  }
  return (
    <MainLayouts type="manajemenbalita">
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Manajemen Penimbangan Balita
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola pengukuran dan penimbangan balita.
            </p>
          </div>

          {/* FILTER SECTION */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
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

            <div className="ml-auto">
              <Link
                to="/kader/createpenimbangan"
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-700"
              >
                Tambah Data
              </Link>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama Balita</th>
                  <th className="px-4 py-3">Umur Balita</th>
                  <th className="px-4 py-3">Tanggal Penimbangan</th>
                  <th className="px-4 py-3">Berat Badan(kg)</th>
                  <th className="px-4 py-3">Tinggi Badan(cm)</th>
                  <th className="px-4 py-3">Lingkar Kepala(cm)</th>
                  <th className="px-4 py-3">Lingkar Lengan Atas(cm)</th>
                  <th className="px-4 py-3">Dicatat Oleh</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-center">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-gray-400">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.nama_balita || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.umur || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.tgl_penimbangan
                          ? new Date(item.tgl_penimbangan).toLocaleDateString(
                              "id-ID",
                            )
                          : "-"}
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {item.berat || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.tinggi || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.lingkar_kepala || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.lingkar_lengan || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.nama_kader || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/kader/detailpenimbangan/${item.id}`}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                          >
                            <FaEye size={14} />
                          </Link>

                          <Link
                            to={`/kader/updatepenimbangan/${item.id}`}
                            className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg"
                          >
                            <FaEdit size={14} />
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
    </MainLayouts>
  );
};

export default ManajemenPenimbangan;
