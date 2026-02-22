import { useState } from "react";
import MainLayouts from "../../../layouts/MainLayouts";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const ManajemenBalita = () => {
  const [data] = useState([
    {
      id: 1,
      nama: "Aisyah",
      orangtua: "Melati",
      tanggal: "2024-01-12",
      tempatlahir: "Semarang",
      posyandu: "Posyandu 1",
      jk: "Perempuan",
      alamat: "Soka RT02/04 Kecamatan Ungaran Barat",
    },
    {
      id: 2,
      nama: "Rafi",
      orangtua: "Mawar",
      tanggal: "2004-01-12",
      tempatlahir: "Ungaran",
      posyandu: "Posyandu 2",
      jk: "Laki-Laki",
      alamat: "Soka RT02/04 Kecamatan Ungaran Barat",
    },
    {
      id: 3,
      nama: "Zahra",
      orangtua: "Matahari",
      tanggal: "2020-01-12",
      tempatlahir: "Lerep",
      posyandu: "Posyandu 3",
      jk: "Perempuan",
      alamat: "Soka RT02/04 Kecamatan Ungaran Barat",
    },
  ]);

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
                to="/createmanajemenbalita"
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
                  <th className="px-4 py-3">Orang Tua</th>
                  <th className="px-4 py-3">JK</th>
                  <th className="px-4 py-3">TTL</th>
                  <th className="px-4 py-3">Alamat</th>
                  <th className="px-4 py-3">Posyandu</th>
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

                    <td className="px-4 py-3 text-gray-600">{item.orangtua}</td>

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

                    <td className="px-4 py-3 text-gray-600">
                      {item.tempatlahir}, {item.tanggal}
                    </td>

                    <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                      {item.alamat}
                    </td>

                    <td className="px-4 py-3">
                      <span className="bg-emerald-100 text-emerald-600 px-2 py-1 rounded-md text-xs">
                        {item.posyandu}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        {/* Detail */}
                        <Link
                          to="/detailmanajemenbalita"
                          className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition"
                        >
                          <FaEye size={14} />
                        </Link>

                        {/* Edit */}
                        <Link
                          to="/updatemanajemenbalita"
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

export default ManajemenBalita;
