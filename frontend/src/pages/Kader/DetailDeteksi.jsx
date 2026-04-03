import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayouts from "../../layouts/MainLayouts";

export default function DetailDeteksi() {
  const location = useLocation();
  const navigate = useNavigate();

  // Ambil hasil dari state router
  const { hasil, metode } = location.state || {};

  useEffect(() => {
    if (!hasil) {
      // Jika user akses langsung tanpa data, redirect ke halaman deteksi
      navigate("/kader/deteksidini");
    }
  }, [hasil, navigate]);

  if (!hasil) return null;

  return (
    <MainLayouts type="deteksidini">
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 border border-gray-300 border-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Hasil Deteksi Dini
          </h1>
          <p className="text-sm text-gray-500">
            Berikut adalah hasil analisis pertumbuhan balita berdasarkan data
            yang Anda masukkan.
          </p>

          {/* Info Balita */}
          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{hasil.name}</p>
              <p className="text-sm text-gray-600">Nama</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{hasil.umur} bulan</p>
              <p className="text-sm text-gray-600">Usia</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{hasil.tanggal_deteksi}</p>
              <p className="text-sm text-gray-600">Tanggal Deteksi</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{hasil.tb} cm</p>
              <p className="text-sm text-gray-600">Tinggi</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{hasil.bb} kg</p>
              <p className="text-sm text-gray-600">Berat</p>
            </div>
          </div>

          {/* Z-Score dan Status */}
          <div className="grid md:grid-cols-3 gap-6 text-center mt-6">
            {metode === "stunting" && (
              <div className="bg-blue-100 p-6 rounded-2xl shadow-lg">
                <p className="font-bold text-xl">{hasil.zscore_tbu}</p>
                <p className="text-sm text-gray-500 mb-2">Z-Score TB/U</p>
                <p
                  className={`font-semibold mt-2 px-3 py-1 rounded-full inline-block ${hasil.status_tbu.warna}`}
                >
                  {hasil.status_tbu.status}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {hasil.status_tbu.keterangan}
                </p>
              </div>
            )}
            {metode === "wasting" && (
              <div className="bg-orange-100 p-6 rounded-2xl shadow-lg">
                <p className="font-bold text-xl">{hasil.zscore_bbtb}</p>
                <p className="text-sm text-gray-500 mb-2">Z-Score TB/BB</p>
                <p
                  className={`font-semibold mt-2 px-3 py-1 rounded-full inline-block ${hasil.status_bb_tb.warna}`}
                >
                  {hasil.status_bb_tb.status}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {hasil.status_bb_tb.keterangan}
                </p>
              </div>
            )}
            {metode === "underweight" && (
              <div className="bg-purple-100 p-6 rounded-2xl shadow-lg">
                <p className="font-bold text-xl">{hasil.zscore_bbu}</p>
                <p className="text-sm text-gray-500 mb-2">Z-Score BB/U</p>
                <p
                  className={`font-semibold mt-2 px-3 py-1 rounded-full inline-block ${hasil.status_bbu.warna}`}
                >
                  {hasil.status_bbu.status}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {hasil.status_bbu.keterangan}
                </p>
              </div>
            )}
          </div>

          {/* Rekomendasi */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-3">Rekomendasi</h2>
            <ul className="list-disc list-inside space-y-2">
              {metode === "stunting" &&
                hasil.rekomendasi_tbu.map((r, i) => (
                  <li key={i}>
                    <span
                      className={`px-3 py-1 rounded-md ${hasil.status_tbu.warna} text-white`}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              {metode === "wasting" &&
                hasil.rekomendasi_bbtb.map((r, i) => (
                  <li key={i}>
                    <span
                      className={`px-3 py-1 rounded-md ${hasil.status_bb_tb.warna} text-white`}
                    >
                      {r}
                    </span>
                  </li>
                ))}
              {metode === "underweight" &&
                hasil.rekomendasi_bbu.map((r, i) => (
                  <li key={i}>
                    <span
                      className={`px-3 py-1 rounded-md ${hasil.status_bbu.warna} text-white`}
                    >
                      {r}
                    </span>
                  </li>
                ))}
            </ul>
            <div className="text-xs text-gray-400 italic mt-4">
              *Hasil ini merupakan skrining awal dan tidak menggantikan
              diagnosis medis.
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate(-1)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              Kembali ke Deteksi
            </button>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
