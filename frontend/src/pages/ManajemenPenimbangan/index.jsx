import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ManajemenPenimbangan = () => {
  const [data] = useState([
    {
      id: 1,
      nama: "Aisyah",
      umur: "11",
      tinggi: "11",
      berat: "10",
      tanggal: "2004-01-12",
      zbbu: "-1.00",
      jk: "Perempuan",
      ztbu: "-2.00",
      zbbtb: "-3.00 ",
    },
    {
      id: 1,
      nama: "Rafi",
      umur: "11",
      tinggi: "11",
      berat: "10",
      tanggal: "2004-01-12",
      zbbu: "-1.00",
      jk: "Laki-Laki",
      ztbu: "-2.00",
      zbbtb: "-3.00 ",
    },
    {
      id: 1,
      nama: "Putri",
      umur: "11",
      tinggi: "11",
      berat: "10",
      tanggal: "2004-01-12",
      zbbu: "-1.00",
      jk: "Perempuan",
      ztbu: "-2.00",
      zbbtb: "-3.00 ",
    },
  ]);

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

          {/* TABS */}
          <div className="flex gap-3 mb-6">
            <button className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow">
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
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari nama balita..."
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none">
              <option>Pilih Posyandu</option>
              <option>Melati 1</option>
              <option>Anggrek 2</option>
            </select>

            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Search
            </button>

            <div className="ml-auto">
              <Link
                to="/createpenimbangan"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Tambah Data
              </Link>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Nama Balita</th>
                  <th className="px-4 py-3">Umur Balita</th>
                  <th className="px-4 py-3">Jenis Kelamin</th>
                  <th className="px-4 py-3">Tanggal Penimbangan</th>
                  <th className="px-4 py-3">Berat Badan(kg)</th>
                  <th className="px-4 py-3">Tinggi Badan(cm)</th>
                  <th className="px-4 py-3">ZS BB/U</th>
                  <th className="px-4 py-3">ZS TB/U</th>
                  <th className="px-4 py-3">ZS BB/TB</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-700">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {item.nama}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {item.umur} tahun
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.jk === "Perempuan"
                            ? "bg-pink-100 text-pink-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.jk}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.tanggal}</td>
                    <td className="px-4 py-3 text-gray-600">{item.berat}kg</td>
                    <td className="px-4 py-3 text-gray-600">{item.tinggi}cm</td>

                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {item.zbbu}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {item.ztbu}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {item.zbbtb}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        {/* Detail */}
                        <Link
                          to="/detailpenimbangan"
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition"
                        >
                          <FaEye size={14} />
                        </Link>

                        {/* Edit */}
                        <Link
                          to="/updatepenimbangan"
                          className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg transition"
                        >
                          <FaEdit size={14} />
                        </Link>

                        {/* Hapus */}
                        <button className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition">
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-end items-center gap-2 mt-6">
            <button className="px-3 py-1 border rounded-md text-gray-500 hover:bg-gray-100">
              &lt;
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
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

export default ManajemenPenimbangan;
