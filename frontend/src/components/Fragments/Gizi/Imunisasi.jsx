import React from "react";
import ImunisasiImg from "../../../assets/images/‫imunisasi.webp";

const Imunisasi = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Pentingnya Imunisasi untuk Anak
        </h2>

        <div className="relative flex items-center justify-center mb-6">
          <img
            className="border-emerald-200 border-2 rounded-xl w-full h-[450px] object-cover hover:scale-105 transition-transform duration-700 ease-out"
            src={ImunisasiImg}
          />
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Imunisasi adalah pemberian vaksin untuk membantu tubuh anak membentuk
          kekebalan terhadap penyakit tertentu. Imunisasi merupakan salah satu
          cara paling efektif untuk mencegah penyakit berbahaya dan komplikasi
          serius yang dapat mengancam kesehatan anak.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Menurut Organisasi Kesehatan Dunia (WHO), imunisasi dapat mencegah
          lebih dari 2-3 juta kematian setiap tahun akibat penyakit menular.
          Anak yang rutin mendapatkan imunisasi memiliki risiko lebih rendah
          terkena penyakit seperti polio, campak, tetanus, hepatitis B, dan
          tuberkulosis.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Manfaat Imunisasi
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-4 mb-6">
          <li>
            <strong>Mencegah Penyakit Menular:</strong> Vaksin membantu tubuh
            mengenali dan melawan kuman sebelum menyebabkan penyakit.
          </li>
          <li>
            <strong>Melindungi Anak dari Komplikasi Serius:</strong> Banyak
            penyakit menular dapat menyebabkan komplikasi seperti pneumonia,
            kerusakan otak, bahkan kematian.
          </li>
          <li>
            <strong>Mendukung Pertumbuhan dan Perkembangan:</strong> Anak yang
            sehat cenderung tumbuh lebih optimal dan memiliki daya tahan tubuh
            yang baik.
          </li>
          <li>
            <strong>Mencegah Penyebaran Penyakit:</strong> Imunisasi tidak hanya
            melindungi anak, tetapi juga keluarga dan komunitas dari wabah
            penyakit.
          </li>
        </ol>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Jadwal Imunisasi Anak
        </h3>
        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Pemberian vaksin biasanya dimulai sejak lahir hingga usia 18 tahun,
          tergantung jenis vaksinnya. Contohnya:
        </p>

        <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
          <li>Hepatitis B: sejak lahir, 1 bulan, dan 6 bulan</li>
          <li>Polio: 2, 4, 6 bulan, dan booster</li>
          <li>Campak: 9 bulan dan booster 18 bulan</li>
          <li>Tetanus: beberapa dosis sesuai usia</li>
          <li>DPT (Difteri, Pertusis, Tetanus): 2, 4, 6 bulan dan booster</li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Tips Orang Tua
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-4 mb-6">
          <li>
            Catat jadwal imunisasi anak agar tidak ada dosis yang terlewat.
          </li>
          <li>
            Diskusikan dengan tenaga kesehatan jika anak memiliki alergi atau
            kondisi khusus.
          </li>
          <li>Berikan nutrisi yang baik agar imunisasi bekerja maksimal.</li>
          <li>
            Jangan takut dengan efek samping ringan seperti demam atau bengkak
            di tempat suntikan—ini normal.
          </li>
        </ol>

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

export default Imunisasi;
