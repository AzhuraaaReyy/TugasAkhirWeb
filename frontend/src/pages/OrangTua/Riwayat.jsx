import HeaderProfile from "@/components/Fragments/Riwayat/HeaderProfile";
import TimelineCard from "@/components/Fragments/Riwayat/TimelineCard";
import MainLayouts from "@/layouts/MainLayouts";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import { Baby } from "lucide-react";
import { Atom } from "react-loading-indicators";
import EvaluasiKenaikanBulanan from "@/components/Fragments/Riwayat/EvaluasiBulananCard";

// Daftarkan DUA route ke komponen ini (sama seperti dashboard ortu):
//   <Route path="/orangtua/riwayat" element={<RiwayatOrtu />} />
//   <Route path="/orangtua/riwayat/:id" element={<RiwayatOrtu />} />
const BASE_PATH = "/orangtua/riwayat";

// Hitung umur ringkas dari tgl_lahir (untuk kartu pemilih anak)
const hitungUmur = (tglLahir) => {
  if (!tglLahir) return "-";
  const lahir = new Date(tglLahir);
  const now = new Date();
  let bulan =
    (now.getFullYear() - lahir.getFullYear()) * 12 +
    (now.getMonth() - lahir.getMonth());
  if (now.getDate() < lahir.getDate()) bulan -= 1;
  if (bulan < 0) return "-";
  return bulan < 24
    ? `${bulan} bulan`
    : `${Math.floor(bulan / 12)} tahun ${bulan % 12} bulan`;
};

// Overlay loading dengan Atom (dipakai di beberapa tahap)
const LayarMemuat = ({ text = "Memuat..." }) => (
  <MainLayouts type="riwayatortu">
    <div className="relative min-h-[70vh] w-full">
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
        <Atom color="#10b981" size="medium" text={text} />
      </div>
    </div>
  </MainLayouts>
);

export default function RiwayatOrtu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  // Daftar anak milik orang tua yang login (null = masih dimuat)
  const [anakSaya, setAnakSaya] = useState(null);

  const [form, setForm] = useState({
    name: "",
    umur: "",
    jk: "",
    tgl_deteksi: "",
    tinggi: "",
    berat: "",
    zscore_tbu: "",
    zscore_bbu: "",
    zscore_bbtb: "",
    status_tbu: "",
    status_bbu: "",
    status_bbtb: "",
    keterangan: "",
    rekomendasi: "",
    total_deteksi: "",
    berat_sekarang: "",
    berat_sebelumnya: "",
    tinggi_sekarang: "",
    tinggi_sebelumnya: "",
    orang_tua: "",
    status: "",
    riwayat: [],
    lokasi_posyandu: "",
    kader_pemeriksa: "",
    balita_id: "",
  });

  const metode = location.state?.metode || "stunting";
  const hasil = location.state?.hasil || "";

  /* ============ AMBIL DAFTAR ANAK MILIK SENDIRI ============
     Menentukan balita milik orang tua yang login. Bila URL tidak membawa
     :id dan orang tua hanya punya 1 anak, langsung diarahkan ke anak itu.
     Daftar ini juga dipakai untuk memastikan id yang dibuka memang miliknya. */
  useEffect(() => {
    api
      .get("/balita-saya")
      .then((res) => {
        const anak = res.data || [];
        setAnakSaya(anak);

        if (!id && anak.length === 1) {
          navigate(`${BASE_PATH}/${anak[0].id}`, { replace: true });
        }
      })
      .catch((err) => {
        console.error("Error ambil daftar anak:", err);
        setAnakSaya([]);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ============ TIMELINE + DETAIL + DATA BALITA (digabung) ============ */
  useEffect(() => {
    if (!id) return;
    let aktif = true;

    const fetchSemua = async () => {
      setLoading(true);
      try {
        // Timeline + data balita diambil paralel
        const [resRiwayat, resBalita] = await Promise.all([
          api.get(`/ambilstatustimeline-ortu/${id}`),
          api.get(`/balitas-ortu/${id}`),
        ]);

        const dataRiwayat = resRiwayat.data?.data || [];
        const terbaru = dataRiwayat[dataRiwayat.length - 1] || {};
        const sebelumnya = dataRiwayat[dataRiwayat.length - 2] || {};
        const balita = resBalita.data?.data || {};

        // Detail dipanggil dgn DETEKSI_ID terbaru (bukan balita_id)
        let detail = {};
        if (terbaru.id) {
          const resDetail = await api.get(`/detaildeteksi-ortu/${terbaru.id}`);
          detail = resDetail.data?.data || {};
        }

        // status: prioritaskan hasil deteksi baru, lalu data terbaru di timeline
        const statusMapping = {
          stunting: hasil?.status_tbu?.status || detail.status?.tbu,
          wasting: hasil?.status_bb_tb?.status || detail.status?.bbtb,
          underweight: hasil?.status_bbu?.status || detail.status?.bbu,
        };
        const statusByMetode = {
          stunting: terbaru.status_tbu,
          wasting: terbaru.status_bbtb,
          underweight: terbaru.status_bbu,
        };

        if (!aktif) return;

        setForm((prev) => ({
          ...prev,

          // ----- dari /balitas-ortu/:id -----
          balita_id: balita.id ?? id,
          name: balita.name || "",
          jk:
            balita.jk === "L" || balita.jk?.toLowerCase() === "laki-laki"
              ? "L"
              : balita.jk === "P" || balita.jk?.toLowerCase() === "perempuan"
                ? "P"
                : "",
          orang_tua: balita.orangtua || "",
          tgl_lahir: balita.tgl_lahir || "",

          // ----- angka inti dari timeline (sudah dihitung & konsisten) -----
          umur: terbaru.umur ?? detail.umur ?? "",
          tgl_deteksi: terbaru.tgl_deteksi ?? detail.tgl_deteksi ?? "",
          status: statusMapping[metode] || statusByMetode[metode] || "-",

          berat_sekarang: terbaru.berat ?? detail.berat ?? "",
          berat_sebelumnya: sebelumnya.berat ?? detail.berat_sebelumnya ?? "",
          tinggi_sekarang: terbaru.tinggi ?? detail.tinggi ?? "",
          tinggi_sebelumnya:
            sebelumnya.tinggi ?? detail.tinggi_sebelumnya ?? "",

          // ----- info tambahan dari detail -----
          keterangan: detail.keterangan ?? "",
          rekomendasi: detail.rekomendasi ?? "",
          lokasi_posyandu:
            detail.lokasi_posyandu ||
            detail.posyandu ||
            balita.lokasi_posyandu ||
            balita.posyandu ||
            "Posyandu Wilayah",
          kader_pemeriksa:
            detail.kader_pemeriksa ||
            balita.kader_pemeriksa ||
            "Kader Posyandu",

          riwayat: dataRiwayat,
        }));
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        if (aktif) setLoading(false);
      }
    };

    fetchSemua();
    return () => {
      aktif = false;
    };
  }, [id, metode, hasil]);

  /* ============================================================
     TAHAP 1 — BELUM ADA ANAK DIPILIH (tanpa :id di URL)
     ============================================================ */
  if (!id) {
    if (anakSaya === null) {
      return <LayarMemuat text="MEMUAT..." />;
    }

    if (anakSaya.length === 0) {
      return (
        <MainLayouts type="riwayatortu">
          <div className="flex min-h-[70vh] items-center justify-center p-6">
            <div className="max-w-lg text-center">
              <div className="mb-4 text-6xl">👶</div>
              <h2 className="text-2xl font-bold text-gray-800">
                Belum Ada Data Anak
              </h2>
              <p className="mt-3 text-gray-600">
                Akun Anda belum terhubung dengan data balita. Silakan hubungi
                kader Posyandu untuk mendaftarkan anak Anda.
              </p>
            </div>
          </div>
        </MainLayouts>
      );
    }

    if (anakSaya.length === 1) {
      return <LayarMemuat text={`Membuka riwayat ${anakSaya[0].name}...`} />;
    }

    // 2 anak atau lebih -> KARTU PILIH ANAK
    return (
      <MainLayouts type="riwayatortu">
        <div className="min-h-[80vh] bg-[#F4F7F4] p-6 flex items-center justify-center">
          <div className="w-full max-w-3xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-extrabold text-gray-800">
                Pilih Anak
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Anda memiliki {anakSaya.length} anak terdaftar. Pilih salah satu
                untuk melihat riwayat pemeriksaannya.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {anakSaya.map((anak) => (
                <button
                  key={anak.id}
                  onClick={() => navigate(`${BASE_PATH}/${anak.id}`)}
                  className="group bg-white rounded-3xl border-2 border-gray-100 p-6 text-left shadow-sm hover:shadow-xl hover:border-emerald-400 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-extrabold text-white ${
                        anak.jk === "L" ? "bg-blue-400" : "bg-pink-400"
                      }`}
                    >
                      {anak.name?.charAt(0)?.toUpperCase() || (
                        <Baby size={28} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 text-lg truncate">
                        {anak.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {anak.jk === "L" ? "Laki-laki" : "Perempuan"} •{" "}
                        {hitungUmur(anak.tgl_lahir)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
                    Lihat Riwayat →
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </MainLayouts>
    );
  }

  /* ============================================================
     TAHAP 2 — ADA :id, TAPI BUKAN ANAK MILIK SENDIRI
     ============================================================ */
  if (anakSaya && !anakSaya.some((a) => String(a.id) === String(id))) {
    return (
      <MainLayouts type="riwayatortu">
        <div className="flex min-h-[70vh] items-center justify-center p-6">
          <div className="max-w-lg text-center">
            <div className="mb-4 text-6xl">🔒</div>
            <h2 className="text-2xl font-bold text-gray-800">
              Akses Tidak Diizinkan
            </h2>
            <p className="mt-3 text-gray-600">
              Data balita ini bukan milik akun Anda.
            </p>
            <button
              onClick={() => navigate(BASE_PATH, { replace: true })}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700"
            >
              Kembali ke Anak Saya
            </button>
          </div>
        </div>
      </MainLayouts>
    );
  }

  if (loading) {
    return <LayarMemuat text="MEMUAT..." />;
  }

  /* ============================================================
     TAHAP 3 — TAMPILAN RIWAYAT
     ============================================================ */
  return (
    <MainLayouts type="riwayatortu">
      <div className="min-h-screen bg-[#F4F7F4] font-sans antialiased py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          {/* ===== PENGGANTI ANAK (pill, hanya jika anak > 1) ===== */}
          {anakSaya && anakSaya.length > 1 && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-gray-600 mr-1">
                Anak:
              </span>
              {anakSaya.map((anak) => {
                const aktif = String(anak.id) === String(id);
                return (
                  <button
                    key={anak.id}
                    onClick={() =>
                      !aktif && navigate(`${BASE_PATH}/${anak.id}`)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                      aktif
                        ? "bg-emerald-600 text-white shadow"
                        : "bg-white text-gray-600 border border-gray-200 hover:border-emerald-400 hover:text-emerald-600"
                    }`}
                  >
                    {anak.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="mb-8 pb-2 border-b border-gray-200/60">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
              Lihat Riwayat Balita
            </h1>
            <p className=" w-full  text-sm text-gray-500 mt-2  leading-relaxed">
              Halaman ini menampilkan riwayat pemeriksaan dan hasil deteksi
              risiko stunting berdasarkan data pertumbuhan balita dari waktu ke
              waktu.
            </p>
          </div>

          {/* Grid Konten Utama */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
              <HeaderProfile form={form} />
              <EvaluasiKenaikanBulanan form={form} />
            </div>
            <div className="flex-1 w-full h-full">
              <TimelineCard
                form={form}
                metode={metode}
                onLihatMonitoring={(balitaId, deteksiId) =>
                  navigate(`/orangtua/monitoring/${balitaId}/${deteksiId}`)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
