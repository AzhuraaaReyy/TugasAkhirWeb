import { useEffect, useRef, useState } from "react";
import MainLayouts from "@/layouts/MainLayouts";
import api from "@/services/api";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, CheckCircle, AlertCircle } from "lucide-react";
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

/* Ambil teks jawaban dari berbagai bentuk respons engine:
   - message di level atas (deteksi, grafik, fallback, monitoring, ...)
   - data.jawaban (knowledge_base, sapaan, definisi) */
const ambilTeks = (msg) =>
  msg.message ?? msg.data?.message ?? msg.data?.data?.jawaban ?? "";

/* Tabel riwayat dikirim dalam blok ``` (str_pad) -> butuh monospace */
const adaTabel = (teks) => typeof teks === "string" && teks.includes("```");
const bersihkanBacktick = (teks) => teks.replaceAll("```", "").trim();

export default function Chatbot() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const chatEndRef = useRef(null);

  const [child, setChild] = useState(null);
  useEffect(() => {
    const getBalita = async () => {
      try {
        const res = await api.get(`/detailmonitoring/${id}`);

        setChild({
          name: res.data.data.name,
          umur: res.data.data.umur,
          jk: res.data.data.jk,
          berat: res.data.data.berat,
          tinggi: res.data.data.tinggi,
          status: res.data.data.status?.tbu ?? "-",
        });
      } catch (error) {
        console.error(error);
      }
    };

    getBalita();
  }, [id]);

  const [messages, setMessages] = useState([
    {
      role: "bot",
      type: "welcome",
      message:
        "Halo Bunda 👋 Saya Tunas. Saya siap membantu menjelaskan hasil monitoring, grafik pertumbuhan, status gizi, perkembangan, dan rekomendasi kesehatan anak.",
      suggested_questions: [
        {
          label: "Bagaimana kondisi anak saya?",
          question: "Bagaimana kondisi anak saya?",
        },
        { label: "Tampilkan grafik pertumbuhan", question: "tampilkan grafik" },
        {
          label: "Jelaskan status gizi",
          question: "jelaskan status gizi anak saya",
        },
      ],
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Klik chip saran: tipe whatsapp membuka link, sisanya bertanya */
  const handleSuggested = (item) => {
    if (item.type === "whatsapp" && item.url) {
      window.open(item.url, "_blank", "noopener");
      return;
    }
    if (item.question) sendQuestion(item.question);
  };

  const sendQuestion = async (customQuestion = null) => {
    if (loading) return; // cegah kirim ganda saat menunggu jawaban

    const q = customQuestion || question;
    if (!q.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", message: q },
      { role: "bot", loading: true },
    ]);
    setQuestion("");

    try {
      setLoading(true);
      const res = await api.post("/ask-ortu", {
        question: q,
        balita_id: id,
        session_id: sessionId,
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", data: res.data };
        return updated;
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => {
        const updated = [...prev];
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

  return (
    <MainLayouts>
      <div className="min-h-screen bg-[#F7FAF8]">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
            <button onClick={() => navigate(-1)} aria-label="Kembali">
              <ArrowLeft />
            </button>
            <img
              src="/images/tunas.png"
              alt="Tunas"
              className="w-12 h-12 rounded-full border-2 border-emerald-500"
            />
            <div>
              <h2 className="font-bold text-xl text-emerald-700">Tunas</h2>
              <p className="text-sm text-gray-500">
                Siap membantu menjelaskan pertumbuhan anak
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-5 py-6">
          {/* ===== KARTU PROFIL ANAK ===== */}
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
            <div className="flex justify-between flex-wrap gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-extrabold text-emerald-600">
                  {child?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <h3 className="font-bold text-2xl">
                    {child?.name || "Loading..."}
                  </h3>
                  <p className="text-gray-500">
                    {child?.umur ?? "-"} bulan •{" "}
                    {child?.jk === "L"
                      ? "Laki-laki"
                      : child?.jk === "P"
                        ? "Perempuan"
                        : "-"}
                  </p>
                </div>
              </div>
              <div className="flex gap-10">
                <div>
                  <p className="text-gray-400 text-sm">Berat</p>
                  <p className="text-emerald-700 font-bold">
                    {child?.berat ?? "-"} kg
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tinggi</p>
                  <p className="text-emerald-700 font-bold">
                    {child?.tinggi ?? "-"} cm
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <div
                    className={`flex items-center gap-1 font-semibold ${
                      statusNormal ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {statusNormal ? (
                      <CheckCircle size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    {child?.status || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== PERCAKAPAN ===== */}
          <div className="space-y-6 pb-40 mt-10">
            {messages.map((msg, index) => {
              const teks = ambilTeks(msg);
              const tabel = adaTabel(teks);
              const grafik = msg.data?.data?.grafik;
              const saran =
                msg.suggested_questions || msg.data?.suggested_questions;

              return (
                <div key={index}>
                  {msg.role === "user" ? (
                    <div className="flex justify-end">
                      <div className="bg-emerald-100 border border-emerald-200 px-5 py-3 rounded-3xl max-w-xl">
                        {msg.message}
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Bot size={18} />
                      </div>
                      <div className="max-w-3xl min-w-0">
                        {msg.loading ? (
                          <div className="bg-white rounded-3xl px-5 py-4 shadow-sm">
                            <span className="inline-flex gap-1 items-center text-gray-400">
                              Tunas sedang mengetik
                              <span className="animate-pulse">...</span>
                            </span>
                          </div>
                        ) : (
                          <div className="bg-white rounded-3xl px-5 py-4 shadow-sm">
                            {/* TEKS JAWABAN — tabel riwayat pakai monospace */}
                            {tabel ? (
                              <pre className="font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre">
                                {bersihkanBacktick(teks)}
                              </pre>
                            ) : (
                              <div className="whitespace-pre-line">{teks}</div>
                            )}

                            {/* GRAFIK — tampil untuk semua respons yg bawa data.grafik */}
                            {Array.isArray(grafik) && grafik.length > 0 && (
                              <div className="mt-4 h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={grafik}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="tgl_format" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                      type="monotone"
                                      dataKey="tinggi"
                                      name="Tinggi (cm)"
                                      stroke="#10b981"
                                    />
                                    <Line
                                      type="monotone"
                                      dataKey="berat"
                                      name="Berat (kg)"
                                      stroke="#f59e0b"
                                    />
                                  </LineChart>
                                </ResponsiveContainer>
                              </div>
                            )}

                            {/* CHIP SARAN — tipe whatsapp membuka link */}
                            {saran?.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-4">
                                {saran.map((item, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleSuggested(item)}
                                    className={`px-4 py-2 rounded-full border text-sm transition ${
                                      item.type === "whatsapp"
                                        ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                        : "border-gray-200 bg-white hover:bg-emerald-50"
                                    }`}
                                  >
                                    {item.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* ===== INPUT ===== */}
        <div className="fixed bottom-5 left-0 right-0">
          <div className="max-w-4xl mx-auto px-5">
            <div className="bg-white border border-emerald-100 rounded-3xl shadow-xl flex items-center px-4 py-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                placeholder="Tanya seputar pertumbuhan anak..."
                className="flex-1 outline-none bg-transparent px-2"
              />
              <button
                disabled={loading}
                onClick={() => sendQuestion()}
                className={`w-11 h-11 rounded-full text-white flex items-center justify-center transition ${
                  loading
                    ? "bg-emerald-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
