import MainLayouts from "../../layouts/MainLayouts";

export default function EdukasiStunting() {
  const edukasi = [
    {
      title: "Tips Gizi Balita",
      desc: "Pastikan anak mendapatkan protein, vitamin, dan mineral yang cukup dari makanan bergizi seperti telur, ikan, sayur dan buah.",
      icon: "🥦",
    },
    {
      title: "Pencegahan Stunting",
      desc: "Penuhi gizi sejak kehamilan, berikan ASI eksklusif, dan lakukan pemantauan pertumbuhan anak secara rutin.",
      icon: "👶",
    },
    {
      title: "Pentingnya Imunisasi",
      desc: "Imunisasi membantu meningkatkan kekebalan tubuh anak terhadap berbagai penyakit berbahaya.",
      icon: "💉",
    },
  ];

  const artikel = [
    {
      title: "Cara Mencegah Stunting Sejak Dini",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    },
    {
      title: "Menu Sehat untuk Balita",
      img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061",
    },
    {
      title: "Peran Orang Tua dalam Tumbuh Kembang Anak",
      img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74",
    },
  ];

  return (
    <MainLayouts>
      <div className="bg-gray-50">
        {/* HERO SECTION */}
        <section className="relative bg-emerald-50 py-24 px-6">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-center gap-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Edukasi Pencegahan Stunting pada Anak
              </h1>

              <p className="text-gray-600 mb-6">
                Dapatkan informasi penting tentang gizi anak, pencegahan
                stunting, imunisasi, dan pola makan sehat untuk mendukung
                pertumbuhan optimal anak.
              </p>

              <button className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow hover:bg-emerald-600">
                Pelajari Sekarang
              </button>
            </div>

            <img
              src="https://images.unsplash.com/photo-1588072432836-e10032774350"
              className="rounded-xl shadow-lg"
            />
          </div>
        </section>

        {/* EDUKASI CARD */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              Informasi Kesehatan Anak
            </h2>
            <p className="text-gray-500 mt-2">
              Edukasi penting bagi orang tua untuk mendukung tumbuh kembang anak
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {edukasi.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* STATISTIK */}
        <section className="bg-white py-14">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 text-center gap-6">
            <div>
              <h3 className="text-3xl font-bold text-emerald-500">80%</h3>
              <p className="text-gray-600">Kasus stunting dapat dicegah</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-orange-500">1000 HPK</h3>
              <p className="text-gray-600">Periode penting pertumbuhan anak</p>
            </div>

            <div>
              <h3 className="text-3xl font-bold text-blue-500">6 Bulan</h3>
              <p className="text-gray-600">ASI Eksklusif dianjurkan</p>
            </div>
          </div>
        </section>

        {/* VIDEO EDUKASI */}
        <section className="py-20 px-6 bg-gray-100">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Video Edukasi Pencegahan Stunting
              </h2>

              <p className="text-gray-600">
                Pelajari lebih lanjut mengenai stunting, penyebabnya, dan cara
                pencegahannya melalui video edukasi berikut.
              </p>
            </div>

            <div className="aspect-video rounded-xl overflow-hidden shadow">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/MQZPj8T3Yp0"
                title="Edukasi Stunting"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </section>

        {/* ARTIKEL EDUKASI */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold">Artikel Edukasi</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {artikel.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden"
              >
                <img src={item.img} className="h-48 w-full object-cover" />

                <div className="p-5">
                  <h3 className="font-semibold text-lg">{item.title}</h3>

                  <button className="text-emerald-500 text-sm mt-3">
                    Baca Selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="bg-emerald-500 py-14 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">
            Pantau Pertumbuhan Anak Anda
          </h2>

          <p className="mb-6">
            Gunakan sistem monitoring pertumbuhan anak untuk mendeteksi stunting
            sejak dini.
          </p>

          <button className="bg-white text-emerald-600 px-6 py-3 rounded-lg font-semibold">
            Mulai Monitoring
          </button>
        </section>
      </div>
    </MainLayouts>
  );
}
