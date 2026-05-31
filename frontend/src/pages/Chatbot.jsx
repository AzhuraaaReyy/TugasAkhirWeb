import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import {
  Sprout,
  Send,
  RotateCcw,
  Phone,
  TrendingUp,
  ChevronRight,
  Baby,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MainLayouts from "@/layouts/MainLayouts";

const WA_URL =
  "https://wa.me/6283162253730?text=" +
  encodeURIComponent("Halo, saya ingin konsultasi kondisi anak saya.");

// Kelas chip dipakai berulang — disimpan sebagai string Tailwind biasa
const CHIP =
  "inline-flex items-center gap-1 bg-white text-[#0a5c3d] border border-[#bfe3cf] " +
  "rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold leading-tight cursor-pointer " +
  "transition hover:bg-[#e6f3ec] hover:-translate-y-px hover:shadow-[0_5px_14px_rgba(15,122,82,0.14)] no-underline";

// Respons cadangan bila API gagal / belum siap
const GREETING_FALLBACK = {
  type: "greeting",
  data: {
    jawaban:
      "Halo, Bunda! Saya Tunas, teman tumbuh si Kecil. Saya siap membantu memantau gizi & pertumbuhan ananda. Mau tanya apa?",
  },
  suggested_questions: [
    {
      label: "Bagaimana kondisi anak saya?",
      type: "ask",
      question: "Bagaimana kondisi anak saya?",
    },
    {
      label: "Apa yang harus dilakukan?",
      type: "ask",
      question: "Apa yang harus saya lakukan?",
    },
  ],
};

const ERROR_RESP = {
  type: "fallback",
  message:
    "Maaf Bunda, sambungan ke server sedang bermasalah. Coba lagi sebentar ya.",
  suggested_questions: [
    { label: "📞 Konsultasi Pakar", type: "whatsapp", url: WA_URL },
  ],
};

const QUICK = [
  "Bagaimana kondisi anak saya?",
  "Apa penyebab stunting?",
  "Tampilkan grafik pertumbuhan",
  "Menu MPASI apa?",
];

/* ====================== RENDER TEKS PESAN ====================== */
function MessageBody({ text }) {
  const parts = text.split(/```/);
  return (
    <div className="space-y-2 text-[14.5px] leading-relaxed">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <pre
            key={i}
            className="overflow-x-auto rounded-xl bg-[#10261d] text-[#cdeede] px-3.5 py-3 text-[11.5px] font-mono leading-relaxed"
          >
            {part.trim()}
          </pre>
        ) : (
          <TextLines key={i} text={part} />
        ),
      )}
    </div>
  );
}

function TextLines({ text }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((ln, i) => {
        const t = ln.trim();
        if (t === "") return <div key={i} className="h-1" />;
        const bullet = /^(-|•)\s+/.test(t);
        const head = /^-\)\s+/.test(t);
        if (bullet) {
          return (
            <div key={i} className="flex gap-2 pl-0.5">
              <span className="text-[#0f7a52] mt-0.5">•</span>
              <span>{t.replace(/^(-|•)\s+/, "")}</span>
            </div>
          );
        }
        if (head) {
          return (
            <div key={i} className="font-semibold text-[#0a5c3d]">
              {t.replace(/^-\)\s+/, "")}
            </div>
          );
        }
        return <div key={i}>{t}</div>;
      })}
    </>
  );
}

/* ====================== GRAFIK ====================== */
function GrowthChart({ data }) {
  const fmt = data.map((d) => ({
    bulan: new Date(d.tgl_format).toLocaleDateString("id-ID", {
      month: "short",
      year: "2-digit",
    }),
    tinggi: d.tinggi,
    berat: d.berat,
  }));
  return (
    <div className="rounded-2xl bg-white border border-[#bfe3cf] pt-3.5 px-2 pb-2 mt-2">
      <div className="flex items-center gap-4 px-3 pb-2 text-xs text-[#3d5a4c]">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-[3px] rounded-sm bg-[#0f7a52]" />
          Tinggi (cm)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-[3px] rounded-sm bg-[#c98a2b]" />
          Berat (kg)
        </span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={fmt}
          margin={{ top: 6, right: 16, left: -18, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 4"
            stroke="#e7eee9"
            vertical={false}
          />
          <XAxis
            dataKey="bulan"
            tick={{ fontSize: 11, fill: "#3d5a4c" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#3d5a4c" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #bfe3cf",
              fontSize: 12,
              boxShadow: "0 6px 20px rgba(15,122,82,.12)",
            }}
          />
          <Line
            type="monotone"
            dataKey="tinggi"
            stroke="#0f7a52"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#0f7a52" }}
            activeDot={{ r: 5 }}
          />
          <Line
            type="monotone"
            dataKey="berat"
            stroke="#c98a2b"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "#c98a2b" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ====================== BADGE LEVEL ====================== */
function LevelBadge({ level }) {
  const map = {
    danger: { t: "Perlu perhatian khusus", c: "bg-[#fbe6e3] text-[#b23b3b]" },
    warning: { t: "Perlu dipantau", c: "bg-[#fbf2dd] text-[#c98a2b]" },
    info: { t: "Data awal", c: "bg-[#e6f3ec] text-[#0f7a52]" },
    normal: { t: "Pertumbuhan sehat", c: "bg-[#e6f3ec] text-[#0f7a52]" },
  };
  const m = map[level] || map.normal;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full text-[11.5px] font-semibold px-[11px] py-1 mb-2 ${m.c}`}
    >
      <TrendingUp size={13} /> {m.t}
    </span>
  );
}

/* ====================== GELEMBUNG BOT ====================== */
function BotMessage({ resp, onAsk, animate }) {
  const text = resp.message ?? resp.data?.jawaban ?? "";
  const level = resp.data?.ews?.level;
  return (
    <div
      className={`flex gap-2.5 items-end ${animate ? "animate-[rise_0.45s_ease_both]" : ""}`}
    >
      <Avatar small />
      <div className="max-w-[84%]">
        <div className="rounded-2xl rounded-bl-md bg-white border border-[#bfe3cf] px-[15px] py-3 text-[#1f3a2e] shadow-[0_8px_22px_rgba(15,90,61,0.07)]">
          {resp.data?.kategori && (
            <span className="inline-block rounded-full bg-[#e6f3ec] text-[#0a5c3d] text-[10.5px] font-bold tracking-wide uppercase px-2.5 py-[3px] mb-2">
              {resp.data.kategori}
            </span>
          )}
          {level && resp.type === "grafik_analisis" && (
            <div>
              <LevelBadge level={level} />
            </div>
          )}
          {text && <MessageBody text={text} />}
          {resp.data?.grafik && <GrowthChart data={resp.data.grafik} />}
        </div>

        {resp.suggested_questions?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {resp.suggested_questions.map((s, i) =>
              s.type === "whatsapp" ? (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#1faf6a] text-white rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold no-underline transition hover:-translate-y-px"
                >
                  <Phone size={13} /> {s.label}
                </a>
              ) : (
                <button
                  key={i}
                  className={CHIP}
                  onClick={() => onAsk(s.question)}
                >
                  {s.label} <ChevronRight size={13} className="opacity-55" />
                </button>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function UserMessage({ text }) {
  return (
    <div className="flex justify-end animate-[rise_0.4s_ease_both]">
      <div className="max-w-[80%] rounded-2xl rounded-br-md bg-gradient-to-br from-[#0f7a52] to-[#0a5c3d] text-white px-[15px] py-[11px] text-[14.5px] leading-relaxed shadow-[0_8px_20px_rgba(15,122,82,0.25)]">
        {text}
      </div>
    </div>
  );
}

function Avatar({ small }) {
  const size = small ? "w-[34px] h-[34px]" : "w-11 h-11";
  return (
    <div
      className={`flex items-center justify-center shrink-0 rounded-full bg-gradient-to-br from-[#0f7a52] to-[#0a5c3d] shadow-[0_0_0_3px_#e6f3ec] ${size}`}
    >
      <Sprout size={small ? 18 : 24} color="#eafaf1" strokeWidth={2.2} />
    </div>
  );
}

function Typing() {
  return (
    <div className="flex gap-2.5 items-end animate-[rise_0.3s_ease_both]">
      <Avatar small />
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-white border border-[#bfe3cf] px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="inline-block w-[7px] h-[7px] rounded-full bg-[#0f7a52] animate-[blink_1.2s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ====================== KOMPONEN UTAMA ====================== */
export default function Chatbot() {
  const { id } = useParams(); // balita_id dari rute /chatbot/:id
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [anak, setAnak] = useState(null); // {name, usia} untuk kartu konteks
  const scrollRef = useRef(null);
  const sessionId = useRef(
    (typeof crypto !== "undefined" && crypto.randomUUID?.()) ||
      String(Date.now()),
  ).current;

  // Auto-scroll ke pesan terbaru
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  // Ambil identitas anak untuk kartu konteks (opsional, untuk header)
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const res = await api.get(`/detaildeteksi/${id}`);
        const item = res.data?.data;
        if (alive && item) {
          setAnak({ name: item.name, usia: item.umur });
        }
      } catch {
        /* abaikan; kartu konteks pakai default */
      }
    })();
    return () => (alive = false);
  }, [id]);

  // Salam pembuka dari backend (dipersonalisasi). Fallback bila gagal.
  useEffect(() => {
    if (!id) return;
    let alive = true;
    (async () => {
      try {
        const res = await api.post("/ask", {
          question: "halo",
          balita_id: Number(id),
          session_id: sessionId,
        });
        if (alive) setMessages([{ role: "bot", resp: res.data }]);
      } catch {
        if (alive) setMessages([{ role: "bot", resp: GREETING_FALLBACK }]);
      }
    })();
    return () => (alive = false);
  }, [id]);

  const send = useCallback(
    async (raw) => {
      const text = (raw ?? "").trim();
      if (!text || typing) return;
      setInput("");
      setMessages((m) => [...m, { role: "user", text }]);
      setTyping(true);
      try {
        const res = await api.post("/ask", {
          question: text,
          balita_id: Number(id),
          session_id: sessionId,
        });
        setMessages((m) => [
          ...m,
          { role: "bot", resp: res.data, fresh: true },
        ]);
      } catch {
        setMessages((m) => [
          ...m,
          { role: "bot", resp: ERROR_RESP, fresh: true },
        ]);
      } finally {
        setTyping(false);
      }
    },
    [typing, id, sessionId],
  );

  const reset = async () => {
    setTyping(false);
    setMessages([]);
    try {
      // "reset chat" memicu handleResetChat di engine -> membersihkan sesi
      const res = await api.post("/ask", {
        question: "reset chat",
        balita_id: Number(id),
        session_id: sessionId,
      });
      setMessages([{ role: "bot", resp: res.data }]);
    } catch {
      setMessages([{ role: "bot", resp: GREETING_FALLBACK }]);
    }
  };

  return (
    <MainLayouts type="chatbot">
      <div className="flex justify-center min-h-screen px-3 pt-[18px] font-['Plus_Jakarta_Sans',system-ui,sans-serif] bg-[#f6f3ea]">
        <div className="flex flex-col w-full max-w-[460px] h-[calc(100vh-18px)] overflow-hidden rounded-t-[26px] border border-b-0 border-[#bfe3cf] bg-white/55 backdrop-blur-sm shadow-[0_-2px_40px_rgba(15,90,61,0.10)]">
          {/* HEADER */}
          <header className="relative overflow-hidden text-white px-[18px] pt-4 pb-[15px] bg-gradient-to-br from-[#0a5c3d] to-[#0f7a52]">
            <div className="absolute -right-8 -top-10 w-[150px] h-[150px] rounded-full bg-white/[0.06]" />
            <div className="absolute right-10 -bottom-12 w-[110px] h-[110px] rounded-full bg-white/5" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar />
                <div>
                  <div className="font-['Fraunces',serif] text-[21px] font-semibold leading-none">
                    Tunas
                  </div>
                  <div className="flex items-center gap-1.5 text-xs opacity-85 mt-1">
                    <span className="w-[7px] h-[7px] rounded-full bg-[#7CF0B0] shadow-[0_0_0_3px_rgba(124,240,176,0.25)]" />
                    Teman tumbuh si Kecil
                  </div>
                </div>
              </div>
              <button
                onClick={reset}
                title="Mulai dari awal"
                className="flex items-center justify-center w-9 h-9 rounded-xl border-none cursor-pointer text-white bg-white/[0.16] transition hover:bg-white/[0.28]"
              >
                <RotateCcw size={17} />
              </button>
            </div>

            {/* KARTU KONTEKS ANAK */}
            <div className="relative flex items-center gap-2.5 rounded-2xl mt-3.5 px-3 py-[9px] bg-white/[0.14]">
              <div className="flex items-center justify-center w-[30px] h-[30px] rounded-[10px] bg-white/[0.18]">
                <Baby size={17} />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-semibold">
                  Ananda {anak?.name || "si Kecil"}
                </div>
                <div className="text-[11px] opacity-85">
                  {anak?.usia ? `${anak.usia} bulan • ` : ""}Pemantauan:
                  Stunting (TB/U)
                </div>
              </div>
            </div>
          </header>

          {/* AREA PESAN */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 pt-[18px] pb-3.5 thin-scroll"
          >
            <div className="flex flex-col gap-4">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <UserMessage key={i} text={m.text} />
                ) : (
                  <BotMessage
                    key={i}
                    resp={m.resp}
                    onAsk={send}
                    animate={m.fresh}
                  />
                ),
              )}
              {typing && <Typing />}
            </div>
          </div>

          {/* QUICK CHIPS (hanya saat awal percakapan) */}
          {messages.length <= 1 && !typing && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-2.5 thin-scroll">
              {QUICK.map((q) => (
                <button
                  key={q}
                  className={`${CHIP} whitespace-nowrap shrink-0`}
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* INPUT */}
          <div className="px-3.5 pt-2.5 pb-4 bg-white/70 border-t border-[#efe9da]">
            <div className="flex items-end gap-2 bg-white border border-[#bfe3cf] rounded-[22px] pl-4 pr-1.5 py-1.5">
              <textarea
                rows={1}
                value={input}
                placeholder="Tulis pertanyaan untuk Tunas…"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                className="flex-1 border-none outline-none resize-none bg-transparent text-[14.5px] text-[#1f3a2e] leading-normal max-h-[100px] py-1.5 placeholder:text-[#a6b0aa]"
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-none shrink-0 transition ${
                  input.trim()
                    ? "bg-gradient-to-br from-[#0f7a52] to-[#0a5c3d] text-white cursor-pointer shadow-[0_6px_16px_rgba(15,122,82,0.3)]"
                    : "bg-[#efe9da] text-[#a6b0aa]"
                }`}
              >
                <Send size={17} />
              </button>
            </div>
            <div className="text-center text-[10.5px] text-[#9aa69e] mt-2">
              Tunas membantu memantau gizi — bukan pengganti tenaga kesehatan.
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
