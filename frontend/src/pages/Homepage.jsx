import stunting from "../assets/images/pexels-photo-1001914.jpeg";
import stunting2 from "../assets/images/image_ultra_hd_2560x1440.png";
import NextArrow from "../assets/icons/Arrows/NextArrow";
import PrevArrow from "../assets/icons/Arrows/PrevArrow";
import stunt from "../assets/images/stun.png";
import st from "../assets/images/img_banner_.png";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRef, useEffect } from "react";

import { Navigation, Autoplay, Pagination } from "swiper/modules";

function Homepage() {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      const swiper = swiperRef.current.swiper;

      swiper.params.navigation.prevEl = prevRef.current;
      swiper.params.navigation.nextEl = nextRef.current;

      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }
  }, []);

  return (
    <>
      {/* HERO SLIDER */}
      <Swiper
        ref={swiperRef}
        modules={[Navigation, Autoplay, Pagination]}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="h-screen"
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} pill-bullet"></span>`;
          },
        }}
      >
        {/* SLIDE 1 */}
        <SwiperSlide>
          <section
            className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${stunting})`,
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

            {/* Content */}
            <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
              <div className="mb-15">
                <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                  Pencegahan Dini Stunting
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  Cegah <span className="text-emerald-400">Stunting</span>
                  <br />
                  Wujudkan Generasi Sehat
                </h1>

                <p className="mt-6 max-w-xl text-gray-200">
                  Stunting memengaruhi pertumbuhan fisik dan perkembangan otak
                  anak. Deteksi dini dan edukasi adalah kunci masa depan yang
                  lebih baik.
                </p>

                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition">
                    Mulai Sekarang
                  </button>

                  <button className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition">
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        {/* SLIDE 2 */}
        <SwiperSlide>
          <section
            className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${stunting2})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

            <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
              <div className="mb-15">
                <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                  Pencegahan Dini Stunting
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  Deteksi Dini{" "}
                  <span className="text-emerald-400">Stunting </span>
                  <br />
                  Untuk Masa Depan Generasi Sehat
                </h1>

                <p className="mt-6 max-w-xl text-gray-200">
                  Stunting merupakan gangguan pertumbuhan yang berdampak pada
                  perkembangan fisik dan kognitif anak. Pemantauan pertumbuhan
                  balita secara berkelanjutan diperlukan untuk mendukung
                  pencegahan stunting secara optimal.
                </p>

                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition">
                    Mulai Pemantauan
                  </button>

                  <button className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition">
                    Pelajari Tentang Stunting
                  </button>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
        {/* SLIDE 3 */}
        <SwiperSlide>
          <section
            className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${stunting2})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

            <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
              <div className="mb-15">
                <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                  Pencegahan Dini Stunting
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  Pemantauan
                  <span className="text-emerald-400"> Pertumbuhan</span> Balita
                  <br />
                  Berbasis Website
                </h1>

                <p className="mt-6 max-w-xl text-gray-200">
                  Pemanfaatan sistem informasi berbasis website membantu
                  pengelolaan data pertumbuhan balita secara cepat, akurat, dan
                  mudah diakses oleh kader posyandu maupun orang tua.
                </p>

                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition">
                    Lihat Fitur Sistem
                  </button>

                  <button className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition">
                    Akses Monitoring
                  </button>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>

        {/* SLIDE 4 */}
        <SwiperSlide>
          <section
            className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${stunting2})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

            <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
              <div className="mb-15">
                <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                  Pencegahan Dini Stunting
                </span>

                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                  Membantu{" "}
                  <span className="text-emerald-400">Kader Posyandu</span> dan{" "}
                  <span className="text-emerald-400">Orang Tua</span> Memantau
                  Pertumbuhan Anak
                  <br />
                </h1>

                <p className="mt-6 max-w-xl text-gray-200">
                  Sistem ini memudahkan pencatatan, pemantauan, serta penyajian
                  informasi pertumbuhan balita secara terpusat dan
                  berkelanjutan.
                </p>

                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition">
                    Mulai Monitoring Anak
                  </button>

                  <button className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition">
                    Akses Data Pertumbuhan
                  </button>
                </div>
              </div>
            </div>
          </section>
        </SwiperSlide>
      </Swiper>
      <PrevArrow arrowRef={prevRef} />
      <NextArrow arrowRef={nextRef} />
      {/* SECTION FITUR */}
      <section className="relative py-24 px-6 bg-gray-50 overflow-hidden">
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
      {/* SECTION STUNTING */}
      <section className="relative py-28 bg-gray-50 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 mb-15">
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Sistem Deteksi Dini Stunting Berbasis Website
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600">
            Sistem membantu kader posyandu dan orang tua dalam melakukan
            pencatatan, pemantauan pertumbuhan balita, serta deteksi dini risiko
            stunting secara digital dan sistematis.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-6 space-y-28 relative z-10">
          {/* ================= SECTION 1 ================= */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* IMAGE */}
            <div className="relative group">
              <img
                src={st}
                alt="Stunting"
                className="w-full h-[420px] object-cover rounded-3xl shadow-xl transition duration-500 group-hover:scale-105"
              />

              <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-emerald-300 rounded-full blur-2xl opacity-40"></div>
            </div>

            {/* TEXT */}
            <div>
              <span className="inline-block px-4 py-2 mb-5 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
                Edukasi Kesehatan Anak
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Apa Itu <span className="text-emerald-600">Stunting?</span>
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed">
                Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan
                gizi kronis dalam jangka waktu lama. Kondisi ini tidak hanya
                mempengaruhi tinggi badan anak, tetapi juga perkembangan otak,
                daya tahan tubuh, serta kemampuan belajar di masa depan.
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Pencegahan stunting dapat dilakukan melalui pemenuhan gizi
                seimbang, pemantauan pertumbuhan anak, serta edukasi kesehatan
                bagi orang tua.
              </p>
            </div>
          </div>

          {/* ================= SECTION 2 ================= */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* TEXT */}
            <div className="order-2 md:order-1">
              <span className="inline-block px-4 py-2 mb-5 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                Dampak Kesehatan Anak
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Apa Dampak <span className="text-blue-600">Stunting?</span>
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed">
                Stunting dapat menyebabkan gangguan perkembangan kognitif,
                menurunkan daya tahan tubuh, serta meningkatkan risiko penyakit
                kronis di masa dewasa.
              </p>

              <p className="mt-4 text-gray-600 leading-relaxed">
                Selain berdampak pada kesehatan individu, stunting juga dapat
                mempengaruhi kualitas sumber daya manusia dan pertumbuhan
                ekonomi suatu negara.
              </p>
            </div>

            {/* IMAGE */}
            <div className="relative group order-1 md:order-2">
              <img
                src={stunt}
                alt="Dampak Stunting"
                className="w-full h-[420px] object-cover rounded-3xl shadow-xl transition duration-500 group-hover:scale-105"
              />

              <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-blue-300 rounded-full blur-2xl opacity-40"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-28 px-6 overflow-hidden bg-gradient-animate">
        {/* Floating Blob 1 */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-blob"></div>

        {/* Floating Blob 2 */}
        <div className="absolute bottom-0 -right-32 w-[420px] h-[420px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-blob delay-2000"></div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
            Sistem Deteksi Dini Stunting
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-800">
            Pantau Pertumbuhan Anak Secara Digital
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-gray-600">
            Sistem membantu kader posyandu dan orang tua dalam melakukan
            pencatatan, pemantauan, serta deteksi dini risiko stunting secara
            lebih efektif.
          </p>
        </div>
      </section>

      <section className="relative py-28 px-6 overflow-hidden bg-gradient-animate">
        {/* Floating Blob 1 */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-blob"></div>

        {/* Floating Blob 2 */}
        <div className="absolute bottom-0 -right-32 w-[420px] h-[420px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-blob delay-2000"></div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
            Sistem Deteksi Dini Stunting
          </span>

          <h2 className="mt-5 text-4xl font-bold text-gray-800">
            Pantau Pertumbuhan Anak Secara Digital
          </h2>

          <p className="mt-5 max-w-2xl mx-auto text-gray-600">
            Sistem membantu kader posyandu dan orang tua dalam melakukan
            pencatatan, pemantauan, serta deteksi dini risiko stunting secara
            lebih efektif.
          </p>
        </div>
      </section>
    </>
  );
}

export default Homepage;
