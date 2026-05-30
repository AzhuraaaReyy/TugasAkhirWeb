import { Smile, AlertTriangle, Weight, Ruler, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import screenNormal from "../../assets/images/screenstuntingnormal.png";
import stuntingImage from "../../assets/images/screenstunting.png";
import wastingImage from "../../assets/images/screenstunting.png";
import underweightImage from "../../assets/images/screenstunting.png";

export default function HasilAnalisisDeteksi({ hasil, metode }) {
  const navigate = useNavigate();
  if (!hasil) {
    return (
      <div className="w-full lg:w-7/12 ">
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm h-full flex items-center justify-center p-10">
          <p className="text-sm text-gray-400 text-center">
            Belum ada hasil deteksi yang ditampilkan
          </p>
        </div>
      </div>
    );
  }

  const handleRiwayat = () => {
    navigate(`/kader/lihatriwayat/${hasil.balita_id}`, {
      state: {
        metode,
        hasil,
      },
    });
  };
  const handleMonitoring = () => {
    
    if (!hasil?.balita_id) {
      console.error("ID Balita tidak ditemukan pada hasil deteksi");
      return;
    }
    navigate(`/kader/lihatmonitoring/${hasil.balita_id}`, {
      state: { metode, hasil },
    });
  };
  const mapping = {
    stunting: {
      zscore: hasil?.zscore_tbu,
      status: hasil?.status_tbu?.status,
      keterangan: hasil?.status_tbu?.keterangan,
    },

    wasting: {
      zscore: hasil?.zscore_bbtb,
      status: hasil?.status_bb_tb?.status,
      keterangan: hasil?.status_bb_tb?.keterangan,
    },

    underweight: {
      zscore: hasil?.zscore_bbu,
      status: hasil?.status_bbu?.status,
      keterangan: hasil?.status_bbu?.keterangan,
    },
  };

  const zscore = mapping[metode]?.zscore || "-";
  const status = mapping[metode]?.status || "-";
  const keterangan = mapping[metode]?.keterangan || "-";

  const isNormal =
    status?.toLowerCase().includes("normal") ||
    status?.toLowerCase().includes("ideal") ||
    status?.toLowerCase().includes("gizi baik");

  /**
   * IMAGE MAPPING
   * clean & reusable
   */
  const abnormalImages = {
    stunting: stuntingImage,
    wasting: wastingImage,
    underweight: underweightImage,
  };

  const imageSrc = isNormal
    ? screenNormal
    : abnormalImages[metode] || screenNormal;

  return (
    <div className="w-full lg:w-7/12 flex">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden h-full w-full">
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 items-center justify-between bg-gradient-to-l from-emerald-50 to-white">
          <h2 className="text-2xl font-bold text-emerald-700">
            Hasil Analisis Deteksi
          </h2>
          <span className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            Sistem menampilkan hasil analisis status gizi balita berdasarkan
            indikator WHO untuk membantu memantau kondisi pertumbuhan anak
            secara dini.
          </span>
        </div>

        <div className="p-6">
          {/* STATUS */}
          <div
            className={`rounded-3xl border p-6 text-center ${
              isNormal
                ? "bg-emerald-50 border-emerald-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div
              className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                isNormal ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              {isNormal ? (
                <Smile className="w-10 h-10 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h3 className="mt-5 text-3xl font-bold text-gray-800">
              Status: {status}
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed mt-3">
              {keterangan}
            </p>
          </div>

          {/* DETAIL */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <Weight className="w-6 h-6 mx-auto text-emerald-600" />

              <p className="text-xs text-gray-500 mt-2">BERAT BADAN</p>

              <h4 className="text-3xl font-bold text-gray-800 mt-1">
                {hasil.bb}
              </h4>

              <span className="text-gray-500 text-sm">kg</span>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <Ruler className="w-6 h-6 mx-auto text-emerald-600" />

              <p className="text-xs text-gray-500 mt-2">TINGGI BADAN</p>

              <h4 className="text-3xl font-bold text-gray-800 mt-1">
                {hasil.tb}
              </h4>

              <span className="text-gray-500 text-sm">cm</span>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 text-center">
              <Calendar className="w-6 h-6 mx-auto text-emerald-600" />

              <p className="text-xs text-gray-500 mt-2">Z-SCORE</p>

              <h4 className="text-3xl font-bold text-gray-800 mt-1">
                {zscore || "-"}
              </h4>

              <span className="text-gray-500 text-sm">SD</span>
            </div>
          </div>

          {/* ILUSTRASI */}
          <div className="mt-6 overflow-hidden rounded-3xl relative">
            <img
              src={imageSrc}
              alt={status}
              className="w-full h-56 object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Text */}
            <div className="absolute bottom-4 left-4 right-4 ">
              <p className="text-white text-sm font-medium drop-shadow-lg italic">
                *Hasil ini merupakan skrining awal dan tidak menggantikan
                diagnosis medis.
              </p>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleRiwayat}
              className="flex-1 h-12 rounded-2xl border border-emerald-600 text-emerald-700 font-medium hover:bg-emerald-50 transition"
            >
              Lihat Riwayat
            </button>

            <button
              onClick={handleMonitoring}
              className="flex-1 h-12 rounded-2xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition"
            >
              Lihat Monitoring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
