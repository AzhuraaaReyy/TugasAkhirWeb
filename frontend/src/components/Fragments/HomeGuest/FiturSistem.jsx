import { useInView } from "../../../hooks/UseInView";
import FadeSlide from "../../Animations/FadeSlide";
import FadeUp from "../../Animations/FadeUp";
import Typewriter from "../../Animations/Typewriter";
const FiturSistem = () => {
  const [refHeader, headerVisible] = useInView(0.3);

  return (
    <>
      {/* SECTION FITUR */}
      <section
        id="fitur"
        className="relative py-24 px-6 bg-gradient-to-b from-gray-50 to-emerald-100 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* BACKGROUND BLUR DECORATION */}
          <div className="absolute -top-40 bottom-0 -left-50 w-[400px] h-[400px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse -z-10"></div>

          <div className="absolute top-40 -right-30 w-[400px] h-[400px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse -z-10"></div>
          {/* Header */}
          <div
            ref={refHeader}
            className={`max-w-6xl mx-auto px-6 relative z-10 transition-all duration-700 ${
              headerVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
              {headerVisible && (
                <Typewriter speed={20}>Fitur Utama Sistem</Typewriter>
              )}
            </span>

            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
              {headerVisible && (
                <Typewriter speed={10}>
                  Sistem Deteksi Dini Stunting Berbasis Website
                </Typewriter>
              )}
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-gray-600">
              {headerVisible && (
                <Typewriter speed={15}>
                  Sistem membantu kader posyandu dan orang tua dalam melakukan
                  pencatatan, pemantauan pertumbuhan balita, serta deteksi dini
                  risiko stunting secara digital dan sistematis.
                </Typewriter>
              )}
            </p>
          </div>
          {/* Card Fitur */}

          <div className="mt-14 grid md:grid-cols-3 gap-8">
            {/* FITUR 1 */}
            <FadeUp delay={400}>
              <div
                className="group p-8 bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 shadow-md
                    transition-all duration-300 ease-out
                    hover:-translate-y-3 hover:shadow-xl hover:scale-105"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl text-2xl mx-auto group-hover:bg-emerald-500 group-hover:text-white transition">
                  📚
                </div>
                <FadeSlide direction="left" delay={400}>
                  <h3 className="mt-6 text-xl font-bold text-gray-800">
                    Edukasi Gizi dan Stunting
                  </h3>
                </FadeSlide>
                <FadeUp delay={400}>
                  <p className="mt-3 text-gray-600">
                    Menyediakan informasi mengenai nutrisi balita, pencegahan
                    stunting, serta panduan tumbuh kembang anak berdasarkan
                    sumber kesehatan terpercaya.
                  </p>
                </FadeUp>
                <FadeSlide direction="right" delay={400}>
                  <button className="mt-5 text-emerald-600 font-semibold hover:underline">
                    Pelajari Sekarang →
                  </button>
                </FadeSlide>
              </div>
            </FadeUp>
            {/* FITUR 2 */}
            <FadeUp delay={600}>
              <div
                className="group p-8 bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 shadow-md
                    transition-all duration-300 ease-out
                    hover:-translate-y-3 hover:shadow-xl hover:scale-105"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl text-2xl mx-auto group-hover:bg-emerald-500 group-hover:text-white transition">
                  📊
                </div>
                <FadeSlide direction="left" delay={600}>
                  <h3 className="mt-6 text-xl font-bold text-gray-800">
                    Monitoring Pertumbuhan Balita
                  </h3>
                </FadeSlide>
                <FadeUp delay={600}>
                  <p className="mt-3 text-gray-600">
                    Mencatat dan memantau data tinggi badan, berat badan, serta
                    umur balita dengan visualisasi grafik pertumbuhan sesuai
                    standar WHO.
                  </p>
                </FadeUp>
                <FadeSlide direction="right" delay={600}>
                  <button className="mt-5 text-emerald-600 font-semibold hover:underline">
                    Monitoring Sekarang →
                  </button>
                </FadeSlide>
              </div>
            </FadeUp>

            {/* FITUR 3 */}
            <FadeUp delay={800}>
              <div
                className="group p-8 bg-white rounded-2xl shadow hover:shadow-xl transition duration-300 shadow-md
                    transition-all duration-300 ease-out
                    hover:-translate-y-3 hover:shadow-xl hover:scale-105"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-xl text-2xl mx-auto group-hover:bg-emerald-500 group-hover:text-white transition">
                  🧠
                </div>
                <FadeSlide direction="left" delay={800}>
                  <h3 className="mt-6 text-xl font-bold text-gray-800">
                    Deteksi Risiko Stunting
                  </h3>
                </FadeSlide>
                <FadeUp delay={800}>
                  <p className="mt-3 text-gray-600">
                    Melakukan klasifikasi risiko stunting menggunakan sistem
                    berbasis aturan yang mengacu pada standar antropometri WHO.
                  </p>
                </FadeUp>
                <FadeSlide direction="right" delay={800}>
                  <button className="mt-12 text-emerald-600 font-semibold hover:underline">
                    Deteksi Sekarang →
                  </button>
                </FadeSlide>
              </div>
            </FadeUp>
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
