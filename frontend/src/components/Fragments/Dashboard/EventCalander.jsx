import { useEffect, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Clock,
  Circle,
  AlertTriangle,
} from "lucide-react";
import api from "@/services/api";

// Pemetaan warna + label badge pendek dari 'tipe' deskriptif backend.
const getStyle = (tipe) => {
  const t = (tipe || "").toLowerCase();
  if (t.includes("stunting"))
    return {
      dot: "bg-red-500",
      border: "border-l-red-500",
      badge: "bg-red-50 text-red-800",
      label: "STUNTING",
    };
  if (t.includes("imunisasi"))
    return {
      dot: "bg-red-500",
      border: "border-l-red-500",
      badge: "bg-red-50 text-red-800",
      label: "IMUNISASI",
    };
  if (t.includes("penimbangan"))
    return {
      dot: "bg-blue-500",
      border: "border-l-blue-500",
      badge: "bg-blue-50 text-blue-800",
      label: "CEKGIZI",
    };
  if (t.includes("posyandu"))
    return {
      dot: "bg-emerald-500",
      border: "border-l-emerald-500",
      badge: "bg-emerald-50 text-emerald-800",
      label: "POSYANDU",
    };
  if (t.includes("edukasi"))
    return {
      dot: "bg-amber-500",
      border: "border-l-amber-500",
      badge: "bg-amber-50 text-amber-800",
      label: "EDUKASI",
    };
  return {
    dot: "bg-purple-500",
    border: "border-l-purple-500",
    badge: "bg-purple-50 text-purple-800",
    label: (tipe || "LAINNYA").toUpperCase(),
  };
};

export default function EventCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [konfirmasi, setKonfirmasi] = useState(null);
  // Tanggal yang dipilih (null = tampilkan agenda mendatang)
  const [selectedDate, setSelectedDate] = useState(null);

  // ====== FETCH DARI BACKEND ======
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/kalender-notifikasi-ortu");
        const data = res.data || [];
        setEvents(data);

        // Jika HARI INI ada acara -> langsung tampilkan acara hari ini.
        const t = new Date();
        const todayStr = `${t.getFullYear()}-${String(
          t.getMonth() + 1,
        ).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
        const adaAcaraHariIni = data.some(
          (e) => (e.tanggal || "").slice(0, 10) === todayStr,
        );
        if (adaAcaraHariIni) setSelectedDate(t);
      } catch (error) {
        console.error("Gagal fetch kalender:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const mintaKonfirmasi = (evt) => setKonfirmasi(evt);
  const batalKonfirmasi = () => setKonfirmasi(null);

  const tandaiSelesai = async () => {
    if (!konfirmasi) return;
    const id = konfirmasi.id;
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setKonfirmasi(null);
    // try { await api.post(`/notifikasi-ortu/${id}/selesai`); } catch (err) { console.error(err); }
  };

  // ====== KONFIGURASI BULAN BERJALAN ======
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const pad = (n) => n.toString().padStart(2, "0");
  const monthLabel = now
    .toLocaleDateString("id-ID", { month: "long", year: "numeric" })
    .toUpperCase();

  const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();
  const leadingBlanks = (firstWeekday + 6) % 7;
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // ====== HELPER TANGGAL ======
  const formatLokal = (date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const tanggalIndo = (date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  // Penanda kalender memakai SEMUA event (termasuk yang sudah lewat) agar
  // tanggal beracara tetap bertanda & bisa diklik.
  const getEventForDate = (date) => {
    const f = formatLokal(date);
    return events.filter((evt) => (evt.tanggal || "").slice(0, 10) === f);
  };

  const todayStr = formatLokal(now);

  // Daftar default = acara hari ini & mendatang (acara lewat disembunyikan).
  const eventsMendatang = [...events]
    .filter((e) => (e.tanggal || "").slice(0, 10) >= todayStr)
    .sort((a, b) => (a.tanggal || "").localeCompare(b.tanggal || ""));

  // Yang ditampilkan: bila tanggal dipilih -> acara tanggal itu (boleh lewat);
  // bila tidak -> agenda mendatang.
  const eventsTampil = selectedDate
    ? getEventForDate(selectedDate)
    : eventsMendatang;

  // ====== KARTU EVENT (dipakai ulang) ======
  const renderEventCard = (evt) => {
    const style = getStyle(evt.tipe);
    const dateObj = new Date(evt.tanggal);
    const formattedDateString = dateObj.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    return (
      <div
        key={evt.id}
        className={`p-3 bg-stone-50 hover:bg-stone-100 rounded-xl flex items-start gap-3 transition-colors border border-stone-100 border-l-4 ${style.border}`}
      >
        <button
          onClick={() => mintaKonfirmasi(evt)}
          className="mt-0.5 text-stone-300 hover:text-emerald-600 transition-colors"
          title="Tandai selesai (hapus dari daftar)"
        >
          <Circle className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <h4 className="text-xs font-bold leading-tight truncate min-w-0 text-stone-800">
              {evt.judul}
            </h4>
            {evt.tipe && (
              <span
                className={`text-[9px] uppercase font-bold tracking-wider font-mono px-1.5 py-0.5 rounded leading-none shrink-0 whitespace-nowrap ${style.badge}`}
              >
                {style.label}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1.5 text-[10px] text-stone-500">
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3 text-stone-400" />
              {formattedDateString}
              {evt.jam ? ` • ${evt.jam}` : ""}
            </span>
            {evt.lokasi && (
              <span className="flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-stone-400" />
                {evt.lokasi}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      id="event-calendar-card"
      className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/60 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-stone-900 text-lg flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#8fa89b]" />
            Kalender Event
          </h3>
          <span className="text-xs font-bold text-[#8fa89b] uppercase tracking-wider font-mono">
            {monthLabel}
          </span>
        </div>

        {/* Grid kalender */}
        <div className="bg-[#fcfcf9] rounded-2xl p-4 border border-stone-100/80 mb-3 shadow-inner">
          <div className="grid grid-cols-7 gap-y-1.5 text-center text-xs">
            {daysOfWeek.map((day, idx) => (
              <span
                key={idx}
                className="font-semibold text-stone-400 text-[10px] uppercase font-mono tracking-wider"
              >
                {day}
              </span>
            ))}

            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <span key={`blank-${i}`} />
            ))}

            {calendarDays.map((day) => {
              const dayDate = new Date(year, month, day);
              const dayEvents = getEventForDate(dayDate);
              const hasEvents = dayEvents.length > 0;
              const dotColor = hasEvents ? getStyle(dayEvents[0].tipe).dot : "";
              const isToday = day === now.getDate();
              const isSelected =
                selectedDate &&
                formatLokal(selectedDate) === formatLokal(dayDate);

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => setSelectedDate(dayDate)}
                  className="flex flex-col items-center justify-center p-1 relative cursor-pointer focus:outline-none"
                  title={
                    hasEvents
                      ? `${dayEvents.length} acara pada tanggal ini`
                      : "Tidak ada acara"
                  }
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-xl font-mono text-[11px] font-bold transition
                      ${
                        hasEvents
                          ? "bg-[#25352c] text-white shadow-sm"
                          : isToday
                            ? "bg-emerald-100 text-emerald-900"
                            : "text-stone-700 hover:bg-stone-200"
                      }
                      ${
                        isSelected
                          ? "ring-2 ring-amber-500 ring-offset-1 ring-offset-[#fcfcf9]"
                          : isToday
                            ? "ring-2 ring-emerald-500 ring-offset-1 ring-offset-[#fcfcf9]"
                            : ""
                      }`}
                  >
                    {day}
                  </span>
                  {hasEvents && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full absolute bottom-0.5 ${dotColor} animate-pulse`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

       

        {/* Daftar agenda / acara pada tanggal terpilih */}
        <div className="space-y-3 ">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] tracking-widest text-[#8fa89b] font-bold uppercase">
              {selectedDate
                ? `Acara — ${tanggalIndo(selectedDate)}`
                : "Agenda Mendatang:"}
            </span>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="text-[10px] font-bold text-emerald-600 hover:underline uppercase tracking-wider shrink-0"
              >
                Agenda mendatang
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2.5 hide-scrollbar pr-1">
            {loading && (
              <div className="text-xs text-stone-400 text-center py-6">
                Memuat agenda...
              </div>
            )}

            {!loading && eventsTampil.length === 0 && (
              <div className="text-xs text-stone-400 text-center py-6">
                {selectedDate
                  ? "Belum ada acara pada tanggal ini."
                  : "Belum ada agenda mendatang."}
              </div>
            )}

            {!loading && eventsTampil.map((evt) => renderEventCard(evt))}
          </div>
        </div>
      </div>

      {/* ====== POPUP KONFIRMASI SELESAI ====== */}
      {konfirmasi && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={batalKonfirmasi}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-stone-900">
                Tandai sebagai Selesai?
              </h4>
            </div>

            <p className="mt-3 text-sm text-stone-600 leading-relaxed">
              Kegiatan{" "}
              <span className="font-semibold text-stone-800">
                &quot;{konfirmasi.judul}&quot;
              </span>{" "}
              akan ditandai selesai dan{" "}
              <span className="font-semibold">dihapus dari daftar agenda</span>.
              Pastikan Anda memang sudah mengikuti kegiatan ini.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={batalKonfirmasi}
                className="rounded-xl border border-stone-200 px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Batal
              </button>
              <button
                onClick={tandaiSelesai}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Ya, Sudah Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
