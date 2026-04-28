import { useEffect } from "react";
import { useParams } from "react-router-dom";
import MainLayouts from "../../layouts/MainLayouts";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import CardTotalPenimbangan from "../../components/Fragments/Riwayat&Grafik/CardPenimbangan";
import CardBerat from "../../components/Fragments/Riwayat&Grafik/CardBerat";
import CardTinggi from "../../components/Fragments/Riwayat&Grafik/CardTinggi";
import CardStatus from "../../components/Fragments/Riwayat&Grafik/CardStatus";
import { useState } from "react";
import EarlyWarning from "@/components/Fragments/Riwayat&Grafik/EarlyWarning";
import { Atom } from "react-loading-indicators";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
export default function DetailDeteksi() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dataWithUsia, setDataWithUsia] = useState([]);
  const [loading, setLoading] = useState(true);
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
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/detaildeteksi/${id}`);
        const data = res.data.data;
        console.log("Response data:", res.data);
        setForm({
          name: data.name || "",
          umur: data.umur || "",
          jk: data.jk || "",
          tgl_deteksi: data.tgl_deteksi?.slice(0, 10) || "",
          berat: data.berat || "",
          tinggi: data.tinggi || "",
          zscore_tbu: data.zscore_tbu || "0",
          zscore_bbu: data.zscore_bbu || "0",
          zscore_bbtb: data.zscore_bbtb || "0",
          status_tbu: data.status.tbu || "",
          status_bbu: data.status.bbu || "",
          status_bbtb: data.status.bbtb || "",
          keterangan: data.keterangan || "",
          rekomendasi: data.rekomendasi || "",
          total_deteksi: data.total_deteksi || "",
          orang_tua: data.orang_tua || "-",
          berat_sekarang: data.berat_sekarang ?? null,
          berat_sebelumnya: data.berat_sebelumnya ?? null,
          tinggi_sekarang: data.tinggi_sekarang ?? null,
          tinggi_sebelumnya: data.tinggi_sebelumnya ?? null,
        });
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    const fetchGrafik = async () => {
      try {
        const res = await api.get(`/grafik/${id}`);
        setDataWithUsia(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error ambil grafik:", err);
      }
    };

    if (id) {
      fetchGrafik();
    }
  }, [id]);

  //warna
  const statusWarnaTBU = {
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",
    "Pendek (stunted)": "bg-yellow-400 text-white",
    Normal: "bg-green-500 text-white",
    Tinggi: "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const statusWarnaBBU = {
    "Berat badan sangat kurang (severely underweight)": "bg-red-600 text-white",
    "Berat badan kurang (underweight)": "bg-yellow-400 text-white",
    "Berat badan normal": "bg-green-500 text-white",
    "Risiko berat badan lebih": "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };
  const statusWarnaBBTB = {
    "Gizi buruk (severely wasted)": "bg-red-600 text-white",
    "Gizi kurang (wasted)": "bg-yellow-400 text-white",
    "Gizi baik (normal)": "bg-green-500 text-white",
    "Berisiko gizi lebih (possible risk of overweight)":
      "bg-blue-300 text-white",
    "Gizi lebih (overweight)": "bg-blue-500 text-white",
    "Obesitas (obese)": "bg-purple-600 text-white",
    default: "bg-gray-300 text-black",
  };

  const baseStyle =
    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ease-in-out shadow-sm";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Atom color="#32cd32" size="medium" text="Memuat Data..." />
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";

    const s = status.toLowerCase();

    if (s.includes("sangat pendek")) return "bg-red-500 text-white";
    if (s.includes("pendek")) return "bg-yellow-400 text-white";
    if (s.includes("normal")) return "bg-green-500 text-white";
    if (s.includes("tinggi")) return "bg-blue-500 text-white";

    return "bg-gray-100 text-gray-600";
  };

  const getStatusBBUColor = (statusBBU) => {
    if (!statusBBU) return "bg-gray-100 text-gray-600";

    const s = statusBBU.toLowerCase();

    if (s.includes("sangat kurang")) return "bg-red-500 text-white";
    if (s.includes("kurang")) return "bg-yellow-400 text-white";
    if (s.includes("normal")) return "bg-green-500 text-white";
    if (s.includes("risiko")) return "bg-blue-500 text-white";

    return "bg-gray-100 text-gray-600";
  };

  const latestPerMonth = Object.values(
    dataWithUsia.reduce((acc, item) => {
      const key = item.bulan; // label bulan

      const itemDate = item.tgl_deteksi
        ? new Date(item.tgl_deteksi)
        : new Date(0);

      if (!acc[key] || new Date(acc[key].tgl_deteksi) < itemDate) {
        acc[key] = item;
      }

      return acc;
    }, {}),
  );

  const dataFix = dataWithUsia.map((item) => ({
    ...item,
    min3: -3,
    min2: -2,
    normal: 0,
    plus2: 2,
  }));
  return (
    <MainLayouts type="deteksidini">
      <div className="min-h-screen bg-gray-100 p-8 font-sans">
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 border border-gray-300 border-2">
          <h1 className="text-2xl font-bold text-gray-800">
            Detail Hasil Deteksi Dini
          </h1>
          <p className="text-sm text-gray-500">
            Berikut adalah hasil analisis pertumbuhan balita berdasarkan data
            yang Anda masukkan.
          </p>
          <div className="bg-gray-200 rounded-3xl shadow-lg p-6 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">{form.name}</h1>
              <p className="text-gray-500">
                {form.jk === "L"
                  ? "Laki-laki"
                  : form.jk === "P"
                    ? "Perempuan"
                    : ""}{" "}
                <span className="mx-2"></span>• Orang Tua:{" "}
                {form.orang_tua || "-"}
              </p>
            </div>
            <div className="flex justify-between items-center  gap-4">
              {/* Kiri - Tanggal Deteksi */}
              <div>
                <p className="text-sm text-gray-500">Tanggal Deteksi</p>
                <p className="text-xl font-semibold mt-1">
                  {form.tgl_deteksi
                    ? new Date(form.tgl_deteksi).toLocaleDateString("id-ID")
                    : "-"}
                </p>
              </div>

              {/* Kanan - Umur */}
              <div className="text-right">
                <p className="text-sm text-gray-500">Usia Saat Ini</p>
                <p className="text-xl font-semibold">
                  {Math.floor(form.umur)} bulan
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 ">
            <CardTotalPenimbangan total={form.total_deteksi} />
            <CardBerat berat={`${form.berat} kg`} />
            <CardTinggi tinggi={`${form.tinggi} cm`} />
            <CardStatus>
              <span
                className={`${baseStyle} ${
                  statusWarnaTBU[form.status_tbu] || statusWarnaTBU.default
                } inline-block`}
              >
                {form.status_tbu}
              </span>
            </CardStatus>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 mt-6 border">
            <h3 className="text-lg font-bold mb-4 text-gray-700 text-center">
              Indikator Status Gizi
            </h3>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              {/* TB/U */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-600">
                  Tinggi Badan / Umur (TB/U)
                </h4>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500"></span>
                    Sangat Pendek
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                    Pendek
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500"></span>
                    Normal
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                    Tinggi
                  </span>
                </div>
              </div>

              {/* BB/U */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-600">
                  Berat Badan / Umur (BB/U)
                </h4>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500"></span>
                    Sangat Kurang
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                    Kurang
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500"></span>
                    Normal
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                    Risiko Lebih
                  </span>
                </div>
              </div>

              {/* BB/TB */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-600">
                  Berat Badan / Tinggi Badan (BB/TB)
                </h4>
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-500"></span>
                    Gizi Buruk
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
                    Gizi Kurang
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500"></span>
                    Gizi Baik
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                    Gizi Lebih
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-purple-500"></span>
                    Obesitas
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* ================= GRAFIK ================= */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="font-semibold mb-4 text-center">
                Grafik Tinggi Badan vs Usia
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataWithUsia}>
                  <CartesianGrid strokeDasharray="3 3" />

                  {/* 🔥 X AXIS BERDASARKAN TANGGAL */}
                  <XAxis
                    dataKey="tgl_format"
                    tickFormatter={(value, index) => {
                      const item = dataWithUsia[index];
                      return `${item.umur} bln`;
                    }}
                  />

                  <YAxis />
                  <Legend />

                  <Tooltip
                    formatter={(value) => [`${value} cm`, "Tinggi"]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        const item = payload[0].payload;
                        return `${item.tgl_label} (${item.umur} bulan)`;
                      }
                      return label;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="tinggi"
                    stroke="#10B981"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    dot={(props) => {
                      const { payload, cx, cy } = props;

                      let color = "#10B981";

                      if (payload?.status) {
                        const s = payload.status.toLowerCase();

                        if (s.includes("sangat pendek")) color = "red";
                        else if (s.includes("pendek")) color = "orange";
                        else if (s.includes("tinggi")) color = "blue";
                      }

                      return <circle cx={cx} cy={cy} r={4} fill={color} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <h2 className="font-semibold  text-center mt-4 mb-4 ">
                Grafik Z-Score TB/U vs Usia
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataWithUsia}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="tgl_format"
                    tickFormatter={(value, index) => {
                      const item = dataWithUsia[index];
                      return `${item.umur} bln`;
                    }}
                  />

                  <YAxis />
                  <Legend />

                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;

                      const data = payload[0].payload;
                      const z = Number(data.zscore);

                      let kategori = "";
                      if (z < -3) kategori = "Sangat Pendek (Stunting Berat)";
                      else if (z < -2) kategori = "Pendek (Stunting)";
                      else if (z <= 3) kategori = "Normal";
                      else kategori = "Tinggi";
                      const zValue = Number(z);
                      return (
                        <div className="bg-white p-3 rounded-lg shadow text-sm border">
                          <p className="font-semibold">
                            {data.tgl_label} ({data.umur} bulan)
                          </p>
                          <hr className="my-2" />
                          <p className="text-gray-700">
                            <b>Kondisi Anak:</b>
                          </p>

                          <p className="text-green-500 font-semibold">
                            Z-Score: {!isNaN(zValue) ? zValue.toFixed(2) : "-"}{" "}
                            → {kategori}
                          </p>
                          <hr className="my-2" />
                          <p className="text-gray-500 text-xs"> Batas WHO:</p>
                          <ul className="text-xs text-gray-600 list-disc pl-4">
                            <li>Normal: ≥ -2 SD</li>
                            <li>Stunting: &lt; -2 SD</li>
                            <li>Stunting berat: &lt; -3 SD</li>
                          </ul>
                        </div>
                      );
                    }}
                  />

                  {/* 🔥 GARIS BATAS WHO */}
                  <Line
                    type="monotone"
                    dataKey={() => -3}
                    stroke="red"
                    strokeDasharray="5 5"
                    name="-3 SD (Sangat Pendek)"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => -2}
                    stroke="orange"
                    strokeDasharray="5 5"
                    name="-2 SD (Pendek)"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => 0}
                    stroke="green"
                    strokeDasharray="5 5"
                    name="Normal"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey={() => 3}
                    stroke="blue"
                    strokeDasharray="5 5"
                    name="+3 SD (Tinggi)"
                    dot={false}
                  />

                  {/* 🔥 GARIS Z-SCORE */}
                  <Line
                    type="monotone"
                    dataKey="zscore"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Z-Score TB/U"
                    dot={(props) => {
                      const { cx, cy } = props;
                      return <circle cx={cx} cy={cy} r={4} fill="#10B981" />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              {/* ================= STATUS PER BULAN ================= */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center ">
                  Status per Bulan
                </h3>

                <div className="flex flex-wrap gap-2 text-sm">
                  {latestPerMonth.map((item, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                        item.status,
                      )}`}
                    >
                      {item.bulan} : {item.status}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-lg p-6">
              <h2 className="font-semibold mb-4 text-center">
                Grafik Berat Badan vs Usia
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataWithUsia}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="tgl_format"
                    tickFormatter={(value, index) => {
                      const item = dataWithUsia[index];
                      return `${item.umur} bln`;
                    }}
                  />

                  <YAxis />
                  <Legend />

                  <Tooltip
                    formatter={(value) => [`${value} kg`, "Berat"]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        const item = payload[0].payload;
                        return `${item.tgl_label} (${item.umur} bulan)`;
                      }
                      return label;
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="berat"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    dot={(props) => {
                      const { payload, cx, cy } = props;

                      let color = "#3B82F6";

                      if (payload?.statusBBU) {
                        const s = payload.statusBBU.toLowerCase();

                        if (s.includes("sangat kurang")) color = "red";
                        else if (s.includes("kurang")) color = "orange";
                        else if (s.includes("normal")) color = "green";
                        else if (s.includes("lebih")) color = "blue";
                      }

                      return <circle cx={cx} cy={cy} r={4} fill={color} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
              <h2 className="font-semibold text-center mt-4 mb-4">
                Grafik Z-Score BB/U vs Usia
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataFix}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="tgl_format"
                    tickFormatter={(value, index) => {
                      const item = dataFix[index];
                      return `${item.umur} bln`;
                    }}
                  />

                  <YAxis domain={[-4, 3]} />
                  <Legend />

                  <Tooltip
                    content={({ payload }) => {
                      if (!payload || payload.length === 0) return null;

                      const data = payload[0].payload;
                      const z = Number(data.ZScoreBBU);

                      let kategori = "";
                      if (z < -3) kategori = "Berat badan sangat kurang";
                      else if (z < -2) kategori = "Berat badan kurang";
                      else if (z <= 2) kategori = "Normal";
                      else kategori = "Risiko berat badan lebih";

                      return (
                        <div className="bg-white p-3 rounded-lg shadow text-sm border">
                          <p className="font-semibold">
                            {data.tgl_label} ({data.umur} bulan)
                          </p>

                          <hr className="my-2" />

                          <p className="text-gray-700">
                            <b>Kondisi Anak:</b>
                          </p>

                          <p className="text-blue-500 font-semibold">
                            Z-Score: {!isNaN(z) ? z.toFixed(2) : "-"} →{" "}
                            {kategori}
                          </p>

                          <hr className="my-2" />

                          <p className="text-gray-500 text-xs">Batas WHO:</p>
                          <ul className="text-xs text-gray-600 list-disc pl-4">
                            <li>Normal: ≥ -2 SD</li>
                            <li>Berat kurang: -3 s/d &lt; -2 SD</li>
                            <li>Sangat kurang: &lt; -3 SD</li>
                            <li>Risiko lebih: &gt; +2 SD</li>
                          </ul>
                        </div>
                      );
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="min3"
                    stroke="red"
                    strokeDasharray="5 5"
                    name="< -3 SD (Berat Badan Sangat Kurang)"
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="min2"
                    stroke="orange"
                    strokeDasharray="5 5"
                    name="-3 s/d < -2 SD (Berat Badan Kurang)"
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="normal"
                    stroke="green"
                    strokeDasharray="5 5"
                    name="-2 s/d +2 SD (Normal)"
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="plus2"
                    stroke="blue"
                    strokeDasharray="5 5"
                    name="> +2 SD (Risiko Berat Badan Lebih)"
                    dot={false}
                  />

                  <Line
                    type="monotone"
                    dataKey="ZScoreBBU"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    name="Z-Score BB/U"
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* ================= STATUS PER BULAN ================= */}
              <div className="mt-6 border-t pt-4">
                <h3 className="text-sm font-semibold text-gray-600 mb-2 text-center ">
                  Status per Bulan
                </h3>

                <div className="flex flex-wrap gap-2 text-sm">
                  {latestPerMonth.map((item, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBBUColor(
                        item.statusBBU,
                      )}`}
                    >
                      {item.bulan} : {item.statusBBU}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= ALERT ================= */}
          <EarlyWarning
            berat_sekarang={form.berat_sekarang}
            berat_sebelumnya={form.berat_sebelumnya}
            tinggi_sekarang={form.tinggi_sekarang}
            tinggi_sebelumnya={form.tinggi_sebelumnya}
            berat_history={dataWithUsia.map((d) => d.berat)}
          />

          {/* Z-Score dan Status */}
          <div className="grid md:grid-cols-3 gap-6 text-center mt-6">
            <div className="bg-blue-100 p-6 rounded-2xl shadow-lg">
              <h2 className="font-extrabold text-xl">Stunting</h2>
              <p className="font-bold text-xl">{form.zscore_tbu}</p>
              <p className="text-sm text-gray-500 mb-2">Z-Score TB/U</p>
              <p
                className={`${baseStyle} ${
                  statusWarnaTBU[form.status_tbu] || statusWarnaTBU.default
                } inline-block`}
              >
                {form.status_tbu}
              </p>
            </div>

            <div className="bg-orange-100 p-6 rounded-2xl shadow-lg">
              <h2 className="font-extrabold text-xl">Wasting</h2>
              <p className="font-bold text-xl">{form.zscore_bbtb}</p>
              <p className="text-sm text-gray-500 mb-2">Z-Score TB/BB</p>
              <p
                className={`${baseStyle} ${
                  statusWarnaBBTB[form.status_bbtb] || statusWarnaBBTB.default
                } inline-block`}
              >
                {form.status_bbtb}
              </p>
            </div>

            <div className="bg-purple-100 p-6 rounded-2xl shadow-lg">
              <h2 className="font-extrabold text-xl ">UnderWeight</h2>
              <p className="font-bold text-xl">{form.zscore_bbu}</p>
              <p className="text-sm text-gray-500 mb-2">Z-Score BB/U</p>
              <p
                className={`${baseStyle} ${
                  statusWarnaBBU[form.status_bbu] || statusWarnaBBU.default
                } inline-block`}
              >
                {form.status_bbu}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-lg p-6 mt-6 border">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              Edukasi Status Gizi Anak
            </h2>

            <div className="grid md:grid-cols-3 gap-6 text-sm">
              {/* STUNTING */}
              <div className="bg-blue-50 p-4 rounded-xl border">
                <h3 className="font-bold text-blue-700 mb-2">
                  📏 Stunting (TB/U)
                </h3>
                <p className="text-gray-700 mb-2">
                  Stunting adalah kondisi anak memiliki tinggi badan lebih
                  pendek dari standar usianya akibat kekurangan gizi kronis
                  dalam jangka waktu lama.
                </p>

                <ul className="list-disc pl-4 text-gray-600 space-y-1">
                  <li>Penyebab: kekurangan gizi, infeksi berulang</li>
                  <li>Dampak: gangguan perkembangan otak & fisik</li>
                  <li>Pencegahan: gizi seimbang & pemantauan rutin</li>
                </ul>

                <div className="mt-2 text-xs text-gray-500">
                  Normal: ≥ -2 SD | Stunting: &lt; -2 SD
                </div>
              </div>

              {/* WASTING */}
              <div className="bg-orange-50 p-4 rounded-xl border">
                <h3 className="font-bold text-orange-700 mb-2">
                  ⚖️ Wasting (BB/TB)
                </h3>
                <p className="text-gray-700 mb-2">
                  Wasting adalah kondisi berat badan anak terlalu rendah
                  dibandingkan tinggi badannya, biasanya terjadi karena
                  kekurangan gizi akut.
                </p>

                <ul className="list-disc pl-4 text-gray-600 space-y-1">
                  <li>Penyebab: kurang makan mendadak, sakit</li>
                  <li>Dampak: tubuh lemah & risiko infeksi tinggi</li>
                  <li>Perlu penanganan cepat</li>
                </ul>

                <div className="mt-2 text-xs text-gray-500">
                  Normal: ≥ -2 SD | Wasting: &lt; -2 SD
                </div>
              </div>

              {/* UNDERWEIGHT */}
              <div className="bg-purple-50 p-4 rounded-xl border">
                <h3 className="font-bold text-purple-700 mb-2">
                  ⚖️ Underweight (BB/U)
                </h3>
                <p className="text-gray-700 mb-2">
                  Underweight adalah kondisi berat badan anak lebih rendah dari
                  standar usianya, bisa disebabkan oleh gizi kurang atau riwayat
                  penyakit.
                </p>

                <ul className="list-disc pl-4 text-gray-600 space-y-1">
                  <li>Penyebab: asupan kurang, infeksi</li>
                  <li>Dampak: pertumbuhan tidak optimal</li>
                  <li>Perlu evaluasi pola makan & kesehatan</li>
                </ul>

                <div className="mt-2 text-xs text-gray-500">
                  Normal: ≥ -2 SD | Kurang: &lt; -2 SD
                </div>
              </div>
            </div>
          </div>
          {/* Rekomendasi */}
          {/* Keterangan dan Rekomendasi */}
          <div className="mt-6 grid md:grid-cols-1 gap-6">
            <div className="bg-emerald-100 p-6 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="font-extrabold text-gray-700 mb-2">
                Keterangan :
              </h3>
              <ul className="list-disc pl-5 space-y-2 ">
                {form.keterangan?.split("\n").map((item, index) => (
                  <li key={index} className="text-gray-700 ">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-emerald-100 p-6 rounded-2xl shadow-lg border border-gray-300">
              <h3 className="font-extrabold text-gray-700 mb-2">
                Rekomendasi :
              </h3>
              <ul className="list-disc pl-5 space-y-2 ">
                {form.rekomendasi?.split("\n").map((item, index) => (
                  <li key={index} className="text-gray-700 ">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Catatan tambahan */}
          <div className="text-xs text-gray-400 italic mt-4">
            *Hasil ini merupakan skrining awal dan tidak menggantikan diagnosis
            medis.
          </div>
        </div>
      </div>
      {/* ================= TABEL RIWAYAT STATUS ================= */}
      <div className=" bg-gray-100 p-8 font-sans">
        <div className="bg-white rounded-3xl shadow-lg p-6 ">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 ">
            Riwayat Detail Pertumbuhan & Status Gizi
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Berikut adalah hasil analisis pertumbuhan balita berdasarkan data
            yang Anda masukkan.
          </p>
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider text-center">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Umur</th>
                  <th className="px-4 py-3">Berat (kg)</th>
                  <th className="px-4 py-3">Tinggi (cm)</th>
                  <th className="px-4 py-3">Status Stunting</th>
                  <th className="px-4 py-3">Status Underweight</th>
                  <th className="px-4 py-3">Status Wasting</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-center">
                {dataWithUsia.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {item.tgl_label || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-500">{item.umur} bln</td>

                    <td className="px-4 py-3 text-gray-500">{item.berat} kg</td>

                    <td className="px-4 py-3 text-gray-500">
                      {item.tinggi} cm
                    </td>

                    {/* STATUS TB/U */}
                    <td className="px-4 py-3 text-gray-500">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>

                    {/* STATUS BB/U */}
                    <td className="px-4 py-3 text-gray-500">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBBUColor(
                          item.statusBBU,
                        )}`}
                      >
                        {item.statusBBU}
                      </span>
                    </td>
                    {/* STATUS BB/U */}
                    <td className="px-4 py-3 text-gray-500">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          statusWarnaBBTB[form.status_bbtb] ||
                          statusWarnaBBTB.default
                        }`}
                      >
                        {form.status_bbtb}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-emerald-600 text-white px-10 py-3 rounded-xl hover:bg-emerald-700 transition"
          >
            Kembali
          </button>
        </div>
      </div>
    </MainLayouts>
  );
}
