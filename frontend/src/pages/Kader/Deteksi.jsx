import { useState, useEffect } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import api from "@/services/api";
import { Atom } from "react-loading-indicators";
import FormPencatatan from "../Deteksi/FormPencatatan";
import FormDeteksi from "../Deteksi/FormDeteksi";
import RiwayatDeteksi from "../Deteksi/HasilAnalisisDeteksi";

export default function DeteksiDini() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(null);
  const [posyandus, setPosyandus] = useState([]);
  const [balitas, setBalitas] = useState([]);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});

  const initialForm = {
    name: "",
    jk: "",
    balita_id: "",
    tgl_lahir: "",
    tmp_lahir: "",
    nama_orangtua: "",
    berat: "",
    tinggi: "",
    alamat: "",
    tgl_deteksi: "",
    umur: "",
    metode: "",
    posyandu_id: "",
    no_telp: "",
  };

  const [form, setForm] = useState(initialForm);
  const handleBack = () => {
    setForm(initialForm);
    setStep(null);
    setHasil(null);
    setMetode("");
    setErrorMsg("");
  };
  useEffect(() => {
    const fetchPosyandu = async () => {
      try {
        const res = await api.get("/posyandu");
        setPosyandus(res.data.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchPosyandu();
  }, []);

  const [metode, setMetode] = useState("");
  const [hasil, setHasil] = useState(null);

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= HITUNG UMUR ================= */
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

      setForm((prev) => ({
        ...prev,
        umur: Number(umur),
      }));
    }
  }, [form.tgl_lahir, form.tgl_deteksi]);

  const handleSubmitcatat = async (e) => {
    e.preventDefault();

    try {
      await api.post("/balitas", {
        name: form.name,
        jk: form.jk,
        tgl_lahir: form.tgl_lahir,
        tmp_lahir: form.tmp_lahir,
        posyandu_id: form.posyandu_id,
        nama_orangtua: form.nama_orangtua,
        no_telp: form.no_telp,
        alamat: form.alamat,
      });

      alert("Data balita berhasil disimpan");
      await fetchBalitas();
      handleBack();
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.log(error.response?.data);
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMsg("");

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
        alamat: form.alamat,
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
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };
  //ambil data deteksi
  const fetchData = async () => {
    try {
      const res = await api.get("/deteksi");
      setData(res.data.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //Ambil data balita
  useEffect(() => {
    fetchBalitas();
  }, []);

  const fetchBalitas = async () => {
    try {
      const res = await api.get("/balitas");

      setBalitas(res.data.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleSelectBalita = (e) => {
    const selectedId = e.target.value;

    const selectedBalita = balitas.find((item) => item.id == selectedId);

    console.log(selectedBalita);

    if (selectedBalita) {
      setForm((prev) => ({
        ...prev,
        balita_id: selectedBalita.id,
        nama_orangtua: selectedBalita.orangtua,
        name: selectedBalita.name || "",
        jk:
          selectedBalita.jk === "Laki-Laki"
            ? "L"
            : selectedBalita.jk === "Perempuan"
              ? "P"
              : "",
        tgl_lahir: selectedBalita.tgl_lahir
          ? selectedBalita.tgl_lahir.split("T")[0]
          : "",
        metode: "",
        tgl_deteksi: "",
        umur: "",
        tinggi: "",
        berat: "",
      }));
    }
  };

  return (
    <MainLayouts type="deteksidini">
      <div className="min-h-screen bg-gray-100 p-8">
        {/* ================= LOADING ================= */}
        {loading && (
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <Atom color="#10b981" size="medium" text="Memuat..." />
          </div>
        )}

        {/* ================= ERROR ================= */}
        {errorMsg && (
          <div className="bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {errorMsg}
          </div>
        )}

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Deteksi dan Pemeriksaan Balita
          </h1>

          <p className="text-gray-500 mt-2">
            Pilih layanan yang ingin dilakukan untuk pencatatan data atau
            pemeriksaan status gizi balita.
          </p>
        </div>

        {/* ================= MENU CARD ================= */}
        {!step && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CARD PENCATATAN */}
            <div
              onClick={() => setStep("record")}
              className="bg-white rounded-3xl border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Pencatatan Pemeriksaan
              </h2>

              <p className="text-sm leading-relaxed text-gray-500">
                Input data identitas balita seperti nama anak, tanggal lahir,
                alamat, jenis kelamin, dan data pemeriksaan lainnya untuk
                kebutuhan monitoring kesehatan.
              </p>

              <div className="mt-6">
                <button className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition">
                  Mulai Pencatatan
                </button>
              </div>
            </div>

            {/* CARD DETEKSI */}
            <div
              onClick={() => setStep("deteksi")}
              className="bg-white rounded-3xl border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
                <svg
                  className="w-7 h-7 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-6h13v6M9 5v6h13V5M3 5h.01M3 12h.01M3 19h.01"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-bold text-gray-800 mb-3">
                Deteksi Status Gizi
              </h2>

              <p className="text-sm leading-relaxed text-gray-500">
                Lakukan analisis pertumbuhan balita berdasarkan indikator WHO
                untuk mengetahui status stunting, wasting, maupun underweight.
              </p>

              <div className="mt-6">
                <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition">
                  Mulai Deteksi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= FORM PENCATATAN ================= */}

        {step === "record" && (
          <FormPencatatan
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmitcatat}
            posyandus={posyandus}
            handleBack={handleBack}
            setForm={setForm}
            errors={errors}
          />
        )}
        {/* ================= FORM DETEKSI ================= */}
        {step === "deteksi" && (
          <div className="flex flex-col xl:flex-row gap-6 items-stretch">
            <FormDeteksi
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              setStep={setStep}
              balitas={balitas}
              handleSelectBalita={handleSelectBalita}
              handleBack={handleBack}
            />
            <RiwayatDeteksi hasil={hasil} metode={metode} />
          </div>
        )}
      </div>
    </MainLayouts>
  );
}
