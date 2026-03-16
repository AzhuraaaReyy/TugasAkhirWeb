const DampakDetail = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Judul */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Dampak Stunting
        </h2>

        {/* Gambar */}
        <div className="relative flex items-center justify-center">
          <img
            src="/images/dampak-stunting.jpg"
            alt="Dampak Stunting"
            className="rounded-xl w-full h-[450px] shadow-xl mb-8 object-cover transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>

        {/* Pengantar */}
        <p className="text-gray-600 leading-relaxed mb-8 text-justify">
          Stunting tidak hanya berdampak pada pertumbuhan fisik anak, tetapi
          juga memengaruhi perkembangan kognitif, kesehatan, hingga kualitas
          hidup di masa depan. Dampak stunting dapat dibedakan menjadi dua
          kategori utama yaitu dampak jangka pendek dan dampak jangka panjang.
        </p>

        {/* Dampak Jangka Pendek */}
        <div className="mb-10">
          <h3 className="text-2xl font-extrabold text-emerald-600 mb-4">
            5 Dampak Jangka Pendek Stunting
          </h3>

          <ol className="space-y-4 text-gray-700 leading-relaxed list-decimal list-inside">
            <li>
              <span className="font-bold">
                Meningkatnya Penyakit Fatal dan Angka Kematian Anak
              </span>
              <p className="text-gray-600 ml-6">
                Pertumbuhan anak yang terhambat berkaitan dengan kerentanan yang
                lebih tinggi terhadap infeksi seperti pneumonia dan diare akibat
                melemahnya sistem kekebalan tubuh.
              </p>
            </li>

            <li>
              <span className="font-bold">
                Gangguan Perkembangan dan Kemampuan Belajar Anak
              </span>
              <p className="text-gray-600 ml-6">
                Stunting dapat menyebabkan keterlambatan perkembangan motorik
                dan kognitif yang mempengaruhi kemampuan anak untuk belajar dan
                berinteraksi dengan lingkungan sekitarnya.
              </p>
            </li>

            <li>
              <span className="font-bold">Status Gizi Buruk</span>
              <p className="text-gray-600 ml-6">
                Anak yang mengalami stunting sering mengalami kesulitan dalam
                menyerap nutrisi secara optimal sehingga memperburuk kondisi
                kekurangan gizi.
              </p>
            </li>

            <li>
              <span className="font-bold">
                Peningkatan Risiko Malnutrisi Akut
              </span>
              <p className="text-gray-600 ml-6">
                Anak stunting lebih rentan mengalami wasting atau penurunan
                berat badan yang drastis yang dapat mengancam kesehatan dan
                kelangsungan hidup anak.
              </p>
            </li>

            <li>
              <span className="font-bold">Gangguan Kekebalan Tubuh</span>
              <p className="text-gray-600 ml-6">
                Kekurangan nutrisi dalam jangka panjang dapat melemahkan sistem
                imun sehingga anak lebih mudah terserang penyakit dan infeksi.
              </p>
            </li>
          </ol>
        </div>

        {/* Dampak Jangka Panjang */}
        <div className="mb-10">
          <h3 className="text-2xl font-extrabold text-red-500 mb-4">
            5 Dampak Jangka Panjang Stunting
          </h3>

          <ol className="space-y-4 text-gray-700 leading-relaxed list-decimal list-inside">
            <li>
              <span className="font-bold">
                Pertumbuhan Tinggi Badan Tidak Optimal Saat Dewasa
              </span>
              <p className="text-gray-600 ml-6">
                Anak yang mengalami stunting cenderung memiliki tinggi badan
                yang tidak optimal ketika dewasa akibat kekurangan gizi sejak
                usia dini.
              </p>
            </li>

            <li>
              <span className="font-bold">
                Produktivitas Pendidikan dan Ekonomi Rendah
              </span>
              <p className="text-gray-600 ml-6">
                Stunting dapat mempengaruhi kemampuan belajar dan prestasi
                akademik sehingga berdampak pada rendahnya tingkat pendidikan
                dan potensi pendapatan di masa depan.
              </p>
            </li>

            <li>
              <span className="font-bold">
                Peningkatan Risiko Penyakit Kronis
              </span>
              <p className="text-gray-600 ml-6">
                Individu yang mengalami stunting memiliki risiko lebih tinggi
                terkena penyakit kronis seperti diabetes, hipertensi, dan
                penyakit jantung ketika dewasa.
              </p>
            </li>

            <li>
              <span className="font-bold">Obesitas dan Gangguan Metabolik</span>
              <p className="text-gray-600 ml-6">
                Anak yang mengalami stunting dapat mengalami peningkatan risiko
                obesitas dan gangguan metabolisme di kemudian hari akibat
                perubahan metabolisme tubuh.
              </p>
            </li>

            <li>
              <span className="font-bold">Dampak Lintas Generasi</span>
              <p className="text-gray-600 ml-6">
                Perempuan yang mengalami stunting lebih berisiko melahirkan anak
                dengan berat badan lahir rendah sehingga siklus stunting dapat
                berlanjut pada generasi berikutnya.
              </p>
            </li>
          </ol>
        </div>

        {/* Button */}
        <button
          onClick={handleClose}
          className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Tutup
        </button>
      </div>
    </section>
  );
};
export default DampakDetail;
