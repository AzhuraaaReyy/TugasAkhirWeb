import React, { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

export default function TimelineCard({ form, metode = "stunting" }) {
  const riwayatMentah = form?.riwayat || [];
  const [limit, setLimit] = useState(4);
  const [idCardAktif, setIdCardAktif] = useState(null);
  const ambilStatus = (item) => {
    const byMetode = {
      stunting: item.status_tbu ?? item.statusTBU,
      wasting: item.status_bbtb ?? item.statusBBTB ?? item.status_bb_tb,
      underweight: item.status_bbu ?? item.statusBBU,
    };
    return byMetode[metode] || item.status || "Pemeriksaan Rutin Selesai";
  };
  if (!riwayatMentah.length) {
    return (
      <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm text-center text-sm text-gray-400 mt-6">
        Tidak ada data riwayat pemeriksaan.
      </div>
    );
  }

  //mengurutkan data lama ke paling baru
  const riwayatKronologis = [...riwayatMentah].sort(
    (a, b) => (a.umur || 0) - (b.umur || 0),
  );

  //menentukan data terbaru berdasarkan data terakhir
  const historyDataTerhitung = riwayatKronologis.map((item, index) => {
    const itemSebelumnya = riwayatKronologis[index - 1];

    const hitungSelisih = (sekarang, sebelum) => {
      if (sebelum === undefined || sebelum === null)
        return { teks: "-", tipe: "stagnan" };

      const diff = parseFloat(sekarang) - parseFloat(sebelum);
      if (diff > 0) return { teks: `+${diff.toFixed(1)}`, tipe: "naik" };
      if (diff < 0) return { teks: `${diff.toFixed(1)}`, tipe: "turun" };
      return { teks: "0", tipe: "stagnan" };
    };

    return {
      id: item.id || index,
      date: item.tgl_label || "-",
      age: `${item.umur || 0} Bulan`,
      isLatest: index === riwayatKronologis.length - 1,
      status: ambilStatus(item) || "Pemeriksaan Rutin Selesai",
      bb: `${item.berat || 0} kg`,
      bbDiff: hitungSelisih(item.berat, itemSebelumnya?.berat),
      tb: `${item.tinggi || 0} cm`,
      tbDiff: hitungSelisih(item.tinggi, itemSebelumnya?.tinggi),
      lk: `${item.lingkar_kepala || 0} cm`,
      lkDiff: hitungSelisih(
        item.lingkar_kepala,
        itemSebelumnya?.lingkar_kepala,
      ),
    };
  });
  //menampilkan paling terbaru
  const historyDataTampilan = [...historyDataTerhitung].reverse();
  const dataDitampilkan = historyDataTampilan.slice(0, limit);

  const RenderDiff = ({ diff }) => {
    if (diff.tipe === "stagnan") {
      return (
        <span className="text-xs text-gray-500 font-medium flex items-center gap-0.5 mt-1">
          <Minus size={12} /> {diff.teks}{" "}
          <span className="text-gray-400 font-normal text-[10px] ml-1">
            vs pemeriksaan lalu
          </span>
        </span>
      );
    }

    return (
      <span
        className={`text-xs font-medium flex items-center gap-0.5 mt-1 ${diff.tipe === "naik" ? "text-emerald-600" : "text-red-500"}`}
      >
        {diff.tipe === "naik" ? (
          <ArrowUpRight size={12} />
        ) : (
          <ArrowDownRight size={12} />
        )}
        {diff.teks}{" "}
        <span className="text-gray-400 font-normal text-[10px] ml-1">
          vs pemeriksaan lalu
        </span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm h-full">
      <div>
        <h1 className="text-xl font-bold text-gray-800">
          Riwayat Yang Sudah Dilakukan
        </h1>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Berikut adalah catatan perkembangan kesehatan yang telah tercatat
          dalam sistem. Klik pada kartu untuk melihat monitoring data
          pertumbuhan.
        </p>
      </div>
      <div
        className={`relative w-full pr-2 transition-all duration-300 custom-scrollbar ${
          limit > 4 ? "max-h-[750px] overflow-y-auto overflow-x-hidden" : ""
        }`}
      >
        {/* Kontainer Utama dengan Garis Vertikal Timeline */}
        <div className="flex flex-col gap-8 relative pl-8 sm:pl-32 py-2">
          {/* Garis Vertikal Timeline */}
          <div className="absolute left-[25px] sm:left-[127px] top-4 bottom-4 w-0.5 bg-gray-100" />

          {dataDitampilkan.map((log, index) => {
            // Card otomatis aktif
            const apakahAktif =
              idCardAktif === log.id || (idCardAktif === null && index === 0);

            return (
              <div
                key={log.id}
                className="relative flex flex-col sm:flex-row gap-4 sm:gap-0 group"
              >
                {/* Tanggal di Samping Kiri */}
                <div
                  className={`sm:absolute sm:-left-28 sm:w-24 text-left sm:text-right font-bold text-sm pt-2 transition-colors duration-300 ${
                    apakahAktif
                      ? "text-emerald-600 text-base"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {log.date}
                </div>

                {/* Node Bulatan Indikator */}
                <div
                  className={`absolute left-0 sm:left-4 z-10 w-3 h-3 rounded-full mt-3.5 -translate-x-[3px] transition-all duration-300 ${
                    apakahAktif
                      ? "bg-emerald-500 ring-4 ring-emerald-100 scale-125"
                      : "bg-gray-300 group-hover:bg-gray-400"
                  }`}
                />

                {/* Card Data Pemeriksaan */}
                <div
                  onClick={() => setIdCardAktif(log.id)}
                  className={`w-full border rounded-2xl p-5 shadow-sm ml-6 sm:ml-12 cursor-pointer transition-all duration-300 transform ${
                    apakahAktif
                      ? "bg-white border-emerald-500 ring-2 ring-emerald-50 md:translate-x-1 shadow-md"
                      : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex items-center gap-2 font-semibold text-sm transition-colors duration-300 ${
                          apakahAktif ? "text-emerald-600" : "text-gray-500"
                        }`}
                      >
                        <CheckCircle2 size={16} />
                        <span>{log.status}</span>
                      </div>

                      {log.isLatest && (
                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm animate-pulse">
                          Terbaru
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full transition-colors duration-300 ${
                        apakahAktif
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-gray-400 bg-gray-50"
                      }`}
                    >
                      Usia: {log.age}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Berat Badan */}
                    <div
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        apakahAktif
                          ? "bg-emerald-50 border-emerald-100/50"
                          : "bg-gray-100 border-gray-50"
                      }`}
                    >
                      <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
                        Berat Badan (BB)
                      </span>
                      <span className="text-lg font-bold text-gray-800 block mt-1">
                        {log.bb}
                      </span>
                      <RenderDiff diff={log.bbDiff} />
                    </div>
                    {/* Tinggi Badan */}
                    <div
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        apakahAktif
                          ? "bg-emerald-50 border-emerald-100/50"
                          : "bg-gray-100 border-gray-50"
                      }`}
                    >
                      <span className="text-xs text-gray-400 font-semibold block uppercase tracking-wider">
                        Tinggi Badan (TB)
                      </span>
                      <span className="text-lg font-bold text-gray-800 block mt-1">
                        {log.tb}
                      </span>
                      <RenderDiff diff={log.tbDiff} />
                    </div>
                  </div>
                  {apakahAktif && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Mencegah klik tombol menutup/reset card
                          // Arahkan ke halaman monitoring atau buka modal
                          console.log("FORM =", form);
                          console.log("BALITA ID =", form.balita_id);
                          console.log("LOG ID =", log.id);
                          window.location.href = `/kader/monitoring/${form.balita_id}/${log.id}`;
                        }}
                        className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-lg transition-colors"
                      >
                        Lihat Tren Monitoring
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tombol Riwayat untuk melihat data sesudah dan sebelum*/}
      <div className="flex justify-center gap-4 mt-6 pl-0 sm:pl-32">
        {historyDataTampilan.length > limit && (
          <button
            onClick={() => setLimit((prev) => prev + 5)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200"
          >
            Tampilkan Riwayat Lebih Banyak
            <ChevronDown size={16} />
          </button>
        )}
        {limit > 5 && (
          <button
            onClick={() => setLimit(4)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 bg-white border border-gray-200 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition-all duration-200"
          >
            Tampilkan Riwayat Lebih Sedikit
            <ChevronDown size={16} className="rotate-180" />{" "}
          </button>
        )}
      </div>
    </div>
  );
}
