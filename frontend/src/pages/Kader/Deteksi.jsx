import { useState, useEffect } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import api from "@/services/api";

export default function DeteksiDini() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    jk: "",
    balita_id: "",
    tgl_lahir: "",
    berat: "",
    tinggi: "",
    tgl_deteksi: "",
    umur: "",
  });

  const [metode, setMetode] = useState(""); // stunting, wasting, underweight
  const [hasil, setHasil] = useState(null);

  // Auto-fill saat pilih balita

  const [detailForm, setDetailForm] = useState({
    umur: "",
    keterangan: "",
    rekomendasi: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/deteksi", {
        name: form.name,
        jk: form.jk,
        balita_id: form.balita_id,
        tgl_deteksi: form.tgl_deteksi,
        berat: form.berat,
        tinggi: form.tinggi,
        tgl_lahir: form.tgl_lahir,
      });

      const data = res.data;

      setHasil({
        id: data.id,
        name: data.name,
        umur: data.umur,
        bb: data.bb,
        tb: data.tb,
        tanggal_deteksi: form.tgl_deteksi,
        zscore_bbu: data.zscore_bbu || "-",
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
      const message = error.response?.data?.message || "Terjadi kesalahan";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };
  const fetchData = async () => {
    try {
      const res = await api.get("/deteksi"); // endpoint index
      setData(res.data.data || res.data || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitDetail = async (e) => {
    e.preventDefault();

    if (!hasil?.id) {
      alert("Lakukan deteksi terlebih dahulu!");
      return;
    }

    setLoading(true);

    try {
      await api.post("/detaildeteksi/store", {
        deteksi_id: hasil.id,
        keterangan: detailForm.keterangan || null,
        rekomendasi: detailForm.rekomendasi || null,
      });

    
      await fetchData();

    
      setDetailForm({
        keterangan: "",
        rekomendasi: "",
      });

    
      setHasil(null);

     
      alert("Data berhasil disimpan!");
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (form.tgl_lahir && form.tgl_deteksi) {
      const lahir = new Date(form.tgl_lahir);
      const deteksi = new Date(form.tgl_deteksi);

      // 🔥 VALIDASI: deteksi tidak boleh sebelum lahir
      if (deteksi < lahir) {
        setForm((prev) => ({
          ...prev,
          umur: 0,
        }));
        return;
      }

      let umur =
        (deteksi.getFullYear() - lahir.getFullYear()) * 12 +
        (deteksi.getMonth() - lahir.getMonth());

      // 🔥 Koreksi jika tanggal deteksi < tanggal lahir (hari)
      if (deteksi.getDate() < lahir.getDate()) {
        umur -= 1;
      }

      setForm((prev) => ({
        ...prev,
        umur: Number(umur),
      }));
    }
  }, [form.tgl_lahir, form.tgl_deteksi]);

  //detail

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  if (loading)
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );

  return (
    <MainLayouts type="deteksidini">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8 font-sans">
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold tracking-tight  text-gray-800">
            Sistem Deteksi Dini Stunting
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Lakukan skrining awal untuk mendeteksi risiko stunting berdasarkan
            data pertumbuhan balita.
          </p>

          {/* FORM INPUT */}
          <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 mb-10 border border-gray-300 border-2">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* PILIH BALITA */}
              <div>
                <label className="text-sm text-gray-600">Nama Balita</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Contoh: Aisyah Putri"
                  className="w-full h-12 border border-gray-700 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none "
                  required
                />
              </div>

              {/* PILIH METODE */}
              <div>
                <label className="text-sm text-gray-600">
                  Metode Pengecekan
                </label>
                <select
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                  required
                >
                  <option value="">Pilih metode</option>
                  <option value="stunting">Stunting (TB/U)</option>
                  <option value="wasting">Wasting (BB/TB)</option>
                  <option value="underweight">Underweight (BB/U)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  name="jk"
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-gray-700 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tgl_lahir"
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>
              {/* TANGGAL PENIMBANGAN */}
              <div>
                <label className="text-sm text-gray-600">Tanggal Deteksi</label>
                <input
                  type="date"
                  name="tgl_deteksi"
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Umur (bulan)</label>
                <input
                  type="number"
                  value={Math.floor(form.umur)}
                  name="umur"
                  onChange={handleChange}
                  placeholder="Masukkan umur balita"
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  name="tinggi"
                  onChange={handleChange}
                  placeholder="Masukkan tinggi balita"
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  name="berat"
                  placeholder="Masukkan berat balita"
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition">
                  Deteksi Sekarang
                </button>
              </div>
            </form>
          </div>

          {/* HASIL */}
          {hasil && (
            <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 space-y-6 border border-gray-300 border-2 mb-5">
              <h2 className="text-xl font-extrabold">Hasil Analisis Deteksi</h2>

              {/* Z-Score & Status */}
              <div className=" text-center">
                {metode === "stunting" && (
                  <>
                    <div
                      className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_tbu.warna}`}
                    >
                      <p className="font-semibold">{hasil.zscore_tbu}</p>
                      <p className="text-sm text-black font-semibold">
                        Z-Score TB/U
                      </p>
                      {hasil.status_tbu.status}
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Status stunting ditentukan berdasarkan indikator{" "}
                        <span className="font-medium text-black">
                          Tinggi Badan menurut Umur (TB/U)
                        </span>{" "}
                        sesuai standar pertumbuhan WHO.
                      </p>
                    </div>
                  </>
                )}
                {metode === "wasting" && (
                  <>
                    <div
                      className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_bb_tb.warna}`}
                    >
                      <p className="font-semibold">{hasil.zscore_bbtb}</p>
                      <p className="text-sm text-black font-semibold">
                        Z-Score BB/TB
                      </p>
                      {hasil.status_bb_tb.status}

                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Status wasting ditentukan berdasarkan indikator{" "}
                        <span className="font-medium text-black">
                          Berat Badan menurut Tinggi Badan (TB/U)
                        </span>{" "}
                        sesuai standar pertumbuhan WHO.
                      </p>
                    </div>
                  </>
                )}
                {metode === "underweight" && (
                  <>
                    <div
                      className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_bbu.warna}`}
                    >
                      <p className="font-semibold">{hasil.zscore_bbu}</p>
                      <p className="text-sm text-black font-semibold">
                        Z-Score BB/U
                      </p>
                      {hasil.status_bbu.status}
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Status underweight ditentukan berdasarkan indikator{" "}
                        <span className="font-medium text-black">
                          Berat Badan menurut Umur (TB/U)
                        </span>{" "}
                        sesuai standar pertumbuhan WHO.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-400 italic text-center">
                *Hasil ini merupakan skrining awal dan tidak menggantikan
                diagnosis medis.
              </div>
              <form
                onSubmit={handleSubmitDetail}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 mt-6"
              >
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Tambah Keterangan & Rekomendasi
                  </h3>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      placeholder="Contoh: Balita mengalami risiko stunting ringan..."
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm"
                      value={detailForm.keterangan}
                      rows={3}
                      onChange={(e) =>
                        setDetailForm({
                          ...detailForm,
                          keterangan: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Rekomendasi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Rekomendasi
                    </label>
                    <textarea
                      placeholder="Contoh: Tingkatkan asupan gizi, rutin posyandu..."
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm"
                      value={detailForm.rekomendasi}
                      rows={3}
                      onChange={(e) =>
                        setDetailForm({
                          ...detailForm,
                          rekomendasi: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!hasil?.id}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                        !hasil?.id
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </MainLayouts>
  );
}
