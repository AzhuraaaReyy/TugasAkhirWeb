import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import Select from "react-select";

export default function DeteksiDini() {
  // ===============================
  // DATA BALITA (Simulasi Database)
  // ===============================
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

  // ===============================
  // HITUNG USIA (BULAN)
  // ===============================
  const hitungUsia = (lahir, timbang) => {
    const l = new Date(lahir);
    const t = new Date(timbang);

    return (
      (t.getFullYear() - l.getFullYear()) * 12 + (t.getMonth() - l.getMonth())
    );
  };

  // ===============================
  // STANDAR SIMPLIFIKASI
  // ===============================
  const standarTBU = {
    "Laki-Laki": (usia) => 49 + usia * 0.7,
    Perempuan: (usia) => 48 + usia * 0.68,
  };

  const standarBBU = {
    "Laki-Laki": (usia) => 3.5 + usia * 0.25,
    Perempuan: (usia) => 3.2 + usia * 0.23,
  };

  const standarTBBB = {
    "Laki-Laki": (berat) => 50 + berat * 1.2,
    Perempuan: (berat) => 49 + berat * 1.15,
  };

  // ===============================
  // HITUNG Z-SCORE
  // ===============================
  const hitungZScoreTBU = (tinggi, usia, jk) => {
    const median = standarTBU[jk](usia);
    const sd = 3.2;
    return (tinggi - median) / sd;
  };

  const hitungZScoreBBU = (berat, usia, jk) => {
    const median = standarBBU[jk](usia);
    const sd = 1.2;
    return (berat - median) / sd;
  };

  const hitungZScoreTBBB = (tinggi, berat, jk) => {
    const median = standarTBBB[jk](berat);
    const sd = 2.5;
    return (tinggi - median) / sd;
  };

  // ===============================
  // KLASIFIKASI TB/U
  // ===============================
  const StatusTBU = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3)
      return {
        status: "Sangat Pendek (Severely Stunted)",
        keterangan: "Anak mengalami stunting berat.",
      };

    if (nilai < -2)
      return {
        status: "Pendek (Stunted)",
        keterangan: "Anak termasuk stunting.",
      };

    return {
      status: "Normal (Tidak Stunting)",
      keterangan: "Tinggi badan sesuai usia.",
    };
  };

  // ===============================
  // KLASIFIKASI BB/U
  // ===============================
  const StatusBBU = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3)
      return {
        status: "Berat Badan Sangat Kurang",
        keterangan: "Kekurangan berat badan berat.",
      };

    if (nilai < -2)
      return {
        status: "Berat Badan Kurang",
        keterangan: "Berat badan di bawah standar.",
      };

    return {
      status: "Normal",
      keterangan: "Berat badan sesuai usia.",
    };
  };

  // ===============================
  // KLASIFIKASI TB/BB
  // ===============================
  const StatusTBBB = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3)
      return { status: "Sangat Kurus", keterangan: "Gizi buruk." };

    if (nilai < -2) return { status: "Kurus", keterangan: "Kekurangan gizi." };

    if (nilai <= 1)
      return { status: "Normal", keterangan: "Status gizi normal." };

    if (nilai <= 2)
      return { status: "Gemuk", keterangan: "Berat badan berlebih." };

    return { status: "Obesitas", keterangan: "Mengalami obesitas." };
  };

  const tentukanStatus = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3) return "Stunting Berat (Risiko Tinggi)";
    if (nilai < -2) return "Stunting (Risiko Sedang)";
    return "Normal (Sesuai Standar)";
  };

  const warnaStatus = (status) => {
    if (status.includes("Normal")) return "bg-green-100 text-green-700";
    if (status.includes("Sedang")) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const rekomendasi = (status) => {
    if (status.includes("Normal"))
      return [
        "Lanjutkan pemantauan rutin setiap bulan",
        "Pastikan asupan gizi seimbang",
        "Lengkapi imunisasi",
      ];

    if (status.includes("Sedang"))
      return [
        "Konsultasi tenaga kesehatan",
        "Evaluasi pola makan",
        "Monitoring ulang 1 bulan",
      ];

    return [
      "Segera rujuk ke Puskesmas",
      "Pendampingan gizi intensif",
      "Monitoring ketat",
    ];
  };

  const warnaTBU = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3) return "bg-red-100 text-red-700"; // Sangat Pendek
    if (nilai < -2) return "bg-yellow-100 text-yellow-700"; // Pendek
    return "bg-green-100 text-green-700"; // Normal
  };

  const warnaBBU = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3) return "bg-red-100 text-red-700";
    if (nilai < -2) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const warnaTBBB = (z) => {
    const nilai = parseFloat(z);

    if (nilai < -3) return "bg-red-100 text-red-700"; // Sangat Kurus
    if (nilai < -2) return "bg-yellow-100 text-yellow-700"; // Kurus
    if (nilai <= 1) return "bg-green-100 text-green-700"; // Normal
    if (nilai <= 2) return "bg-yellow-100 text-yellow-700"; // Gemuk
    return "bg-red-100 text-red-700"; // Obesitas
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();

    const balita = balitaList.find((b) => b.id === parseInt(form.balita_id));
    if (!balita) return;

    const usia = hitungUsia(balita.tanggal_lahir, form.tanggal);
    if (usia < 0) {
      alert("Tanggal penimbangan tidak valid.");
      return;
    }

    const zTBU = hitungZScoreTBU(parseFloat(form.tinggi), usia, balita.jk);
    const zBBU = hitungZScoreBBU(parseFloat(form.berat), usia, balita.jk);
    const zTBBB = hitungZScoreTBBB(
      parseFloat(form.tinggi),
      parseFloat(form.berat),
      balita.jk,
    );

    const status = tentukanStatus(zTBU);

    setHasil({
      ...balita,
      usia,
      tanggal_deteksi: form.tanggal,
      berat: form.berat,
      tinggi: form.tinggi,
      zscoreTBU: zTBU.toFixed(2),
      zscoreBBU: zBBU.toFixed(2),
      zscoreTBBB: zTBBB.toFixed(2),
      status,
      statusTBU: StatusTBU(zTBU),
      statusBBU: StatusBBU(zBBU),
      statusTBBB: StatusTBBB(zTBBB),
      rekomendasi: rekomendasi(status),
    });
  };

  const balitaOptions = balitaList.map((b) => ({
    value: b.id,
    label: b.nama,
  }));

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
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      balita_id: selected.value,
                    })
                  }
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
                  name="tanggal"
                  onChange={handleChange}
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

              <div className="grid md:grid-cols-5 gap-4 text-center">
                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.nama}</p>
                  <p className="text-sm text-gray-600 ">Nama</p>
                </div>

                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.usia} bulan</p>
                  <p className="text-sm text-gray-600">Usia</p>
                </div>

                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.tanggal_deteksi}</p>
                  <p className="text-sm text-gray-600">Tanggal Deteksi</p>
                </div>

                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.tinggi} cm</p>
                  <p className="text-sm text-gray-600">Tinggi</p>
                </div>

                <div className="bg-emerald-200 p-4 rounded-xl border border-gray-400 border-2 shadow-lg">
                  <p className="font-bold">{hasil.berat} kg</p>
                  <p className="text-sm text-gray-600">Berat</p>
                </div>
              </div>

              {/* Z-SCORE DETAIL */}
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-100 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscoreTBU}</p>
                  <p className="text-sm text-gray-500">Z-Score TB/U</p>
                  <p
                    className={`font-bold mt-2 px-3 py-1 rounded-full inline-block ${warnaTBU(
                      hasil.zscoreTBU,
                    )}`}
                  >
                    {hasil.statusTBU.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    {hasil.statusTBU.keterangan}
                  </p>
                </div>

                <div className="bg-purple-100 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscoreBBU}</p>
                  <p className="text-sm text-gray-500">Z-Score BB/U</p>
                  <p
                    className={`font-bold mt-2 px-3 py-1 rounded-full inline-block ${warnaBBU(
                      hasil.zscoreBBU,
                    )}`}
                  >
                    {hasil.statusBBU.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    {hasil.statusBBU.keterangan}
                  </p>
                </div>

                <div className="bg-orange-100 p-4 rounded-xl">
                  <p className="font-semibold">{hasil.zscoreTBBB}</p>
                  <p className="text-sm text-gray-500">Z-Score TB/BB</p>
                  <p
                    className={`font-bold mt-2 px-3 py-1 rounded-full inline-block ${warnaTBBB(
                      hasil.zscoreTBBB,
                    )}`}
                  >
                    {hasil.statusTBBB.status}
                  </p>
                  <p className="text-sm font-semibold text-gray-500">
                    {hasil.statusTBBB.keterangan}
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div
                className={`p-6 rounded-2xl text-center text-xl font-bold ${warnaStatus(
                  hasil.status,
                )}`}
              >
                {hasil.status}
                {/* CATATAN */}
                <p className="text-xs text-gray-500 mt-2 text-center">
                  *Status stunting ditentukan berdasarkan indikator{" "}
                  <span className="font-medium text-black">
                    Tinggi Badan menurut Umur (TB/U)
                  </span>
                  sesuai standar pertumbuhan WHO.
                </p>
              </div>

              {/* REKOMENDASI */}
              <div>
                <h3 className="font-semibold mb-2">Rekomendasi Tindakan</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {hasil.rekomendasi.map((r, i) => (
                    <li key={i}>{r}</li>
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
