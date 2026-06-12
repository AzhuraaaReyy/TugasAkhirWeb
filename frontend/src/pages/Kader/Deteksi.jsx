import { useState, useEffect } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import api from "@/services/api";
import { Atom } from "react-loading-indicators";
import Pagination from "@/components/Pagination/pagination";
import FormPencatatan from "../Deteksi/FormPencatatan";
import FormDeteksi from "../Deteksi/FormDeteksi";
import RiwayatDeteksi from "../Deteksi/HasilAnalisisDeteksi";
import gambarpencatatan from "../../assets/images/rekamedis.png";
import gambardeteksigizi from "../../assets/images/deteksisistem.png";

export default function DeteksiDini() {
  // Animasi render saat halaman pertama dibuka (seperti dashboard)
  const [pageLoading, setPageLoading] = useState(true);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [step, setStep] = useState(null);
  const [posyandus, setPosyandus] = useState([]);
  const [balitas, setBalitas] = useState([]);
  const [penimbangans, setPenimbangans] = useState([]);
  const [data, setData] = useState([]);
  const [errors, setErrors] = useState({});
  const [metode, setMetode] = useState("");
  const [hasil, setHasil] = useState(null);

  // ===== Tabel manajemen (di bawah kartu) =====
  const [tabAktif, setTabAktif] = useState("balita"); // "balita" | "penimbangan"
  const [halaman, setHalaman] = useState(1);
  const perHalaman = 10;

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

  /* ================= FETCHERS ================= */
  const fetchPosyandu = async () => {
    try {
      const res = await api.get("/posyandu");
      setPosyandus(res.data.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ambil data deteksi
  const fetchData = async () => {
    try {
      const res = await api.get("/deteksi");
      setData(res.data.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ambil data balita
  const fetchBalitas = async () => {
    try {
      const res = await api.get("/balitas");
      setBalitas(res.data.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  // ambil data penimbangan
  const fetchPenimbangans = async () => {
    try {
      const res = await api.get("/penimbangans");
      setPenimbangans(res.data.data || res.data || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  /* ============ INIT SAAT HALAMAN DIBUKA ============ */
  useEffect(() => {
    const initHalaman = async () => {
      try {
        await Promise.all([
          fetchPosyandu(),
          fetchData(),
          fetchBalitas(),
          fetchPenimbangans(),
        ]);
      } finally {
        setPageLoading(false);
      }
    };
    initHalaman();
  }, []);

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

  const handleSelectBalita = (e) => {
    const selectedId = e.target.value;

    const selectedBalita = balitas.find((item) => item.id == selectedId);

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

  /* ================= TABEL MANAJEMEN ================= */
  // Ganti tab -> reset pagination ke halaman 1 agar tetap konsisten.
  const pilihTab = (tab) => {
    setTabAktif(tab);
    setHalaman(1);
  };

  const hapusBalita = async (idHapus) => {
    if (!window.confirm("Yakin ingin menghapus data balita ini?")) return;
    try {
      await api.delete(`/balitas/${idHapus}`);
      setBalitas((prev) => prev.filter((it) => it.id !== idHapus));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  const hapusPenimbangan = async (idHapus) => {
    if (!window.confirm("Yakin ingin menghapus data penimbangan ini?")) return;
    try {
      await api.delete(`/penimbangans/${idHapus}`);
      setPenimbangans((prev) => prev.filter((it) => it.id !== idHapus));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus data");
    }
  };

  // Data aktif sesuai tab + slicing pagination
  const dataAktif = tabAktif === "balita" ? balitas : penimbangans;
  const totalHalaman = Math.max(1, Math.ceil(dataAktif.length / perHalaman));
  const halamanAman = Math.min(halaman, totalHalaman);
  const mulai = (halamanAman - 1) * perHalaman;
  const dataTampil = dataAktif.slice(mulai, mulai + perHalaman);

  return (
    <MainLayouts type="deteksidini">
      <div className="h-full bg-gray-100 p-8 ">
        {/* ====== ANIMASI RENDER SAAT HALAMAN DIBUKA / SAAT SUBMIT ====== */}
        {(pageLoading || loading) && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
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

        {/* ================= MENU CARD + TABEL ================= */}
        {!step && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CARD PENCATATAN */}
              <div
                onClick={() => setStep("record")}
                className="bg-white rounded-3xl border p-8 cursor-pointer hover:shadow-xl transition duration-300 group shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7 border-2 border-gray-100"
              >
                <img
                  src={gambarpencatatan}
                  alt="Pencatatan"
                  className="w-full h-[250px] object-cover rounded-xl"
                />

                <h2 className="text-xl font-bold text-gray-800 mb-3 mt-4">
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
                className="bg-white rounded-3xl border border-gray-200 p-8 cursor-pointer hover:shadow-xl transition duration-300 group shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7 border-2 border-gray-100"
              >
                <img
                  src={gambardeteksigizi}
                  alt="Deteksi Gizi"
                  className="w-full h-[250px] object-cover rounded-xl"
                />
                <h2 className="text-xl font-bold text-gray-800 mb-3 mt-4">
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

            {/* ===================== DATA MANAJEMEN ===================== */}
            <div className="mt-8 bg-white rounded-3xl border-2 border-gray-100 shadow-sm p-6">
              {/* Header + Slide pemilih tabel */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Data Manajemen
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {tabAktif === "balita"
                      ? "Daftar data balita yang terdaftar."
                      : "Daftar data penimbangan balita."}
                  </p>
                </div>

                {/* SLIDE / SEGMENTED CONTROL */}
                <div className="relative flex w-full sm:w-[420px] rounded-xl bg-gray-100 p-1">
                  <span
                    className="absolute top-1 bottom-1 rounded-lg bg-white shadow transition-all duration-300 ease-out"
                    style={{
                      left: tabAktif === "balita" ? "0.25rem" : "50%",
                      right: tabAktif === "balita" ? "50%" : "0.25rem",
                    }}
                  />
                  <button
                    onClick={() => pilihTab("balita")}
                    className={`relative z-10 grow basis-0 whitespace-nowrap rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                      tabAktif === "balita"
                        ? "text-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Manajemen Balita
                  </button>
                  <button
                    onClick={() => pilihTab("penimbangan")}
                    className={`relative z-10 grow basis-0 whitespace-nowrap rounded-lg py-2.5 text-center text-sm font-semibold transition-colors ${
                      tabAktif === "penimbangan"
                        ? "text-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Manajemen Penimbangan
                  </button>
                </div>
              </div>

              {/* TABEL */}
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                {tabAktif === "balita" ? (
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Nama Balita</th>
                        <th className="px-4 py-3">JK</th>
                        <th className="px-4 py-3">Posyandu</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-center">
                      {dataTampil.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="py-6 text-gray-400">
                            Data tidak ditemukan
                          </td>
                        </tr>
                      ) : (
                        dataTampil.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3 text-gray-500">
                              {mulai + index + 1}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {item.name || "-"}
                            </td>

                            <td className="px-4 py-3">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  item.jk === "Perempuan"
                                    ? "bg-emerald-100 text-emerald-600"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {item.jk || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {item.posyandu || "-"}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-3">
                                <Link
                                  to={`/kader/detailmanajemenbalita/${item.id}`}
                                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                                >
                                  <FaEye size={14} />
                                </Link>
                                <Link
                                  to={`/kader/updatemanajemenbalita/${item.id}`}
                                  className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg"
                                >
                                  <FaEdit size={14} />
                                </Link>
                                <button
                                  onClick={() => hapusBalita(item.id)}
                                  className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-sm text-left border-collapse">
                    <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                      <tr>
                        <th className="px-4 py-3">No</th>
                        <th className="px-4 py-3">Nama Balita</th>
                        <th className="px-4 py-3">Tgl Penimbangan</th>
                        <th className="px-4 py-3 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-center">
                      {dataTampil.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="py-6 text-gray-400">
                            Data tidak ditemukan
                          </td>
                        </tr>
                      ) : (
                        dataTampil.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-gray-50 transition"
                          >
                            <td className="px-4 py-3 text-gray-500">
                              {mulai + index + 1}
                            </td>
                            <td className="px-4 py-3 text-gray-500">
                              {item.nama_balita || "-"}
                            </td>
                           
                            <td className="px-4 py-3 text-gray-500">
                              {item.tgl_penimbangan
                                ? new Date(
                                    item.tgl_penimbangan,
                                  ).toLocaleDateString("id-ID")
                                : "-"}
                            </td>
                           
                            <td className="px-4 py-3 text-center">
                              <div className="flex justify-center gap-3">
                                <Link
                                  to={`/kader/detailpenimbangan/${item.id}`}
                                  className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                                >
                                  <FaEye size={14} />
                                </Link>
                                <Link
                                  to={`/kader/updatepenimbangan/${item.id}`}
                                  className="text-yellow-600 hover:bg-yellow-100 p-2 rounded-lg"
                                >
                                  <FaEdit size={14} />
                                </Link>
                                <button
                                  onClick={() => hapusPenimbangan(item.id)}
                                  className="text-red-600 hover:bg-red-100 p-2 rounded-lg"
                                >
                                  <FaTrash size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* PAGINATION */}
              <Pagination
                currentPage={halamanAman}
                totalPages={totalHalaman}
                onPageChange={setHalaman}
              />
            </div>
          </>
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
