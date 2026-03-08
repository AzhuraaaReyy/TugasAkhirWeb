import stunting1 from "../../../assets/images/unnamed.jpg";
import stunting2 from "../../../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import stunting3 from "../../../assets/images/image_2k_2560x1440_v3.png";
import { useState } from "react";
import Typewriter from "../../Animations/Typewriter";
import { useInView } from "../../../hooks/UseInView";
import FadeSlide from "../../Animations/FadeSlide";
import { NavLink } from "react-router-dom";
import AuthModal from "../../Elements/Modal/AuthModal";
const Edukasi = () => {
  const [active, setActive] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [refHeader, headerVisible] = useInView(0.3);
  const [refSec1, sec1Visible] = useInView(0.3);
  const [refSec4, sec4Visible] = useInView(0.3);

  return (
    <>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={() => {
          setIsLogin(true);
          setShowAuth(false);
        }}
      />
      {/* SECTION STUNTING */}
      <section
        id="edukasi"
        className="relative py-28 bg-emerald-50 overflow-hidden z-10 "
      >
        {/* Background Decoration */}
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>

        <div className="absolute top-210 right-290 w-[400px] h-[400px] bg-emerald-200 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute top-160 right-40 w-[400px] h-[400px] bg-blue-200 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute top-300 right-200 w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-40 -z-10"></div>

        <div className="absolute top-380 left-140 w-[300px] h-[300px] bg-emerald-200 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute top-460 right-40 w-[400px] h-[400px] bg-blue-200 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute top-640 -right-30 w-[400px] h-[400px] bg-blue-400 rounded-full blur-3xl opacity-40 -z-10"></div>

        <div className="absolute top-550 left-40 w-[300px] h-[300px] bg-emerald-200 rounded-full blur-3xl opacity-40 -z-10"></div>
        <div className="absolute top-640 left-140 w-[200px] h-[200px] bg-blue-300 rounded-full blur-3xl opacity-40 -z-10"></div>

        <div className="absolute top-5 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
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
        <div
          ref={refHeader}
          className={`max-w-6xl mx-auto px-6 relative z-10 mb-20 transition-all duration-700 ${
            headerVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center">
            <FadeSlide direction="left" delay={200}>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold text-center">
                Edukasi Stunting
              </span>
            </FadeSlide>
          </div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
            {headerVisible && (
              <Typewriter speed={20}>Edukasi Stunting Pada Anak</Typewriter>
            )}
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-center">
            {headerVisible && (
              <Typewriter speed={20}>
                Sistem membantu kader posyandu dan orang tua dalam melakukan
                pencatatan, pemantauan pertumbuhan balita, serta deteksi dini
                risiko stunting secara digital dan sistematis."
              </Typewriter>
            )}
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6  relative z-10">
          {/* ================= SECTION 1 ================= */}

          <div
            ref={refSec1}
            className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700  ${
              sec1Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* IMAGE */}

            <div
              className="relative w-full h-[520px] flex items-center justify-center"
              onMouseLeave={() => setActive(null)}
            >
              {/* FOTO KIRI */}
              <div
                onMouseEnter={() => setActive("kiri1")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kiri1"
        ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] z-40"
        : "top-30 left-0 top-20 w-[270px] h-[270px] rotate-[-6deg] z-10 "
    }`}
              >
                <img src={stunting1} className="w-full h-full object-cover" />
              </div>

              {/* FOTO TENGAH */}
              <div
                onMouseEnter={() => setActive("tengah1")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "tengah1"
        ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] z-40"
        : "top-23 left-1/2 -translate-x-1/2 w-[270px] h-[320px] z-10 bg-white z-20"
    }`}
              >
                <img src={stunting2} className="w-full h-full object-cover" />
              </div>

              {/* FOTO KANAN */}
              <div
                onMouseEnter={() => setActive("kanan1")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kanan1"
        ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] z-40"
        : "right-0 top-30 w-[270px] h-[270px] z-10 rotate-[6deg] z-10"
    }`}
              >
                <img src={stunting3} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* TEXT */}
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                {sec1Visible && (
                  <Typewriter
                    key="sec1"
                    speed={25}
                    highlightWords={["Stunting?"]}
                    highlightClass="text-emerald-600 font-bold"
                    delay={1600}
                  >
                    Apa Itu Stunting?
                  </Typewriter>
                )}
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                {sec1Visible && (
                  <Typewriter
                    speed={25}
                    highlightWords={["Stunting"]}
                    delay={1600}
                  >
                    Stunting adalah kondisi gagal tumbuh pada anak akibat
                    kekurangan gizi kronis dalam waktu yang lama, terutama pada
                    1.000 hari pertama kehidupan (sejak masa kehamilan hingga
                    usia 2 tahun). Kondisi ini ditandai dengan tinggi badan anak
                    yang lebih rendah dibandingkan standar usianya berdasarkan
                    kurva pertumbuhan yang ditetapkan oleh World Health
                    Organization (WHO).Anak yang mengalami stunting berisiko
                    memiliki daya tahan tubuh yang lebih rendah dan lebih rentan
                    terhadap penyakit. Oleh karena itu, pencegahan stunting
                    menjadi sangat penting melalui pemenuhan gizi seimbang,
                    pemantauan pertumbuhan secara rutin, serta peran aktif
                    keluarga dan tenaga kesehatan dalam menjaga kesehatan ibu
                    dan anak sejak dini.
                  </Typewriter>
                )}
              </p>
              <FadeSlide direction="right" delay={2100}>
                <button
                  onClick={() => {
                    if (!isLogin) {
                      setShowAuth(true);
                    }
                  }}
                  className="mt-6 bg-white hover:bg-emerald-500 hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition text-emerald-400"
                >
                  Baca Selengkapnya →
                </button>
              </FadeSlide>
            </div>
          </div>
          {/* ================= SECTION 4 ================= */}
          <div
            ref={refSec4}
            className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${
              sec4Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* TEXT */}
            <div className="order-2 md:order-1 mt-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                {sec4Visible && (
                  <Typewriter
                    key="sec4"
                    speed={25}
                    highlightWords={["Stunting?"]}
                    highlightClass="text-emerald-600 font-bold"
                  >
                    Bagaimana Cegah Stunting?
                  </Typewriter>
                )}
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                {sec4Visible && (
                  <Typewriter
                    key="sec4"
                    speed={25}
                    highlightWords={["Cara"]}
                    highlightClass="text-emerald-600 font-bold"
                  >
                    Cara mencegah stunting dimulai sejak masa kehamilan dengan
                    memastikan ibu mendapatkan asupan gizi yang cukup, rutin
                    memeriksakan kehamilan, dan mengonsumsi suplemen sesuai
                    anjuran tenaga kesehatan. Setelah bayi lahir, pencegahan
                    dilakukan melalui pemberian ASI eksklusif selama enam bulan,
                    dilanjutkan dengan MPASI bergizi seimbang yang kaya protein,
                    vitamin, dan mineral, serta memastikan imunisasi lengkap dan
                    kebersihan lingkungan terjaga. Selain itu, pemantauan rutin
                    tinggi dan berat badan anak di posyandu atau fasilitas
                    kesehatan sangat penting untuk mendeteksi dini gangguan
                    pertumbuhan sehingga dapat segera ditangani.
                  </Typewriter>
                )}
              </p>

              <FadeSlide direction="left" delay={2100}>
                <button
                  onClick={() => {
                    if (!isLogin) {
                      setShowAuth(true);
                    }
                  }}
                  className="mt-6 bg-white hover:bg-emerald-500 hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition text-emerald-400"
                >
                  Baca Selengkapnya →
                </button>
              </FadeSlide>
            </div>

            {/* IMAGE */}
            <div
              className="relative w-full h-[520px] flex items-center justify-center order-2 md:order-2"
              onMouseLeave={() => setActive(null)}
            >
              {/* FOTO KIRI */}
              <div
                onMouseEnter={() => setActive("kiri4")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kiri4"
        ? "left-1/2 top-80 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[520px] z-40"
        : "left-5 top-42 w-[270px] h-[270px] z-10"
    }`}
              >
                <img src={stunting1} className="w-full h-full object-cover" />
              </div>

              {/* FOTO TENGAH */}
              <div
                onMouseEnter={() => setActive("tengah4")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "tengah4"
        ? "left-1/2 top-[300px] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[520px] z-40"
        : "left-[140px] top-[300px] w-[270px] h-[270px] z-20"
    }`}
              >
                <img src={stunting2} className="w-full h-full object-cover" />
              </div>

              {/* FOTO KANAN */}
              <div
                onMouseEnter={() => setActive("kanan4")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kanan4"
        ? "left-1/2 top-80 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] z-40"
        : "left-[280px] top-25 w-[270px] h-[270px] z-30"
    }`}
              >
                <img src={stunting3} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Edukasi;
