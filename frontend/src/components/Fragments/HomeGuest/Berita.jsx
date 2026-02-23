import stunting from "../../../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import stunt from "../../../assets/images/unnamed.jpg";
import st from "../../../assets/images/6342b1cd-16a7-4330-b8b8-95e5f94db39e.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import NextArrow from "../../../assets/icons/Arrows/NextArrow";
import PrevArrow from "../../../assets/icons/Arrows/PrevArrow";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import FadeUp from "../../Animations/FadeUp";
import FadeSlide from "../../Animations/FadeSlide";
const Berita = () => {
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
    <section
      id="berita"
      className="relative py-25 bg-gradient-to-b from-gray-50 via-green-100 to-green-100 overflow-hidden"
    >
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
      {/* Background */}
      <div className="absolute -top-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute top-20 left-100 w-[200px] h-[200px] bg-emerald-200 rounded-full blur-3xl opacity-60 z-0"></div>
      <div className="absolute top-120 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute bottom-0 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -top-5 -right-20 w-[300px] h-[300px] bg-blue-200 rounded-full blur-3xl opacity-60 z-0"></div>
      <div className="absolute top-20 right-110 w-[200px] h-[200px] bg-blue-200 rounded-full blur-3xl opacity-60 z-0"></div>

      <div className="w-full px-6 relative">
        {/* HEADER */}

        <div className="text-center mb-16 z-40 ">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
              Berita & Informasi
            </span>
          </motion.div>
          <FadeSlide direction="left"delay={200}>
            <div>
              <h2 className="mt-5 text-4xl font-extrabold text-gray-800">
                Berita Seputar Stunting
              </h2>
            </div>
          </FadeSlide>
          <FadeSlide direction="right" delay={200}>
            <div>
              <p className="mt-5 max-w-2xl mx-auto text-gray-600">
                Dapatkan informasi terbaru mengenai pencegahan, edukasi gizi,
                serta perkembangan penelitian terkait stunting.
              </p>
            </div>
          </FadeSlide>
        </div>

        {/* SWIPER */}
        <div className="relative mb-20">
          <PrevArrow arrowRef={prevRef} />
          <NextArrow arrowRef={nextRef} />
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={3}
            loop={true}
            autoplay={{ delay: 4000 }}
            ref={swiperRef}
            pagination={{
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className} pill-bullet"></span>`;
              },
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {beritaList.map((item, i) => (
              <SwiperSlide key={i}>
                <div className="relative group overflow-hidden rounded-2xl cursor-pointer ">
                  {/* IMAGE */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[420px] object-cover transition duration-700 group-hover:scale-110 "
                  />

                  {/* DARK OVERLAY */}
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* HOVER OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out"></div>

                  {/* CONTENT */}
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white z-10">
                    <div className="group-hover:opacity-0 transition duration-300">
                      <p className="text-emerald-400 text-sm font-semibold mb-2">
                        {item.date}
                      </p>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <hr className="w-20 border-emerald-500 border-2 mt-3" />
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 opacity-0 translate-y-10 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 ease-out">
                      <p className="text-emerald-400 text-sm font-semibold mb-2">
                        {item.date}
                      </p>
                      <h3 className="text-2xl font-bold">{item.title}</h3>
                      <hr className="w-20 border-emerald-500 border-2 mt-3" />
                      <p className="mt-4 text-gray-200 text-sm leading-relaxed">
                        {item.desc}
                      </p>

                      <button className="mt-6 bg-white hover:bg-emerald-500 hover:text-white px-5 py-2 rounded-full text-sm font-semibold transition text-emerald-400">
                        Baca Selengkapnya →
                      </button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Berita;
