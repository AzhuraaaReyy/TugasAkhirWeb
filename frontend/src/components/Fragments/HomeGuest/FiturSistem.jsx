const FiturSistem = () => {
  return (
    <>
      {/* SECTION FITUR */}
      <section
        id="fitur"
        className="relative py-24 px-6 bg-gray-50 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* BACKGROUND BLUR DECORATION */}
          <div className="absolute -top-40 bottom-0 -left-50 w-[400px] h-[400px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse -z-10"></div>

          <div className="absolute top-40 -right-30 w-[400px] h-[400px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse -z-10"></div>
          {/* Header */}
          <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
            Fitur Utama Sistem
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Sistem Deteksi Dini Stunting Berbasis Website
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Sistem membantu kader posyandu dan orang tua dalam melakukan
            pencatatan, pemantauan pertumbuhan balita, serta deteksi dini risiko
            stunting secara digital dan sistematis.
          </p>

          {/* Card Fitur */}
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {/* FITUR 1 */}
            <div className="group p-8 bg-white rounded-2xl shadow hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl text-2xl mx-auto group-hover:bg-emerald-500 group-hover:text-white transition">
                📚
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-800">
                Edukasi Gizi dan Stunting
              </h3>

              <p className="mt-3 text-gray-600">
                Menyediakan informasi mengenai nutrisi balita, pencegahan
                stunting, serta panduan tumbuh kembang anak berdasarkan sumber
                kesehatan terpercaya.
              </p>

              <button className="mt-5 text-emerald-600 font-semibold hover:underline">
                Pelajari Sekarang →
              </button>
            </div>

            {/* FITUR 2 */}
            <div className="group p-8 bg-white rounded-2xl shadow hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl text-2xl mx-auto group-hover:bg-emerald-500 group-hover:text-white transition">
                📊
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-800">
                Monitoring Pertumbuhan Balita
              </h3>

              <p className="mt-3 text-gray-600">
                Mencatat dan memantau data tinggi badan, berat badan, serta umur
                balita dengan visualisasi grafik pertumbuhan sesuai standar WHO.
              </p>

              <button className="mt-5 text-emerald-600 font-semibold hover:underline">
                Monitoring Sekarang →
              </button>
            </div>

            {/* FITUR 3 */}
            <div className="group p-8 bg-white rounded-2xl shadow hover:shadow-xl transition duration-300">
              <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl text-2xl mx-auto group-hover:bg-emerald-500 group-hover:text-white transition">
                🧠
              </div>

              <h3 className="mt-6 text-xl font-bold text-gray-800">
                Deteksi Risiko Stunting
              </h3>

              <p className="mt-3 text-gray-600">
                Melakukan klasifikasi risiko stunting menggunakan sistem
                berbasis aturan yang mengacu pada standar antropometri WHO.
              </p>

              <button className="mt-12 text-emerald-600 font-semibold hover:underline">
                Deteksi Sekarang →
              </button>
            </div>
          </div>
        </div>

        {/* 🌊 FLOATING WAVE */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none pointer-events-none">
          {/* Layer 1 */}
          <svg
            className="block w-full h-[160px] wave-float"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#9bf4ca"
              fillOpacity="0.5"
              d="M0,224L80,176C160,128,320,128,480,170.7C640,213,800,299,960,293.3C1120,288,1280,192,1360,144L1440,96L1440,320L0,320Z"
            />
          </svg>

          {/* Layer 2 */}
          <svg
            className="absolute bottom-0 block w-full h-[150px] wave-float-slow"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="#00ff80"
              fillOpacity="0.3"
              d="M0,192L120,208C240,224,480,256,720,229.3C960,203,1200,117,1320,74.7L1440,32L1440,320L0,320Z"
            />
          </svg>
        </div>
      </section>
    </>
  );
};
export default FiturSistem;
