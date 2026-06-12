import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "../../../services/api";
import { Atom } from "react-loading-indicators";
const UpdatePenimbangan = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [balita, setBalita] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    balita_id: "",
    umur: "",
    tgl_deteksi: "",
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

  const getUmurFromBalita = (balitaId, tglPenimbangan) => {
    const selected = balita.find((b) => b.id === Number(balitaId));
    if (!selected || !selected.tgl_lahir || !tglPenimbangan) return 0;

    const tglLahir = new Date(selected.tgl_lahir);
    const tglTimbang = new Date(tglPenimbangan);

    let bulan =
      (tglTimbang.getFullYear() - tglLahir.getFullYear()) * 12 +
      (tglTimbang.getMonth() - tglLahir.getMonth());

    // OPTIONAL: kalau tanggal belum lewat dalam bulan itu
    if (tglTimbang.getDate() < tglLahir.getDate()) {
      bulan -= 1;
    }

    return bulan < 0 ? 0 : bulan;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newForm = { ...form, [name]: value };

    if (name === "balita_id" || name === "tgl_deteksi") {
      newForm.umur = getUmurFromBalita(
        name === "balita_id" ? value : form.balita_id,
        name === "tgl_deteksi" ? value : form.tgl_deteksi,
      );
    }

    setForm(newForm);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/penimbangans/detail/${id}`);
        const data = res.data.data;

        setForm({
          balita_id: String(data.balita_id || ""),
          umur: data.umur || "0",
          tgl_deteksi: data.tgl_deteksi?.slice(0, 10) || "",
          berat: data.berat || "",
          tinggi: data.tinggi || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.get("/balitas");
        setBalita(res.data.data || res.data || []);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchBalita();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/penimbangans/${id}`, form); // id dari params

      alert("Data berhasil diupdate");
      navigate("/kader/deteksidini");
    } catch (error) {
      console.error(error);
      alert("Gagal update data");
    }
  };

  return (
    <MainLayouts type="createpenimbangan">
      <div className="min-h-screen bg-slate-100 p-6 ">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
            <Atom color="#10b981" size="medium" text="Memuat..." />
          </div>
        )}
        <div className="max-w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* HEADER */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Update Data Penimbangan
            </h1>
            <p className="text-sm text-gray-500">
              Mengupdate data penimbangan balita dengan lengkap.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID 2 KOLOM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nama Balita */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Balita
                </label>
                <select
                  name="balita_id"
                  value={form.balita_id}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Balita</option>
                  {balita.map((bal) => (
                    <option key={bal.id} value={bal.id}>
                      {bal.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nama Orang Tua */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Umur (Bulan)
                </label>
                <input
                  type="text"
                  name="umur"
                  readOnly
                  value={form.umur}
                  onChange={handleChange}
                  placeholder="Contoh: Ibu Melati"
                  className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Penimbangan
                </label>
                <input
                  type="date"
                  name="tgl_deteksi"
                  value={form.tgl_deteksi}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  value={form.tinggi}
                  onChange={handleChange}
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
                onClick={() => navigate("/kader/deteksidini")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600  transition hover:bg-emerald-600 hover:text-white"
              >
                Kembali
              </button>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition"
                >
                  Edit Data
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayouts>
  );
};

export default UpdatePenimbangan;
