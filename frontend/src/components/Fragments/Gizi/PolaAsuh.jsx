import React from "react";
import PolaAsuhImg from "../../../assets/images/polaasuh.jpg";

const PolaAsuh = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Pola Asuh Anak
        </h2>

        <div className="relative flex items-center justify-center mb-6">
          <img
            className="border-emerald-200 border-2 rounded-xl w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
            src={PolaAsuhImg}
          />
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Pola asuh anak adalah cara orang tua atau pengasuh membimbing,
          mendidik, dan memenuhi kebutuhan fisik maupun psikososial anak agar
          tumbuh dan berkembang dengan optimal. Pola asuh yang tepat memengaruhi
          kesehatan, emosi, perilaku, dan prestasi anak di masa depan.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Ada beberapa gaya pola asuh yang umum diterapkan: otoriter, permisif,
          dan demokratis. Pola asuh yang seimbang cenderung menggunakan gaya
          demokratis, yaitu memberikan kasih sayang, batasan, dan kebebasan
          sesuai usia anak.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Tips Pola Asuh Anak yang Sehat
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-4 mb-6">
          <li>
            <strong>Kasih Sayang dan Dukungan:</strong> Berikan pelukan, pujian,
            dan perhatian agar anak merasa aman dan dicintai.
          </li>
          <li>
            <strong>Beri Batasan yang Jelas:</strong> Tetapkan aturan rumah yang
            konsisten agar anak belajar disiplin.
          </li>
          <li>
            <strong>Konsisten dan Tegas:</strong> Terapkan aturan secara
            konsisten, tapi tetap sabar dan adil.
          </li>
          <li>
            <strong>Dengarkan Anak:</strong> Luangkan waktu untuk mendengarkan
            keluh kesah dan aspirasi anak.
          </li>
          <li>
            <strong>Kembangkan Kemandirian:</strong> Ajarkan anak tanggung jawab
            sesuai usia, misal merapikan mainan atau menyiapkan pakaian sendiri.
          </li>
          <li>
            <strong>Berikan Contoh Positif:</strong> Anak belajar dari teladan
            orang tua, jadi tunjukkan perilaku yang baik.
          </li>
          <li>
            <strong>Komunikasi yang Baik:</strong> Gunakan bahasa yang jelas,
            sabar, dan jangan menghina anak saat menegur.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Aspek Penting Pola Asuh
        </h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Kebutuhan emosional: perhatian, kasih sayang, dan rasa aman.</li>
          <li>
            Kebutuhan fisik: makanan bergizi, tidur cukup, dan aktivitas fisik.
          </li>
          <li>
            Pendidikan dan stimulasi: membaca, bermain edukatif, dan bimbingan
            belajar.
          </li>
          <li>
            Interaksi sosial: belajar berbagi, toleransi, dan berkomunikasi
            dengan teman sebaya.
          </li>
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

export default PolaAsuh;
