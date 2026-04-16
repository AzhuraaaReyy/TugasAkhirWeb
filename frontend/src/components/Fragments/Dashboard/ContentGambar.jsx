import {
  AlertTriangle,
  Calendar,
  TrendingDown,
  Hospital,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/services/api";

const Content = () => {
  const [notif, setNotif] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);

  useEffect(() => {
    api.get("/dashboardnotif").then((res) => {
      setNotif(res.data);
    });
  }, []);
  console.log("RUJUKAN:", notif?.list_rujukan);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        ⚠️ Notifikasi Penting
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Informasi terbaru terkait kondisi balita yang memerlukan perhatian
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* BELUM TIMBANG */}
        <div
          onClick={() =>
            setSelectedNotif({
              title: "Balita Belum Hadir Penimbangan",
              type: "list",
              color: "yellow",
              list: notif?.list_belum_timbang || [],
            })
          }
          className="bg-yellow-50 border border-yellow-300 rounded-2xl p-5 flex gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-white p-3 rounded-xl shadow">
            <AlertTriangle className="text-yellow-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Balita Belum Hadir Penimbangan</h3>
            <p className="text-sm text-gray-600">
              {notif?.belum_timbang ?? 0} balita belum hadir
            </p>
          </div>
        </div>

        {/* TURUN BB */}
        <div
          onClick={() =>
            setSelectedNotif({
              title: "Penurunan Berat Badan",
              type: "list",
              color: "red",
              list: notif?.list_turun_bb || [],
            })
          }
          className="bg-red-50 border border-red-300 rounded-2xl p-5 flex gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-white p-3 rounded-xl shadow">
            <TrendingDown className="text-red-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Berat Badan Turun</h3>
            <p className="text-sm text-gray-600">
              {notif?.turun_bb ?? 0} balita mengalami penurunan berat badan
            </p>
          </div>
        </div>

        {/* JADWAL */}
        <div
          onClick={() =>
            setSelectedNotif({
              title: "Jadwal Posyandu",
              type: "info",
              value: notif?.jadwal,
            })
          }
          className="bg-blue-50 border border-blue-300 rounded-2xl p-5 flex gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-white p-3 rounded-xl shadow">
            <Calendar className="text-blue-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Jadwal Posyandu</h3>
            <p className="text-sm text-gray-600">{notif?.jadwal ?? "-"}</p>
          </div>
        </div>

        {/* RUJUKAN */}
        <div
          onClick={() =>
            setSelectedNotif({
              title: "Perlu Rujukan",
              type: "list",
              color: "green",
              list: notif?.list_rujukan || [],
            })
          }
          className="bg-green-50 border border-green-300 rounded-2xl p-5 flex gap-4 cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-white p-3 rounded-xl shadow">
            <Hospital className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">Perlu Rujukan</h3>
            <p className="text-sm text-gray-600">
              {notif?.rujukan ?? 0} balita perlu rujukan
            </p>
          </div>
        </div>
      </div>

      {/* ================= POPUP (FIXED) ================= */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[95%] max-w-md rounded-2xl p-6 relative shadow-xl animate-fadeIn">
            {/* CLOSE */}
            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <X />
            </button>

            {/* TITLE */}
            <h2 className="text-lg font-bold mb-4 text-gray-800 text-center">
              {selectedNotif.title}
            </h2>

            {/* ===== LIST MODE ===== */}
            {selectedNotif.type === "list" && (
              <>
                {selectedNotif.list?.length > 0 ? (
                  <ul className="space-y-3 max-h-72 overflow-y-auto">
                    {selectedNotif.list.map((item, i) => (
                      <li
                        key={item.id}
                        className="flex flex-col gap-2 border rounded-xl p-3 text-sm shadow-sm"
                      >
                        {/* NAMA */}
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-800">
                            {i + 1}. {item.name}
                          </span>

                          {/* LABEL */}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              selectedNotif.color === "red"
                                ? "bg-red-100 text-red-600"
                                : selectedNotif.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : "bg-green-100 text-green-600"
                            }`}
                          >
                            {selectedNotif.color === "red"
                              ? "Berat  Badan Turun"
                              : selectedNotif.color === "yellow"
                                ? "Belum Timbang"
                                : "Rujukan"}
                          </span>
                        </div>

                        {/* 🔥 KHUSUS TURUN BB */}
                        {selectedNotif.color === "red" && (
                          <div className="text-xs text-gray-600 flex justify-between">
                            <span>
                              {item.berat_sebelumnya} kg → {item.berat_sekarang}{" "}
                              kg
                            </span>
                            <span className="text-red-500 font-bold">
                              ↓ {Math.abs(item.selisih)} kg
                            </span>
                          </div>
                        )}

                        {/* 🔥 KHUSUS RUJUKAN */}
                        {selectedNotif.color === "green" && (
                          <div className="bg-green-50 border border-green-200 rounded-xl p-3 space-y-2">
                            {/* 🔹 KETERANGAN UTAMA */}
                            <p className="text-green-700 font-semibold text-xs">
                              {item.keterangan ||
                                "Perlu pemeriksaan lebih lanjut"}
                            </p>

                            {/* 🔹 ALASAN */}
                            {item.alasan && item.alasan.length > 0 && (
                              <ul className="list-disc pl-4 text-gray-600 text-xs space-y-1">
                                {item.alasan.map((a, idx) => (
                                  <li key={idx}>{a}</li>
                                ))}
                              </ul>
                            )}

                            {/* 🔹 TANGGAL */}
                            {item.tgl_deteksi && (
                              <p className="text-[10px] text-gray-400 italic">
                                Pemeriksaan terakhir: {item.tgl_deteksi}
                              </p>
                            )}
                          </div>
                        )}

                        {/* 🔥 KHUSUS BELUM TIMBANG */}
                        {selectedNotif.color === "yellow" && (
                          <p className="text-xs text-yellow-600">
                            Belum melakukan penimbangan bulan ini
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 text-sm">
                    Tidak ada data!
                  </p>
                )}
              </>
            )}

            {/* ===== INFO MODE ===== */}
            {selectedNotif.type === "info" && (
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Jadwal Posyandu berikutnya:
                </p>
                <p className="text-lg font-bold text-blue-600 mt-2">
                  {selectedNotif.value || "-"}
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={() => setSelectedNotif(null)}
              className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-black"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Content;
