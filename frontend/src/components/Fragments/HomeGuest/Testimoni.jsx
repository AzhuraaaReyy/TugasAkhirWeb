import { Star } from "lucide-react";
const testimonials = [
  {
    nama: "Siti Rahma",
    peran: "Kader Posyandu",
    komentar:
      "Sistem ini sangat membantu kami dalam memantau pertumbuhan anak secara lebih cepat dan akurat.",
    foto: "https://i.pravatar.cc/150?img=32",
  },
  {
    nama: "Budi Santoso",
    peran: "Orang Tua",
    komentar:
      "Saya jadi lebih mudah mengetahui status gizi anak saya tanpa harus bingung membaca grafik manual.",
    foto: "https://i.pravatar.cc/150?img=12",
  },
  {
    nama: "Dinas Kesehatan",
    peran: "Instansi",
    komentar:
      "Platform ini mendukung program pemerintah dalam pencegahan stunting secara digital.",
    foto: "https://i.pravatar.cc/150?img=5",
  },
];
const Testimoni = () => {
  return (
    <section
      id="testimoni"
      className="py-24 px-6 bg-gray-50 relative overflow-hidden bg-gradient-animate"
    >
      {/* Background Blob */}
      {/* Floating Blob 1 */}
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-blob"></div>

      {/* Floating Blob 2 */}
      <div className="absolute bottom-0 -right-32 w-[420px] h-[420px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-blob delay-2000"></div>
      <div className="absolute -top-20 -right-32 w-[350px] h-[350px] bg-emerald-200 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
          Testimoni Pengguna
        </span>

        <h2 className="mt-4 text-4xl font-bold text-gray-800">
          Apa Kata Mereka?
        </h2>

        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Pengalaman pengguna yang telah menggunakan sistem deteksi dini
          stunting.
        </p>

        {/* Card Testimoni */}
        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >
              {/* Foto */}
              <img
                src={item.foto}
                alt={item.nama}
                className="w-16 h-16 rounded-full mx-auto object-cover"
              />

              {/* Nama */}
              <h4 className="mt-4 font-semibold text-gray-800">{item.nama}</h4>

              <span className="text-sm text-gray-500">{item.peran}</span>

              {/* Rating */}
              <div className="flex justify-center mt-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Komentar */}
              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                "{item.komentar}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Testimoni;
