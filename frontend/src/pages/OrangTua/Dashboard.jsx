import MainLayouts from "../../layouts/MainLayouts";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import stunting from "../../assets/images/image_2k.png";
export default function DashboardOrtu() {
  const anak = {
    nama: "Aisyah",
    umur: "18 Bulan",
    status: "Normal",
    progress: 85,
  };

  const dataPertumbuhan = [
    {
      bulan: "Jan",
      umur: 10,
      tinggi: 70,
      berat: 11,
      statusTinggi: "Normal",
      statusBerat: "Normal",
    },
    {
      bulan: "Feb",
      umur: 11,
      tinggi: 71,
      berat: 8.2,
      statusTinggi: "Normal",
      statusBerat: "Normal",
    },
    {
      bulan: "Mar",
      umur: 12,
      tinggi: 72,
      berat: 8.4,
      statusTinggi: "Normal",
      statusBerat: "Normal",
    },
    {
      bulan: "Apr",
      umur: 13,
      tinggi: 72.5,
      berat: 8.3,
      statusTinggi: "Pendek",
      statusBerat: "Kurus",
    },
    {
      bulan: "Mei",
      umur: 14,
      tinggi: 73,
      berat: 8.1,
      statusTinggi: "Pendek",
      statusBerat: "Kurus",
    },
    {
      bulan: "Jun",
      umur: 15,
      tinggi: 74,
      berat: 8.5,
      statusTinggi: "Normal",
      statusBerat: "Normal",
    },
  ];

  return (
    <MainLayouts type="dashboard">
      <div className="min-h-screen bg-emerald-50 p-8 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 mt-5">
            Dashboard Monitoring Anak
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            Pantau pertumbuhan dan kesehatan anak Anda
          </p>
        </div>

        {/* PROFILE ANAK */}
        <div className="bg-white rounded-2xl shadow shadow-lg p-6 flex items-center gap-6 mb-10 border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
            <img
              src={stunting}
              className="rounded-full w-20 h-20 object-cover"
            ></img>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{anak.nama}</h2>
            <p className="text-gray-500 text-sm">{anak.umur}</p>
          </div>

          <div className="ml-auto">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              Status {anak.status}
            </span>
          </div>
        </div>
        {/* CARD INFO */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow shadow-lg p-6 border border-gray-100">
            <p className="text-gray-500 text-sm">Berat Badan</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">10.5 kg</h2>
            <p className="text-green-500 text-sm mt-1">Naik 0.2 kg</p>
          </div>

          <div className="bg-white rounded-2xl shadow shadow-lg p-6 border border-gray-100">
            <p className="text-gray-500 text-sm">Tinggi Badan</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">82 cm</h2>
            <p className="text-green-500 text-sm mt-1">Naik 2 cm</p>
          </div>

          <div className="bg-white rounded-2xl shadow shadow-lg p-6 border border-gray-100">
            <p className="text-gray-500 text-sm">Penimbangan Terakhir</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              10 Juli 2026
            </h2>
          </div>
        </div>

        {/* STATUS PERTUMBUHAN */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Grafik Pertumbuhan Anak
          </h2>

          {/* CHART GRID */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* CHART TINGGI BADAN */}
            <div className="bg-white p-6 rounded-2xl shadow mb-5">
              <h2 className="font-semibold mb-4">
                Grafik Tinggi Badan (Deteksi Stunting)
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataPertumbuhan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="umur"
                    label={{
                      value: "Umur (bulan)",
                      position: "insideBottom",
                      textAnchor: "middle",
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: "Tinggi Badan (kg)",
                      angle: -90,
                      position: "insideLeft",
                      textAnchor: "middle",
                    }}
                  />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="tinggi"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Tinggi Badan"
                    dot={({ payload }) => {
                      const color =
                        payload.statusTinggi === "Pendek" ? "red" : "#10b981";
                      return <circle r={5} fill={color} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* STATUS STUNTING */}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold mb-2">
                  Status Tinggi Badan
                </p>

                <div className="flex flex-wrap gap-2">
                  {dataPertumbuhan.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700"
                    >
                      {item.bulan} : {item.statusTinggi}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CHART BERAT BADAN */}
            <div className="bg-white p-6 rounded-2xl shadow mb-5">
              <h2 className="font-semibold mb-4">
                Grafik Berat Badan (Deteksi Wasting)
              </h2>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dataPertumbuhan}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="umur"
                    label={{
                      value: "Umur (bulan)",
                      position: "insideBottom",
                      textAnchor: "middle",
                      offset: -5,
                    }}
                  />

                  <YAxis
                    label={{
                      value: "Berat Badan (kg)",
                      angle: -90,
                      position: "insideLeft",
                      textAnchor: "middle",
                    }}
                  />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="berat"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Berat Badan"
                    dot={({ payload }) => {
                      const color =
                        payload.statusBerat === "Kurus" ? "red" : "#f59e0b";
                      return <circle r={5} fill={color} />;
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>

              {/* STATUS WASTING */}
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-semibold mb-2">Status Berat Badan</p>

                <div className="flex flex-wrap gap-2">
                  {dataPertumbuhan.map((item, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700"
                    >
                      {item.bulan} : {item.statusBerat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* REMINDER POSYANDU */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-10 shadow shadow-lg">
          <h2 className="font-semibold text-yellow-700 mb-2">
            Reminder Posyandu
          </h2>

          <p className="text-sm text-yellow-700">
            Jadwal Posyandu berikutnya pada tanggal
            <span className="font-semibold"> 15 Juli 2026</span>. Jangan lupa
            melakukan penimbangan anak.
          </p>
        </div>
      </div>
    </MainLayouts>
  );
}
