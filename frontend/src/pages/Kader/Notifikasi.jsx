import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import TerkirimCard from "../../components/Fragments/Notifikasi/TerkirimCard";
import TotalNotifikasiCard from "../../components/Fragments/Notifikasi/TotalNotifikasiCard";
import PendingCard from "../../components/Fragments/Notifikasi/PendingCard";
import api from "@/services/api";
import { useEffect } from "react";
export default function Notifikasi() {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [listOrangTua, setListOrangTua] = useState([]);
  const [form, setForm] = useState({
    judul: "",
    tipe: "",
    metode: "",
    target: "",
    user_id: "",
    tanggal: "",
    pesan: "",
    status_kirim: "",
    status_baca: "",
  });
  useEffect(() => {
    api.get("/orangtua").then((res) => {
      setListOrangTua(res.data);
    });
  }, []);
  const [editingId, setEditingId] = useState(null);

  // FETCH DATA (DIBUAT FUNCTION BIAR BISA DIPANGGIL ULANG)
  const fetchNotifikasi = async () => {
    try {
      const res = await api.get("/notifikasi");
      console.log(res.data);

      const data = res.data.map((item) => ({
        id: item.id,
        judul: item.judul || "-",
        tipe: item.tipe || "-",
        metode: item.metode || "-",
        tanggal: item.tanggal || "-",
        status_kirim: item.status_kirim || "-",
        status_baca: item.status_baca || "-",
      }));

      setNotifikasiList(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchNotifikasi();
    };

    loadData();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/notifikasi", form);

      alert("Notifikasi berhasil dikirim");

      setForm({
        judul: "",
        tipe: "",
        metode: "",
        pesan: "",
        tanggal: "",
        email: "",
        phone: "",
      });

      setEditingId(null);

      // 🔥 REFRESH DATA
      fetchNotifikasi();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Gagal kirim notifikasi");
    }
  };

  // EDIT (FIX mapping)
  const handleEdit = (item) => {
    setForm({
      judul: item.judul,
      tipe: item.tipe,
      metode: item.metode,
      pesan: "",
      tanggal: item.tanggal,
      email: "",
      phone: "",
    });

    setEditingId(item.id);
  };

  // HAPUS (sementara FE saja)
  const handleDelete = (id) => {
    if (confirm("Hapus notifikasi ini?")) {
      setNotifikasiList(notifikasiList.filter((n) => n.id !== id));
    }
  };

  // 🔥 STATISTIK (FIX STATUS)
  const totalNotif = notifikasiList.length;

  const terkirim = notifikasiList.filter((n) => n.status === "terkirim").length;

  const pending = notifikasiList.filter((n) => n.status === "gagal").length;

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
            <h2 className="text-lg font-extrabold mb-6">Buat Notifikasi</h2>

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
                  Metode Pengiriman
                </label>
                <select
                  name="metode"
                  value={form.metode}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Metode</option>
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="dashboard">Dashboard</option>
                </select>
              </div>

              {/* TARGET */}
              {form.metode && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Penerima
                  </label>
                  <select
                    name="target"
                    value={form.target}
                    onChange={handleChange}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Pilih Target</option>
                    <option value="semua">Semua Orang Tua</option>
                    <option value="tertentu">Orang Tua Tertentu</option>
                  </select>
                </div>
              )}

              {/* PILIH ORANG TUA */}
              {form.target === "tertentu" && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Orang Tua
                  </label>
                  <select
                    name="user_id"
                    value={form.user_id}
                    onChange={handleChange}
                    className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Pilih Orang Tua</option>
                    {listOrangTua.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.email || item.no_telp})
                      </option>
                    ))}
                  </select>
                </div>
              )}

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

              {/* BUTTON */}
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Kirim Notifikasi
                </button>
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
                    <th className="px-4 py-3">NO</th>
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
                    notifikasiList.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        {/* Judul Notifikasi */}
                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                        <td className="py-3">{item.judul || "-"}</td>

                        {/* Tipe Notifikasi */}
                        <td>{item.tipe || "-"}</td>

                        {/* Metode Pengiriman */}
                        <td>{item.metode || "-"}</td>

                        {/* Tanggal */}
                        <td>{item.tanggal || "-"}</td>

                        {/* Status Kirim */}
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${
                              item.status_kirim === "terkirim"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status_kirim || "-"}
                          </span>
                        </td>

                        {/* Aksi Edit / Hapus */}
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
