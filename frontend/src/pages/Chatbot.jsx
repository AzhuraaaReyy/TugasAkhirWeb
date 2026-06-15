import { useEffect, useMemo, useRef, useState } from "react";
import MainLayouts from "@/layouts/MainLayouts";
import api from "@/services/api";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Send,
  Bot,
  CheckCircle,
  AlertCircle,
  Plus,
  MessageSquare,
  Menu,
  X,
  User,
  Ruler,
  Weight,
  Calendar,
  Trash2,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const generateSessionId = () =>
  `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

const ambilTeks = (msg) =>
  msg.message ?? msg.data?.message ?? msg.data?.data?.jawaban ?? "";

const adaTabel = (teks) => typeof teks === "string" && teks.includes("```");
const bersihkanBacktick = (teks) => teks.replaceAll("```", "").trim();

const fmtTanggal = (t) =>
  t
    ? new Date(t).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : null;

const fmtJam = (t) =>
  new Date(t).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

const sapaanPembuka = (nama) =>
  `Halo${nama ? `, ${nama}` : ""}! 👋 Saya GrowthAI, teman pendamping tumbuh ` +
  `kembang si kecil. Saya bisa membantu memberi rekomendasi makanan dan ` +
  `MPASI, ide menu harian, serta langkah yang sebaiknya dilakukan untuk ` +
  `anak. Bila ingin, saya juga bisa menjelaskan kondisi dan grafik ` +
  `pertumbuhannya. Mau mulai dari mana?`;

const pesanPembuka = (nama = null) => ({
  role: "bot",
  type: "welcome",
  message: sapaanPembuka(nama),
  suggested_questions: [
    { label: "Rekomendasi makanan & MPASI", question: "Menu MPASI apa?" },
    {
      label: "Lihat kondisi & grafik anak",
      question: "Bagaimana kondisi anak saya?",
    },
  ],
});

export default function Chatbot() {
  const { id, deteksiId } = useParams();
  const isSnapshot = Boolean(deteksiId);

  /* Penanda peran dari URL (?peran=ortu). Dashboard orang tua membuka chatbot
     dengan parameter ini agar data anak diambil dari rute orang tua. */
  const [searchParams] = useSearchParams();
  const isOrtu = searchParams.get("peran") === "ortu";

  /* Nama user yang sedang login (diisi dari response detailmonitoring) */
  const [namaUser, setNamaUser] = useState(null);

  const storageKey = isSnapshot
    ? `GrowthAI_chats_${id}_snap_${deteksiId}`
    : `GrowthAI_chats_${id}`;

  const muatSesi = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const buatSesiBaru = () => ({
    sessionId: isSnapshot
      ? `sess_snap_${deteksiId}_${generateSessionId()}`
      : generateSessionId(),
    title: null, // diisi pertanyaan pertama
    createdAt: new Date().toISOString(),
    messages: [pesanPembuka(namaUser)],
  });

  const [sessions, setSessions] = useState(() => {
    const tersimpan = muatSesi();
    return tersimpan.length ? tersimpan : [buatSesiBaru()];
  });
  const [activeIdx, setActiveIdx] = useState(0);
  const aktif = sessions[activeIdx] ?? sessions[0];
  const messages = useMemo(() => aktif?.messages ?? [], [aktif]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(sessions));
    } catch {
      /* abaikan bila storage penuh */
    }
  }, [sessions, storageKey]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarTerbuka, setSidebarTerbuka] = useState(false); // mobile
  const chatEndRef = useRef(null);

  /* ===== PROFIL ANAK ===== */
  const [child, setChild] = useState(null);
  const [gagalMuat, setGagalMuat] = useState(false);
  useEffect(() => {
    const getBalita = async () => {
      setGagalMuat(false);

      const kandidat = isSnapshot
        ? isOrtu
          ? [
              `/detailmonitoring-snapshot-ortu/${deteksiId}`,
              `/detailmonitoring-snapshot/${deteksiId}`,
            ]
          : [
              `/detailmonitoring-snapshot/${deteksiId}`,
              `/detailmonitoring-snapshot-ortu/${deteksiId}`,
            ]
        : isOrtu
          ? [`/detailmonitoring-ortu/${id}`, `/detailmonitoring/${id}`]
          : [`/detailmonitoring/${id}`, `/detailmonitoring-ortu/${id}`];

      for (const url of kandidat) {
        try {
          const res = await api.get(url);
          const d = res.data?.data;
          if (!d) continue;

          setChild({
            name: d.name,
            umur: d.umur,
            jk: d.jk,
            berat: d.berat,
            tinggi: d.tinggi,
            status: d.status?.tbu ?? "-",
            tanggal: d.tgl_deteksi ?? null,
          });

          // nama user login (orang tua / kader) dari backend
          setNamaUser(d.nama_user ?? null);
          return; // berhasil — hentikan percobaan
        } catch {
          // endpoint ini tidak boleh diakses / gagal — coba kandidat berikutnya
          console.warn(`Gagal memuat ${url}, mencoba endpoint lain...`);
        }
      }

      // semua kandidat gagal
      setGagalMuat(true);
    };

    getBalita();
  }, [id, deteksiId, isSnapshot, isOrtu]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeIdx]);

  /* ===== AKSI SESI ===== */
  const gantiSesi = (idx) => {
    setActiveIdx(idx);
    setSidebarTerbuka(false);
  };

  const chatBaru = () => {
    setSessions((prev) => [buatSesiBaru(), ...prev]);
    setActiveIdx(0);
    setSidebarTerbuka(false);
  };

  const hapusSesi = (idx, e) => {
    e.stopPropagation();
    if (!window.confirm("Hapus percakapan ini?")) return;
    setSessions((prev) => {
      const sisa = prev.filter((_, i) => i !== idx);
      return sisa.length ? sisa : [buatSesiBaru()];
    });
    setActiveIdx(0);
  };

  const setPesanAktif = (updater) => {
    setSessions((prev) =>
      prev.map((s, i) =>
        i === activeIdx ? { ...s, messages: updater(s.messages) } : s,
      ),
    );
  };

  /* ===== KIRIM PERTANYAAN (endpoint & payload tidak berubah) ===== */
  const handleSuggested = (item) => {
    if (item.type === "whatsapp" && item.url) {
      window.open(item.url, "_blank", "noopener");
      return;
    }
    if (item.question) sendQuestion(item.question);
  };

  const sendQuestion = async (customQuestion = null) => {
    if (loading) return;

    const q = customQuestion || question;
    if (!q.trim()) return;

    setSessions((prev) =>
      prev.map((s, i) =>
        i === activeIdx && !s.title ? { ...s, title: q.slice(0, 60) } : s,
      ),
    );

    setPesanAktif((prevMsgs) => [
      ...prevMsgs,
      { role: "user", message: q, time: new Date().toISOString() },
      { role: "bot", loading: true },
    ]);
    setQuestion("");

    try {
      setLoading(true);

      const res = await api.post(isSnapshot ? "/ask-snapshot" : "/ask", {
        question: q,
        balita_id: id,
        session_id: aktif.sessionId,
        ...(isSnapshot && { deteksi_id: deteksiId }),
      });

      setPesanAktif((prevMsgs) => {
        const updated = [...prevMsgs];
        updated[updated.length - 1] = {
          role: "bot",
          data: res.data,
          time: new Date().toISOString(),
        };
        return updated;
      });
    } catch (error) {
      console.error("ERROR:", error);
      console.error("DATA:", error.response?.data);
      setPesanAktif((prevMsgs) => {
        const updated = [...prevMsgs];
        updated[updated.length - 1] = {
          role: "bot",
          data: { status: "error", message: "Terjadi kesalahan koneksi" },
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const statusNormal = (child?.status || "").toLowerCase().includes("normal");
  const tanggalSnapshot = fmtTanggal(child?.tanggal);
  const namaTampil =
    child?.name || (gagalMuat ? "Data tidak tersedia" : "Memuat...");

  /* ===== POTONGAN UI KECIL ===== */
  const InfoRow = ({ icon, label, value }) => {
    const Icon = icon;
    return (
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
          <Icon size={15} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-gray-400">
            {label}
          </p>
          <p className="truncate text-sm font-semibold text-gray-800">
            {value}
          </p>
        </div>
      </div>
    );
  };

  const DaftarSesi = () => (
    <>
      <button
        onClick={chatBaru}
        className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
      >
        <Plus size={16} /> Percakapan baru
      </button>

      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
        Riwayat chat
      </p>

      <div className="flex-1 space-y-1 overflow-y-auto pr-1">
        {sessions.map((s, idx) => (
          <button
            key={s.sessionId}
            onClick={() => gantiSesi(idx)}
            className={`group flex w-full items-start gap-2.5 rounded-xl px-3 py-2.5 text-left transition ${
              idx === activeIdx
                ? "bg-emerald-50 ring-1 ring-emerald-100"
                : "hover:bg-gray-50"
            }`}
          >
            <MessageSquare
              size={15}
              className={`mt-0.5 shrink-0 ${
                idx === activeIdx ? "text-emerald-600" : "text-gray-400"
              }`}
            />
            <span className="min-w-0 flex-1">
              <span
                className={`block truncate text-sm ${
                  idx === activeIdx
                    ? "font-semibold text-emerald-900"
                    : "text-gray-600"
                }`}
              >
                {s.title || "Percakapan baru"}
              </span>
              <span className="block text-[11px] text-gray-400">
                {fmtTanggal(s.createdAt)} · {fmtJam(s.createdAt)}
              </span>
            </span>
            <span
              onClick={(e) => hapusSesi(idx, e)}
              className="hidden shrink-0 rounded-md p-1 text-gray-300 hover:bg-red-50 hover:text-red-500 group-hover:block"
              title="Hapus percakapan"
            >
              <Trash2 size={13} />
            </span>
          </button>
        ))}
      </div>
    </>
  );

  return (
    <MainLayouts>
      <div className="overflow-hidden bg-emerald-50/60 ">
        <div className="mx-auto flex h-[calc(100dvh-88px)] max-w-[1400px] gap-0 p-3 sm:p-4 mt-6 ">
          {/* ============ PANEL KIRI: RIWAYAT CHAT ============ */}
          <aside className="hidden w-72 shrink-0 flex-col rounded-l-3xl border border-emerald-100 bg-white p-4 md:flex">
            <DaftarSesi />
          </aside>

          {/* Mobile: drawer */}
          {sidebarTerbuka && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div
                className="absolute inset-0 bg-black/30"
                onClick={() => setSidebarTerbuka(false)}
              />
              <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white p-4 shadow-xl">
                <button
                  onClick={() => setSidebarTerbuka(false)}
                  className="mb-3 self-end rounded-lg p-1.5 text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
                <DaftarSesi />
              </aside>
            </div>
          )}

          {/* ============ PANEL TENGAH: TANYA JAWAB ============ */}
          <main className="flex min-w-0 flex-1 flex-col rounded-3xl border border-emerald-100 bg-white md:rounded-l-none md:border-l-0 xl:rounded-r-none xl:border-r-1">
            {/* Header ruang chat */}
            <div className="flex items-center gap-3 border-b border-emerald-50 px-4 py-3 sm:px-6">
              <button
                onClick={() => setSidebarTerbuka(true)}
                className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 md:hidden"
              >
                <Menu size={18} />
              </button>

              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                  <Bot size={18} />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-gray-900">
                  GrowthAI — Asisten Pertumbuhan Anak
                </p>
                <p className="truncate text-xs text-gray-400">
                  {isSnapshot && tanggalSnapshot
                    ? `Membahas pemeriksaan ${tanggalSnapshot}`
                    : `Mendampingi tumbuh kembang ${child?.name || "si kecil"}`}
                </p>
              </div>

              {isSnapshot && tanggalSnapshot && (
                <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 sm:flex">
                  <Calendar size={13} /> {tanggalSnapshot}
                </span>
              )}
            </div>

            {/* Daftar pesan */}
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
              {messages.map((msg, index) => {
                // Sapaan pembuka selalu hidup: pakai nama user terkini,
                // bukan teks yang tersimpan di sesi lama.
                const teks =
                  msg.type === "welcome"
                    ? sapaanPembuka(namaUser)
                    : ambilTeks(msg);
                const tabel = adaTabel(teks);
                const grafik = msg.data?.data?.grafik;
                const saran =
                  msg.suggested_questions || msg.data?.suggested_questions;

                if (msg.role === "user") {
                  return (
                    <div key={index} className="flex justify-end">
                      <div className="max-w-[85%] sm:max-w-xl">
                        <div className="rounded-2xl rounded-br-md bg-emerald-600 px-4 py-2.5 text-sm leading-relaxed text-white shadow-sm">
                          {msg.message}
                        </div>
                        {msg.time && (
                          <p className="mt-1 text-right text-[10px] text-gray-400">
                            {fmtJam(msg.time)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={index} className="flex gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                      <Bot size={15} />
                    </div>
                    <div className="min-w-0 max-w-[88%] sm:max-w-2xl">
                      {msg.loading ? (
                        <div className="rounded-2xl rounded-tl-md border border-emerald-50 bg-emerald-50/50 px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-400">
                            GrowthAI sedang mengetik
                            <span className="animate-pulse">...</span>
                          </span>
                        </div>
                      ) : (
                        <div className="rounded-2xl rounded-tl-md border border-emerald-50 bg-emerald-50/50 px-4 py-3">
                          {/* TEKS — tabel riwayat pakai monospace */}
                          {tabel ? (
                            <pre className="overflow-x-auto whitespace-pre rounded-xl bg-white p-3 font-mono text-[11px] leading-relaxed text-gray-800 ring-1 ring-emerald-50">
                              {bersihkanBacktick(teks)}
                            </pre>
                          ) : (
                            <div className="whitespace-pre-line text-sm leading-relaxed text-gray-800">
                              {teks}
                            </div>
                          )}

                          {/* GRAFIK */}
                          {Array.isArray(grafik) && grafik.length > 0 && (
                            <div className="mt-4 h-64 rounded-xl bg-white p-2 ring-1 ring-emerald-50">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={grafik}>
                                  <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#ecfdf5"
                                  />
                                  <XAxis
                                    dataKey="tgl_format"
                                    tick={{ fontSize: 11 }}
                                  />
                                  <YAxis tick={{ fontSize: 11 }} />
                                  <Tooltip />
                                  <Legend />
                                  <Line
                                    type="monotone"
                                    dataKey="tinggi"
                                    name="Tinggi (cm)"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="berat"
                                    name="Berat (kg)"
                                    stroke="#f59e0b"
                                    strokeWidth={2}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          )}

                          {/* CHIP SARAN */}
                          {saran?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {saran.map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleSuggested(item)}
                                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                                    item.type === "whatsapp"
                                      ? "border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700"
                                      : "border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"
                                  }`}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {msg.time && !msg.loading && (
                        <p className="mt-1 text-[10px] text-gray-400">
                          {fmtJam(msg.time)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-emerald-50 p-3 sm:p-4">
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/40 px-3 py-2 transition focus-within:border-emerald-300 focus-within:bg-white">
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                  placeholder={
                    isSnapshot
                      ? "Tanya seputar hasil pemeriksaan ini..."
                      : "Tanya seputar pertumbuhan anak..."
                  }
                  className="flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-gray-400"
                />
                <button
                  disabled={loading}
                  onClick={() => sendQuestion()}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-sm transition ${
                    loading
                      ? "cursor-not-allowed bg-emerald-300"
                      : "bg-emerald-600 hover:bg-emerald-700"
                  }`}
                >
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-gray-300">
                Jawaban GrowthAI bersifat edukatif, bukan pengganti pemeriksaan
                tenaga kesehatan.
              </p>
            </div>
          </main>

          {/* ============ PANEL KANAN: INFO ANAK ============ */}
          <aside className="hidden w-80 shrink-0 flex-col gap-4 rounded-r-3xl border border-emerald-100 border-l-0 bg-white p-5 xl:flex">
            <div className="flex flex-col items-center pt-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-extrabold text-emerald-600 ring-4 ring-emerald-50">
                {child?.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <h3 className="mt-3 text-lg font-bold text-gray-900">
                {namaTampil}
              </h3>

              <div
                className={`mt-1.5 flex items-center gap-1.5 text-sm font-semibold ${
                  statusNormal ? "text-emerald-600" : "text-amber-600"
                }`}
              >
                {statusNormal ? (
                  <CheckCircle size={14} />
                ) : (
                  <AlertCircle size={14} />
                )}
                {child?.status || "-"}
              </div>

              {isSnapshot && tanggalSnapshot && (
                <span className="mt-2 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                  Pemeriksaan {tanggalSnapshot}
                </span>
              )}
            </div>

            <div className="border-t border-emerald-50 pt-4">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                Data anak
              </p>
              <div className="space-y-3.5">
                <InfoRow
                  icon={User}
                  label="Jenis kelamin"
                  value={
                    child?.jk === "L"
                      ? "Laki-laki"
                      : child?.jk === "P"
                        ? "Perempuan"
                        : "-"
                  }
                />
                <InfoRow
                  icon={Calendar}
                  label="Umur"
                  value={`${child?.umur ?? "-"} bulan`}
                />
                <InfoRow
                  icon={Weight}
                  label="Berat badan"
                  value={`${child?.berat ?? "-"} kg`}
                />
                <InfoRow
                  icon={Ruler}
                  label="Tinggi badan"
                  value={`${child?.tinggi ?? "-"} cm`}
                />
              </div>
            </div>

            <div className="mt-auto rounded-2xl bg-emerald-50/60 p-4 text-xs leading-relaxed text-gray-500">
              Pantau terus tumbuh kembang si kecil lewat pemeriksaan rutin di
              posyandu setiap bulan.
            </div>
          </aside>
        </div>
      </div>
    </MainLayouts>
  );
}
