import React, { useState } from "react";
import { SlidersHorizontal, Download, Lightbulb } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function GrafikInsight({ form }) {
  const [range, setRange] = useState("3M");
  const riwayatData = form?.riwayat || [];
  const namaAnak = form?.name || "Anak";

  // Helper untuk mengubah string tanggal lokal menjadi objek Date yang aman
  const parseSafeDate = (tglStr) => {
    if (!tglStr || tglStr === "-") return null;

    let cleanStr = tglStr.toLowerCase();
    const bulanIndo = [
      "jan",
      "feb",
      "mar",
      "apr",
      "mei",
      "jun",
      "jul",
      "agu",
      "sep",
      "okt",
      "nov",
      "des",
    ];
    const bulanEng = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ];

    bulanIndo.forEach((bln, idx) => {
      if (cleanStr.includes(bln)) {
        cleanStr = cleanStr.replace(bln, bulanEng[idx]);
      }
    });

    const parsed = new Date(cleanStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // FILTER & SORTING KALENDER RIIL
  const getFilteredData = () => {
    if (!riwayatData.length) return [];

    // Urutkan data berdasarkan umur anak secara kronologis (dari terkecil ke terbesar)
    const dataTerurut = [...riwayatData].sort(
      (a, b) => (a.umur || 0) - (b.umur || 0),
    );

    const dataTerbaru = dataTerurut[dataTerurut.length - 1];
    const tanggalAcuan = parseSafeDate(dataTerbaru?.tgl_label);

    if (!tanggalAcuan) return dataTerurut;

    const tahunAcuan = tanggalAcuan.getFullYear();
    const bulanAcuan = tanggalAcuan.getMonth();

    let batasBulanKeBelakang = 120;
    if (range === "1M") batasBulanKeBelakang = 1;
    if (range === "3M") batasBulanKeBelakang = 3;
    if (range === "6M") batasBulanKeBelakang = 6;
    if (range === "1Y") batasBulanKeBelakang = 12;

    return dataTerurut.filter((item) => {
      const tanggalItem = parseSafeDate(item.tgl_label);
      if (!tanggalItem) return false;

      const tahunItem = tanggalItem.getFullYear();
      const bulanItem = tanggalItem.getMonth();

      const selisihBulan =
        (tahunAcuan - tahunItem) * 12 + (bulanAcuan - bulanItem);
      return selisihBulan >= 0 && selisihBulan < batasBulanKeBelakang;
    });
  };

  // Format label teks sumbu X dan bersihkan tipe data payload
  const filteredData = getFilteredData().map((item, index) => {
    const tglPendek =
      item.tgl_label && item.tgl_label !== "-"
        ? item.tgl_label.split(" ").slice(0, 2).join(" ")
        : "";

    return {
      ...item,
      berat: Number(item.berat || 0),
      tinggi: Number(item.tinggi || 0),
      // Tambahkan index unik di belakang nama agar Recharts bisa membedakan entitas titik data
      displayLabel: tglPendek
        ? `${tglPendek} (${item.umur}b)`
        : `Pemeriksaan ${index + 1}`,
      chartKey: `pemeriksaan-${index}-${item.umur}`, // Untuk internal ID Recharts
    };
  });

  // Ambil dua data pemeriksaan terakhir untuk logika insight
  const dataTerakhir = filteredData[filteredData.length - 1];
  const dataSebelumnya = filteredData[filteredData.length - 2];

  // Penentu Gaya Box Insight
  const getInsightStyle = () => {
    if (!dataTerakhir || !dataSebelumnya) {
      return {
        bg: "bg-gray-50/50",
        border: "border-gray-100",
        text: "text-gray-700",
        textMuted: "text-gray-800",
        iconColor: "text-gray-600",
      };
    }

    const selisihBerat = dataTerakhir.berat - dataSebelumnya.berat;
    const selisihTinggi = dataTerakhir.tinggi - dataSebelumnya.tinggi;

    if (selisihBerat < 0 && selisihTinggi < 0) {
      return {
        bg: "bg-red-50/50",
        border: "border-red-100",
        text: "text-red-700",
        textMuted: "text-red-800",
        iconColor: "text-red-600",
      };
    }

    if (
      selisihBerat < 0 ||
      selisihTinggi < 0 ||
      (selisihBerat === 0 && selisihTinggi === 0)
    ) {
      return {
        bg: "bg-amber-50/50",
        border: "border-amber-100",
        text: "text-amber-700",
        textMuted: "text-amber-800",
        iconColor: "text-amber-600",
      };
    }

    return {
      bg: "bg-emerald-50/50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      textMuted: "text-emerald-800",
      iconColor: "text-emerald-600",
    };
  };

  // Generator Pesan Teks Analisis Grafik
  const getInsightMessage = () => {
    if (!dataTerakhir) return "Memproses data pertumbuhan...";
    if (!dataSebelumnya) {
      return `Pemeriksaan pertama untuk ${namaAnak} dicatat pada (${dataTerakhir.displayLabel}). Grafik memerlukan minimal dua data pemeriksaan untuk menganalisis tren perubahan pertumbuhan.`;
    }

    const selisihBerat = (dataTerakhir.berat - dataSebelumnya.berat).toFixed(2);
    const selisihTinggi = (dataTerakhir.tinggi - dataSebelumnya.tinggi).toFixed(
      1,
    );

    let teksBerat =
      selisihBerat > 0
        ? `berat naik +${selisihBerat} kg`
        : selisihBerat < 0
          ? `berat turun ${Math.abs(selisihBerat)} kg`
          : "berat badan stagnan";
    let teksTinggi =
      selisihTinggi > 0
        ? `tinggi naik +${selisihTinggi} cm`
        : selisihTinggi < 0
          ? `tinggi turun ${Math.abs(selisihTinggi)} cm`
          : "tinggi badan stagnan";

    if (
      dataTerakhir.berat - dataSebelumnya.berat < 0 &&
      dataTerakhir.tinggi - dataSebelumnya.tinggi < 0
    ) {
      return `Peringatan (${dataTerakhir.displayLabel}): Terdeteksi tren penurunan grafik. Terjadi kondisi ${teksBerat} dan ${teksTinggi} dibanding pemeriksaan (${dataSebelumnya.displayLabel}). Hubungi petugas puskesmas untuk tindakan lanjut.`;
    }

    if (
      dataTerakhir.berat - dataSebelumnya.berat <= 0 ||
      dataTerakhir.tinggi - dataSebelumnya.tinggi <= 0
    ) {
      return `Perhatian (${dataTerakhir.displayLabel}): Grafik menunjukkan ${teksBerat} & ${teksTinggi} dari data sebelumnya (${dataSebelumnya.displayLabel}). Harap perhatikan frekuensi asupan gizi hewani anak.`;
    }

    return `Tren Positif! Dibandingkan data (${dataSebelumnya.displayLabel}), pertumbuhan terbaru (${dataTerakhir.displayLabel}) menunjukkan progres baik: ${teksBerat} dan ${teksTinggi}.`;
  };

  const style = getInsightStyle();
  const message = getInsightMessage();

  if (!riwayatData.length) {
    return (
      <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm text-center text-sm text-gray-400">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="h-4 w-32 bg-gray-200 rounded"></div>
          <span>Memuat grafik pertumbuhan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Riwayat Pemeriksaan
          </h2>
          <p className="text-sm text-gray-400">
            Pantau pertumbuhan bulanan {namaAnak} dengan data klinis yang
            akurat.
          </p>
        </div>
        <div className="flex gap-2 self-end sm:self-auto">
          <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <SlidersHorizontal size={18} />
          </button>
          <button className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">
              Tren Pertumbuhan
            </h3>
            <div className="flex flex-wrap gap-4 mt-2 text-xs font-medium text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block"></span>
                Berat Badan (kg)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block"></span>
                Tinggi Badan (cm)
              </span>
            </div>
          </div>

          {/* Filter Range */}
          <div className="bg-gray-50 p-1 rounded-xl flex gap-1 text-xs font-semibold text-gray-500">
            {["1M", "3M", "6M", "1Y"].map((item) => (
              <button
                key={item}
                onClick={() => setRange(item)}
                className={`px-3 py-1.5 rounded-lg transition-all ${range === item ? "bg-emerald-700 text-white shadow-sm" : "hover:bg-gray-100 text-gray-500"}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-64 min-h-[260px] w-full relative">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              {/* Tambahkan properti tooltipInteractionKind ke graph untuk koordinat presisi */}
              <LineChart
                data={filteredData}
                margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F3F4F6"
                />

                <XAxis
                  dataKey="displayLabel"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                />

                <YAxis
                  domain={["dataMin - 2", "dataMax + 2"]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 11 }}
                />

                {/* 🛠️ SINKRONISASI UTAMA TOOLTIP: Ditambahkan trigger="click" atau shared={false} */}
                <Tooltip
                  shared={false}
                  filterByDataKey={true}
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #F3F4F6",
                  }}
                  labelClassName="font-bold text-gray-700 text-xs"
                  formatter={(value, name) => [
                    value,
                    name === "berat" ? "berat badan" : "tinggi badan",
                  ]}
                  labelFormatter={(label, items) => {
                    // Paksa pembacaan tanggal dari payload item yang sedang aktif di hover, bukan dari label XAxis
                    return items[0]?.payload?.tgl_label || label;
                  }}
                />

                <Line
                  type="linear"
                  dataKey="berat"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#059669" }}
                  activeDot={{ r: 6 }}
                  label={{
                    position: "top",
                    fill: "#059669",
                    fontSize: 10,
                    fontWeight: 600,
                    offset: 10,
                  }}
                />
                <Line
                  type="linear"
                  dataKey="tinggi"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3B82F6" }}
                  activeDot={{ r: 6 }}
                  label={{
                    position: "top",
                    fill: "#3B82F6",
                    fontSize: 10,
                    fontWeight: 600,
                    offset: 10,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Insight Card */}
          <div
            className={`${style.bg} ${style.border} border rounded-2xl p-5 flex flex-col justify-center transition-all duration-300`}
          >
            <div
              className={`flex items-center gap-2 ${style.text} font-bold text-sm mb-2`}
            >
              <Lightbulb size={16} className={style.iconColor} /> Insight
            </div>
            <p
              className={`text-xs ${style.textMuted} leading-relaxed font-medium`}
            >
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
