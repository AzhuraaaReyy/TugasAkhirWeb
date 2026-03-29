import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../../services/api";

const CreateFormBalita = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posyandus, setPosyandus] = useState([]);
  const [form, setForm] = useState({
    name: "",
    user_id: "",
    jk: "",
    tgl_lahir: "",
    tmp_lahir: "",
    alamat: "",
    posyandu_id: "",
  });

  //ambil user orangtua
  useEffect(() => {
    const fetchOrangTua = async () => {
      try {
        const res = await api.get("/users?role=orangtua");
        setUsers(res.data.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };
    fetchOrangTua();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    const fetchPosyandu = async () => {
      try {
        const res = await api.get("/posyandu");
        setPosyandus(res.data.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPosyandu();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/balitas", form); //

      alert("Data berhasil ditambahkan");
      navigate("/kader/manajemenbalita");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Gagal update data");
    }
  };

  return (
    <MainLayouts type="createmanajemenbalita">
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* HEADER */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Tambah Data Balita
            </h1>
            <p className="text-sm text-gray-500">
              Isi data identitas balita dengan lengkap.
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
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Contoh: Aisyah Putri"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none "
                  required
                />
              </div>

              {/* Orang Tua (Select) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orang Tua
                </label>
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Orang Tua</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jenis Kelamin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  name="jk"
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tgl_lahir"
                  required
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Tempat Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempat Lahir
                </label>
                <input
                  type="text"
                  name="tmp_lahir"
                  required
                  value={form.tmp_lahir}
                  onChange={handleChange}
                  placeholder="Contoh: Semarang"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              {/* Posyandu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posyandu
                </label>
                <select
                  name="posyandu_id"
                  required
                  value={form.posyandu_id}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Posyandu</option>
                  {posyandus.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.nama_posyandu}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ALAMAT FULL WIDTH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                name="alamat"
                value={form.alamat}
                required
                onChange={handleChange}
                rows="3"
                placeholder="Contoh: Soka RT02/04 Kecamatan Ungaran Barat"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* BUTTON */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/kader/manajemenbalita")}
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

export default CreateFormBalita;
