import { useState } from "react";
import MainLayouts from "../../../layouts/MainLayouts";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "@/services/api";
import { useEffect } from "react";
const ManajemenBalita = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [posyandu, setPosyandu] = useState("");
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

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data?")) return;

    try {
      await api.delete(`/balitas/${id}`);

      // ✅ hapus dari state (langsung update UI)
      setData((prev) => prev.filter((item) => item.id !== id));

      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
  };
  if (loading) {
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  }

  const filteredData = data.filter((item) => {
    return (
      item.nama?.toLowerCase().includes(search.toLowerCase()) &&
      (posyandu === "" || item.posyandu === posyandu)
    );
  });
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

          {/* TABS */}
          <div className="flex gap-3 mb-6">
            <button className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium shadow">
              Semua Data
            </button>
            <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">
              Posyandu Melati
            </button>
            <button className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200">
              Posyandu Anggrek
            </button>
          </div>

          {/* FILTER SECTION */}
          {/* FILTER */}
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
              <option value="Posyandu Melati">Posyandu Melati</option>
              <option value="Posyandu Anggrek">Posyandu Anggrek</option>
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
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-6 text-gray-400">
                      Data tidak ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 text-gray-500">{index + 1}</td>

                      <td className="px-4 py-3 text-gray-500">
                        {item.nama || "-"}
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
                        {item.tempatlahir},{" "}
                        {new Date(item.tanggal).toLocaleDateString("id-ID")}
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

          {/* PAGINATION */}
          <div className="flex justify-end items-center gap-2 mt-6">
            <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100">
              &lt;
            </button>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded-md">
              1
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
              2
            </button>
            <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
              3
            </button>
            <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default ManajemenBalita;
