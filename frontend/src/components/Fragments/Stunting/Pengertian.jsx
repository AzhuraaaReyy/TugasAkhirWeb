export default function PengertianDetail({ detailRef, handleClose }) {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Pengertian Stunting
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Menurut World Health Organization (WHO), stunting merupakan kondisi
          terganggunya pertumbuhan dan perkembangan anak yang disebabkan oleh
          kekurangan gizi dalam jangka waktu lama, sering mengalami infeksi,
          serta kurangnya stimulasi psikososial yang memadai.
        </p>

        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg mb-6">
          <p className="text-gray-700 leading-relaxed">
            Seorang anak dikatakan mengalami stunting apabila tinggi badannya
            lebih rendah dari standar tinggi badan anak seusianya, yaitu berada
            di bawah <span className="font-semibold">-2 standar deviasi</span>
            dari standar pertumbuhan anak menurut WHO.
          </p>
        </div>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Berdasarkan ketentuan WHO, suatu negara dikatakan mengalami masalah
          stunting jika jumlah kasusnya melebihi 20% dari total jumlah anak. Di
          Indonesia sendiri, pada tahun 2022 angka stunting masih cukup tinggi
          yaitu sekitar <span className="font-semibold">24,4%</span>.
        </p>

        <p className="text-gray-600 leading-relaxed text-justify">
          Namun demikian, stunting berbeda dengan kondisi anak yang hanya
          memiliki tubuh pendek. Anak yang mengalami stunting pasti memiliki
          tinggi badan yang lebih pendek dari standar usianya.
        </p>

        <button
          onClick={handleClose}
          className="mt-8 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          Tutup
        </button>
      </div>
    </section>
  );
}
