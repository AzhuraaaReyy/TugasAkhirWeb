import { useState } from "react";
import MainLayouts from "../../layouts/MainLayouts";

export default function NotifikasiOrtu() {
  const [filter, setFilter] = useState("semua");

  // ========================
  // DATA DARI KADER (SIMULASI API)
  // ========================
  const [notifikasi, setNotifikasi] = useState([
    {
      id: 1,
      judul: "Jadwal Posyandu",
      pesan: "Besok ada kegiatan posyandu jam 08.00 di balai desa.",
      waktu: "1 jam lalu",
      tipe: "jadwal",
      penting: true,
      dibaca: false,
    },
    {
      id: 2,
      judul: "Pengingat Penimbangan",
      pesan: "Jangan lupa timbang berat badan anak bulan ini ya.",
      waktu: "Hari ini",
      tipe: "pengingat",
      penting: false,
      dibaca: false,
    },
    {
      id: 3,
      judul: "Edukasi Gizi",
      pesan: "Tambahkan protein seperti telur dan ikan dalam menu anak.",
      waktu: "Kemarin",
      tipe: "edukasi",
      penting: false,
      dibaca: true,
    },
  ]);

  // ========================
  // FILTER LOGIC
  // ========================
  const filteredData = notifikasi.filter((item) => {
    if (filter === "belum") return !item.dibaca;
    if (filter === "penting") return item.penting;
    return true;
  });

  // ========================
  // MARK AS READ
  // ========================
  const markAsRead = (id) => {
    setNotifikasi((prev) =>
      prev.map((item) => (item.id === id ? { ...item, dibaca: true } : item)),
    );
  };

  // ========================
  // STYLE TIPE ICON
  // ========================
  const getIcon = (tipe) => {
    switch (tipe) {
      case "jadwal":
        return "📅";
      case "pengingat":
        return "⏰";
      case "edukasi":
        return "📚";
      default:
        return "🔔";
    }
  };

  return (
    <MainLayouts type="ortu">
      <div className="min-h-screen bg-gray-100 p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            🔔 Notifikasi Anda
          </h1>
          <p className="text-sm text-gray-500">
            Lihat informasi penting dari kader posyandu
          </p>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 mb-6">
          {[
            { label: "Semua", value: "semua" },
            { label: "Belum Dibaca", value: "belum" },
            { label: "Penting", value: "penting" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-full text-sm transition ${
                filter === f.value
                  ? "bg-emerald-600 text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredData.length === 0 && (
            <div className="text-center text-gray-400 mt-10">
              Tidak ada notifikasi
            </div>
          )}

          {filteredData.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border shadow-sm transition hover:shadow-md ${
                item.dibaca ? "bg-white" : "bg-emerald-50"
              }`}
            >
              <div className="flex justify-between">
                {/* LEFT */}
                <div className="flex gap-3">
                  <div className="text-xl">{getIcon(item.tipe)}</div>

                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {item.judul}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{item.pesan}</p>

                    <p className="text-xs text-gray-400 mt-2">{item.waktu}</p>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col items-end gap-2">
                  {item.penting && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      Penting
                    </span>
                  )}

                  {!item.dibaca && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  )}
                </div>
              </div>

              {/* ACTION */}
              {!item.dibaca && (
                <div className="mt-4">
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="text-sm text-emerald-600 hover:underline"
                  >
                    Tandai sudah dibaca
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </MainLayouts>
  );
}
