import {
  AlertTriangle,
  Calendar,
  TrendingDown,
  Hospital,
  X,
} from "lucide-react";

import { useState, useEffect } from "react";

import api from "@/services/api";

import ReactCalendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

const Content = () => {
  const [notif, setNotif] = useState(null);

  const [selectedNotif, setSelectedNotif] = useState(null);

  const [events, setEvents] = useState([]);

  // Tanggal yang sedang dipilih di kalender (untuk panel keterangan)
  const [selectedDate, setSelectedDate] = useState(null);

  /* ================= FETCH ================= */
  useEffect(() => {
    api.get("/dashboardnotif").then((res) => {
      setNotif(res.data);
    });

    api.get("/kalender-notifikasi").then((res) => {
      setEvents(res.data || []);
    });
  }, []);

  /* ================= HELPER TANGGAL ================= */
  // Normalisasi tanggal dari backend: "2026-06-15 00:00:00" -> "2026-06-15"
  const normalisasiTanggal = (t) => String(t || "").slice(0, 10);

  // Format tanggal LOKAL (bukan toISOString/UTC agar tidak geser sehari di WIB)
  const formatLokal = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(date.getDate()).padStart(2, "0")}`;

  const getEventByDate = (date) => {
    const formatted = formatLokal(date);
    return events.filter(
      (event) => normalisasiTanggal(event.tanggal) === formatted,
    );
  };

  const tanggalIndo = (date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Event pada tanggal yang sedang dipilih
  const eventTerpilih = selectedDate ? getEventByDate(selectedDate) : [];

  return (
    <div className="mb-10">
      {/* ================= HEADER ================= */}
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        ⚠️ Notifikasi Penting
      </h2>

      <p className="text-sm text-gray-500 mb-6">
        Informasi terbaru terkait kondisi balita yang memerlukan perhatian
      </p>

      {/* ================= NOTIFICATION CARD ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
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

      {/* ================= CALENDAR ================= */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-800">
            📅 Kalender Monitoring
          </h2>

          <p className="text-sm text-gray-500">
            Tanggal berwarna hijau menandakan ada event / jadwal posyandu. Klik
            tanggalnya untuk melihat keterangan acara.
          </p>
        </div>

        <ReactCalendar
          className="w-full border-none"
          /* Tandai hijau setiap tanggal yang punya event */
          tileClassName={({ date, view }) => {
            if (view === "month" && getEventByDate(date).length > 0) {
              return "has-event";
            }
            return null;
          }}
          /* Titik kecil di bawah angka tanggal */
          tileContent={({ date, view }) => {
            if (view === "month") {
              const eventsOnDate = getEventByDate(date);

              return eventsOnDate.length > 0 ? (
                <div className="flex justify-center mt-1">
                  <div className="event-dot"></div>
                </div>
              ) : null;
            }
          }}
          /* Klik tanggal mana pun -> panel keterangan di bawah ikut berubah */
          onClickDay={(date) => {
            setSelectedDate(date);
          }}
        />

        {/* ============ KETERANGAN ACARA (di bawah kalender) ============ */}
        <div className="mt-6 border-t border-gray-300 pt-5">
          <h3 className="font-semibold text-gray-800 mb-3">
            🗓 Keterangan Acara
            {selectedDate ? ` — ${tanggalIndo(selectedDate)}` : ""}
          </h3>

          {!selectedDate ? (
            <p className="text-sm text-gray-400">
              Belum ada acara yang dipilih. Klik tanggal bertanda hijau pada
              kalender untuk melihat detail acara.
            </p>
          ) : eventTerpilih.length === 0 ? (
            <p className="text-sm text-gray-400">
              Belum ada event atau acara pada tanggal ini.
            </p>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto hide-scrollbar pr-1">
              {eventTerpilih.map((event) => (
                <div
                  key={event.id}
                  className="border border-emerald-200 bg-emerald-50/50 rounded-xl p-4"
                >
                  <div className="flex justify-between items-start gap-3">
                    <h4 className="font-semibold text-gray-800">
                      {event.judul}
                    </h4>

                    <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                      {event.tipe}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">{event.pesan}</p>

                  <p className="text-xs text-gray-400 mt-2">
                    {normalisasiTanggal(event.tanggal)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= NOTIFICATION POPUP ================= */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[95%] max-w-md rounded-2xl p-6 relative shadow-xl animate-scaleUp">
            {/* CLOSE */}
            <button
              onClick={() => setSelectedNotif(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
            >
              <X />
            </button>

            {/* TITLE */}
            <h2 className="text-lg font-bold mb-5 text-gray-800 text-center">
              {selectedNotif.title}
            </h2>

            {/* ================= LIST MODE ================= */}
            {selectedNotif.type === "list" && (
              <>
                {selectedNotif.list?.length > 0 ? (
                  <ul className="space-y-3 max-h-80 overflow-y-auto">
                    {selectedNotif.list.map((item, i) => (
                      <li
                        key={item.id}
                        className="
                    border
                    border-gray-100
                    rounded-2xl
                    p-4
                    shadow-sm
                    bg-gray-50
                  "
                      >
                        {/* HEADER */}
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-800">
                            {i + 1}. {item.name}
                          </span>

                          <span
                            className={`
                        text-xs
                        px-3
                        py-1
                        rounded-full
                        font-medium
                        ${
                          selectedNotif.color === "red"
                            ? "bg-red-100 text-red-600"
                            : selectedNotif.color === "yellow"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }
                      `}
                          >
                            {selectedNotif.color === "red"
                              ? "BB Turun"
                              : selectedNotif.color === "yellow"
                                ? "Belum Timbang"
                                : "Rujukan"}
                          </span>
                        </div>

                        {/* ================= TURUN BB ================= */}
                        {selectedNotif.color === "red" && (
                          <div className="mt-3 text-sm text-gray-600 flex justify-between">
                            <span>
                              {item.berat_sebelumnya} kg → {item.berat_sekarang}{" "}
                              kg
                            </span>

                            <span className="font-bold text-red-500">
                              ↓ {Math.abs(item.selisih)} kg
                            </span>
                          </div>
                        )}

                        {/* ================= BELUM TIMBANG ================= */}
                        {selectedNotif.color === "yellow" && (
                          <p className="mt-3 text-sm text-yellow-700">
                            Belum melakukan penimbangan bulan ini
                          </p>
                        )}

                        {/* ================= RUJUKAN ================= */}
                        {selectedNotif.color === "green" && (
                          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3">
                            <p className="text-green-700 text-sm font-semibold">
                              {item.keterangan ||
                                "Perlu pemeriksaan lebih lanjut"}
                            </p>

                            {item.alasan && item.alasan.length > 0 && (
                              <ul className="list-disc pl-5 mt-2 text-xs text-gray-600 space-y-1">
                                {item.alasan.map((a, idx) => (
                                  <li key={idx}>{a}</li>
                                ))}
                              </ul>
                            )}

                            {item.tgl_deteksi && (
                              <p className="text-[11px] text-gray-400 mt-3 italic">
                                Pemeriksaan terakhir: {item.tgl_deteksi}
                              </p>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-400 text-sm">
                    Tidak ada data
                  </p>
                )}
              </>
            )}

            {/* ================= INFO MODE ================= */}
            {selectedNotif.type === "info" && (
              <div className="text-center">
                <p className="text-gray-500 text-sm">
                  Jadwal Posyandu berikutnya
                </p>

                <p className="text-xl font-bold text-blue-600 mt-3">
                  {selectedNotif.value || "-"}
                </p>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={() => setSelectedNotif(null)}
              className="
          mt-6
          w-full
          bg-gray-800
          text-white
          py-3
          rounded-xl
          hover:bg-black
          transition
        "
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
