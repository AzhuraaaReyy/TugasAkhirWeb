import LensDemo from "@/components/Animations/Lens";
import stunting1 from "../../../assets/images/6342b1cd-16a7-4330-b8b8-95e5f94db39e.png";
import stunting2 from "../../../assets/images/stunting-1170x627.webp";
const CiriDetail = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Ciri-Ciri Stunting
        </h2>
        {/* IMAGE */}

        <div className="flex justify-center mb-10 shadow-xl border-emerald-200 border-2 rounded-xl">
          <LensDemo src={stunting1} />
        </div>

        <p className="text-gray-600 leading-relaxed mb-8 text-justify">
          Menurut <strong>WHO</strong>, ciri utama stunting adalah tinggi badan
          anak berada di bawah <strong>-2 standar deviasi</strong> dari kurva
          pertumbuhan standar WHO. Kondisi ini menunjukkan bahwa anak mengalami
          gangguan pertumbuhan akibat kekurangan gizi kronis dalam jangka waktu
          lama.
        </p>

        {/* GRID 1 */}

        {/* TEXT */}
        <div className="border-emerald-200 border-2 p-5 rounded-xl hover:shadow-xl mb-10">
          <h3 className="text-xl font-extrabold text-emerald-600 mb-3">
            Ciri Utama Stunting
          </h3>

          <ul className="list-[upper-alpha] list-inside text-gray-600 space-y-2 text-justify">
            <li>
              <strong>Tinggi Badan Sangat Pendek</strong>

              <p>
                Menurut World Health Organization, stunting ditandai dengan
                tinggi badan anak yang berada di bawah standar usianya
                berdasarkan grafik pertumbuhan (Height-for-Age). Kondisi ini
                terjadi karena kekurangan gizi dalam jangka panjang, bukan
                sekadar faktor keturunan. Anak yang mengalami stunting memiliki
                nilai tinggi badan di bawah -2 standar deviasi dari kurva
                pertumbuhan WHO, yang menunjukkan adanya gangguan pertumbuhan
                kronis. Dampaknya tidak hanya pada fisik, tetapi juga dapat
                memengaruhi perkembangan otak dan kemampuan belajar anak.
              </p>
            </li>

            <li>
              <strong>Pertumbuhan tulang terlambat</strong>

              <p>
                Pertumbuhan tulang yang tidak optimal merupakan salah satu
                dampak utama dari kekurangan nutrisi yang berlangsung lama. WHO
                menjelaskan bahwa nutrisi seperti protein, kalsium, zinc, dan
                vitamin D sangat berperan dalam pembentukan dan pertumbuhan
                tulang. Jika kebutuhan nutrisi tersebut tidak terpenuhi, maka
                proses pertumbuhan tulang menjadi terhambat sehingga tinggi
                badan anak tidak berkembang sesuai usianya. Kondisi ini sering
                diperparah oleh infeksi berulang dan lingkungan yang kurang
                sehat.
              </p>
            </li>

            <li>
              <strong>Proporsi tubuh tampak normal tetapi kecil</strong>
              sehingga anak terlihat lebih muda dari usianya.
              <p>
                Anak yang mengalami stunting umumnya tetap memiliki proporsi
                tubuh yang terlihat seimbang antara kepala, badan, dan anggota
                tubuh lainnya. Namun, ukuran tubuh secara keseluruhan lebih
                kecil dibandingkan anak seusianya. Hal ini membuat anak sering
                tampak lebih muda dari usia sebenarnya. Karena bentuk tubuhnya
                terlihat normal, kondisi ini sering tidak disadari oleh orang
                tua, padahal pertumbuhan anak sebenarnya tidak optimal.
              </p>
            </li>

            <li>
              <strong>Berat badan tidak naik atau rendah</strong> dibandingkan
              anak lain dengan usia yang sama.
              <p>
                Selain tinggi badan yang terhambat, anak stunting juga sering
                mengalami berat badan yang rendah atau tidak mengalami
                peningkatan yang signifikan. Hal ini menunjukkan bahwa asupan
                energi dan nutrisi yang diterima tubuh tidak mencukupi atau
                tidak terserap dengan baik. Kondisi ini dapat berkaitan dengan
                masalah gizi lainnya seperti underweight atau wasting, serta
                dipengaruhi oleh faktor seperti pola makan yang tidak seimbang,
                penyakit berulang, dan kondisi lingkungan yang kurang mendukung
                kesehatan anak.
              </p>
            </li>
          </ul>
        </div>

        {/* INFO BOX */}
        <div className="bg-sky-50 border-l-4 border-sky-500 p-5 rounded-lg text-justify mb-10">
          <p className="text-gray-700 font-medium">
            Stunting tidak hanya berkaitan dengan tubuh yang pendek, tetapi juga
            dapat mempengaruhi perkembangan otak, kesehatan, serta kemampuan
            belajar anak dalam jangka panjang.
          </p>
        </div>

        {/* GRID 2 */}

        {/* IMAGE */}
        <div className="flex justify-center mb-10 shadow-xl border-emerald-200 border-2 rounded-xl">
          <LensDemo src={stunting2} />
        </div>

        {/* TEXT */}
        <div className="border-emerald-200 border-2 p-5 rounded-xl hover:shadow-xl">
          <h3 className="text-xl font-extrabold text-emerald-600 mb-3">
            Ciri-Ciri Lain Stunting
          </h3>

          <ul className="list-[upper-alpha] list-outside pl-6 text-gray-600 space-y-2 text-justify">
            <li>
              <strong>Perkembangan Motorik dan Kognitif Lambat</strong>,{" "}
              <p>
                Menurut World Health Organization, stunting tidak hanya
                berdampak pada pertumbuhan fisik, tetapi juga perkembangan otak
                anak. Anak dapat mengalami keterlambatan dalam kemampuan motorik
                seperti duduk, berdiri, atau berjalan, serta perkembangan
                kognitif seperti berbicara dan memahami bahasa. Hal ini terjadi
                karena kekurangan nutrisi penting yang dibutuhkan untuk
                perkembangan sel-sel otak, sehingga anak cenderung sulit fokus,
                lambat belajar, dan memiliki kemampuan berpikir yang tidak
                optimal.
              </p>
            </li>

            <li>
              <strong>Lingkar Kepala Kecil</strong>
              <p>
                Lingkar kepala merupakan salah satu indikator pertumbuhan otak.
                Pada anak stunting, lingkar kepala sering kali lebih kecil dari
                standar usia, yang dapat menunjukkan bahwa perkembangan otak
                tidak berjalan optimal. Kondisi ini berkaitan dengan kurangnya
                asupan gizi, terutama pada masa penting pertumbuhan yaitu 1000
                hari pertama kehidupan. Dampaknya dapat berpengaruh jangka
                panjang terhadap kecerdasan dan kemampuan belajar anak.
              </p>
            </li>

            <li>
              <strong>Imunitas Tubuh Lemah</strong>
              <p>
                Anak dengan stunting umumnya memiliki sistem kekebalan tubuh
                yang lebih lemah. Hal ini disebabkan oleh kekurangan nutrisi
                seperti protein, vitamin, dan mineral yang berperan penting
                dalam menjaga daya tahan tubuh. Akibatnya, anak lebih rentan
                terkena infeksi seperti diare, ISPA, dan penyakit lainnya.
                Infeksi yang berulang ini juga dapat memperparah kondisi
                stunting karena mengganggu penyerapan nutrisi dalam tubuh.
              </p>
            </li>

            <li>
              <strong>Nafsu Makan Rendah</strong>
              <p>
                Stunting sering disertai dengan penurunan nafsu makan, sehingga
                asupan nutrisi anak semakin tidak mencukupi. Anak juga cenderung
                tampak kurang aktif, lemas, dan tidak seenergik anak seusianya.
                Kondisi ini dapat disebabkan oleh kombinasi antara kekurangan
                energi, gangguan metabolisme, serta infeksi yang sering terjadi,
                sehingga anak tidak memiliki cukup energi untuk beraktivitas.
              </p>
            </li>

            <li>
              <strong>Pertumbuhan gigi terlambat</strong>
              <p>
                Pertumbuhan gigi yang lebih lambat dari usia seharusnya juga
                dapat menjadi salah satu tanda stunting. Nutrisi seperti
                kalsium, fosfor, dan vitamin D sangat berperan dalam pembentukan
                gigi. Jika asupan nutrisi tersebut kurang, maka proses
                pertumbuhan gigi menjadi terhambat. Hal ini tidak hanya
                berdampak pada kesehatan mulut, tetapi juga dapat memengaruhi
                kemampuan anak dalam mengunyah makanan dan memenuhi kebutuhan
                gizinya.
              </p>
            </li>
          </ul>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleClose}
          className="mt-10 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
          Tutup
        </button>
      </div>
    </section>
  );
};
export default CiriDetail;
