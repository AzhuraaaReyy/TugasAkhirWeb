import MainLayouts from "../../../layouts/MainLayouts";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import api from "@/services/api";
const DetailFormBalita = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    user_id: "",
    jk: "",
    tgl_lahir: "",
    tmp_lahir: "",
    alamat: "",
    posyandu: "",
    orangtua: "",
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/balitas/detail/${id}`);
        const data = res.data.data;

        setForm({
          ...data,
          tgl_lahir: data.tgl_lahir?.split("T")[0] || "",
        });
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    };

    if (id) fetchDetail();
  }, [id]);
  return (
    <MainLayouts type="detailmanajemenbalita">
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* HEADER */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <h1 className="text-xl font-semibold text-gray-800">
              Detail Data Balita
            </h1>
            <p className="text-sm text-gray-500">
              Melihat data identitas balita dengan lengkap.
            </p>
          </div>

          {/* GRID 2 KOLOM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nama Balita */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Balita
              </label>
              <input
                type="text"
                value={form.name || "-"}
                readOnly
                placeholder="Contoh: Aisyah Putri"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Nama Orang Tua */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Orang Tua
              </label>
              <input
                type="text"
                value={form.orangtua || "-"}
                readOnly
                placeholder="Contoh: Ibu Melati"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <input
                type="text"
                value={
                  form.jk === "L"
                    ? "Laki-Laki"
                    : form.jk === "P"
                      ? "Perempuan"
                      : "-"
                }
                readOnly
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={form.tgl_lahir || "-"}
                readOnly
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={form.tmp_lahir || "-"}
                readOnly
                placeholder="Contoh: Semarang"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            {/* Posyandu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posyandu
              </label>
              <input
                type="text"
                value={form.posyandu || "-"}
                readOnly
                placeholder="Contoh: Posyandu Mawar"
                className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* ALAMAT FULL WIDTH */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat
            </label>
            <textarea
              value={form.alamat || "-"}
              readOnly
              rows="3"
              placeholder="Contoh: Soka RT02/04 Kecamatan Ungaran Barat"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* BUTTON SECTION */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate("/kader/manajemenbalita")}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600  transition hover:bg-emerald-600 hover:text-white"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
};
export default DetailFormBalita;
