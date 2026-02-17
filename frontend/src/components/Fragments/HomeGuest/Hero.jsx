import stunting from "../../../assets/images/pexels-photo-1001914.jpeg";
import stunting2 from "../../../assets/images/image_ultra_hd_2560x1440.png";
import NextArrow from "../../../assets/icons/Arrows/NextArrow";
import PrevArrow from "../../../assets/icons/Arrows/PrevArrow";
import { useState } from "react";
import AuthModal from "../../Elements/Modal/AuthModal";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "leaflet/dist/leaflet.css";

import { useRef, useEffect } from "react";

import { Navigation, Autoplay, Pagination } from "swiper/modules";
const Hero = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);

  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

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
      {/* AUTH MODAL (HARUS DI LUAR SWIPER) */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLoginSuccess={() => {
          setIsLogin(true);
          setShowAuth(false);
        }}
      />
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
            id="hero"
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
                  {/* BUTTON LOGIN GATE */}
                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition"
                  >
                    Mulai Sekarang
                  </button>

                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition"
                  >
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
                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition"
                  >
                    Mulai Pemantauan
                  </button>

                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition"
                  >
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
                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition"
                  >
                    Lihat Fitur Sistem
                  </button>

                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition"
                  >
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
                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl shadow hover:bg-emerald-600 transition"
                  >
                    Mulai Monitoring Anak
                  </button>

                  <button
                    onClick={() => {
                      if (!isLogin) {
                        setShowAuth(true);
                      }
                    }}
                    className="px-6 py-3 border border-emerald-400 text-emerald-300 rounded-xl hover:bg-emerald-400/20 transition"
                  >
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
    </>
  );
};
export default Hero;
