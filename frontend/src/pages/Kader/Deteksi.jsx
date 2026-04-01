import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import Select from "react-select";
import api from "@/services/api";
import { useEffect } from "react";
export default function DeteksiDini() {
  // ===============================
  // DATA BALITA (Simulasi Database)
  // ===============================
  const [balitaList, setBalitaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    balita_id: "",
    tgl_penimbangan: "",
    berat: "",
    tinggi: "",
  });

  const [hasil, setHasil] = useState(null);

  const handleChange = (selected) => {
    const balita = balitaList.find((b) => b.id === selected.value);
    if (!balita) return;

    setForm({
      ...form,
      balita_id: balita.id,
      berat: balita.berat || "",
      tinggi: balita.tinggi || "",
    });
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST request ke endpoint Laravel /api/deteksi
      const res = await api.post("/deteksi", {
        balita_id: form.balita_id,
      });

      const data = res.data;

      // Set hasil sesuai struktur backend terbaru
      setHasil({
        name: data.name,
        umur: data.umur,
        bb: data.bb,
        tb: data.tb,
        tanggal_deteksi: new Date().toLocaleDateString("id-ID"), // bisa disesuaikan
        zscore_bbu: data.zscore_bbu || "-", // jika backend kirim zscore
        zscore_tbu: data.zscore_tbu || "-",
        zscore_bbtb: data.zscore_bbtb || "-",
        status_bbu: {
          status: data.status_bbu.status,
          warna: data.status_bbu.warna,
          keterangan: data.status_bbu.keterangan || "",
        },
        status_tbu: {
          status: data.status_tbu.status,
          warna: data.status_tbu.warna,
          keterangan: data.status_tbu.keterangan || "",
        },
        status_bb_tb: {
          status: data.status_bb_tb.status,
          warna: data.status_bb_tb.warna,
          keterangan: data.status_bb_tb.keterangan || "",
        },
        rekomendasi_tbu: data.rekomendasi_tbu || "",
        rekomendasi_bbu: data.rekomendasi_bbu || "",
        rekomendasi_bbtb: data.rekomendasi_bbtb || "",
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Gagal melakukan deteksi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.get("/ambilbalita"); // endpoint Laravel
        setBalitaList(res.data || []);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalita();
  }, []);
  const balitaOptions = balitaList.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  // ===============================
  // Fungsi warna status (contoh)
  // ===============================

  return (
    <MainLayouts type="deteksidini">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8 font-sans">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold tracking-tight  text-gray-800">
            Sistem Deteksi Dini Stunting
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Lakukan skrining awal untuk mendeteksi risiko stunting berdasarkan
            data pertumbuhan balita.
          </p>

          {/* ================= INPUT ================= */}
          <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 mb-10 border border-gray-300 border-2">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">Pilih Balita</label>
                <Select
                  options={balitaOptions}
                  placeholder="Cari Balita..."
                  className="mt-1 text-gray-500"
                  noOptionsMessage={() => "Balita tidak ditemukan"}
                  onChange={handleChange} // <-- pakai fungsi ini
                  formatOptionLabel={(data) => (
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {data.label}
                      </span>
                    </div>
                  )}
                  filterOption={(option, inputValue) => {
                    const search = inputValue.toLowerCase();
                    const nama = option.data.label?.toLowerCase() || "";
                    return nama.includes(search);
                  }}
                  unstyled
                  classNames={{
                    control: () =>
                      "w-full mt-1 border rounded-xl px-2 py-1 bg-emerald-50",
                    menu: () => "border mt-1 rounded-xl shadow-md bg-white",
                    menuList: () => "max-h-40 overflow-y-auto",
                    option: ({ isFocused, isSelected }) =>
                      `px-4 py-2 cursor-pointer ${
                        isSelected
                          ? "bg-emerald-500 text-white"
                          : isFocused
                            ? "bg-emerald-100"
                            : ""
                      }`,
                  }}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Tanggal Penimbangan
                </label>
                <input
                  type="date"
                  name="tgl_penimbangan"
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="berat"
                  value={form.berat}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  readOnly
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="tinggi"
                  value={form.tinggi}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  readOnly
                />
              </div>

              <div className="md:col-span-2">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition">
                  Deteksi Sekarang
                </button>
              </div>
            </form>
          </div>

          {/* ================= HASIL ================= */}
          {hasil && (
            <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 space-y-6 border border-gray-300 border-2 mb-5">
              <h2 className="text-xl font-semibold">
                Hasil Analisis Pertumbuhan
              </h2>

              {/* INFO BALITA */}
              <div className="grid md:grid-cols-5 gap-4 text-center">
                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.name}</p>
                  <p className="text-sm text-gray-600">Nama</p>
                </div>
                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.umur} bulan</p>
                  <p className="text-sm text-gray-600">Usia</p>
                </div>
                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.tanggal_deteksi}</p>
                  <p className="text-sm text-gray-600">Tanggal Deteksi</p>
                </div>
                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.tb} cm</p>
                  <p className="text-sm text-gray-600">Tinggi</p>
                </div>
                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.bb} kg</p>
                  <p className="text-sm text-gray-600">Berat</p>
                </div>
              </div>

              {/* Z-SCORE DETAIL */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                {/* TB/U */}
                <div className="bg-blue-100 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscore_tbu}</p>
                  <p className="text-sm text-gray-500">Z-Score TB/U</p>
                  <p
                    className={`font-bold mt-2 px-3 py-1 rounded-full inline-block ${hasil.status_tbu.warna}`}
                  >
                    {hasil.status_tbu.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    {hasil.status_tbu.keterangan}
                  </p>
                </div>

                {/* BB/U */}
                <div className="bg-purple-100 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscore_bbu}</p>
                  <p className="text-sm text-gray-500">Z-Score BB/U</p>
                  <p
                    className={`font-bold mt-2 px-3 py-1 rounded-full inline-block ${hasil.status_bbu.warna}`}
                  >
                    {hasil.status_bbu.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    {hasil.status_bbu.keterangan}
                  </p>
                </div>

                {/* BB/TB */}
                <div className="bg-orange-100 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscore_bbtb}</p>
                  <p className="text-sm text-gray-500">Z-Score TB/BB</p>
                  <p
                    className={`font-bold mt-2 px-3 py-1 rounded-full inline-block ${hasil.status_bb_tb.warna}`}
                  >
                    {hasil.status_bb_tb.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    {hasil.status_bb_tb.keterangan}
                  </p>
                </div>
              </div>

              {/* STATUS STUNTING */}
              <div
                className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_tbu.warna}`}
              >
                {hasil.status_tbu.status}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  *Status stunting ditentukan berdasarkan indikator{" "}
                  <span className="font-medium text-black">
                    Tinggi Badan menurut Umur (TB/U)
                  </span>{" "}
                  sesuai standar pertumbuhan WHO.
                </p>
              </div>

              {/* REKOMENDASI */}
              <div>
                <h3 className="font-semibold mb-2">
                  Rekomendasi Tindakan Stunting
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {hasil.rekomendasi_tbu?.map((r, i) => (
                    <li key={i}>
                      <span
                        className={`px-2 py-1 rounded-md ${hasil.status_tbu.warna} text-white`}
                      >
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-semibold mb-2">
                  Rekomendasi Tindakan BB/U
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {hasil.rekomendasi_bbu?.map((r, i) => (
                    <li key={i}>
                      <span
                        className={`px-2 py-1 rounded-md ${hasil.status_bbu.warna} text-white`}
                      >
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
                <h3 className="font-semibold mb-2">
                  Rekomendasi Tindakan BB/TB
                </h3>
                <ul className="list-disc list-inside space-y-2">
                  {hasil.rekomendasi_bbtb?.map((r, i) => (
                    <li key={i}>
                      <span
                        className={`px-2 py-1 rounded-md ${hasil.status_bb_tb.warna} text-white`}
                      >
                        {r}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-xs text-gray-400 italic">
                *Hasil ini merupakan skrining awal dan tidak menggantikan
                diagnosis medis.
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayouts>
  );
}
