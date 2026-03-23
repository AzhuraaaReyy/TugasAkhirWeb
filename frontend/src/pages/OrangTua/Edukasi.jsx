import MainLayouts from "../../layouts/MainLayouts";
import { useState, useRef, useEffect } from "react";
import FadeSlide from "../../components/Animations/FadeSlide";
import Typewriter from "../../components/Animations/Typewriter";
import Particles from "../../components/Animations/Particles";
import FadeUp from "../../components/Animations/FadeUp";
import { useInView } from "@/hooks/useInView";
import AnimatedList from "../../components/Animations/AnimatedList";
import ArtikelPanel from "@/components/Fragments/Edukasi/ArtikelPanel";
import PengertianDetail from "@/components/Fragments/Stunting/Pengertian";
import PenyebabDetail from "@/components/Fragments/Stunting/Penyebab";
import DampakDetail from "@/components/Fragments/Stunting/Dampak";
import PencegahanDetail from "@/components/Fragments/Stunting/Pencegahan";
import CiriDetail from "@/components/Fragments/Stunting/Ciri";
import artikel from "@/data/artikel";
import { data } from "@/data/stunting";
import { motion } from "framer-motion";

export default function EdukasiStunting() {
  const [activeKey, setActiveKey] = useState("pengertian");

  const [selectedArtikel, setSelectedArtikel] = useState(null);

  const activeData = data[0][activeKey];
  const images = activeData.image;
  const artikelRefs = useRef([]); // simpan ref semua artikel
  const [fade, setFade] = useState(true);

  const detailRef = useRef(null);

  const changeTab = (value, newTab) => {
    setFade(false);

    setTimeout(() => {
      setActiveKey(value);
      setFade(true);
    }, 200);
    if (selectedDetail) {
      setSelectedDetail(data[newTab]);
    }
  };

  const items = [
    {
      title: "Apa itu Stunting?",
      videoId: "jTsMZYU76uY",
    },
    {
      title: "Cara Mencegah Stunting",
      videoId: "ic0tQZUZRA4",
    },
    {
      title: "Pentingnya Gizi Seimbang",
      videoId: "T7y5v1B2Q0A",
    },
    {
      title: "Peran Posyandu dalam Pencegahan Stunting",
      videoId: "q3sL8Zx1N9M",
    },
  ];

  const [activeVideo, setActiveVideo] = useState(items[0]);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setTargetPos({
      x: (e.clientX - centerX) / 20, // atur sensitivity
      y: (e.clientY - centerY) / 20,
    });
  };

  // Lerp untuk smooth
  useEffect(() => {
    const frame = () => {
      setPos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * 0.1,
        y: prev.y + (targetPos.y - prev.y) * 0.1,
      }));
      requestAnimationFrame(frame);
    };
    const animation = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animation);
  }, [targetPos]);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const detail2Ref = useRef(null);
  const topRef = useRef(null);
  const topRef2 = useRef(null);
  const handleDetail = () => {
    setSelectedDetail(activeKey);

    setTimeout(() => {
      detail2Ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  useEffect(() => {
    if (!selectedDetail) {
      requestAnimationFrame(() => {
        topRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [selectedDetail]);
  const handleClose = () => {
    setSelectedDetail(null);
  };

  useEffect(() => {
    if (selectedArtikel) {
      detailRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [selectedArtikel]);
  const SelectedComponent = selectedArtikel?.component;

  const [refHeader, headerVisible] = useInView(0.3);
  const [refSec1, sec1Visible] = useInView(0.3);
  const [refSec4, sec4Visible] = useInView(0.3);
  return (
    <MainLayouts type="edukasiortu">
      <section
        id="edukasi"
        ref={topRef}
        className="relative w-full bg-emerald-50 py-10 overflow-hidden"
      >
        <div className="absolute inset-0 -z-0 pointer-events-none">
          <Particles
            particleColors={["#00ff1e"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>
        {/* Background Decoration */}
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>

        {/* Galaxy Background */}

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
          className={`max-w-6xl mx-auto px-6 relative z-10  transition-all duration-700  `}
        >
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
            {headerVisible && (
              <Typewriter speed={20}>Edukasi Stunting Pada Anak</Typewriter>
            )}
          </h2>
          <FadeUp delay={400}>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-center">
              Sistem membantu kader posyandu dan orang tua dalam melakukan
              pencatatan, pemantauan pertumbuhan balita, serta deteksi dini
              risiko stunting secara digital dan sistematis."
            </p>
          </FadeUp>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
          {/* IMAGE */}
          <FadeSlide direction="right" delay={700}>
            <div
              onMouseMove={handleMouseMove}
              className="  relative flex items-center justify-center"
            >
              {/* IMAGE */}
              <img
                src={images[0]}
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                }}
                className={` border-white border-3 left-5 relative z-20 rounded-xl hover:shadow-xl object-cover w-[600px] h-[400px] transition-opacity duration-500  transition-all duration-700 transition-transform duration-700 ease-out
  hover:scale-105 `}
              />
              <img
                src={images[2]}
                className={`  border-white border-2 absolute bottom-[-30px] left-[-30px]  z-30 rounded-xl hover:shadow-xl object-cover w-[300px] h-[180px] transition-opacity duration-500  transition-all duration-700 transition-transform duration-700 ease-out
  hover:scale-105 `}
              />
            </div>
          </FadeSlide>

          {/* TEXT */}

          <div className="mb-10 min-h-[360px]">
            {/* TITLE */}
            <FadeSlide direction="left" delay={700}>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-800 leading-snug">
                {activeData.title}
              </h2>
            </FadeSlide>

            {/* TAB MENU */}
            <FadeSlide direction="left" delay={700}>
              <div className="relative flex gap-6 mt-6 text-sm font-semibold text-gray-500">
                <button
                  onClick={() => changeTab("pengertian")}
                  className={`pb-1 ${
                    activeKey === "pengertian"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Pengertian
                </button>

                <button
                  onClick={() => changeTab("penyebab")}
                  className={`pb-1 ${
                    activeKey === "penyebab"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Penyebab
                </button>

                <button
                  onClick={() => changeTab("dampak")}
                  className={`pb-1 ${
                    activeKey === "dampak"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Dampak
                </button>

                <button
                  onClick={() => changeTab("pencegahan")}
                  className={`pb-1 ${
                    activeKey === "pencegahan"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Mencegah
                </button>

                <button
                  onClick={() => changeTab("ciri")}
                  className={`pb-1 ${
                    activeKey === "ciri"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Ciri-ciri
                </button>

                {/* DOT PATTERN */}
                <div
                  className="absolute  top-27 right-55 w-[350px] h-[150px] 
  bg-[radial-gradient(#6b7280_1px,transparent_1px)] 
  [background-size:20px_20px] opacity-30  pointer-events-none"
                ></div>

                <div
                  className="absolute -top-30 -right-2 w-[120px] h-[120px] 
  bg-[radial-gradient(#6b7280_7px,transparent_5px)] 
  [background-size:30px_30px] opacity-15  pointer-events-none"
                ></div>
                <div
                  className="absolute top-53 -right-2 w-[120px] h-[120px] 
  bg-[radial-gradient(#6b7280_7px,transparent_5px)] 
  [background-size:30px_30px] opacity-15  pointer-events-none"
                ></div>
              </div>
              {/* DESCRIPTION */}
              <FadeSlide direction="left" delay={700}>
                <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                  {activeData.text}
                </p>
              </FadeSlide>
              <button
                onClick={handleDetail}
                className="mt-6 px-5 py-3 bg-emerald-500 border border-white/30 rounded-lg text-sm hover:bg-emerald-600 transition text-white"
              >
                Selengkapnya
              </button>
            </FadeSlide>
          </div>
        </div>
      </section>
      {selectedDetail === "pengertian" && (
        <PengertianDetail detailRef={detail2Ref} handleClose={handleClose} />
      )}

      {selectedDetail === "penyebab" && (
        <PenyebabDetail detailRef={detail2Ref} handleClose={handleClose} />
      )}

      {selectedDetail === "dampak" && (
        <DampakDetail detailRef={detail2Ref} handleClose={handleClose} />
      )}

      {selectedDetail === "pencegahan" && (
        <PencegahanDetail detailRef={detail2Ref} handleClose={handleClose} />
      )}

      {selectedDetail === "ciri" && (
        <CiriDetail detailRef={detail2Ref} handleClose={handleClose} />
      )}
      <section
        ref={topRef2}
        className="relative w-full bg-emerald-50 py-10 overflow-hidden"
      >
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
        <div className="absolute inset-0 pointer-events-none z-0">
          <Particles
            particleColors={["#00ff1e"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          {/* Title Section */}
          <div ref={refSec1} className="text-center mb-16">
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
              {sec1Visible && (
                <Typewriter speed={20}>Panduan Gizi Pada Anak</Typewriter>
              )}
            </h2>
            <FadeSlide direction="right" delay={300}>
              <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                Temukan berbagai informasi penting seputar makanan bergizi, menu
                MPASI, cara meningkatkan nafsu makan anak, pola asuh yang baik,
                serta pentingnya imunisasi untuk mendukung tumbuh kembang anak
                secara optimal.
              </p>
            </FadeSlide>
          </div>

          {/* Panel Layout */}
          <FadeUp delay={400}>
            <ArtikelPanel
              artikel={artikel}
              onSelect={(item, index) => {
                setSelectedArtikel({ ...item, index });
              }}
              artikelRefs={artikelRefs}
            />
          </FadeUp>
        </div>
      </section>
      <div ref={detailRef}>
        {SelectedComponent && (
          <SelectedComponent
            detailRef={detailRef}
            handleClose={() => {
              setSelectedArtikel(null);

              setTimeout(() => {
                topRef2.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);
            }}
          />
        )}
      </div>
      <section className="relative w-full bg-emerald-50 py-10 overflow-hidden">
        {/* Particles Background */}
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
        <div className="absolute inset-0 pointer-events-none">
          <Particles
            particleColors={["#00ff1e"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        <div ref={refSec4} className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Title */}

          <div className="text-center text-black mb-12">
            <h2 className="text-4xl font-extrabold">
              {sec4Visible && (
                <Typewriter speed={20}>Video Edukasi Stunting</Typewriter>
              )}
            </h2>
            <FadeSlide direction="left">
              <p className="text-gray-500 mt-2">
                Pelajari cara mencegah stunting melalui video edukasi kesehatan
                anak.
              </p>
            </FadeSlide>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* VIDEO UTAMA */}
            <motion.div
              key={activeVideo.videoId}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <div className="md:col-span-2">
                <iframe
                  className="w-full h-[400px] rounded-lg"
                  src={`https://www.youtube.com/embed/${activeVideo.videoId}`}
                  title={activeVideo.title}
                  allowFullScreen
                ></iframe>
              </div>
            </motion.div>
            {/* LIST VIDEO */}
            <div className="space-y-4">
              <AnimatedList
                items={items}
                onItemSelect={(item) => setActiveVideo(item)}
                showGradients
                enableArrowNavigation
                displayScrollbar
              />
            </div>
          </div>

          {/* Button */}
          <FadeSlide direction="right">
            <div className="text-center mt-10">
              <button className="bg-emerald-500 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition">
                Lihat Semua Video
              </button>
            </div>
          </FadeSlide>
        </div>
      </section>
    </MainLayouts>
  );
}
