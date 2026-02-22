import React from "react";
import MainLayouts from "../../layouts/MainLayouts";
import {
  User,
  Calendar,
  Weight,
  Ruler,
  Activity,
  BookOpen,
  BarChart3,
  FileText,
} from "lucide-react";

const DashboardOrangTua = () => {
  const parentName = "Ibu Siti";
  const today = new Date().toLocaleDateString("id-ID");

  const child = {
    name: "Ahmad Rizky",
    gender: "Laki-laki",
    birthDate: "2022-05-10",
    age: "3 Tahun 9 Bulan",
  };

  const growth = {
    status: "Berisiko",
    weight: "11.2 kg",
    height: "84 cm",
    lastCheck: "15 Februari 2026",
    recommendation:
      "Disarankan untuk meningkatkan asupan gizi dan berkonsultasi dengan kader posyandu.",
  };

  const statusStyle =
    growth.status === "Normal"
      ? "bg-green-100 text-green-700"
      : growth.status === "Berisiko"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <MainLayouts type="dashboardorangtua">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-6">
        
        {/* Header Modern */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Halo, {parentName} 👋
            </h1>
            <p className="text-gray-500 text-sm flex items-center gap-2 mt-1">
              <Calendar size={16} /> {today}
            </p>
          </div>

          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow">
            Logout
          </button>
        </div>

        {/* Profil Anak */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} /> Profil Anak
          </h2>

          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-medium">Nama:</span> {child.name}</p>
            <p><span className="font-medium">Jenis Kelamin:</span> {child.gender}</p>
            <p><span className="font-medium">Tanggal Lahir:</span> {child.birthDate}</p>
            <p><span className="font-medium">Usia:</span> {child.age}</p>
          </div>
        </div>

        {/* Status Pertumbuhan Modern */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Activity size={20} /> Status Pertumbuhan
            </h2>
            <span className={`px-4 py-1 text-sm rounded-full font-medium ${statusStyle}`}>
              {growth.status}
            </span>
          </div>

          <p className="text-gray-600 mb-2">
            Berdasarkan pengukuran terakhir, kondisi pertumbuhan anak termasuk
            kategori <span className="font-semibold">{growth.status}</span>.
          </p>
          <p className="text-sm text-gray-500">{growth.recommendation}</p>
        </div>

        {/* Ringkasan Pengukuran */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <Weight className="mx-auto mb-2 text-blue-500" />
            <p className="text-gray-500 text-sm">Berat Badan</p>
            <p className="text-xl font-bold text-gray-800">{growth.weight}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <Ruler className="mx-auto mb-2 text-green-500" />
            <p className="text-gray-500 text-sm">Tinggi Badan</p>
            <p className="text-xl font-bold text-gray-800">{growth.height}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition">
            <Calendar className="mx-auto mb-2 text-purple-500" />
            <p className="text-gray-500 text-sm">Tanggal Penimbangan</p>
            <p className="text-xl font-bold text-gray-800">{growth.lastCheck}</p>
          </div>
        </div>

        {/* Quick Actions Lebih Modern */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Menu Cepat</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <button className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition text-center">
              <FileText className="mx-auto mb-2 text-blue-500" />
              <p className="font-medium">Riwayat</p>
            </button>

            <button className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition text-center">
              <BarChart3 className="mx-auto mb-2 text-indigo-500" />
              <p className="font-medium">Grafik</p>
            </button>

            <button className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition text-center">
              <Activity className="mx-auto mb-2 text-purple-500" />
              <p className="font-medium">Detail Hasil</p>
            </button>

            <button className="bg-white shadow-md rounded-2xl p-5 hover:shadow-lg transition text-center">
              <BookOpen className="mx-auto mb-2 text-green-500" />
              <p className="font-medium">Edukasi Gizi</p>
            </button>
          </div>
        </div>

      </div>
    </MainLayouts>
  );
};

export default DashboardOrangTua;
