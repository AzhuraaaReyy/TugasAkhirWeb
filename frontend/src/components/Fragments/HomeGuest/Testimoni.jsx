import { Star } from "lucide-react";
import { motion } from "framer-motion";
import FadeUp from "../../Animations/FadeUp";
import FadeSlide from "../../Animations/FadeSlide";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import NextArrow from "../../../assets/icons/Arrows/NextArrow";
import PrevArrow from "../../../assets/icons/Arrows/PrevArrow";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { useRef } from "react";

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
  {
    nama: "Andhika Pratama",
    peran: "Orang Tua",
    komentar:
      "Platform ini mendukung program pemerintah dalam pencegahan stunting secara digital.",
    foto: "https://i.pravatar.cc/150?img=6",
  },
  {
    nama: "Dilan & Milea",
    peran: "Kader Posyandu",
    komentar:
      "Platform ini mendukung program pemerintah dalam pencegahan stunting secara digital.",
    foto: "https://i.pravatar.cc/150?img=7",
  },
  {
    nama: "Puskesmas",
    peran: "Instansi",
    komentar:
      "Platform ini mendukung program pemerintah dalam pencegahan stunting secara digital.",
    foto: "https://i.pravatar.cc/150?img=8",
  },
];

const Testimoni = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      id="testimoni"
      className="py-24 px-6 bg-emerald-50 relative overflow-hidden"
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
      {/* Background Blur */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-emerald-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -top-32 left-300 w-[300px] h-[300px] bg-emerald-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-320 w-[300px] h-[300px] bg-blue-300 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-110 right-150 w-[300px] h-[300px] bg-blue-300 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3 }}
        >
          <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold">
            Testimoni Pengguna
          </span>
        </motion.div>

        <FadeUp delay={300}>
          <h2 className="mt-4 text-4xl font-bold text-gray-800">
            Apa Kata Mereka?
          </h2>
        </FadeUp>

        <FadeSlide direction="left" delay={500}>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Pengalaman pengguna yang telah menggunakan sistem deteksi dini
            stunting.
          </p>
        </FadeSlide>

        <FadeUp delay={700}>
          <div className="mt-14 relative">
            {/* Custom Navigation */}
            <div
              ref={prevRef}
              className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            >
              <PrevArrow />
            </div>

            <div
              ref={nextRef}
              className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-20 cursor-pointer"
            >
              <NextArrow />
            </div>

            <Swiper
              modules={[Navigation, Autoplay, Pagination]}
              spaceBetween={30}
              loop={true}
              autoHeight={false}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              onBeforeInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
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
              {testimonials.map((item, index) => (
                <SwiperSlide key={index} className="flex">
                  <div
                    className="
bg-white p-8 rounded-2xl 
flex flex-col w-full h-[400px] text-center
shadow-md
transition-all duration-500 ease-out

hover:-translate-y-5
hover:scale-105
hover:bg-gray-100
hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
"
                  >
                    <FadeUp delay={400}>
                      
                      {/* Foto */}
                      <img
                        src={item.foto}
                        alt={item.nama}
                        className="w-16 h-16 rounded-full mx-auto object-cover mt-10 animate-bounce [animation-duration:5s]"
                      />

                      {/* Nama */}
                      <h4 className="mt-4 font-semibold text-gray-800">
                        {item.nama}
                      </h4>

                      <span className="text-sm text-gray-500">
                        {item.peran}
                      </span>

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

                      <p className="mt-4 text-gray-600 text-sm leading-relaxed flex-grow italic before:content-['“'] after:content-['”']">
                        {item.komentar}
                      </p>
                    </FadeUp>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </FadeUp>
      </div>
    </section>
  );
};

export default Testimoni;
