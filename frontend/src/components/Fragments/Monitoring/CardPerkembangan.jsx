import React from "react";
import {
  Scale,
  Ruler,
  ArrowUpRight,
  Minus,
  ArrowDownRight,
} from "lucide-react";

export default function CardPerkembangan({ data }) {
  const berat = data?.berat_badan || {};
  const tinggi = data?.tinggi_badan || {};

  const renderIcon = (status) => {
    if (status === "Kenaikan Pertumbuhan")
      return <ArrowUpRight size={14} className="mr-0.5" />;

    if (status === "Penurunan Pertumbuhan")
      return <ArrowDownRight size={14} className="mr-0.5" />;

    return <Minus size={14} className="mr-0.5" />;
  };

  const renderColor = (status) => {
    if (status === "Kenaikan Pertumbuhan") {
      return {
        text: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        badge: "bg-emerald-200 text-emerald-700",
      };
    }

    if (status === "Penurunan Pertumbuhan") {
      return {
        text: "text-red-500",
        bg: "bg-red-50",
        border: "border-red-100",
        badge: "bg-red-200 text-red-700",
      };
    }

    return {
      text: "text-yellow-500",
      bg: "bg-yellow-50",
      border: "border-yellow-100",
      badge: "bg-yellow-200 text-yellow-700",
    };
  };

  const warnaBb = renderColor(berat.status);
  const warnaTb = renderColor(tinggi.status);

  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm w-full pb-25">
      <h3 className="text-base font-bold text-gray-800 mb-4">
        Perkembangan Berat & Tinggi Badan
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 ">
        {/* BERAT BADAN */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative ">
          <div className="flex items-center gap-2 mb-4 ">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
              <Scale size={18} />
            </div>

            <span className="text-sm font-bold text-gray-700">Berat Badan</span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500 ">
                Bulan Lalu
                <span className="ml-1 ">
                  ({formatTanggal(berat.tanggal_lalu)})
                </span>
              </span>
              <span className="font-bold text-black">
                {berat.bulan_lalu || 0} kg
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Bulan Ini
                <span className="ml-1">
                  ({formatTanggal(berat.tanggal_ini)})
                </span>
              </span>
              <span className="font-bold text-black">
                {berat.bulan_ini || 0} kg
              </span>
            </div>

            <hr className="border-gray-100 my-1" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Perubahan</span>

              <span
                className={`${warnaBb.text} font-bold flex items-center text-xs ${warnaBb.bg} px-2 py-0.5 rounded-lg`}
              >
                {renderIcon(berat.status)}
                {Math.abs(berat.perubahan || 0)} kg
              </span>
            </div>
          </div>

          <div
            className={`${warnaBb.bg} p-3 rounded-xl border ${warnaBb.border}`}
          >
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${warnaBb.badge}`}
            >
              {berat.status}
            </span>

            <p className="text-[11px] text-gray-700 mt-1.5 font-medium leading-relaxed">
              Berat badan mengalami{" "}
              <span className={`font-bold `}>
                {berat.status?.toLowerCase()}
              </span>{" "}
              pertumbuhan{" "}
              <span className={`font-bold ${warnaBb.text}`}>
                {Math.abs(berat.perubahan || 0)} kg
              </span>{" "}
              dari bulan lalu.
            </p>
          </div>
        </div>

        {/* TINGGI BADAN */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
              <Ruler size={18} />
            </div>

            <span className="text-sm font-bold text-gray-700">
              Tinggi Badan
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Bulan Lalu
                <span className="ml-1">
                  ({formatTanggal(tinggi.tanggal_lalu)})
                </span>
              </span>
              <span className="font-bold text-black">
                {tinggi.bulan_lalu || 0} cm
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Bulan Ini
                <span className="ml-1">
                  ({formatTanggal(tinggi.tanggal_ini)})
                </span>
              </span>
              <span className="font-bold text-black">
                {tinggi.bulan_ini || 0} cm
              </span>
            </div>

            <hr className="border-gray-100 my-1" />

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Perubahan</span>

              <span
                className={`${warnaTb.text} font-bold flex items-center text-xs ${warnaTb.bg} px-2 py-0.5 rounded-lg`}
              >
                {renderIcon(tinggi.status)}
                {Math.abs(tinggi.perubahan || 0)} cm
              </span>
            </div>
          </div>

          <div
            className={`${warnaTb.bg} p-3 rounded-xl border ${warnaTb.border}`}
          >
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-md ${warnaTb.badge}`}
            >
              {tinggi.status}
            </span>

            <p className="text-[11px] text-gray-700 mt-1.5 font-medium leading-relaxed">
              Tinggi badan mengalami{" "}
              <span className={`font-bold `}>
                {tinggi.status?.toLowerCase()}
              </span>{" "}
              pertumbuhan{" "}
              <span className={`font-bold ${warnaTb.text}`}>
                {Math.abs(tinggi.perubahan || 0)} cm
              </span>{" "}
              dari bulan lalu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
