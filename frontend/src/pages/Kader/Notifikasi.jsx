import { useMemo } from "react";
import Card from "../../components/Elements/Card/Index";
import MainLayouts from "../../layouts/MainLayouts";
const Notifikasi = () => {
  // ===============================
  // Dummy Data Balita
  // ===============================
  const dataBalita = [
    {
      id: 1,
      nama: "Aisyah",
      dusun: "Dusun 1",
      riwayat: [
        { tanggal: "2024-11", tinggi: 76, status: "Stunting" },
        { tanggal: "2024-12", tinggi: 77, status: "Stunting" },
        { tanggal: "2025-01", tinggi: 78, status: "Stunting" },
      ],
    },
    {
      id: 2,
      nama: "Rafi",
      dusun: "Dusun 2",
      riwayat: [
        { tanggal: "2024-11", tinggi: 84, status: "Normal" },
        { tanggal: "2024-12", tinggi: 85, status: "Normal" },
        { tanggal: "2025-01", tinggi: 83, status: "Normal" },
      ],
    },
    {
      id: 3,
      nama: "Dina",
      dusun: "Dusun 1",
      riwayat: [
        { tanggal: "2024-11", tinggi: 74, status: "Normal" },
        { tanggal: "2024-12", tinggi: 74, status: "Risiko" },
        { tanggal: "2025-01", tinggi: 74, status: "Risiko" },
      ],
    },
  ];

  // ===============================
  // Sistem Deteksi Risiko
  // ===============================
  const hasilAnalisis = useMemo(() => {
    return dataBalita.map((anak) => {
      const riwayat = anak.riwayat;
      const last = riwayat[riwayat.length - 1];
      const prev = riwayat[riwayat.length - 2];

      let notifikasi = null;
      let level = "aman";

      // 1️⃣ Stunting 2x berturut
      if (last.status === "Stunting" && prev.status === "Stunting") {
        notifikasi = "Stunting 2 bulan berturut-turut";
        level = "tinggi";
      }

      // 2️⃣ Tinggi turun drastis
      else if (last.tinggi < prev.tinggi) {
        notifikasi = "Penurunan tinggi badan";
        level = "tinggi";
      }

      // 3️⃣ Tinggi stagnan 2 bulan
      else if (last.tinggi === prev.tinggi) {
        notifikasi = "Tinggi tidak bertambah";
        level = "sedang";
      }

      return {
        ...anak,
        terakhir: last,
        notifikasi,
        level,
      };
    });
  }, []);

  const totalRisikoTinggi = hasilAnalisis.filter(
    (a) => a.level === "tinggi",
  ).length;

  const totalRisikoSedang = hasilAnalisis.filter(
    (a) => a.level === "sedang",
  ).length;

  const totalAman = hasilAnalisis.filter((a) => a.level === "aman").length;

  return (
    <MainLayouts type="notifikasi">
      <div className="min-h-screen bg-gray-50 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Notifikasi Risiko Tinggi</h1>

        {/* Banner Alert */}
        {totalRisikoTinggi > 0 && (
          <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-400">
            ⚠️ Ditemukan {totalRisikoTinggi} balita dengan risiko tinggi bulan
            ini.
          </div>
        )}

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Risiko Tinggi" desc={totalRisikoTinggi} color="red" />
          <Card title="Risiko Sedang" desc={totalRisikoSedang} color="yellow" />
          <Card title="Aman" desc={totalAman} color="green" />
        </div>

        {/* Daftar Balita */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold mb-4">Daftar Monitoring Balita</h2>

          <div className="space-y-3">
            {hasilAnalisis.map((anak) => (
              <div
                key={anak.id}
                className={`p-4 rounded-xl border ${
                  anak.level === "tinggi"
                    ? "border-red-500 bg-red-50"
                    : anak.level === "sedang"
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{anak.nama}</h3>
                    <p className="text-sm text-gray-500">{anak.dusun}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm">Status: {anak.terakhir.status}</p>
                    <p className="text-xs text-gray-400">
                      {anak.terakhir.tanggal}
                    </p>
                  </div>
                </div>

                {anak.notifikasi && (
                  <div className="mt-3 text-sm font-medium text-red-600">
                    ⚠️ {anak.notifikasi}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};
export default Notifikasi;
