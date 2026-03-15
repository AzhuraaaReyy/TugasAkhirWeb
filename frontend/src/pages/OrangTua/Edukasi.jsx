import MainLayouts from "../../layouts/MainLayouts";
import { useState, useRef, useEffect } from "react";
import FadeSlide from "../../components/Animations/FadeSlide";
import Typewriter from "../../components/Animations/Typewriter";
import Particles from "../../components/Animations/Particles";
import stunting1 from "../../assets/images/unnamed.jpg";
import stunting2 from "../../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import stunting3 from "../../assets/images/image_2k_2560x1440_v3.png";
import FadeUp from "../../components/Animations/FadeUp";
import stunting4 from "../../assets/images/image_2k_2560x1440.png";
import AnimatedList from "../../components/Animations/AnimatedList";
import ArtikelDetail from "@/components/Fragments/Edukasi/ArtikelDetail";
import ArtikelPanel from "@/components/Fragments/Edukasi/ArtikelPanel";
import PengertianDetail from "@/components/Fragments/Stunting/Pengertian";
export default function EdukasiStunting() {
  const [tab, setTab] = useState("pengertian");

  const [selectedArtikel, setSelectedArtikel] = useState(null);
  const data = {
    pengertian: {
      title: "1.) Apa Itu Stunting?",
      image: [stunting4, stunting2, stunting3],
      text: "Stunting menurut WHO adalah gangguan pertumbuhan dan perkembangan anak akibat kekurangan gizi kronis dan infeksi berulang, yang ditandai dengan panjang atau tinggi badannya berada di bawah standar kurva pertumbuhan WHO (kurang dari -2 standar deviasi/SD). Kondisi ini terjadi akibat asupan gizi yang tidak adekuat selama 1000 hari pertama kehidupan (sejak janin hingga usia 2 tahun).",
    },
    penyebab: {
      title: "2.) Penyebab Stunting",
      image: [stunting1, stunting2, stunting4],
      text: "Menurut WHO, penyebab utama stunting adalah malnutrisi kronis (jangka panjang) yang terjadi sejak dalam kandungan hingga dua tahun pertama kehidupan, yang diperburuk oleh infeksi berulang, kurangnya asupan gizi seimbang, serta sanitasi dan lingkungan yang tidak sehat. Sekitar 20% kasus stunting sudah dimulai sejak janin dalam kandungan.",
    },
    dampak: {
      title: "3.) Dampak Stunting",
      image: [stunting1, stunting4, stunting3],
      text: "Menurut WHO, stunting adalah gangguan pertumbuhan fisik dan perkembangan otak akibat kekurangan gizi kronis, ditandai dengan tinggi badan di bawah -2 standar deviasi kurva pertumbuhan WHO. Dampaknya meliputi penurunan kemampuan kognitif, imunitas lemah, risiko penyakit kronis (diabetes/hipertensi) saat dewasa, hingga penurunan produktivitas ekonomi.",
    },
    pencegahan: {
      title: "4.) Pencegahan Stunting",
      image: [stunting1, stunting2, stunting3],
      text: "Pencegahan stunting menurut WHO berfokus pada intervensi gizi dan kesehatan selama 1000 Hari Pertama Kehidupan (HPK), mulai dari kehamilan hingga anak usia 2 tahun. Upaya utama meliputi nutrisi optimal ibu hamil, ASI eksklusif 6 bulan, MPASI bergizi (kaya protein hewani), pemantauan tumbuh kembang, imunisasi, dan sanitasi bersih.",
    },
    ciri: {
      title: "5.) Ciri-Ciri Stunting",
      image: [stunting1, stunting2, stunting3],
      text: "Ciri utama stunting menurut WHO adalah tinggi badan anak berada di bawah -2 standar deviasi (SD) dari kurva pertumbuhan standar WHO. Anak tampak jauh lebih pendek dari usianya, pertumbuhan tulang tertunda, berat badan tidak naik, dan perkembangan kognitif/motorik terlambat. Stunting terjadi akibat gizi kronis, ditandai dengan anak kurang aktif, mudah sakit, dan nafsu makan rendah. ",
    },
  };
  const activeData = data[tab];
  const artikelRefs = useRef([]); // simpan ref semua artikel
  const [fade, setFade] = useState(true);

  const images = activeData.image;
  const detailRef = useRef(null);
  const changeTab = (value, newTab) => {
    setFade(false);

    setTimeout(() => {
      setTab(value);
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

  const artikel = [
    {
      title: "Tips Makanan Bergizi",
      image:
        "https://images.unsplash.com/photo-1543332164-6e82f355bad8?q=80&w=1974",
      desc: "Makanan bergizi merupakan salah satu faktor utama dalam mendukung pertumbuhan dan perkembangan balita.",
    },
    {
      title: "Menu MPASI",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1974",
      desc: "MPASI atau Makanan Pendamping ASI merupakan makanan tambahan yang diberikan kepada bayi setelah berusia enam bulan.",
    },
    {
      title: "Nafsu Makan Anak",
      image:
        "https://images.unsplash.com/photo-1484981138541-3d074aa97716?q=80&w=1974",
      desc: "Untuk meningkatkan nafsu makan anak, orang tua dapat mencoba beberapa cara seperti memberikan variasi menu makanan, menyajikan makanan dengan tampilan yang menarik, serta menciptakan suasana makan yang nyaman.",
    },
    {
      title: "Pola Asuh Anak",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1974",
      desc: "Pola asuh yang baik memiliki peran penting dalam mendukung perkembangan fisik maupun mental anak. Orang tua perlu memberikan perhatian, kasih sayang, serta stimulasi yang cukup agar anak dapat tumbuh dan berkembang dengan optimal.",
    },
    {
      title: "Pentingnya Imunisasi",
      image:
        "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=1974",
      desc: "Imunisasi merupakan salah satu upaya penting dalam melindungi anak dari berbagai penyakit berbahaya. Melalui imunisasi, tubuh anak akan membentuk kekebalan terhadap penyakit tertentu sehingga risiko terkena penyakit dapat berkurang.",
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
  const handleDetail = () => {
    setSelectedDetail(tab);

    setTimeout(() => {
      detail2Ref.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  const handleClose = () => {
    setSelectedDetail(null);

    setTimeout(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };
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
          className={`max-w-6xl mx-auto px-6 relative z-10  transition-all duration-700  `}
        >
          <div className="text-center"></div>
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
            <Typewriter speed={20}>Edukasi Stunting Pada Anak</Typewriter>
          </h2>
          <FadeSlide direction="right" delay={300}>
            <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-center">
              Sistem membantu kader posyandu dan orang tua dalam melakukan
              pencatatan, pemantauan pertumbuhan balita, serta deteksi dini
              risiko stunting secara digital dan sistematis."
            </p>
          </FadeSlide>
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
            <FadeSlide direction="right" delay={500}>
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-800 leading-snug">
                {activeData.title}
              </h2>
            </FadeSlide>

            {/* TAB MENU */}
            <FadeUp delay={600}>
              <div className="relative flex gap-6 mt-6 text-sm font-semibold text-gray-500">
                <button
                  onClick={() => changeTab("pengertian")}
                  className={`pb-1 ${
                    tab === "pengertian"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Pengertian
                </button>

                <button
                  onClick={() => changeTab("penyebab")}
                  className={`pb-1 ${
                    tab === "penyebab"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Penyebab
                </button>

                <button
                  onClick={() => changeTab("dampak")}
                  className={`pb-1 ${
                    tab === "dampak"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Dampak
                </button>

                <button
                  onClick={() => changeTab("pencegahan")}
                  className={`pb-1 ${
                    tab === "pencegahan"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Mencegah
                </button>

                <button
                  onClick={() => changeTab("ciri")}
                  className={`pb-1 ${
                    tab === "ciri"
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
            </FadeUp>
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
      <section className="relative w-full bg-emerald-50 py-10 overflow-hidden">
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
          <div className="text-center mb-16">
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
              <Typewriter speed={20}>
                Panduan Gizi dan Perawatan Anak
              </Typewriter>
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
              artikelRefs={artikelRefs}
              onSelect={(item, index) => {
                setSelectedArtikel({ ...item, index });

                setTimeout(() => {
                  detailRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }, 100);
              }}
            />
          </FadeUp>
        </div>
      </section>
      <div ref={detailRef} className="">
        <ArtikelDetail
          artikel={selectedArtikel}
          onClose={() => setSelectedArtikel(null)}
          artikelRefs={artikelRefs}
        />
      </div>
      <section className="relative w-full bg-emerald-50 py-10 overflow-hidden">
        {/* Particles Background */}
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

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          {/* Title */}

          <div className="text-center text-black mb-12">
            <h2 className="text-4xl font-extrabold">Video Edukasi Stunting</h2>
            <p className="text-gray-500 mt-2">
              Pelajari cara mencegah stunting melalui video edukasi kesehatan
              anak.
            </p>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* VIDEO UTAMA */}

            <div className="md:col-span-2">
              <iframe
                className="w-full h-[400px] rounded-lg"
                src={`https://www.youtube.com/embed/${activeVideo.videoId}`}
                title={activeVideo.title}
                allowFullScreen
              ></iframe>
            </div>

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
          <div className="text-center mt-10">
            <button className="bg-emerald-500 text-white px-6 py-3 rounded-full hover:bg-emerald-600 transition">
              Lihat Semua Video
            </button>
          </div>
        </div>
      </section>
    </MainLayouts>
  );
}
