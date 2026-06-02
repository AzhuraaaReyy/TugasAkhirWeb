import { useEffect, useRef, useState } from "react";
import MainLayouts from "@/layouts/MainLayouts";
import api from "@/services/api";
import { ArrowLeft, Send, Bot, User, CheckCircle } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const generateSessionId = () =>
  `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(generateSessionId());
  const chatEndRef = useRef(null);

  const [child] = useState({
    id: 1,
    name: "Azhura",
    umur: 24,
    jk: "Perempuan",
    berat: 11.5,
    tinggi: 86,
    status: "Normal",
  });

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

  const sendQuestion = async (customQuestion = null) => {
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
      const res = await api.post("/ask", {
        question: q,
        balita_id: child.id,
        session_id: sessionId,
      });

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "bot", data: res.data };
        return updated;
      });
    } catch (error) {
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

  return (
    <MainLayouts>
      <div className="min-h-screen bg-[#F7FAF8]">
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
            <button>
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
                Ready to help explain child growth
              </p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-5 py-6">
          <div className="bg-white rounded-3xl border border-emerald-100 p-6 shadow-sm">
            <div className="flex justify-between flex-wrap gap-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100"></div>
                <div>
                  <h3 className="font-bold text-2xl">{child.name}</h3>
                  <p className="text-gray-500">
                    {child.umur} months • {child.jk}
                  </p>
                </div>
              </div>
              <div className="flex gap-10">
                <div>
                  <p className="text-gray-400 text-sm">Weight</p>
                  <p className="text-emerald-700 font-bold">{child.berat}kg</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Height</p>
                  <p className="text-emerald-700 font-bold">{child.tinggi}cm</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle size={16} /> {child.status}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 pb-40 mt-10">
            {messages.map((msg, index) => (
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
                    <div className="max-w-3xl">
                      {msg.loading ? (
                        <div className="bg-white rounded-3xl px-5 py-4 shadow-sm">
                          Loading...
                        </div>
                      ) : (
                        <div className="bg-white rounded-3xl px-5 py-4 shadow-sm whitespace-pre-line">
                          {msg.message || msg.data?.message}
                          {msg.data?.type === "grafik" && (
                            <div className="mt-4 h-64">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={msg.data.data.grafik}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="tgl_format" />
                                  <YAxis />
                                  <Tooltip />
                                  <Line
                                    type="monotone"
                                    dataKey="tinggi"
                                    stroke="#10b981"
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="berat"
                                    stroke="#f59e0b"
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          )}
                          {(
                            msg.suggested_questions ||
                            msg.data?.suggested_questions
                          )?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {(
                                msg.suggested_questions ||
                                msg.data.suggested_questions
                              ).map((item, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => sendQuestion(item.question)}
                                  className="px-4 py-2 rounded-full border border-gray-200 bg-white hover:bg-emerald-50 text-sm"
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
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>

        <div className="fixed bottom-5 left-0 right-0">
          <div className="max-w-4xl mx-auto px-5">
            <div className="bg-white border border-emerald-100 rounded-3xl shadow-xl flex items-center px-4 py-3">
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendQuestion()}
                placeholder="Ask about growth..."
                className="flex-1 outline-none bg-transparent px-2"
              />
              <button
                disabled={loading}
                onClick={() => sendQuestion()}
                className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center"
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
