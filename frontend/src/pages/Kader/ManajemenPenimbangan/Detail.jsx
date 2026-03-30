import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../../../services/api";
const DetailPenimbangan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    balita_id: "",
    umur: "",
    tgl_penimbangan: "",
    berat: "",
    tinggi: "",
    lingkar_kepala: "",
    lingkar_lengan: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
      const res = await api.get("/user");
      setUser(res.data);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/penimbangans/detail/${id}`);
        const data = res.data.data;

        setForm({
          balita_id: String(data.balita_id || ""),
          nama_balita: data.nama_balita || "",
          umur: data.umur || "",
          tgl_penimbangan: data.tgl_penimbangan?.slice(0, 10) || "",
          berat: data.berat || "",
          tinggi: data.tinggi || "",
          lingkar_kepala: data.lingkar_kepala || "",
          lingkar_lengan: data.lingkar_lengan || "",
        });
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  }

  return (
    <MainLayouts type="detailpenimbangan">
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* HEADER */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Tambah Data Penimbangan
            </h1>
            <p className="text-sm text-gray-500">
              Isi data penimbangan balita dengan lengkap.
            </p>
          </div>

          {/* FORM */}

          {/* GRID 2 KOLOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Balita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Balita
              </label>
              <input
                type="text"
                name="nama_balita"
                readOnly
                value={form.nama_balita}
                placeholder="Contoh: Aisyah Putri"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Nama Orang Tua */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Umur
              </label>
              <input
                type="text"
                name="umur"
                readOnly
                value={form.umur}
                placeholder="Contoh: Ibu Melati"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Penimbangan
              </label>
              <input
                type="date"
                readOnly
                name="tgl_penimbangan"
                value={form.tgl_penimbangan}
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Berat Badan (kg)
              </label>
              <input
                type="number"
                name="berat"
                value={form.berat}
                readOnly
                step="0.01"
                min="0"
                placeholder="Contoh: 12.5"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tinggi Badan (cm)
              </label>
              <input
                type="number"
                name="tinggi"
                readOnly
                value={form.tinggi}
                step="0.01"
                min="0"
                placeholder="Contoh: 85.3"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Petugas yang mencatat
              </label>
              <input
                type="text"
                value={user?.name || ""}
                readOnly
                className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg px-4 text-sm"
              />
            </div>
          </div>

          {/* BUTTON SECTION */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/kader/manajemenpenimbangan")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600  transition hover:bg-emerald-600 hover:text-white"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};

export default DetailPenimbangan;
