import MainLayouts from "../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UpdatePenimbangan = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama: "",
    umur: "",
    jk: "",
    tanggal: "",
    berat: "",
    tinggi: "",
    ztbu: "",
    zbbu: "",
    zbbtb: "",
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
    navigate("/manajemenpenimbangan");
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
                  Umur
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
                  Tanggal Penimbangan
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
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  name="berat_badan"
                  value={form.berat_badan}
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
                  name="tinggi_badan"
                  value={form.tinggi_badan}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="Contoh: 85.3"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Z-Score BB/U
                </label>
                <input
                  type="number"
                  name="zbbu"
                  value={form.zbbu}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Contoh: -2.35"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Z-Score TB/U
                </label>
                <input
                  type="number"
                  name="ztbu"
                  value={form.ztbu}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Contoh: -1.80"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Z-Score BB/TB
                </label>
                <input
                  type="number"
                  name="zbbtb"
                  value={form.zbbtb}
                  onChange={handleChange}
                  step="0.01"
                  placeholder="Contoh: -0.95"
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* BUTTON SECTION */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate("/manajemenpenimbangan")}
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

export default UpdatePenimbangan;
