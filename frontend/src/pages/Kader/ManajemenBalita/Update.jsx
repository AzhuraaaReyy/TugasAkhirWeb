import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "@/services/api";
const UpdateFormBalita = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [posyandus, setPosyandus] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const [form, setForm] = useState({
    name: "",
    user_id: "",
    jk: "",
    tgl_lahir: "",
    tmp_lahir: "",
    alamat: "",
    posyandu_id: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/balitas/detail/${id}`);
        const data = res.data.data;

        setForm({
          ...data,
          tgl_lahir: data.tgl_lahir?.split("T")[0] || "",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/balitas/${id}`, form); // id dari params

      alert("Data berhasil diupdate");
      navigate("/kader/manajemenbalita");
    } catch (error) {
      console.error(error);
      alert("Gagal update data");
    }
  };

  if (loading) {
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );
  }
  return (
    <MainLayouts type="detailmanajemenbalita">
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* HEADER */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Update Data Balita
            </h1>
            <p className="text-sm text-gray-500">
              Mengupdate data identitas balita dengan lengkap.
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
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Aisyah Putri"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Nama Orang Tua */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orang Tua
                </label>
                <select
                  name="user_id"
                  value={form.user_id}
                  onChange={handleChange}
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
                  value={form.jk}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="P">Perempuan</option>
                  <option value="L">Laki-Laki</option>
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
                  value={form.tgl_lahir}
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
                  value={form.posyandu_id}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Posyandu</option>
                  {posyandus.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.nama_posyandu}
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
                onChange={handleChange}
                rows="3"
                placeholder="Contoh: Soka RT02/04 Kecamatan Ungaran Barat"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* BUTTON SECTION */}
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
export default UpdateFormBalita;
