import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import TerkirimCard from "../../components/Fragments/Notifikasi/TerkirimCard";
import TotalNotifikasiCard from "../../components/Fragments/Notifikasi/TotalNotifikasiCard";
import PendingCard from "../../components/Fragments/Notifikasi/PendingCard";

export default function Notifikasi() {
  const [notifikasiList, setNotifikasiList] = useState([]);

  const [form, setForm] = useState({
    judul: "",
    tipe: "",
    metode: "",
    pesan: "",
    tanggal: "",
  });

  const [editingId, setEditingId] = useState(null);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // TAMBAH / EDIT NOTIFIKASI
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.judul || !form.tipe || !form.metode || !form.pesan) {
      alert("Harap isi semua field");
      return;
    }

    if (editingId) {
      setNotifikasiList(
        notifikasiList.map((item) =>
          item.id === editingId ? { ...form, id: editingId } : item,
        ),
      );
      setEditingId(null);
    } else {
      const newNotif = {
        ...form,
        id: Date.now(),
        status: "Terkirim",
      };

      setNotifikasiList([...notifikasiList, newNotif]);
    }

    setForm({
      judul: "",
      tipe: "",
      metode: "",
      pesan: "",
      tanggal: "",
    });
  };

  // EDIT
  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  // HAPUS
  const handleDelete = (id) => {
    if (confirm("Hapus notifikasi ini?")) {
      setNotifikasiList(notifikasiList.filter((n) => n.id !== id));
    }
  };

  // STATISTIK
  const totalNotif = notifikasiList.length;
  const terkirim = notifikasiList.filter((n) => n.status === "Terkirim").length;
  const pending = notifikasiList.filter((n) => n.status === "Pending").length;

  return (
    <MainLayouts type="notifikasi">
      <div className="p-6 min-h-screen">
        <div className="bg-white rounded-2xl shadow-md p-6">
          {/* TITLE */}
          <h1 className="text-2xl font-bold mb-8">
            Manajemen Notifikasi Orang Tua
          </h1>

          {/* STATISTIK */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <TotalNotifikasiCard notif={`${totalNotif}`} />
            <TerkirimCard send={`${terkirim}`} />
            <PendingCard pending={`${pending}`} />
          </div>

          {/* FORM BUAT NOTIFIKASI */}
          <div className="bg-white shadow-lg rounded-2xl p-6 mb-10 border border-gray-200 border-2">
            <h2 className="text-lg font-extrabold mb-6">
              {editingId ? "Edit Notifikasi" : "Buat Notifikasi"}
            </h2>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* JUDUL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Notifikasi
                </label>
                <input
                  type="text"
                  name="judul"
                  value={form.judul}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: Jadwal Posyandu"
                />
              </div>

              {/* JENIS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Notifikasi
                </label>
                <select
                  name="tipe"
                  value={form.tipe}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Jenis</option>
                  <option>Jadwal Posyandu</option>
                  <option>Pengingat Penimbangan</option>
                  <option>Hasil Penimbangan</option>
                  <option>Peringatan Stunting</option>
                  <option>Edukasi Gizi</option>
                  <option>Pengumuman Posyandu</option>
                </select>
              </div>

              {/* METODE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Pengiriman
                </label>

                <select
                  name="metode"
                  value={form.metode}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Metode Pengiriman</option>
                  <option value="email">Email Orang Tua</option>
                  <option value="whatsapp">Nomor WhatsApp Orang Tua</option>
                </select>

                {form.metode === "email" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Orang Tua
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Masukkan email orang tua"
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                )}

                {form.metode === "whatsapp" && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nomor WhatsApp Orang Tua
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Contoh: 081234567890"
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* TANGGAL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tanggal Kirim
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* PESAN */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Isi Pesan
                </label>
                <textarea
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  rows="4"
                  className="border border-gray-300 w-full rounded-lg px-3 py-2 mt-1 focus:ring-indigo-500 outline-none"
                  placeholder="Tuliskan pesan untuk orang tua..."
                />
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? "Update Notifikasi" : "Kirim Notifikasi"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setForm({
                        judul: "",
                        tipe: "",
                        metode: "",
                        pesan: "",
                        tanggal: "",
                      });
                    }}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* RIWAYAT NOTIFIKASI */}
          <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-200 border-2 mb-5">
            <h2 className="text-lg font-extrabold mb-6">Riwayat Notifikasi</h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200 text-center">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                  <tr className=" text-center">
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Metode</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-center">
                  {notifikasiList.length > 0 ? (
                    notifikasiList.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="py-3">{item.judul}</td>
                        <td>{item.tipe}</td>
                        <td>{item.metode}</td>
                        <td>{item.tanggal}</td>

                        <td>
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                            {item.status}
                          </span>
                        </td>

                        <td className="flex gap-2 justify-center py-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-400 px-3 py-1 rounded text-white text-xs"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 px-3 py-1 rounded text-white text-xs"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-8 text-gray-400"
                      >
                        Belum ada notifikasi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
