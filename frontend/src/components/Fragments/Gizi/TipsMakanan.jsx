import React from "react";
import Makanan from "../../../assets/images/makananbergizi.png";

const TipsMakanan = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Pola Makan Sehat
        </h2>

        <div className="relative flex items-center justify-center mb-6">
          <img
            className="border-emerald-200 border-2 rounded-xl w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
            src={Makanan}
          />
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Pola makan sehat adalah perilaku mengonsumsi makan dengan gizi
          seimbang guna menjaga kesehatan tubuh. Seperti yang diketahui, pola
          makan seseorang sangat berpengaruh pada kondisi tubuhnya. Pola makan
          sehat adalah upaya untuk mengatur porsi dan jenis makanan sehat yang
          dikonsumsi agar dapat mempertahankan kesehatan, status nutrisi,
          mencegah atau membantu kesembuhan penyakit. Pola makan sehat adalah
          perilaku membiasakan diri untuk mengonsumsi makanan yang sehat dan
          bergizi setiap hari. Makanan yang bergizi berupa daging, sayuran,
          buah-buahan, dan lain-lain. Menjaga asupan nutrisi melalui pola makan
          sehat adalah hal yang penting dilakukan.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Berikut ini adalah beberapa saran ahli gizi tentang makanan sehat dan
          cara terbaik untuk mengonsumsinya:
        </p>

        {/* List saran ahli gizi */}
        <ol className="list-decimal list-inside text-gray-600 space-y-4 mb-6">
          <li>
            <strong>Mengonsumsi Makanan yang Bergizi:</strong> Kunci utama dari
            pola makan sehat adalah mengonsumsi makanan yang mengandung nutrisi
            baik bagi tubuh. Cara pengolahan makanan juga perlu diperhatikan.
            Disarankan untuk mengonsumsi lima kelompok pangan setiap hari:
            makanan pokok, lauk-pauk, sayuran, buah-buahan, dan minuman.
          </li>

          <li>
            <strong>Mengurangi Konsumsi Garam, Gula, dan Minyak:</strong> Batasi
            asupan gula, minyak, dan garam tiap harinya. Konsumsi minyak
            berlebihan dapat meningkatkan risiko penyakit, gula berlebih
            meningkatkan risiko obesitas dan diabetes, sedangkan garam berlebih
            bisa menyebabkan tekanan darah tinggi dan stroke.
          </li>

          <li>
            <strong>Membiasakan Sarapan Pagi:</strong> Sarapan pagi membantu
            tubuh tetap fit untuk aktivitas sehari-hari. Disarankan sarapan
            antara bangun pagi hingga jam 9, memenuhi 15–30% kebutuhan gizi
            harian.
          </li>

          <li>
            <strong>Penuhi Kebutuhan Cairan Tubuh:</strong> Minum air putih
            minimal 8 gelas per hari untuk tetap terhidrasi.
          </li>

          <li>
            <strong>Tambah Asupan Protein:</strong> Protein penting untuk
            pembentukan otot, kulit, hormon, dan sel tubuh. Sumber protein
            tinggi juga membantu menurunkan berat badan.
          </li>

          <li>
            <strong>Konsumsi Lemak Baik:</strong> Lemak tak jenuh tunggal dan
            ganda (omega-3) baik untuk kesehatan jantung. Contoh: alpukat,
            kacang almond, minyak zaitun, ikan salmon.
          </li>

          <li>
            <strong>Pilih Karbohidrat Kompleks:</strong> Sumber energi yang
            mengandung vitamin, mineral, dan serat. Contoh: nasi, pasta, roti,
            kacang-kacangan, brokoli, wortel, apel, pisang.
          </li>

          <li>
            <strong>Konsumsi Susu dan Produk Olahan Susu:</strong> Contoh:
            yoghurt kaya kalsium dan probiotik, baik untuk pencernaan.
          </li>

          <li>
            <strong>Konsumsi Serat:</strong> Penting untuk kesehatan pencernaan
            dan membantu menurunkan berat badan. Contoh: buah pir, stroberi,
            apel, pisang, brokoli, lentil, biji chia.
          </li>
        </ol>

        {/* Button Tutup */}
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

export default TipsMakanan;
