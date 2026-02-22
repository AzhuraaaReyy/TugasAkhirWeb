import stunting1 from "../../../assets/images/unnamed.jpg";
import stunting2 from "../../../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import stunting3 from "../../../assets/images/image_2k_2560x1440_v3.png";
import { useState } from "react";
import Typewriter from "../../Animations/Typewriter";
import { useInView } from "../../../hooks/UseInView";
const Edukasi = () => {
  const [active, setActive] = useState(null);

  const [refHeader, headerVisible] = useInView(0.3);
  const [refSec1, sec1Visible] = useInView(0.3);
  const [refSec2, sec2Visible] = useInView(0.3);
  const [refSec3, sec3Visible] = useInView(0.3);
  const [refSec4, sec4Visible] = useInView(0.3);

  return (
    <>
      {/* SECTION STUNTING */}
      <section
        id="edukasi"
        className="relative py-28 bg-gray-50 overflow-hidden z-10"
      >
        {/* Background Decoration */}
        <div className="absolute -bottom-40 -left-40 w-[420px] h-[420px] bg-emerald-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -top-40 -right-40 w-[420px] h-[420px] bg-blue-200 rounded-full blur-3xl opacity-40 "></div>
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
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
            {headerVisible && (
              <Typewriter speed={20}>Edukasi Stunting Pada Anak</Typewriter>
            )}
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-gray-600 text-center">
            {headerVisible && (
              <Typewriter speed={10}>
                Sistem membantu kader posyandu dan orang tua dalam melakukan
                pencatatan, pemantauan  pertumbuhan balita, serta deteksi dini
                risiko stunting secara digital dan sistematis."
              </Typewriter>
            )}
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 space-y-28 relative z-10">
          {/* ================= SECTION 1 ================= */}

          <div
            ref={refSec1}
            className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${
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
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-0 top-20 w-[65%] h-[360px] rotate-[-6deg] z-10 "
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
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-1/2 -translate-x-1/2 w-[70%] h-[420px] bg-white z-20"
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
        ? "inset-0 z-40 scale-106 rotate-0"
        : "right-0 top-20 w-[55%] h-[360px] rotate-[6deg] z-10"
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
                    speed={20}
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
                    speed={10}
                    highlightWords={["Stunting"]}
                    delay={1600}
                  >
                    Stunting adalah kondisi gagal tumbuh pada anak akibat
                    kekurangan gizi kronis dalam waktu yang lama, terutama pada
                    1.000 hari pertama kehidupan (sejak masa kehamilan hingga
                    usia 2 tahun). Kondisi ini ditandai dengan tinggi badan anak
                    yang lebih rendah dibandingkan standar usianya  berdasarkan
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
            </div>
          </div>

          {/* ================= SECTION 2 ================= */}
          <div
            ref={refSec2}
            className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${
              sec2Visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            {/* TEXT */}
            <div className="order-2 md:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                {sec2Visible && (
                  <Typewriter
                    key="sec2"
                    speed={25}
                    highlightWords={["Stunting?"]}
                    highlightClass="text-emerald-600 font-bold"
                  >
                    Apa Dampak Stunting?
                  </Typewriter>
                )}
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                {sec2Visible && (
                  <Typewriter
                    key="sec2"
                    speed={10}
                    highlightWords={["Dampak"]}
                    highlightClass="text-emerald-600 font-bold"
                  >
                    Dampak stunting tidak hanya menyebabkan tinggi badan anak
                    lebih pendek dari standar usianya, tetapi juga berpengaruh
                    pada perkembangan otak, kemampuan belajar, dan konsentrasi
                    sehingga dapat menurunkan prestasi akademik di masa sekolah.
                    Anak yang mengalami stunting juga memiliki daya tahan tubuh
                    lebih lemah dan lebih rentan terhadap penyakit. Dalam jangka
                    panjang, kondisi ini dapat memengaruhi produktivitas saat
                    dewasa serta meningkatkan risiko penyakit tidak menular,
                    sehingga menjadi masalah kesehatan masyarakat yang serius
                    menurut World Health Organization.
                  </Typewriter>
                )}
              </p>
            </div>

            {/* IMAGE */}
            <div
              className="relative w-full h-[520px] flex items-center justify-center order-2 md:order-2"
              onMouseLeave={() => setActive(null)}
            >
              {/* FOTO KIRI */}
              <div
                onMouseEnter={() => setActive("kiri2")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kiri2"
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-0 top-20 w-[65%] h-[360px] rotate-[-6deg] z-10 "
    }`}
              >
                <img src={stunting1} className="w-full h-full object-cover" />
              </div>

              {/* FOTO TENGAH */}
              <div
                onMouseEnter={() => setActive("tengah2")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "tengah2"
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-1/2 -translate-x-1/2 w-[70%] h-[420px] bg-white z-20"
    }`}
              >
                <img src={stunting2} className="w-full h-full object-cover" />
              </div>

              {/* FOTO KANAN */}
              <div
                onMouseEnter={() => setActive("kanan2")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kanan2"
        ? "inset-0 z-40 scale-106 rotate-0"
        : "right-0 top-20 w-[55%] h-[360px] rotate-[6deg] z-10"
    }`}
              >
                <img src={stunting3} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div
            ref={refSec3}
            className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${
              sec3Visible
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
                onMouseEnter={() => setActive("kiri3")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kiri3"
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-0 top-20 w-[65%] h-[360px] rotate-[-6deg] z-10 "
    }`}
              >
                <img src={stunting1} className="w-full h-full object-cover" />
              </div>

              {/* FOTO TENGAH */}
              <div
                onMouseEnter={() => setActive("tengah3")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "tengah3"
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-1/2 -translate-x-1/2 w-[70%] h-[420px] bg-white z-20"
    }`}
              >
                <img src={stunting2} className="w-full h-full object-cover" />
              </div>

              {/* FOTO KANAN */}
              <div
                onMouseEnter={() => setActive("kanan3")}
                className={`absolute transition-all duration-700 ease-in-out rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.65)] cursor-pointer
    ${
      active === "kanan3"
        ? "inset-0 z-40 scale-106 rotate-0"
        : "right-0 top-20 w-[55%] h-[360px] rotate-[6deg] z-10"
    }`}
              >
                <img src={stunting3} className="w-full h-full object-cover" />
              </div>
            </div>

            {/* TEXT */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                {sec3Visible && (
                  <Typewriter
                    key="sec3"
                    speed={25}
                    highlightWords={["Stunting?"]}
                    highlightClass="text-emerald-600 font-bold"
                  >
                    Bagaimana Ciri-Ciri Stunting?
                  </Typewriter>
                )}
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed text-justify">
                {sec3Visible && (
                  <Typewriter
                    key="sec3"
                    speed={10}
                    highlightWords={["Stunting"]}
                    highlightClass="text-emerald-600 font-bold"
                  >
                    Stunting dapat dikenali ketika anak memiliki tinggi badan
                    yang lebih pendek dibandingkan standar tinggi sesuai usianya
                    berdasarkan kurva pertumbuhan, terutama jika kondisi
                    tersebut terjadi dalam jangka waktu lama akibat kekurangan
                    gizi kronis. Selain tubuh yang lebih pendek, anak dengan
                    stunting juga dapat mengalami keterlambatan perkembangan
                    motorik dan kognitif, seperti lambat berbicara, sulit
                    berkonsentrasi, daya tahan tubuh yang lemah sehingga mudah
                    sakit, serta berat badan yang tidak bertambah sesuai tahapan
                    pertumbuhan. Deteksi dini dapat dilakukan melalui pemantauan
                    rutin tinggi dan berat badan di posyandu atau fasilitas
                    kesehatan dengan membandingkannya pada grafik pertumbuhan
                    anak.
                  </Typewriter>
                )}
              </p>
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
            <div className="order-2 md:order-1">
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
                    speed={10}
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
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-0 top-20 w-[65%] h-[360px] rotate-[-6deg] z-10 "
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
        ? "inset-0 z-40 scale-106 rotate-0"
        : "left-1/2 -translate-x-1/2 w-[70%] h-[420px] bg-white z-20"
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
        ? "inset-0 z-40 scale-106 rotate-0"
        : "right-0 top-20 w-[55%] h-[360px] rotate-[6deg] z-10"
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
