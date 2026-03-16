import stunting1 from "../../../assets/images/6342b1cd-16a7-4330-b8b8-95e5f94db39e.png";
import stunting2 from "../../../assets/images/stunting-1170x627.webp";
const PencegahanDetail = ({ detailRef, handleClose }) => {
  return (
    <section ref={detailRef} className="py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Layout Grid */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Tips Mencegah Stunting
        </h2>

        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Menurut World Health Organization (WHO), pencegahan stunting berfokus
          pada{" "}
          <span className="font-semibold">
            1000 Hari Pertama Kehidupan (HPK)
          </span>
          , yaitu sejak masa kehamilan hingga anak berusia dua tahun. Pada
          periode ini, pemenuhan gizi, kesehatan ibu, serta lingkungan yang
          bersih sangat berperan penting dalam mendukung tumbuh kembang anak
          secara optimal.
        </p>
        <div className="grid md:grid-cols-2 gap-10 items-center mb-10">
          {/* TEXT LEFT */}
          <div className="border-emerald-200 border-2 p-4 rounded-xl hover:shadow-xl">
            {/* Tips 1 */}
            <div className="mb-6 mt-6">
              <h3 className="text-xl font-extrabold text-emerald-600 mb-2">
                1. Pemenuhan Gizi Selama Kehamilan
              </h3>

              <ul className="list-disc list-inside text-gray-600 space-y-2 text-justify">
                <li>
                  Ibu hamil perlu mengonsumsi makanan bergizi yang kaya protein,
                  zat besi, kalsium, dan asam folat.
                </li>
                <li>
                  Mengonsumsi tablet tambah darah setiap hari selama masa
                  kehamilan untuk mencegah anemia.
                </li>
                <li>
                  Melakukan pemeriksaan kehamilan (ANC) minimal 6 kali selama
                  kehamilan untuk memantau kesehatan ibu dan janin.
                </li>
              </ul>
            </div>

            {/* Tips 2 */}
            <div className="mb-1">
              <h3 className="text-xl font-extrabold text-emerald-600 mb-2">
                2. Nutrisi Bayi dan Balita
              </h3>

              <ul className="list-disc list-inside text-gray-600 space-y-2 text-justify">
                <li>
                  Memberikan ASI eksklusif selama 6 bulan pertama kehidupan.
                </li>
                <li>
                  Memberikan MPASI bergizi seimbang mulai usia 6 bulan, terutama
                  yang mengandung protein hewani seperti telur, ikan, dan
                  daging.
                </li>
                <li>
                  Rutin memantau tumbuh kembang anak di Posyandu atau fasilitas
                  kesehatan setiap bulan.
                </li>
              </ul>
            </div>
          </div>

          {/* IMAGE RIGHT */}
          <div className="flex justify-center mt-6">
            <img
              src={stunting1}
              alt="Pencegahan Stunting"
              className="rounded-xl shadow-xl w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105 border-emerald-200 border-2"
            />
          </div>
        </div>
        <div className="bg-sky-50 border-l-4 border-sky-500 p-5 rounded-lg text-justify mb-10">
          <p className="text-gray-700 font-medium font-bold">
            Pencegahan stunting dapat diringkas dengan konsep
            <span className="font-bold text-sky-600"> ABCDE</span>:
          </p>

          <ul className="mt-2 text-gray-600 space-y-1">
            <li>A — Aktif minum Tablet Tambah Darah</li>
            <li>B — Bumil rutin periksa kehamilan</li>
            <li>C — Cukupi protein hewani</li>
            <li>D — Datang ke Posyandu</li>
            <li>E — Eksklusif ASI selama 6 bulan</li>
          </ul>
        </div>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* TEXT LEFT */}
          <div className="flex justify-center mt-6">
            <img
              src={stunting2}
              alt="Pencegahan Stunting"
              className="rounded-xl shadow-xl w-full h-[500px] object-cover transition-transform duration-700 hover:scale-105 border-emerald-200 border-2"
            />
          </div>
          <div className="border-emerald-200 border-2 p-4 rounded-xl hover:shadow-xl">
            {/* IMAGE RIGHT */}

            <div className="mb-6 mt-6 ">
              <h3 className="text-xl font-extrabold text-emerald-600 mb-2">
                3. Kesehatan Lingkungan dan Perawatan
              </h3>

              <ul className="list-disc list-inside text-gray-600 space-y-2 text-justify">
                <li>
                  Memberikan imunisasi lengkap sesuai jadwal untuk mencegah
                  penyakit infeksi.
                </li>
                <li>Memastikan akses air bersih dan sanitasi yang layak.</li>
                <li>
                  Menerapkan perilaku hidup bersih dan sehat (PHBS) di dalam
                  keluarga.
                </li>
              </ul>
            </div>

            {/* Tips 4 */}

            <h3 className="text-xl font-extrabold text-emerald-600 mb-2">
              4. Pentingnya 1000 Hari Pertama Kehidupan
            </h3>

            <p className="text-gray-700 text-justify mb-5">
              Pencegahan stunting paling efektif dilakukan pada periode 1000
              hari pertama kehidupan, yaitu sejak janin dalam kandungan hingga
              anak berusia dua tahun. Selain pemenuhan gizi, stimulasi dini juga
              sangat penting untuk mendukung perkembangan fisik dan kognitif
              anak.
            </p>

            {/* Highlight ABCDE */}

            {/* Button */}
          </div>
        </div>
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
export default PencegahanDetail;
