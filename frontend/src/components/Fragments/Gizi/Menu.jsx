import React from "react";
import MenuMPASIImg from "../../../assets/images/menumapsi.png";

const Menu = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Menu MPASI
        </h2>

        <div className="relative flex items-center justify-center mb-6">
          <img
            className="border-emerald-200 border-2 rounded-xl w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
            src={MenuMPASIImg}
          />
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          MPASI atau Makanan Pendamping ASI adalah makanan tambahan yang
          diberikan kepada bayi setelah usia 6 bulan. MPASI bertujuan untuk
          memenuhi kebutuhan nutrisi bayi yang tidak lagi cukup hanya dari ASI,
          sehingga mendukung pertumbuhan dan perkembangan yang optimal.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          MPASI harus diberikan secara bertahap, dimulai dari makanan yang
          lembut, mudah ditelan, dan kaya gizi. Orang tua disarankan
          memperhatikan tekstur, rasa, dan kandungan nutrisi agar bayi nyaman
          makan dan menerima semua zat gizi penting.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Tips Menyusun Menu MPASI
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-4 mb-6">
          <li>
            <strong>Variasi Makanan:</strong> Sajikan berbagai jenis makanan
            dari sumber karbohidrat, protein hewani dan nabati, sayuran, dan
            buah-buahan agar bayi mendapatkan gizi seimbang.
          </li>
          <li>
            <strong>Tekstur Sesuai Usia:</strong> Awali dengan bubur lembut,
            kemudian secara bertahap berikan makanan yang lebih padat sesuai
            kemampuan mengunyah bayi.
          </li>
          <li>
            <strong>Porsi Sedikit tapi Sering:</strong> Berikan porsi kecil 2–3
            kali sehari di awal, lalu tingkatkan frekuensi dan jumlah sesuai
            kebutuhan bayi.
          </li>
          <li>
            <strong>Perhatikan Kebersihan:</strong> Cuci tangan, alat makan, dan
            bahan makanan dengan bersih untuk mencegah infeksi.
          </li>
          <li>
            <strong>Tambahkan Lemak Sehat:</strong> Minyak sayur, alpukat, atau
            margarin sehat dapat meningkatkan kandungan kalori MPASI.
          </li>
          <li>
            <strong>Perhatikan Reaksi Bayi:</strong> Perhatikan tanda alergi
            atau intoleransi makanan. Perkenalkan satu jenis makanan baru setiap
            beberapa hari untuk memantau reaksi.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Contoh Menu MPASI Sehari
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Pagi: Bubur oatmeal dengan pisang dan ASI</li>
          <li>Siang: Nasi tim ayam wortel dengan minyak sayur</li>
          <li>Sore: Bubur kacang hijau dengan ASI atau susu formula</li>
          <li>Malem: Puree labu atau kentang + sedikit daging cincang</li>
        </ul>

        <button
          onClick={handleClose}
          className="mt-8 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Tutup
        </button>
      </div>
    </section>
  );
};

export default Menu;
