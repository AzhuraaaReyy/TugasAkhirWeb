import stunt from "../../../assets/images/stun.png";
import st from "../../../assets/images/img_banner_.png";

const Edukasi = () => {
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

        <div className="max-w-6xl mx-auto px-6 text-center relative z-10 mb-15">
          <h2 className="mt-4 text-3xl md:text-4xl font-extrabold text-gray-800">
            Edukasi Stunting Pada Anak
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
            </div>

            {/* TEXT */}
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Apa Itu <span className="text-emerald-600">Stunting?</span>
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed">
                <span className="text-emerald-600 font-bold">Stunting</span>{" "}
                adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi
                kronis dalam jangka waktu lama. Kondisi ini tidak hanya
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Apa Dampak <span className="text-emerald-600">Stunting?</span>
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed">
                <span className="text-emerald-600 font-bold">Stunting</span>{" "}
                dapat menyebabkan gangguan perkembangan kognitif, menurunkan
                daya tahan tubuh, serta meningkatkan risiko penyakit kronis di
                masa dewasa.
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Bagaimana Cara Mengenali Ciri-Ciri
                <span className="text-emerald-600"> Stunting?</span>
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
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug">
                Bagaimana Cara Mencegah{" "}
                <span className="text-emerald-600">Stunting?</span>
              </h2>

              <p className="mt-6 text-gray-600 leading-relaxed">
                <span className="text-emerald-600 font-bold">Stunting</span>{" "}
                dapat menyebabkan gangguan perkembangan kognitif, menurunkan
                daya tahan tubuh, serta meningkatkan risiko penyakit kronis di
                masa dewasa.
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
    </>
  );
};
export default Edukasi;
