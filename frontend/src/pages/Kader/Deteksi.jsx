import { useState, useEffect } from "react";
import MainLayouts from "../../layouts/MainLayouts";
import Select from "react-select";
import api from "@/services/api";
import { Navigate, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "@/components/Pagination/pagination";
export default function DeteksiDini() {
  const [balitaList, setBalitaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [form, setForm] = useState({
    balita_id: "",
    umur: "",
    berat: "",
    tinggi: "",
    tgl_deteksi: "",
    lingkar_kepala: "",
    lingkar_lengan: "",
  });

  const [metode, setMetode] = useState(""); // stunting, wasting, underweight
  const [hasil, setHasil] = useState(null);

  // Auto-fill saat pilih balita
  const handleChangeBalita = (selected) => {
    const balita = balitaList.find((b) => b.id === selected.value);
    if (!balita) return;

    setForm({
      ...form,
      balita_id: balita.id,
      umur: balita.umur,
      berat: balita.berat || "",
      tinggi: balita.tinggi || "",
      lingkar_kepala: balita.lingkar_kepala || "",
      lingkar_lengan: balita.lingkar_lengan || "",
    });
  };
  const [detailForm, setDetailForm] = useState({
    keterangan: "",
    rekomendasi: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/deteksi", {
        balita_id: form.balita_id,
        tgl_deteksi: form.tgl_deteksi,
        berat: form.berat,
        tinggi: form.tinggi,
        umur: form.umur,
        lingkar_kepala: form.lingkar_kepala,
        lingkar_lengan: form.lingkar_lengan,
      });

      const data = res.data;

      setHasil({
        id: data.id,
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
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitDetail = async (e) => {
    e.preventDefault();
    if (!hasil?.id) {
      alert("Lakukan deteksi terlebih dahulu!");
      return;
    }

    try {
      await api.post("/detaildeteksi/store", {
        deteksi_id: hasil.id,
        keterangan: detailForm.keterangan,
        rekomendasi: detailForm.rekomendasi,
      });
      alert("Deteksi berhasil disimpan!");
      navigate("/kader/detaildeteksi");
    } catch (error) {
      const message = error.response?.data?.message || "Terjadi kesalahan";

      setErrorMsg(message);
    }
  };
  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.get("/ambilbalita");
        setBalitaList(res.data || []);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBalita();
  }, []);

  const balitaOptions = balitaList.map((b) => ({
    value: b.id,
    label: b.name,
  }));

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data?")) return;

    try {
      await api.delete(`/deteksi/delete/${id}`);
      setData((prev) => prev.filter((item) => item.id !== id));
      alert("Data berhasil dihapus");
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data");
    }
  };

  //detail
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/deteksi"); // endpoint index
        setData(res.data.data || res.data || []);
      } catch (error) {
        console.error(error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //filter
  const filteredData = data.filter((item) => {
    const nama = item.name || "";

    const matchSearch = nama.toLowerCase().includes(search.toLowerCase());

    return matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentData = filteredData.slice(startIndex, endIndex);

  //warna
  const statusWarna = {
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",
    "Pendek (stunted)": "bg-yellow-400 text-white",
    Normal: "bg-green-500 text-white",
    Tinggi: "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };

  const baseStyle =
    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

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
          <h1 className="text-2xl font-bold tracking-tight  text-gray-800">
            Sistem Deteksi Dini Stunting
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Lakukan skrining awal untuk mendeteksi risiko stunting berdasarkan
            data pertumbuhan balita.
          </p>

          {/* FORM INPUT */}
          <div className="bg-emerald-50 rounded-3xl shadow-lg p-8 mb-10 border border-gray-300 border-2">
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              {/* PILIH BALITA */}
              <div>
                <label className="text-sm text-gray-600">Pilih Balita</label>
                <Select
                  options={balitaOptions}
                  placeholder="Cari Balita..."
                  noOptionsMessage={() => "Balita tidak ditemukan"}
                  onChange={handleChangeBalita}
                  formatOptionLabel={(data) => (
                    <div className="font-medium text-gray-800">
                      {data.label}
                    </div>
                  )}
                  filterOption={(option, inputValue) =>
                    option.label
                      .toLowerCase()
                      .includes(inputValue.toLowerCase())
                  }
                  unstyled
                  classNames={{
                    control: () =>
                      "w-full mt-1 border rounded-xl px-2 py-1 bg-emerald-50",
                    menu: () => "border mt-1 rounded-xl shadow-md bg-white",
                    menuList: () => "max-h-40 overflow-y-auto",
                    option: ({ isFocused, isSelected }) =>
                      `px-4 py-2 cursor-pointer ${isSelected ? "bg-emerald-500 text-white" : isFocused ? "bg-emerald-100" : ""}`,
                  }}
                />
              </div>

              {/* PILIH METODE */}
              <div>
                <label className="text-sm text-gray-600">
                  Metode Pengecekan
                </label>
                <select
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                  required
                >
                  <option value="">Pilih metode</option>
                  <option value="stunting">Stunting (TB/U)</option>
                  <option value="wasting">Wasting (BB/TB)</option>
                  <option value="underweight">Underweight (BB/U)</option>
                </select>
              </div>

              {/* TANGGAL PENIMBANGAN */}
              <div>
                <label className="text-sm text-gray-600">Tanggal Deteksi</label>
                <input
                  type="date"
                  name="tgl_deteksi"
                  value={form.tgl_deteksi}
                  className="w-full mt-1 border rounded-xl px-4 py-2 text-sm text-gray-600"
                  onChange={(e) =>
                    setForm({ ...form, tgl_deteksi: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Umur (bulan)</label>
                <input
                  type="number"
                  value={form.umur}
                  onChange={(e) => setForm({ ...form, umur: e.target.value })}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                  readOnly
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Tinggi Badan (cm)
                </label>
                <input
                  type="number"
                  value={form.tinggi}
                  onChange={(e) => setForm({ ...form, tinggi: e.target.value })}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Berat Badan (kg)
                </label>
                <input
                  type="number"
                  value={form.berat}
                  onChange={(e) => setForm({ ...form, berat: e.target.value })}
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Lingkar Kepala (cm)
                </label>
                <input
                  type="number"
                  value={form.lingkar_kepala}
                  onChange={(e) =>
                    setForm({ ...form, lingkar_kepala: e.target.value })
                  }
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Lingkar Lengan (cm)
                </label>
                <input
                  type="number"
                  value={form.lingkar_lengan}
                  onChange={(e) =>
                    setForm({ ...form, lingkar_lengan: e.target.value })
                  }
                  className="w-full mt-1 border rounded-xl px-4 py-2"
                  required
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

              {/* Z-Score & Status */}
              <div className=" text-center">
                {metode === "stunting" && (
                  <>
                    <div
                      className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_tbu.warna}`}
                    >
                      <p className="font-semibold">{hasil.zscore_tbu}</p>
                      <p className="text-sm text-black font-semibold">
                        Z-Score TB/U
                      </p>
                      {hasil.status_tbu.status}
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Status stunting ditentukan berdasarkan indikator{" "}
                        <span className="font-medium text-black">
                          Tinggi Badan menurut Umur (TB/U)
                        </span>{" "}
                        sesuai standar pertumbuhan WHO.
                      </p>
                    </div>
                  </>
                )}
                {metode === "wasting" && (
                  <>
                    <div
                      className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_bb_tb.warna}`}
                    >
                      <p className="font-semibold">{hasil.zscore_bbtb}</p>
                      <p className="text-sm text-black font-semibold">
                        Z-Score BB/TB
                      </p>
                      {hasil.status_bb_tb.status}

                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Status wasting ditentukan berdasarkan indikator{" "}
                        <span className="font-medium text-black">
                          Berat Badan menurut Tinggi Badan (TB/U)
                        </span>{" "}
                        sesuai standar pertumbuhan WHO.
                      </p>
                    </div>
                  </>
                )}
                {metode === "underweight" && (
                  <>
                    <div
                      className={`p-6 rounded-2xl text-center text-xl font-bold ${hasil.status_bbu.warna}`}
                    >
                      <p className="font-semibold">{hasil.zscore_bbu}</p>
                      <p className="text-sm text-black font-semibold">
                        Z-Score BB/U
                      </p>
                      {hasil.status_bbu.status}
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        *Status underweight ditentukan berdasarkan indikator{" "}
                        <span className="font-medium text-black">
                          Berat Badan menurut Umur (TB/U)
                        </span>{" "}
                        sesuai standar pertumbuhan WHO.
                      </p>
                    </div>
                  </>
                )}
              </div>
              <div className="text-xs text-gray-400 italic">
                *Hasil ini merupakan skrining awal dan tidak menggantikan
                diagnosis medis.
              </div>
              <form
                onSubmit={handleSubmitDetail}
                className="bg-white rounded-2xl shadow-md p-6 border border-gray-200 mt-6"
              >
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Tambah Keterangan & Rekomendasi
                  </h3>

                  {/* Keterangan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Keterangan
                    </label>
                    <textarea
                      placeholder="Contoh: Balita mengalami risiko stunting ringan..."
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm"
                      value={detailForm.keterangan}
                      required
                      rows={3}
                      onChange={(e) =>
                        setDetailForm({
                          ...detailForm,
                          keterangan: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* Rekomendasi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Rekomendasi
                    </label>
                    <textarea
                      placeholder="Contoh: Tingkatkan asupan gizi, rutin posyandu..."
                      className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition text-sm"
                      value={detailForm.rekomendasi}
                      required
                      rows={3}
                      onChange={(e) =>
                        setDetailForm({
                          ...detailForm,
                          rekomendasi: e.target.value,
                        })
                      }
                    />
                  </div>

                  {/* BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!hasil?.id}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
                        !hasil?.id
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg"
                      }`}
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </form>
              <NavLink to="/kader/detaildeteksi">
                <button>Lihat Detail Deteksi</button>
              </NavLink>
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h1 className="text-2xl font-bold tracking-tight  text-gray-800">
            Detail Deteksi
          </h1>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Lakukan skrining awal untuk mendeteksi risiko stunting berdasarkan
            data pertumbuhan balita.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 flex flex-wrap items-center gap-4 mb-6">
            <input
              type="text"
              placeholder="Cari nama balita..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          {/* FORM INPUT */}
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-10 border border-gray-300 border-2">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Nama Balita</th>
                    <th className="px-4 py-3">Umur</th>
                    <th className="px-4 py-3">Tinggi</th>
                    <th className="px-4 py-3">Berat</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-center">
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="py-6 text-gray-400">
                        Data tidak ditemukan
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.name || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.umur || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.tinggi || "-"}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {item.berat || "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`${baseStyle} ${
                              statusWarna[item.status_tb_u] ||
                              "bg-gray-300 text-black"
                            }`}
                          >
                            {item.status_tb_u || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-3">
                            <Link
                              to={`/kader/detaildeteksi/${item.id}`}
                              className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg"
                            >
                              <FaEye size={14} />
                            </Link>

                            <button
                              onClick={() => handleDelete(item.id)}
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
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
