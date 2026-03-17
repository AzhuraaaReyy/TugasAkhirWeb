import React from "react";
import NafsuMakanImg from "../../../assets/images/nafsumakan.png";

const NafsuMakan = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Nafsu Makan Anak
        </h2>

        <div className="relative flex items-center justify-center mb-6">
          <img
            className="border-emerald-200 border-2 rounded-xl w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
            src={NafsuMakanImg}
          />
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Nafsu makan anak bisa bervariasi setiap harinya. Faktor yang memengaruhi antara lain kondisi kesehatan, suasana hati, kebiasaan makan, dan lingkungan keluarga. Penting bagi orang tua untuk memahami tanda lapar dan kenyang pada anak agar tumbuh kembangnya optimal.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Anak yang memiliki nafsu makan rendah dapat mengalami kurang gizi, sedangkan anak yang terlalu banyak makan bisa mengalami obesitas. Oleh karena itu, pengaturan pola makan yang sehat dan perhatian terhadap perilaku makan anak sangat penting.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Tips Meningkatkan Nafsu Makan Anak</h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-4 mb-6">
          <li>
            <strong>Jadwal Makan Teratur:</strong> Tetapkan waktu makan dan camilan agar anak terbiasa makan secara konsisten.
          </li>
          <li>
            <strong>Variasi Menu:</strong> Sajikan makanan dengan berbagai warna, tekstur, dan rasa agar anak tertarik makan.
          </li>
          <li>
            <strong>Porsi Kecil dan Sering:</strong> Berikan porsi kecil 5–6 kali sehari, daripada 3 porsi besar.
          </li>
          <li>
            <strong>Makan Bersama Keluarga:</strong> Anak lebih termotivasi makan jika melihat orang tua atau saudara makan bersama.
          </li>
          <li>
            <strong>Libatkan Anak:</strong> Ajak anak memilih bahan makanan sehat atau ikut menyiapkan makanan.
          </li>
          <li>
            <strong>Hindari Gangguan:</strong> Matikan TV dan gadget saat makan agar anak fokus pada makanan.
          </li>
          <li>
            <strong>Jangan Memaksa:</strong> Biarkan anak makan sesuai nafsu makan mereka untuk menghindari trauma makan.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Makanan yang Dianjurkan</h3>
        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Sumber protein: telur, ayam, ikan, tahu, tempe.</li>
          <li>Sumber karbohidrat: nasi, roti, pasta, kentang.</li>
          <li>Sayuran: wortel, brokoli, bayam, labu.</li>
          <li>Buah-buahan: apel, pisang, mangga, jeruk.</li>
          <li>Minyak sehat: minyak zaitun, alpukat, kacang-kacangan.</li>
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

export default NafsuMakan;