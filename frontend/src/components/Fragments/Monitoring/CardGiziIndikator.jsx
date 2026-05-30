export const CardGiziIndikator = ({ data }) => {
  const getIndicatorPosition = (score) => {
    if (score < -3) return { label: "Sangat pendek", left: "12.5%" };
    if (score >= -3 && score < -2) return { label: "Pendek", left: "37.5%" };
    if (score >= -2 && score <= 3) return { label: "Normal", left: "62.5%" };
    return { label: "Tinggi", left: "87.5%" };
  };

  // Simpan hasil fungsi ke dalam variabel agar tidak dipanggil berulang kali
  const indicator = getIndicatorPosition(data);

  return (
    <div className="w-full p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7 border border-white border-2">
      <h4 className="text-lg font-extrabold text-gray-800 mb-2 ">
        Indikator Status Gizi{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-400 to-gray-600">
          (Berdasarkan Z-Score WHO)
        </span>
      </h4>
      <p className="text-sm text-black leading-relaxed mb-5 text-justify">
        Indikator ini membantu memantau pertumbuhan tinggi badan si kecil
        dibandingkan anak seusianya berdasarkan standar WHO. Semakin dekat
        dengan area hijau, semakin sesuai pertumbuhan anak dengan usianya.
      </p>
      {/* Bar Indikator */}
      <div className="relative w-full h-20 flex rounded-xl overflow-hidden border border-gray-100">
        {/* ... (isi bar indikator tetap sama) ... */}

        <div className="flex-1 bg-red-100 flex items-center justify-center text-[12px] font-bold text-red-500 flex-col">
          <span>&lt;-3 SD</span> <span>Sangat Pendek</span>
        </div>
        <div className="flex-1 bg-orange-50 flex items-center justify-center text-[12px] font-bold text-orange-600 flex-col">
          <span>-3 s.d &lt;-2 SD</span> <span>Pendek</span>
        </div>
        <div className="flex-1 bg-emerald-50 border-x border-emerald-200 flex items-center justify-center text-[12px] font-bold text-emerald-700 flex-col">
          <span>-2 s.d 3 SD</span> <span>Normal</span>
        </div>
        <div className="flex-1 bg-blue-50 flex items-center justify-center text-[12px] font-bold text-blue-600 flex-col">
          <span>&gt;3 SD</span> <span>Tinggi</span>
        </div>

        {/* Pointer yang menggunakan variabel indicator */}
        <div
          className="absolute bottom-0 transition-all duration-500 ease-in-out"
          style={{
            left: indicator.left, // Menggunakan variabel yang sudah benar
            transform: "translateX(-50%)",
          }}
        >
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-gray-800"></div>
        </div>
      </div>

      <p className="text-xs text-center mt-3 text-gray-500 font-medium">
        Nilai Z-Score saat ini:{" "}
        <span className="font-bold text-gray-800">{data}</span>
      </p>
    </div>
  );
};
