import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone } from "lucide-react";
import api from "@/services/api";

/**
 * Halaman "Lengkapi Nomor HP" — ditampilkan setelah login Google
 * bila akun belum punya nomor HP (query lengkapi_hp=1).
 *
 * Mengapa penting: nomor HP adalah kunci yang menautkan akun ini
 * dengan data anak yang dicatat kader. Tanpa nomor, dashboard
 * orang tua tidak menemukan anaknya.
 *
 * Route: <Route path="/lengkapi-no-telp" element={<LengkapiNoTelp />} />
 */
export default function LengkapiNoTelp() {
  const navigate = useNavigate();
  const [noTelp, setNoTelp] = useState("");
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    // validasi ringan di frontend
    if (!/^(0|62)[0-9]{8,13}$/.test(noTelp)) {
      setMsg({
        type: "error",
        text: "Format nomor tidak valid. Contoh: 081234567890",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/lengkapi-no-telp", { no_telp: noTelp });

      setMsg({ type: "success", text: res.data.message });

      // beri waktu sebentar agar pesan "X anak terhubung" terbaca
      setTimeout(() => navigate("/orangtua/dashboard/id"), 1800);
    } catch (err) {
      setMsg({
        type: "error",
        text:
          err.response?.data?.message || "Gagal menyimpan nomor HP. Coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm border border-gray-200 p-8">
        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">
            <Phone className="text-emerald-600" size={26} />
          </div>

          <h1 className="text-xl font-bold text-gray-800">Lengkapi Nomor HP</h1>

          <p className="mt-2 text-sm text-gray-500 leading-relaxed">
            Nomor HP digunakan untuk menghubungkan akun Anda dengan data anak
            yang telah dicatat oleh kader Posyandu. Gunakan nomor yang sama
            dengan yang Anda berikan saat pencatatan.
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor WhatsApp
            </label>
            <input
              type="tel"
              value={noTelp}
              onChange={(e) => setNoTelp(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="081234567890"
              className="w-full h-12 border border-gray-300 rounded-xl px-4 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {msg && (
            <div
              className={`text-sm text-center rounded-xl px-4 py-3 border ${
                msg.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {msg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition ${
              loading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan & Hubungkan"}
          </button>

          {/* Lewati: boleh masuk dulu, tapi anak belum terhubung */}
          <button
            type="button"
            onClick={() => navigate("/orangtua/dashboard")}
            className="w-full py-3 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-sm"
          >
            Lewati dulu (data anak belum akan tampil)
          </button>
        </form>
      </div>
    </div>
  );
}
