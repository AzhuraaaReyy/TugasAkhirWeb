import stunting1 from "../../../assets/images/6342b1cd-16a7-4330-b8b8-95e5f94db39e.png";
import stunting2 from "../../../assets/images/stunting-1170x627.webp";
const CiriDetail = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Ciri-Ciri Stunting
        </h2>

        <p className="text-gray-600 leading-relaxed mb-8 text-justify">
          Menurut <strong>WHO</strong>, ciri utama stunting adalah tinggi badan
          anak berada di bawah <strong>-2 standar deviasi</strong> dari kurva
          pertumbuhan standar WHO. Kondisi ini menunjukkan bahwa anak mengalami
          gangguan pertumbuhan akibat kekurangan gizi kronis dalam jangka waktu
          lama.
        </p>

        {/* GRID 1 */}
        {/* IMAGE */}
        <div className="flex justify-center mb-10">
          <img
            src={stunting1}
            alt="Anak dengan stunting"
            className="rounded-xl shadow-xl w-full h-[420px] object-cover transition-transform duration-700 hover:scale-105 border-emerald-200 border-2"
          />
        </div>

        {/* TEXT */}
        <div className="border-emerald-200 border-2 p-5 rounded-xl hover:shadow-xl mb-10">
          <h3 className="text-xl font-extrabold text-emerald-600 mb-3">
            Ciri Utama Stunting
          </h3>

          <ul className="list-[lower-alpha] list-inside text-gray-600 space-y-2 text-justify">
            <li>
              <strong>Tinggi badan sangat pendek</strong> dibandingkan anak
              seusianya berdasarkan grafik pertumbuhan WHO.
            </li>

            <li>
              <strong>Pertumbuhan tulang terlambat</strong> sehingga tinggi
              badan anak tidak berkembang secara optimal.
            </li>

            <li>
              <strong>Proporsi tubuh tampak normal tetapi kecil</strong>
              sehingga anak terlihat lebih muda dari usianya.
            </li>

            <li>
              <strong>Berat badan tidak naik atau rendah</strong> dibandingkan
              anak lain dengan usia yang sama.
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
        <div className="flex justify-center mb-10">
          <img
            src={stunting2}
            alt="Ciri-ciri stunting pada anak"
            className="rounded-xl shadow-xl w-full h-[420px] object-cover transition-transform duration-700 hover:scale-105 border-emerald-200 border-2"
          />
        </div>

        {/* TEXT */}
        <div className="border-emerald-200 border-2 p-5 rounded-xl hover:shadow-xl">
          <h3 className="text-xl font-extrabold text-emerald-600 mb-3">
            Ciri-Ciri Lain Stunting
          </h3>

          <ul className="list-disc list-inside text-gray-600 space-y-2 text-justify">
            <li>
              <strong>Perkembangan motorik dan kognitif lambat</strong>, seperti
              terlambat berbicara dan kesulitan fokus.
            </li>

            <li>
              <strong>Lingkar kepala kecil</strong> yang dapat menunjukkan
              pertumbuhan otak tidak optimal.
            </li>

            <li>
              <strong>Imunitas tubuh lemah</strong>, sehingga anak lebih sering
              sakit.
            </li>

            <li>
              <strong>Nafsu makan rendah</strong> dan anak tampak kurang aktif.
            </li>

            <li>
              <strong>Pertumbuhan gigi terlambat</strong> dibandingkan anak
              seusianya.
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
