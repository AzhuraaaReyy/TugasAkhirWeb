import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../../services/api";

const CreatePenimbangan = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balita, setBalita] = useState([]);
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

  const formatUmur = (bulan) => {
    if (bulan === "" || bulan === undefined || bulan === null) return "";

    const tahun = Math.floor(bulan / 12);
    const sisaBulan = bulan % 12;

    if (tahun === 0) return `${sisaBulan} bulan`;
    if (sisaBulan === 0) return `${tahun} tahun`;
    return `${tahun} tahun ${sisaBulan} bulan`;
  };
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

    if (name === "balita_id" || name === "tgl_penimbangan") {
      newForm.umur = getUmurFromBalita(
        name === "balita_id" ? value : form.balita_id,
        name === "tgl_penimbangan" ? value : form.tgl_penimbangan,
      );
    }

    setForm(newForm);
  };

  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.get("/balitas");
        setBalita(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchBalita();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/penimbangans", form); //

      alert("Data berhasil ditambahkan");
      navigate("/kader/manajemenpenimbangan");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Gagal update data");
    }
  };

  return (
    <MainLayouts type="createpenimbangan">
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
                  required
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
                  Umur
                </label>
                <input
                  type="text"
                  value={form.umur ? formatUmur(form.umur) : ""}
                  readOnly
                  className="w-full h-12 bg-gray-100 border border-gray-300 rounded-lg px-4 text-sm"
                />
              </div>
              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Penimbangan
                </label>
                <input
                  type="date"
                  name="tgl_penimbangan"
                  value={form.tgl_penimbangan}
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
                  Lingkar Kepala (cm)
                </label>
                <input
                  type="number"
                  name="lingkar_kepala"
                  value={form.lingkar_kepala}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Contoh: 10"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lingkar Lengan Atas (cm)
                </label>
                <input
                  type="number"
                  name="lingkar_lengan"
                  value={form.lingkar_lengan}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Contoh: 20"
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

              <div className="flex gap-3">
                <button
                  type="reset"
                  className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-medium shadow-sm hover:bg-emerald-700 transition"
                >
                  Tambah Data
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </MainLayouts>
  );
};

export default CreatePenimbangan;
