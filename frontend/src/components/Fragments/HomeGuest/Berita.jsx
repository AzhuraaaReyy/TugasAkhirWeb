import stunting from "../../../assets/images/pexels-photo-1001914.jpeg";

import stunt from "../../../assets/images/stun.png";
import st from "../../../assets/images/img_banner_.png";

const Berita = () => {
  const beritaList = [
    {
      image: stunting,
      title: "Pentingnya 1000 Hari Pertama Kehidupan",
      desc: "1000 HPK merupakan periode emas pertumbuhan anak yang sangat menentukan kualitas kesehatan dan perkembangan otak.",
      date: "12 Februari 2026",
    },
    {
      image: stunt,
      title: "Peran Gizi Seimbang Dalam Pencegahan Stunting",
      desc: "Pemenuhan nutrisi seperti protein, zat besi, dan vitamin sangat berpengaruh terhadap pertumbuhan balita.",
      date: "10 Februari 2026",
    },
    {
      image: st,
      title: "Cara Memantau Pertumbuhan Anak Secara Rutin",
      desc: "Pemantauan tinggi dan berat badan secara berkala membantu mendeteksi risiko stunting lebih awal.",
      date: "8 Februari 2026",
    },
  ];
  return (
    <>
      <section
        id="berita"
        className="relative py-28 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute bottom-0 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40"></div>

        <div className="relative max-w-6xl mx-auto px-6">
          {/* HEADER */}
          <div className="text-center mb-16">
            <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
              Informasi & Edukasi
            </span>

            <h2 className="mt-5 text-4xl font-bold text-gray-800">
              Berita Seputar Stunting
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-gray-600">
              Dapatkan informasi terbaru mengenai pencegahan, edukasi gizi,
              serta perkembangan penelitian terkait stunting.
            </p>
          </div>

          {/* CARD GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {beritaList.map((item, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-500"
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-56 w-full object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>

                  {/* Date badge */}
                  <span className="absolute top-4 left-4 px-3 py-1 bg-emerald-500 text-white text-xs rounded-full shadow">
                    {item.date}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>

                  <button className="mt-6 text-emerald-600 font-semibold hover:underline flex items-center gap-2">
                    Baca Selengkapnya →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default Berita;
