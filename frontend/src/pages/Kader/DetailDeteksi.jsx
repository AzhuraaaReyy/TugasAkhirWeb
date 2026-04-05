import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayouts from "../../layouts/MainLayouts";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export default function DetailDeteksi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    umur: "",
    tgl_deteksi: "",
    tinggi: "",
    berat: "",
    zscore_tbu: "",
    zscore_bbu: "",
    zscore_bbtb: "",
    status_tbu: "",
    status_bbu: "",
    status_bbtb: "",
    keterangan: "",
    rekomendasi: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/detaildeteksi/${id}`);
        const data = res.data.data;

        setForm({
          name: data.name || "",
          umur: data.umur || "",
          tgl_deteksi: data.tgl_deteksi?.slice(0, 10) || "",
          berat: data.berat || "",
          tinggi: data.tinggi || "",
          zscore_tbu: data.zscore_tbu || "",
          zscore_bbu: data.zscore_bbu || "",
          zscore_bbtb: data.zscore_bbtb || "",
          status_tbu: data.status_tbu || "",
          status_bbu: data.status_bbu || "",
          status_bbtb: data.status_bbtb || "",
          keterangan: data.keterangan || "",
          rekomendasi: data.rekomendasi || "",
        });
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  //warna
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
    "Risiko Berat badan lebih": "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const statusWarnaBBTB = {
    "Gizi buruk (severely wasted)": "bg-red-600 text-white",
    "Gizi kurang (wasted)": "bg-yellow-400 text-white",
    "Gizi baik (normal)": "bg-green-500 text-white",
    "Berisiko gizi lebih (possible risk of overweight)":
      "bg-blue-300 text-white",
    "Gizi lebih (overweight)": "bg-blue-500 text-white",
    "Obesitas (obese)": "bg-purple-600 text-white",
    default: "bg-gray-300 text-black",
  };

  const baseStyle =
    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

  if (loading) {
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  }

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
              <p className="font-bold">{form.name}</p>
              <p className="text-sm text-gray-600">Nama</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{form.umur} bulan</p>
              <p className="text-sm text-gray-600">Usia</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{form.tgl_deteksi}</p>
              <p className="text-sm text-gray-600">Tanggal Deteksi</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{form.tinggi} cm</p>
              <p className="text-sm text-gray-600">Tinggi</p>
            </div>
            <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 shadow-lg">
              <p className="font-bold">{form.berat} kg</p>
              <p className="text-sm text-gray-600">Berat</p>
            </div>
          </div>

          {/* Z-Score dan Status */}
          <div className="grid md:grid-cols-3 gap-6 text-center mt-6">
            <div className="bg-blue-100 p-6 rounded-2xl shadow-lg">
              <p className="font-bold text-xl">{form.zscore_tbu}</p>
              <p className="text-sm text-gray-500 mb-2">Z-Score TB/U</p>
              <p
                className={`${baseStyle} ${
                  statusWarnaTBU[form.status_tbu] || statusWarnaTBU.default
                } inline-block`}
              >
                {form.status_tbu}
              </p>
            </div>

            <div className="bg-orange-100 p-6 rounded-2xl shadow-lg">
              <p className="font-bold text-xl">{form.zscore_bbtb}</p>
              <p className="text-sm text-gray-500 mb-2">Z-Score TB/BB</p>
              <p
                className={`${baseStyle} ${
                  statusWarnaBBTB[form.status_bbtb] || statusWarnaBBTB.default
                } inline-block`}
              >
                {form.status_bbtb}
              </p>
            </div>

            <div className="bg-purple-100 p-6 rounded-2xl shadow-lg">
              <p className="font-bold text-xl">{form.zscore_bbu}</p>
              <p className="text-sm text-gray-500 mb-2">Z-Score BB/U</p>
              <p
                className={`${baseStyle} ${
                  statusWarnaBBU[form.status_bbu] || statusWarnaBBU.default
                } inline-block`}
              >
                {form.status_bbu}
              </p>
            </div>
          </div>

          {/* Rekomendasi */}
          {/* Keterangan dan Rekomendasi */}
          <div className="mt-6 grid md:grid-cols-1 gap-6">
            <div className="bg-emerald-100 p-6 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="font-extrabold text-gray-700 mb-2">
                Keterangan :
              </h3>
              <p className="text-gray-600 italic">{form.keterangan || "-"}</p>
            </div>
            <div className="bg-emerald-100 p-6 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="font-extrabold text-gray-700 mb-2">
                Rekomendasi :
              </h3>
              <p className="text-gray-600 italic">{form.rekomendasi || "-"}</p>
            </div>
          </div>

          {/* Catatan tambahan */}
          <div className="text-xs text-gray-400 italic mt-4">
            *Hasil ini merupakan skrining awal dan tidak menggantikan diagnosis
            medis.
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
