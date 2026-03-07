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
      tinggi: 65,
      tinggiWHO: 67,
      statusTinggi: "Normal",
      berat: 7.2,
      beratWHO: 7.4,
      statusBerat: "Normal",
    },
    {
      bulan: "Feb",
      tinggi: 66,
      tinggiWHO: 68,
      statusTinggi: "Normal",
      berat: 7.5,
      beratWHO: 7.7,
      statusBerat: "Normal",
    },
    {
      bulan: "Mar",
      tinggi: 67,
      tinggiWHO: 69,
      statusTinggi: "Normal",
      berat: 7.8,
      beratWHO: 8.0,
      statusBerat: "Normal",
    },
    {
      bulan: "Apr",
      tinggi: 68,
      tinggiWHO: 70,
      statusTinggi: "Berisiko Stunting",
      berat: 8.0,
      beratWHO: 8.3,
      statusBerat: "Normal",
    },
  ];

  const tips = [
    "Berikan makanan tinggi protein seperti telur dan ikan",
    "Pastikan anak makan sayur dan buah setiap hari",
    "Pantau pertumbuhan anak setiap bulan di Posyandu",
  ];

  return (
    <MainLayouts type="dashboard">
      <div className="min-h-screen bg-gray-100 p-8 space-y-8">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard Monitoring Anak
          </h1>
          <p className="text-gray-500 text-sm">
            Pantau pertumbuhan dan kesehatan anak Anda
          </p>
        </div>

        {/* PROFILE ANAK */}
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-3xl">
            👶
          </div>

          <div>
            <h2 className="text-xl font-semibold">{anak.nama}</h2>
            <p className="text-gray-500 text-sm">{anak.umur}</p>
          </div>

          <div className="ml-auto">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
              Status {anak.status}
            </span>
          </div>
        </div>

        {/* STATUS PERTUMBUHAN */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
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
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="tinggi"
                    stroke="#10b981"
                    strokeWidth={3}
                    name="Tinggi Anak"
                  />

                  <Line
                    type="monotone"
                    dataKey="tinggiWHO"
                    stroke="#3b82f6"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Standar WHO"
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
                  <XAxis dataKey="bulan" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line
                    type="monotone"
                    dataKey="berat"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    name="Berat Anak"
                  />

                  <Line
                    type="monotone"
                    dataKey="beratWHO"
                    stroke="#6366f1"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    name="Standar WHO"
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

        {/* CARD INFO */}
        <div className="grid md:grid-cols-3 gap-6 ">
          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Berat Badan</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">10.5 kg</h2>
            <p className="text-green-500 text-sm mt-1">Naik 0.2 kg</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Tinggi Badan</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">82 cm</h2>
            <p className="text-green-500 text-sm mt-1">Naik 2 cm</p>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <p className="text-gray-500 text-sm">Penimbangan Terakhir</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-1">
              10 Juli 2026
            </h2>
          </div>
        </div>

        {/* REMINDER POSYANDU */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
          <h2 className="font-semibold text-yellow-700 mb-2">
            Reminder Posyandu
          </h2>

          <p className="text-sm text-yellow-700">
            Jadwal Posyandu berikutnya pada tanggal
            <span className="font-semibold"> 15 Juli 2026</span>. Jangan lupa
            melakukan penimbangan anak.
          </p>
        </div>

        {/* TIPS GIZI */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="font-semibold text-gray-700 mb-4">Tips Gizi Anak</h2>

          <ul className="space-y-3">
            {tips.map((tip, i) => (
              <li
                key={i}
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm"
              >
                🥗 {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </MainLayouts>
  );
}
