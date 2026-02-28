import { AlertTriangle, Calendar, TrendingDown, Hospital } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Balita Belum Hadir Penimbangan",
    description: "5 balita belum hadir pada penimbangan bulan Februari.",
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    id: 2,
    title: "Penurunan Berat Badan",
    description: "3 balita mengalami penurunan berat badan signifikan.",
    icon: TrendingDown,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  {
    id: 3,
    title: "Jadwal Posyandu Berikutnya",
    description: "Posyandu akan dilaksanakan pada 10 Maret 2026.",
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    id: 4,
    title: "Perlu Rujukan ke Puskesmas",
    description: "2 balita direkomendasikan untuk rujukan lanjutan.",
    icon: Hospital,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
];

const Content = () => {
  return (
    <div className="p-6">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        ⚠️ Notifikasi Penting
      </h2>

      {/* Notification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className={`rounded-2xl border ${item.border} ${item.bg} p-5 shadow-sm hover:shadow-md transition duration-300`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl bg-white shadow-sm ${item.color}`}
                >
                  <Icon size={24} />
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
