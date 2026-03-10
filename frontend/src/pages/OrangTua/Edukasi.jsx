import MainLayouts from "../../layouts/MainLayouts";
import { useState } from "react";
import FadeSlide from "../../components/Animations/FadeSlide";
import Typewriter from "../../components/Animations/Typewriter";

import stunting1 from "../../assets/images/unnamed.jpg";
import stunting2 from "../../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import stunting3 from "../../assets/images/image_2k_2560x1440_v3.png";
import FadeUp from "../../components/Animations/FadeUp";
import stunting4 from "../../assets/images/image_2k_2560x1440.png";
const VideoItem = ({ title, thumbnail }) => {
  return (
    <div className="flex gap-4 items-center bg-emerald-500 p-3 rounded-lg hover:bg-emerald-600 transition cursor-pointer zoom-in">
      <img src={thumbnail} className="w-24 h-16 object-cover rounded" />

      <p className="text-white text-sm font-medium">{title}</p>
    </div>
  );
};

export default function EdukasiStunting() {
  const [tab, setTab] = useState("pengertian");
  const [tab2, setTab2] = useState("pengertian");
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
  const activeData2 = data[tab2];
  const [fade, setFade] = useState(true);
  const [fade2, setFade2] = useState(true);
  const images = activeData.image;
  const images2 = activeData2.image;
  const changeTab = (value) => {
    setFade(false);

    setTimeout(() => {
      setTab(value);
      setFade(true);
    }, 200);
  };

  const changeTab2 = (value) => {
    setFade2(false);

    setTimeout(() => {
      setTab2(value);
      setFade2(true);
    }, 200);
  };

  return (
    <MainLayouts type="edukasiortu">
      <section
        id="edukasi"
        className="relative py-10 bg-emerald-50 overflow-hidden z-10 "
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
          className={`max-w-6xl mx-auto px-6 relative z-10 mb-5 transition-all duration-700  `}
        >
          <div className="text-center">
            <FadeSlide direction="left" delay={200}>
              <span className="px-4 py-2 bg-emerald-100 text-emerald-600 rounded-full text-sm font-semibold text-center">
                Edukasi Stunting
              </span>
            </FadeSlide>
          </div>
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

        <div className="max-w-6xl mx-auto px-6 py-30 grid md:grid-cols-2 gap-14 items-center">
          {/* IMAGE */}
          <FadeUp delay={400}>
            <div className="relative flex items-center justify-center">
              {/* IMAGE */}
              <img
                src={images[0]}
                className={` left-40 relative z-20 rounded-full shadow-xl object-cover w-[400px] h-[400px] transition-opacity duration-500 border-[6px] border-black ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              />
           
              <img
                src={images[1]}
                className={` top-40 left-10 relative z-10 rounded-full shadow-xl object-cover w-[230px] h-[230px] transition-opacity duration-500 border-[3px] border-black ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              />
              <img
                src={images[2]}
                className={`bottom-15 right-48 relative z-0 rounded-full shadow-xl object-cover w-[300px] h-[300px] transition-opacity duration-500 ${
                  fade ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          </FadeUp>

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
  [background-size:20px_20px] opacity-30"
                ></div>

                <div
                  className="absolute -top-30 -right-2 w-[120px] h-[120px] 
  bg-[radial-gradient(#6b7280_7px,transparent_5px)] 
  [background-size:30px_30px] opacity-15"
                ></div>
                <div
                  className="absolute top-53 -right-2 w-[120px] h-[120px] 
  bg-[radial-gradient(#6b7280_7px,transparent_5px)] 
  [background-size:30px_30px] opacity-15"
                ></div>
              </div>
              {/* DESCRIPTION */}
              <FadeSlide direction="right" delay={700}>
                <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                  {activeData.text}
                </p>
              </FadeSlide>
            </FadeUp>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-14 items-center">
          {/* TEXT */}

          <div className="mb-10 min-h-[360px]">
            {/* TITLE */}
            <FadeSlide direction="left">
              <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-gray-800 leading-snug">
                {activeData2.title}
              </h2>

              {/* TAB MENU */}
              <div className="flex gap-6 mt-6 text-sm font-semibold text-gray-500">
                <button
                  onClick={() => changeTab2("pengertian")}
                  className={`pb-1 ${
                    tab2 === "pengertian"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Pengertian
                </button>
                <button
                  onClick={() => changeTab2("penyebab")}
                  className={`pb-1 ${
                    tab2 === "penyebab"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Penyebab
                </button>
                <button
                  onClick={() => changeTab2("dampak")}
                  className={`pb-1 ${
                    tab2 === "dampak"
                      ? "text-emerald-500 border-b-2 border-emerald-500"
                      : "text-gray-500"
                  }`}
                >
                  Dampak
                </button>
              </div>
              <FadeUp>
                <div className=" -bottom-60 left-67 absolute w-[300px] h-[200px]  bg-[radial-gradient(#6b7280_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
                <div className=" -bottom-80 right-103   absolute w-[120px] h-[120px]   bg-[radial-gradient(#6b7280_7px,transparent_5px)] [background-size:30px_30px] opacity-10"></div>
                <div className=" -bottom-1 right-0   absolute w-[120px] h-[120px]   bg-[radial-gradient(#6b7280_7px,transparent_5px)] [background-size:30px_30px] opacity-10"></div>
              </FadeUp>
              {/* DESCRIPTION */}
            </FadeSlide>
            <FadeSlide direction="right">
              <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                {activeData2.text}
              </p>
            </FadeSlide>
          </div>

          <div className="  h-[350px]">
            <FadeSlide direction="left">
              <div className="relative flex items-center justify-center">
                {/* DOT PATTERN (belakang) */}

                {/* BORDER */}
                <div className="absolute top-3 left-8 w-[420px] h-[420px] rounded-full border-2 border-blue-200 z-30"></div>

                {/* IMAGE */}
                <div className="relative w-[420px] h-[420px]">
                  <img
                    src={images2[0]}
                    className={`absolute inset-0 z-20 rounded-full shadow-xl object-cover w-full h-full transition-opacity duration-500 ${
                      fade2 ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  {/* gradient overlay */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-black/60 to-transparent z-30 pointer-events-none"></div>
                </div>
              </div>
            </FadeSlide>
          </div>
        </div>
      </section>
      <section className="bg-emerald-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
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
                src="https://www.youtube.com/embed/VIDEO_ID"
                title="Video Edukasi Stunting"
                allowFullScreen
              ></iframe>
            </div>

            {/* LIST VIDEO */}
            <div className="space-y-4">
              <VideoItem
                title="Apa itu Stunting?"
                thumbnail="https://img.youtube.com/vi/VIDEO_ID/0.jpg"
              />

              <VideoItem
                title="Cara Mencegah Stunting"
                thumbnail="https://img.youtube.com/vi/VIDEO_ID/0.jpg"
              />

              <VideoItem
                title="Pentingnya Gizi Seimbang"
                thumbnail="https://img.youtube.com/vi/VIDEO_ID/0.jpg"
              />

              <VideoItem
                title="Peran Posyandu dalam Pencegahan Stunting"
                thumbnail="https://img.youtube.com/vi/VIDEO_ID/0.jpg"
              />
            </div>
          </div>

          {/* Button */}
          <div className="text-center mt-10">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition">
              Lihat Semua Video
            </button>
          </div>
        </div>
      </section>
    </MainLayouts>
  );
}
