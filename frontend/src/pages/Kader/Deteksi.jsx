import { useState, useEffect, useRef } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import api from "@/services/api";
import Typewriter from "@/components/Animations/Typewriter";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// 🔥 Helper untuk generate session ID
const generateSessionId = () =>
  `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export default function DeteksiDini() {
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    name: "",
    jk: "",
    balita_id: "",
    tgl_lahir: "",
    berat: "",
    tinggi: "",
    tgl_deteksi: "",
    umur: "",
    metode: "",
  });
  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [metode, setMetode] = useState("");
  const [hasil, setHasil] = useState(null);
  // 🔥 BARU: Session ID untuk context memory
  const [sessionId, setSessionId] = useState(generateSessionId());
  const chatEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    // 🔥 Reset session setiap deteksi baru (percakapan baru)
    setSessionId(generateSessionId());

    try {
      const res = await api.post("/deteksi", {
        name: form.name,
        jk: form.jk,
        balita_id: form.balita_id,
        tgl_deteksi: form.tgl_deteksi,
        berat: form.berat,
        tinggi: form.tinggi,
        tgl_lahir: form.tgl_lahir,
        metode: form.metode,
      });

      const data = res.data;
      setMetode(form.metode);
      setHasil({
        id: data.id,
        balita_id: data.balita_id,
        name: data.name,
        umur: data.umur,
        bb: data.bb,
        tb: data.tb,
        tanggal_deteksi: form.tgl_deteksi,
        zscore_bbu: data.zscore_bbu || "-",
        zscore_tbu: data.zscore_tbu || "-",
        zscore_bbtb: data.zscore_bbtb || "-",
        status_bbu: {
          status: data.status_bbu.status,
          warna: data.status_bbu.warna,
          keterangan: data.status_bbu.keterangan || "",
        },
        status_tbu: {
          status: data.status_tbu.status,
          warna: data.status_tbu.warna,
          keterangan: data.status_tbu.keterangan || "",
        },
        status_bb_tb: {
          status: data.status_bb_tb.status,
          warna: data.status_bb_tb.warna,
          keterangan: data.status_bb_tb.keterangan || "",
        },
        rekomendasi_tbu: data.rekomendasi_tbu || "",
        rekomendasi_bbu: data.rekomendasi_bbu || "",
        rekomendasi_bbtb: data.rekomendasi_bbtb || "",
      });
      await api.post("/detaildeteksi/store", {
        deteksi_id: data.id,
      });
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (hasil) {
      let status = "";
      let penjelasan = "";
      let zscore = "";
      let rekomendasi = [];

      if (metode === "stunting") {
        status = hasil.status_tbu.status;
        penjelasan = hasil.status_tbu.keterangan;
        rekomendasi = hasil.rekomendasi_tbu;
        zscore = hasil.zscore_tbu;
      }
      if (metode === "wasting") {
        status = hasil.status_bb_tb.status;
        penjelasan = hasil.status_bb_tb.keterangan;
        rekomendasi = hasil.rekomendasi_bbtb;
        zscore = hasil.zscore_bbtb;
      }
      if (metode === "underweight") {
        status = hasil.status_bbu.status;
        penjelasan = hasil.status_bbu.keterangan;
        rekomendasi = hasil.rekomendasi_bbu;
        zscore = hasil.zscore_bbu;
      }

      setChat([{ role: "bot", type: "loading" }]);

      setTimeout(() => {
        const message = {
          role: "bot",
          type: "auto",
          content: `Halo Bunda! \n\nSaya sudah menganalisis hasil deteksi yang telah dilakukan. Berikut ringkasannya:\n\n Dapat diketahui bahwa status balita tersebut adalah: ${status}\n${penjelasan ? `\n Karena z-score tersebut menunjukkan ${zscore}, yang berarti  ${penjelasan}\n` : ""}${
            Array.isArray(rekomendasi) && rekomendasi.length > 0
              ? `\n Untuk membantu memperbaiki kondisi ini, Bunda dapat melakukan beberapa langkah berikut:\n${rekomendasi.map((r) => "  • " + r).join("\n")}\n`
              : ""
          }\nSilakan pilih pertanyaan di bawah, atau ketik pertanyaan Bunda sendiri! `,
         
          suggested_questions: [
            {
              label: "Bagaimana kondisi anak saya?",
              type: "ask",
              question: "Bagaimana kondisi anak saya?",
            },
            {
              label: "Tampilkan grafik pertumbuhan anak",
              type: "ask",
              question: "tampilkan grafik",
            },
          ],
        };

        setChat([message]);
      }, 1000);
    }
  }, [hasil, metode]);

  // 🔥 UPDATED: handleAsk dengan session_id + handle WhatsApp action
  const handleAsk = async (customQuestion = null, action = null) => {
    if (action?.type === "whatsapp") {
      window.open(action.url, "_blank");
      return;
    }

    const q = customQuestion || question;

    if (!q.trim()) return;

    if (!hasil?.id) {
      alert("Lakukan deteksi terlebih dahulu sebelum bertanya!");
      return;
    }

    setChat((prev) => [
      ...prev,
      { role: "user", text: q },
      { role: "bot", type: "loading" },
    ]);

    setQuestion("");

    try {
      // 🔥 CUMA 1 REQUEST SAJA
      const res = await api.post("/ask", {
        question: q,
        balita_id: hasil.id,
        session_id: sessionId,
      });

      const responseData = res.data;

      if (responseData?.topic === "reset_chat") {
        setChat([
          {
            role: "bot",
            data: responseData,
          },
        ]);
      } else {
        setChat((prev) => {
          const newChat = [...prev];
          newChat[newChat.length - 1] = {
            role: "bot",
            data: responseData,
          };
          return newChat;
        });
      }
    } catch (error) {
      setChat((prev) => {
        const newChat = [...prev];
        newChat[newChat.length - 1] = {
          role: "bot",
          data: {
            status: "error",
            message:
              error.response?.data?.message || "Terjadi kesalahan koneksi",
          },
        };
        return newChat;
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await api.get("/deteksi");
      setData(res.data.data || res.data || []);
    } catch (error) {
      console.error(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (form.tgl_lahir && form.tgl_deteksi) {
      const lahir = new Date(form.tgl_lahir);
      const deteksi = new Date(form.tgl_deteksi);

      if (deteksi < lahir) {
        setForm((prev) => ({ ...prev, umur: 0 }));
        return;
      }

      let umur =
        (deteksi.getFullYear() - lahir.getFullYear()) * 12 +
        (deteksi.getMonth() - lahir.getMonth());
      if (deteksi.getDate() < lahir.getDate()) umur -= 1;

      setForm((prev) => ({ ...prev, umur: Number(umur) }));
    }
  }, [form.tgl_lahir, form.tgl_deteksi]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (loading)
    return (
      <MainLayouts>
        <div className="p-6">Loading data...</div>
      </MainLayouts>
    );

  return (
    <MainLayouts type="deteksidini">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8 font-sans">
        {errorMsg && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {errorMsg}
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-800">
            Sistem Deteksi Dini Stunting
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Lakukan skrining awal untuk mendeteksi risiko stunting berdasarkan
            data pertumbuhan balita.
          </p>

          {/* FORM INPUT (sama seperti sebelumnya, tidak diubah) */}
          <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 mb-10 border border-gray-300 border-2">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-600">Nama Balita</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  placeholder="Contoh: Aisyah Putri"
                  required
                  className="w-full h-12 border border-gray-700 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Metode Pengecekan
                </label>
                <select
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  name="metode"
                  value={form.metode}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pilih metode</option>
                  <option value="stunting">Stunting (TB/U)</option>
                  <option value="wasting">Wasting (BB/TB)</option>
                  <option value="underweight">Underweight (BB/U)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Kelamin
                </label>
                <select
                  name="jk"
                  onChange={handleChange}
                  required
                  className="w-full h-12 border border-gray-700 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="">Pilih Jenis Kelamin</option>
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Lahir</label>
                <input
                  type="date"
                  name="tgl_lahir"
                  required
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Deteksi</label>
                <input
                  type="date"
                  name="tgl_deteksi"
                  required
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Umur (bulan)</label>
                <input
                  type="number"
                  value={Math.floor(form.umur)}
                  name="umur"
                  onChange={handleChange}
                  placeholder="Masukkan umur balita"
                  required
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  name="tinggi"
                  step="any"
                  onChange={handleChange}
                  placeholder="Masukkan tinggi balita"
                  required
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  name="berat"
                  step="any"
                  placeholder="Masukkan berat balita"
                  onChange={handleChange}
                  required
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <button className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition">
                  Deteksi Sekarang
                </button>
              </div>
            </form>
          </div>

          {/* HASIL */}
          {hasil && (
            <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 space-y-6 border border-gray-300 border-2 mb-5">
              <h2 className="text-xl font-extrabold">Hasil Analisis Deteksi</h2>

              {/* Z-Score Card (sama seperti sebelumnya) */}
              <div className="text-center">
                {metode === "stunting" && (
                  <div
                    className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_tbu.warna}`}
                  >
                    <p className="font-semibold">{hasil.zscore_tbu}</p>
                    <p className="text-sm text-black font-semibold">
                      Z-Score TB/U
                    </p>
                    {hasil.status_tbu.status}
                    <p className="text-xs text-gray-500 mt-2">
                      *Status stunting ditentukan berdasarkan indikator{" "}
                      <span className="font-medium text-black">
                        Tinggi Badan menurut Umur (TB/U)
                      </span>{" "}
                      sesuai standar pertumbuhan WHO.
                    </p>
                  </div>
                )}
                {metode === "wasting" && (
                  <div
                    className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_bb_tb.warna}`}
                  >
                    <p className="font-semibold">{hasil.zscore_bbtb}</p>
                    <p className="text-sm text-black font-semibold">
                      Z-Score BB/TB
                    </p>
                    {hasil.status_bb_tb.status}
                    <p className="text-xs text-gray-500 mt-2">
                      *Status wasting ditentukan berdasarkan indikator{" "}
                      <span className="font-medium text-black">
                        Berat Badan menurut Tinggi Badan (BB/TB)
                      </span>{" "}
                      sesuai standar pertumbuhan WHO.
                    </p>
                  </div>
                )}
                {metode === "underweight" && (
                  <div
                    className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_bbu.warna}`}
                  >
                    <p className="font-semibold">{hasil.zscore_bbu}</p>
                    <p className="text-sm text-black font-semibold">
                      Z-Score BB/U
                    </p>
                    {hasil.status_bbu.status}
                    <p className="text-xs text-gray-500 mt-2">
                      *Status underweight ditentukan berdasarkan indikator{" "}
                      <span className="font-medium text-black">
                        Berat Badan menurut Umur (BB/U)
                      </span>{" "}
                      sesuai standar pertumbuhan WHO.
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-300 overflow-hidden mt-20">
                {/* Chat header */}
                <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-600 px-6 lg:px-8 py-5 border-b border-emerald-100/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xl shadow-md shadow-emerald-200">
                        🤖
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        Asisten Gizi Pintar
                      </h3>
                      <p className="text-xs text-white font-medium animate-pulse ">
                        ● Online — siap menjawab pertanyaan Bunda
                      </p>
                    </div>
                  </div>
                </div>

                {/* CHAT LIST */}
                <div className="h-[28rem] overflow-y-auto scrollbar-thin px-4 lg:px-6 py-5 bg-gradient-to-b from-gray-50/40 to-white space-y-5">
                  {chat.map((c, i) => (
                    <div key={i} className="flex flex-col gap-1">
                      {/* USER */}
                      {c.role === "user" && (
                        <div className="flex justify-end items-end gap-2 animate-slide-in-right">
                          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-2xl rounded-br-md shadow-md shadow-emerald-200 text-sm max-w-xs leading-relaxed">
                            {c.text}
                          </div>
                          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                            U
                          </div>
                        </div>
                      )}

                      {/* BOT */}
                      {c.role === "bot" && (
                        <div className="flex items-start gap-2 animate-slide-in">
                          <div className="w-9 h-9 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center rounded-full text-base shadow-sm border border-emerald-200/50 flex-shrink-0">
                            🤖
                          </div>

                          <div className="flex flex-col gap-2 max-w-lg">
                            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm text-sm text-gray-700 leading-relaxed">
                              {/* LOADING */}
                              {c.type === "loading" && (
                                <div className="flex items-center gap-2">
                                  <div className="flex gap-1">
                                    <span
                                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "0ms" }}
                                    ></span>
                                    <span
                                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "150ms" }}
                                    ></span>
                                    <span
                                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                                      style={{ animationDelay: "300ms" }}
                                    ></span>
                                  </div>
                                  <span className="text-xs text-gray-400 italic">
                                    Sedang mengetik...
                                  </span>
                                </div>
                              )}

                              {/* AUTO INSIGHT */}
                              {c.type === "auto" && (
                                <Typewriter
                                  speed={20}
                                  delay={200}
                                  showCursor={true}
                                >
                                  {c.content}
                                </Typewriter>
                              )}

                              {/* DETEKSI (kondisi/solusi) */}
                              {c.data?.type === "deteksi" &&
                                c.data?.message && (
                                  <Typewriter speed={15}>
                                    {c.data.message}
                                  </Typewriter>
                                )}
                              {c.data?.type === "monitoring" &&
                                c.data?.message && (
                                  <Typewriter speed={15}>
                                    {c.data.message}
                                  </Typewriter>
                                )}
                              {c.data?.type === "riwayat" &&
                                c.data?.message && (
                                  <Typewriter speed={15}>
                                    {c.data.message}
                                  </Typewriter>
                                )}
                              {c.data?.type === "perkembangan" &&
                                c.data?.message && (
                                  <Typewriter speed={15}>
                                    {c.data.message}
                                  </Typewriter>
                                )}

                              {/* KNOWLEDGE BASE */}
                              {c.data?.type === "knowledge_base" && (
                                <div>
                                  <Typewriter speed={15}>
                                    {c.data.data.jawaban}
                                  </Typewriter>
                                </div>
                              )}

                              {/* GREETING */}
                              {c.data?.type === "greeting" && (
                                <Typewriter speed={15}>
                                  {c.data.data.jawaban}
                                </Typewriter>
                              )}

                              {/* FALLBACK */}
                              {(c.data?.status === "fallback" ||
                                c.data?.type === "fallback") && (
                                <Typewriter speed={15}>
                                  {c.data.message}
                                </Typewriter>
                              )}

                              {c.data?.type === "grafik" && (
                                <Typewriter speed={15}>
                                  {c.data.message}
                                </Typewriter>
                              )}
                              {c.data?.type === "grafik_analisis" && (
                                <Typewriter speed={15}>
                                  {c.data.message}
                                </Typewriter>
                              )}
                              {c.data?.type === "system" && (
                                <Typewriter speed={15}>
                                  {c.data.message}
                                </Typewriter>
                              )}

                              {/* ERROR */}
                              {c.data?.status === "error" && (
                                <div className="flex items-start gap-2 text-rose-600">
                                  <span>⚠️</span>
                                  <p>{c.data.message}</p>
                                </div>
                              )}

                              {/* GRAFIK */}
                              {c.data?.type === "grafik" &&
                                Array.isArray(
                                  c.data?.data?.grafik || c.data?.grafik,
                                ) && (
                                  <div className="mt-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 p-4 rounded-2xl border border-emerald-100">
                                    <div className="flex items-center justify-between mb-3">
                                      <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                                        <span>📈</span> Grafik Pertumbuhan
                                      </h3>
                                      <div className="flex gap-3 text-xs">
                                        <span className="flex items-center gap-1">
                                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                          <span className="text-gray-600">
                                            Tinggi
                                          </span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                          <span className="text-gray-600">
                                            Berat
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                    <ResponsiveContainer
                                      width="100%"
                                      height={220}
                                    >
                                      <LineChart data={c.data.data.grafik}>
                                        <CartesianGrid
                                          strokeDasharray="3 3"
                                          stroke="#e5e7eb"
                                        />
                                        <XAxis
                                          dataKey="tgl_format"
                                          stroke="#9ca3af"
                                          fontSize={11}
                                        />
                                        <YAxis stroke="#9ca3af" fontSize={11} />
                                        <Tooltip
                                          contentStyle={{
                                            background: "white",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: "12px",
                                            boxShadow:
                                              "0 4px 12px rgba(0,0,0,0.08)",
                                            fontSize: "12px",
                                          }}
                                        />
                                        <Line
                                          type="monotone"
                                          dataKey="tinggi"
                                          stroke="#10b981"
                                          strokeWidth={2.5}
                                          dot={{ r: 4, fill: "#10b981" }}
                                          activeDot={{ r: 6 }}
                                        />
                                        <Line
                                          type="monotone"
                                          dataKey="berat"
                                          stroke="#f59e0b"
                                          strokeWidth={2.5}
                                          dot={{ r: 4, fill: "#f59e0b" }}
                                          activeDot={{ r: 6 }}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                )}
                            </div>

                            {/* SUGGESTED QUESTIONS */}
                            {(c.suggested_questions?.length > 0 ||
                              c.data?.suggested_questions?.length > 0) && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {(
                                  c.suggested_questions ||
                                  c.data.suggested_questions
                                ).map((sq, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() =>
                                      sq.type === "whatsapp"
                                        ? handleAsk(null, sq)
                                        : handleAsk(sq.question)
                                    }
                                    className={`text-xs px-3.5 py-2 rounded-full font-semibold transition-all hover:-translate-y-0.5 ${
                                      sq.type === "whatsapp"
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300"
                                        : "bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400 shadow-sm"
                                    }`}
                                  >
                                    {sq.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* INPUT */}
                <div className="border-t border-gray-100 px-4 lg:px-6 py-4 bg-white">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl pl-4 pr-2 py-2 focus-within:border-emerald-400 focus-within:bg-white focus-within:shadow-md focus-within:shadow-emerald-100 transition-all">
                    <span className="text-gray-400">💬</span>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Tanyakan Pertanyaanmu..."
                      className="flex-1 outline-none text-sm bg-transparent placeholder:text-gray-400"
                      onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                    />
                    <button
                      onClick={() => handleAsk()}
                      disabled={!question.trim()}
                      className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-200 hover:shadow-lg flex items-center gap-1.5"
                    >
                      <span>Kirim</span>
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2.5"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-2 text-center">
                    💡 Tip: Pilih saran pertanyaan di atas untuk jawaban yang
                    sudah terverifikasi
                  </p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50/70 border border-amber-200/70 rounded-2xl px-5 py-4 flex items-start gap-3">
                <span className="text-xl flex-shrink-0">ℹ️</span>
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-bold">Catatan penting:</span> Hasil ini
                  merupakan skrining awal berbasis standar WHO dan tidak
                  menggantikan diagnosis medis. Untuk pemeriksaan menyeluruh,
                  silakan konsultasi dengan tenaga kesehatan di puskesmas atau
                  rumah sakit terdekat.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayouts>
  );
}
