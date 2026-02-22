import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";

export default function DeteksiDini() {
  const balitaList = [
    { id: 1, nama: "Aisyah", tanggal_lahir: "2023-01-10", jk: "Perempuan" },
    { id: 2, nama: "Rafi", tanggal_lahir: "2022-05-15", jk: "Laki-Laki" },
  ];

  const [form, setForm] = useState({
    balita_id: "",
    tanggal: "",
    berat: "",
    tinggi: "",
  });

  const [hasil, setHasil] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const hitungUsia = (lahir, timbang) => {
    const l = new Date(lahir);
    const t = new Date(timbang);
    return (
      (t.getFullYear() - l.getFullYear()) * 12 + (t.getMonth() - l.getMonth())
    );
  };

  const hitungZScore = (tinggi, usia) => {
    const median = usia * 0.5 + 50;
    const sd = 3;
    return ((tinggi - median) / sd).toFixed(2);
  };

  const tentukanStatus = (z) => {
    if (z < -3) return "Stunting Berat";
    if (z < -2) return "Stunting";
    return "Normal";
  };

  const warnaStatus = (status) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-700";
      case "Stunting":
        return "bg-yellow-100 text-yellow-700";
      case "Stunting Berat":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  const rekomendasi = (status) => {
    if (status === "Normal")
      return ["Lanjutkan pemantauan rutin", "Pastikan asupan gizi cukup"];
    if (status === "Stunting")
      return [
        "Konsultasi ke puskesmas",
        "Evaluasi pola makan",
        "Monitoring ulang 1 bulan",
      ];
    return [
      "Segera rujuk fasilitas kesehatan",
      "Pendampingan gizi intensif",
      "Monitoring ketat",
    ];
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const balita = balitaList.find((b) => b.id === parseInt(form.balita_id));

    const usia = hitungUsia(balita.tanggal_lahir, form.tanggal);
    const zscore = hitungZScore(parseFloat(form.tinggi), usia);
    const status = tentukanStatus(zscore);

    setHasil({
      ...balita,
      usia,
      berat: form.berat,
      tinggi: form.tinggi,
      zscore,
      status,
      rekomendasi: rekomendasi(status),
    });
  };

  return (
    <MainLayouts type="deteksidini">
      <div className="flex bg-gray-100 min-h-screen">
        <div className="flex-1 p-8 space-y-8">
          <h1 className="text-2xl font-bold">Sistem Deteksi Dini Stunting</h1>

          {/* CARD INPUT */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">Pilih Balita</label>
                <select
                  name="balita_id"
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                >
                  <option value="">-- Pilih --</option>
                  {balitaList.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Tanggal Penimbangan
                </label>
                <input
                  type="date"
                  name="tanggal"
                  onChange={handleChange}
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
                  step="0.01"
                  name="berat"
                  onChange={handleChange}
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
                  step="0.01"
                  name="tinggi"
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <button className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                  Analisis Sekarang
                </button>
              </div>
            </form>
          </div>

          {/* CARD HASIL */}
          {hasil && (
            <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 transition-all duration-500">
              <h2 className="text-xl font-bold">Hasil Analisis</h2>

              {/* Info */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.usia} bulan</p>
                  <p className="text-sm text-gray-500">Usia</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscore}</p>
                  <p className="text-sm text-gray-500">Z-Score</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.tinggi} cm</p>
                  <p className="text-sm text-gray-500">Tinggi</p>
                </div>
              </div>

              {/* Status */}
              <div
                className={`p-6 rounded-2xl text-center text-xl font-bold ${warnaStatus(
                  hasil.status,
                )}`}
              >
                {hasil.status}
              </div>

              {/* Rekomendasi */}
              <div>
                <h3 className="font-semibold mb-2">Rekomendasi Tindakan</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {hasil.rekomendasi.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayouts>
  );
}
