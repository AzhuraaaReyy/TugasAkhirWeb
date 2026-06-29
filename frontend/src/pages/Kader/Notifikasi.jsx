import { useState, useEffect } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import TerkirimCard from "../../components/Fragments/Notifikasi/TerkirimCard";
import TotalNotifikasiCard from "../../components/Fragments/Notifikasi/TotalNotifikasiCard";
import PendingCard from "../../components/Fragments/Notifikasi/PendingCard";
import api from "@/services/api";
import { Atom } from "react-loading-indicators";
const FORM_KOSONG = {
  judul: "",
  tipe: "",
  metode: "",
  target: "",
  user_id: "",
  tanggal: "",
  lokasi: "",
  pesan: "",
};

export default function Notifikasi() {
  const [notifikasiList, setNotifikasiList] = useState([]);
  const [listOrangTua, setListOrangTua] = useState([]);
  const [form, setForm] = useState(FORM_KOSONG);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orangtua").then((res) => {
      setListOrangTua(res.data || []);
    });
  }, []);

  const fetchNotifikasi = async () => {
    try {
      setLoading(true);

      const res = await api.get("/notifikasi");

      // Disesuaikan dengan tampildata(): ikut ambil berhasil / gagal / dibaca / detail_gagal
      const data = res.data.map((item) => ({
        id: item.id,
        judul: item.judul,
        tipe: item.tipe,
        metode: item.metode,
        tanggal: item.tanggal === "-" ? "" : item.tanggal,
        lokasi: item.lokasi,
        pesan: item.pesan,
        status_kirim: item.status_kirim,
        total_penerima: item.total_penerima ?? 0,
        berhasil: item.berhasil ?? 0,
        gagal: item.gagal ?? 0,
        dibaca: item.dibaca ?? 0,
        // tampildata: detail_gagal = [{ user, keterangan }]
        detail_gagal: Array.isArray(item.detail_gagal) ? item.detail_gagal : [],
      }));

      setNotifikasiList(data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifikasi();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.judul || !form.tipe || !form.pesan) {
      alert("Judul, jenis, dan isi pesan wajib diisi.");
      return;
    }
    if (!editingId) {
      if (!form.metode || !form.target) {
        alert("Metode dan target penerima wajib diisi.");
        return;
      }
      if (form.target === "tertentu" && !form.user_id) {
        alert("Pilih orang tua tujuan terlebih dahulu.");
        return;
      }
    }
    try {
      setLoading(true);

      if (editingId) {
        const data = {
          judul: form.judul,
          tipe: form.tipe,
          pesan: form.pesan,
          tanggal: form.tanggal || null,
          lokasi: form.lokasi || null,
        };

        await api.put(`/notifikasi/${editingId}`, data);

        alert("Notifikasi berhasil diperbarui");
      } else {
        const res = await api.post("/notifikasi", form);

     
        const d = res.data || {};
        const berhasil = d.berhasil ?? 0;
        const total = d.total_penerima ?? 0;
        const gagal = d.gagal ?? 0;

        let msg = `Proses pengiriman selesai.\nTerkirim: ${berhasil} dari ${total}`;

        if (gagal > 0) {
          msg += `\nGagal: ${gagal}`;

          if (Array.isArray(d.detail_gagal) && d.detail_gagal.length > 0) {
            msg += "\n\nDetail gagal:";
            d.detail_gagal.forEach((x) => {
              msg += `\n• ${x.nama} (${x.metode}): ${x.alasan}`;
            });
          }
        }

        alert(msg);
      }

      setForm(FORM_KOSONG);
      setEditingId(null);

      await fetchNotifikasi();
    } catch (err) {
      console.error(err.response?.data || err.message);

      alert(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      ...FORM_KOSONG,

      judul: item.judul,
      tipe: item.tipe,
      tanggal: item.tanggal || "",
      lokasi: item.lokasi || "",
      pesan: item.pesan,

      // edit tidak mengubah target
      metode: "",
      target: "",
      user_id: "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus notifikasi ini?")) {
      return;
    }

    try {
      setLoading(true);

      await api.delete(`/notifikasi/${id}`);

      alert("Notifikasi berhasil dihapus");

      await fetchNotifikasi();
    } catch (err) {
      console.error(err.response?.data || err.message);

      alert(err.response?.data?.message || "Gagal menghapus notifikasi.");
    } finally {
      setLoading(false);
    }
  };

  const totalNotif = notifikasiList.length;
  const terkirim = notifikasiList.filter(
    (n) => n.status_kirim === "terkirim",
  ).length;
  const pending = notifikasiList.filter(
    (n) => n.status_kirim === "pending",
  ).length;

  return (
    <MainLayouts type="notifikasi">
      <div className="p-4 sm:p-6 min-h-screen">
        <div className=" bg-white rounded-2xl shadow-md p-4 sm:p-6">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
              <Atom color="#10b981" size="medium" text="Memuat..." />
            </div>
          )}

          <h1 className="text-xl sm:text-2xl font-bold mb-8">
            Manajemen Notifikasi Orang Tua
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
            <TotalNotifikasiCard notif={`${totalNotif}`} />
            <TerkirimCard send={`${terkirim}`} />
            <PendingCard pending={`${pending}`} />
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 mb-10 border border-gray-200 border-2">
            <h2 className="text-lg font-extrabold mb-1">
              {editingId ? "Edit Notifikasi" : "Buat Notifikasi"}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Notifikasi dengan tanggal akan otomatis tampil di Kalender
              Monitoring orang tua.
            </p>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6"
            >
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
                  placeholder="Contoh: Jadwal Posyandu Juni"
                />
              </div>

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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {form.tipe === "Jadwal Posyandu"
                    ? "Tanggal Posyandu"
                    : "Tanggal Kirim / Acara"}
                </label>
                <input
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tanggal ini yang akan ditandai hijau di kalender orang tua.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi Kegiatan
                </label>
                <input
                  type="text"
                  name="lokasi"
                  value={form.lokasi}
                  onChange={handleChange}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Contoh: Balai RW 03 / Puskesmas Tlogosari"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Opsional. Akan tampil di kalender orang tua bila diisi.
                </p>
              </div>

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

              <div className="md:col-span-2 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg text-white transition ${
                    loading
                      ? "bg-blue-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {loading
                    ? editingId
                      ? "Memperbarui..."
                      : "Mengirim..."
                    : editingId
                      ? "Perbarui Notifikasi"
                      : "Kirim Notifikasi"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(FORM_KOSONG);
                      setEditingId(null);
                    }}
                    className="px-6 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-200 border-2 mb-5">
            <h2 className="text-lg font-extrabold mb-6">Riwayat Notifikasi</h2>

            <div className="overflow-x-auto rounded-xl border border-gray-200 text-center hide-scrollbar">
              <table className="w-full min-w-[850px] text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                  <tr className="text-center">
                    <th className="px-4 py-3">NO</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Jenis</th>
                    <th className="px-4 py-3">Metode</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Lokasi</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 text-center">
                  {notifikasiList.length > 0 ? (
                    notifikasiList.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                        <td className="py-3 px-4">{item.judul}</td>
                        <td className="px-4 whitespace-nowrap">{item.tipe}</td>
                        <td className="px-4">{item.metode}</td>
                        <td className="px-4 whitespace-nowrap">
                          {item.tanggal || "-"}
                        </td>
                        <td className="px-4">{item.lokasi || "-"}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs ${
                              item.status_kirim === "terkirim"
                                ? "bg-green-100 text-green-700"
                                : item.status_kirim === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status_kirim}
                          </span>

                          {item.total_penerima > 0 && (
                            <div className="text-[11px] text-gray-500 mt-1">
                              {item.berhasil}/{item.total_penerima} terkirim
                              {item.dibaca > 0 && ` · ${item.dibaca} dibaca`}
                            </div>
                          )}

                          {item.gagal > 0 && (
                            <div
                              className="text-[11px] text-red-500 mt-0.5 cursor-help"
                              title={item.detail_gagal
                                .map(
                                  (g) =>
                                    `${g.user || "-"}: ${g.keterangan || "-"}`,
                                )
                                .join("\n")}
                            >
                              {item.gagal} gagal (arahkan kursor)
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2 justify-center">
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
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
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
