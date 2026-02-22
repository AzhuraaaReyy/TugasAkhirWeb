import stunting from "../../../assets/images/6342b1cd-16a7-4330-b8b8-95e5f94db39e.png";
import stunting2 from "../../../assets/images/image_2k_2560x1440_v2.png";
import stunting3 from "../../../assets/images/image_2k_2560x1440_v3.png";
import stunting4 from "../../../assets/images/ae9726d1-a139-4f6b-99f8-8230a88c7e65.png";
import NextArrow from "../../../assets/icons/Arrows/NextArrow";
import PrevArrow from "../../../assets/icons/Arrows/PrevArrow";
import { useState } from "react";
import AuthModal from "../../Elements/Modal/AuthModal";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import { useInView } from "../../../hooks/UseInView";
import Typewriter from "../../Animations/Typewriter";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import FadeUp from "../../Animations/FadeUp";
import FadeSlide from "../../Animations/FadeSlide";
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

  const [refHeader, headerVisible] = useInView(0.3);

  const [activeIndex, setActiveIndex] = useState(0);
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
        autoplay={{ delay: 6000 }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
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
          {activeIndex === 0 && (
            <section
              key={activeIndex}
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
                <div className="mb-15" ref={refHeader}>
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                      Pencegahan Dini Stunting
                    </span>
                  </motion.div>
                  <FadeUp delay={200}>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                      Cegah <span className="text-emerald-400">Stunting</span>
                      <br />
                      Wujudkan Generasi Sehat
                    </h1>
                  </FadeUp>
                  <p className="mt-6 max-w-xl text-gray-200 leading-relaxed">
                    {headerVisible && (
                      <Typewriter speed={20}>
                        Stunting dapat dicegah sejak dini melalui pemantauan
                        pertumbuhan, pemenuhan gizi seimbang, dan edukasi
                        berkelanjutan bagi orang tua. Bersama, kita wujudkan
                        generasi yang lebih sehat, cerdas, dan siap menghadapi
                        masa depan.
                      </Typewriter>
                    )}
                  </p>

                  <div className="mt-8 flex gap-4">
                    {/* BUTTON LOGIN GATE */}
                    <FadeSlide direction="left" delay={200}>
                      <div>
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
                      </div>
                    </FadeSlide>
                    <FadeSlide direction="right" delay={200}>
                      <div>
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
                    </FadeSlide>
                  </div>
                </div>
              </div>
            </section>
          )}
        </SwiperSlide>

        {/* SLIDE 2 */}
        <SwiperSlide>
          {activeIndex === 1 && (
            <section
              key={activeIndex}
              className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${stunting2})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

              <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
                <div className="mb-15">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                      Pencegahan Dini Stunting
                    </span>
                  </motion.div>
                  <FadeUp delay={200}>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                      Deteksi Dini{" "}
                      <span className="text-emerald-400">Stunting </span>
                      <br />
                      Untuk Masa Depan Generasi Sehat
                    </h1>
                  </FadeUp>
                  <p className="mt-6 max-w-xl text-gray-200 leading-relaxed text-justify">
                    <Typewriter speed={20}>
                      Deteksi dini stunting melalui pemantauan tinggi dan berat
                      badan secara rutin membantu mengenali risiko sejak awal.
                      Dengan intervensi yang tepat dan edukasi berkelanjutan,
                      kita dapat memastikan anak tumbuh optimal dan memiliki
                      masa depan yang lebih sehat.
                    </Typewriter>
                  </p>

                  <div className="mt-8 flex gap-4">
                    <FadeSlide direction="left" delay={200}>
                      <div>
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
                      </div>
                    </FadeSlide>
                    <FadeSlide direction="right" delay={200}>
                      <div>
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
                    </FadeSlide>
                  </div>
                </div>
              </div>
            </section>
          )}
        </SwiperSlide>
        {/* SLIDE 3 */}
        <SwiperSlide>
          {activeIndex === 2 && (
            <section
              key={activeIndex}
              className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${stunting3})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

              <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
                <div className="mb-15">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                      Pencegahan Dini Stunting
                    </span>
                  </motion.div>
                  <FadeUp delay={200}>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                      Pemantauan
                      <span className="text-emerald-400">
                        {" "}
                        Pertumbuhan
                      </span>{" "}
                      Balita
                      <br />
                      Berbasis Website
                    </h1>
                  </FadeUp>
                  <p className="mt-6 max-w-xl text-gray-200 leading-relaxed">
                    <Typewriter speed={20}>
                      Sistem berbasis website ini mempermudah pencatatan dan
                      pemantauan pertumbuhan balita secara real-time, sehingga
                      kader posyandu dan orang tua dapat memantau perkembangan
                      anak dengan lebih cepat, dan akurat.
                    </Typewriter>
                  </p>

                  <div className="mt-8 flex gap-4">
                    <FadeSlide direction="left" delay={200}>
                      <div>
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
                      </div>
                    </FadeSlide>
                    <FadeSlide delay={200} direction="right">
                      <div>
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
                    </FadeSlide>
                  </div>
                </div>
              </div>
            </section>
          )}
        </SwiperSlide>

        {/* SLIDE 4 */}
        <SwiperSlide>
          {activeIndex === 3 && (
            <section
              key={activeIndex}
              className="relative min-h-screen flex items-center justify-center px-6 pt-24 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${stunting4})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/100 to-transparent"></div>

              <div className="relative max-w-7xl grid md:grid-cols-2 gap-10 items-center text-white">
                <div className="mb-15">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <span className="inline-block mb-4 px-4 py-2 bg-emerald-500/30 rounded-full text-sm">
                      Pencegahan Dini Stunting
                    </span>
                  </motion.div>
                  <FadeUp delay={200}>
                    <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                      Membantu{" "}
                      <span className="text-emerald-400">Kader Posyandu</span>{" "}
                      dan <span className="text-emerald-400">Orang Tua</span>{" "}
                      Memantau Pertumbuhan Anak
                      <br />
                    </h1>
                  </FadeUp>
                  <p className="mt-6 max-w-xl text-gray-200 leading-relaxed">
                    <Typewriter speed={20}>
                      Melalui sistem berbasis website, kader posyandu dan orang
                      tua dapat mencatat, memantau, serta mengevaluasi
                      pertumbuhan anak secara berkala. Informasi yang tersaji
                      secara terintegrasi membantu pengambilan keputusan yang
                      lebih cepat dan tepat.
                    </Typewriter>
                  </p>

                  <div className="mt-8 flex gap-4">
                    <FadeSlide direction="left" delay={200}>
                      <div>
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
                      </div>
                    </FadeSlide>
                    <FadeSlide direction="right" delay={200}>
                      <div>
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
                    </FadeSlide>
                  </div>
                </div>
              </div>
            </section>
          )}
        </SwiperSlide>
      </Swiper>
      <PrevArrow arrowRef={prevRef} />
      <NextArrow arrowRef={nextRef} />
    </>
  );
};
export default Hero;
