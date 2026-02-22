import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CreateFormBalita = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    orangtua: "",
    jk: "",
    tanggal: "",
    tempatlahir: "",
    alamat: "",
    posyandu: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    navigate("/manajemenbalita");
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
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Contoh: Aisyah Putri"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Nama Orang Tua */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Orang Tua
                </label>
                <input
                  type="text"
                  name="orangtua"
                  value={form.orangtua}
                  onChange={handleChange}
                  placeholder="Contoh: Ibu Melati"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
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
                  <option value="Perempuan">Perempuan</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                </select>
              </div>

              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
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
                  name="tempatlahir"
                  value={form.tempatlahir}
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
                  name="posyandu"
                  value={form.posyandu}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Posyandu</option>
                  <option value="Posyandu 1">Posyandu 1</option>
                  <option value="Posyandu 2">Posyandu 2</option>
                  <option value="Posyandu 3">Posyandu 3</option>
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
                onClick={() => navigate("/manajemenbalita")}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
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
                  className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 transition"
                >
                  Simpan Data
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
