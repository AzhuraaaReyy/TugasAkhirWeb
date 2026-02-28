import { Baby, Utensils, Home, BookOpen } from "lucide-react";
import ActivityCard from "../../Elements/Card/ActivityCard";

const Contentaktifitas = () => {
  const data = [
    {
      title: "Balita Ditimbang",
      value: 35,
      icon: Baby,
      color: "bg-emerald-500",
    },
    {
      title: "Penerima PMT",
      value: 12,
      icon: Utensils,
      color: "bg-blue-500",
    },
    {
      title: "Kunjungan Rumah",
      value: 4,
      icon: Home,
      color: "bg-teal-500",
    },
    {
      title: "Edukasi Gizi",
      value: 1,
      icon: BookOpen,
      color: "bg-cyan-500",
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          📋 Ringkasan Aktivitas Bulan Ini
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Monitoring kegiatan kader posyandu terkait pencegahan stunting.
        </p>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <ActivityCard
            key={index}
            title={item.title}
            value={item.value}
            icon={item.icon}
            color={item.color}
          />
        ))}
      </div>
    </div>
  );
};

export default Contentaktifitas;
