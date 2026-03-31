import { useState, useEffect } from "react";
import MainLayouts from "../../../layouts/MainLayouts";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "@/services/api";
import Pagination from "@/components/Pagination/pagination";
const ManajemenBalita = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [posyandu, setPosyandu] = useState("");
  const [posyanduList, setPosyanduList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch balita
  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.get("/balitas"); // endpoint index
        setData(res.data.data || res.data || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalita();
  }, []);

  // Fetch posyandu list
  useEffect(() => {
    const fetchPosyandu = async () => {
      try {
        const res = await api.get("/posyandu");
        setPosyanduList(res.data.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosyandu();
  }, []);

  // Delete balita
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data?")) return;

    try {
      await api.delete(`/balitas/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
  };

  // Filter data sesuai search & posyandu
  const filteredData = data.filter((item) => {
    const matchSearch = (item.nama || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchPosyandu = posyandu === "" || (item.posyandu || "") === posyandu;

    return matchSearch && matchPosyandu;
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
              Manajemen Data Balita
            </h1>
            <p className="text-gray-500 text-sm">
              Kelola pencatatan dan perkembangan balita.
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

            <select
              value={posyandu}
              onChange={(e) => setPosyandu(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="">Semua Posyandu</option>
              {posyanduList.map((p) => (
                <option key={p.id} value={p.nama_posyandu}>
                  {p.nama_posyandu}
                </option>
              ))}
            </select>

            <div className="ml-auto">
              <Link
                to="/kader/createmanajemenbalita"
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
                  <th className="px-4 py-3">Orang Tua</th>
                  <th className="px-4 py-3">JK</th>
                  <th className="px-4 py-3">TTL</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3">Posyandu</th>
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
                        {item.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.orangtua || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.jk === "Perempuan"
                              ? "bg-emerald-100 text-emerald-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {item.jk || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.tmp_lahir},{" "}
                        {new Date(item.tgl_lahir).toLocaleDateString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.alamat || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {item.posyandu || "-"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-3">
                          <Link
                            to={`/kader/detailmanajemenbalita/${item.id}`}
                            className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                          >
                            <FaEye size={14} />
                          </Link>

                          <Link
                            to={`/kader/updatemanajemenbalita/${item.id}`}
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

export default ManajemenBalita;
