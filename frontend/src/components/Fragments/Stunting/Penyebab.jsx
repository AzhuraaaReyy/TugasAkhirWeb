import { ScrollTimeline } from "../../Animations/ScroolTimeline";
import stunting from "../../../assets/images/ae9726d1-a139-4f6b-99f8-8230a88c7e65.png";
const PenyebabDetail = ({ detailRef, handleClose }) => {
  const penyebabStunting = [
    {
      year: "Gizi Buruk",
      title: "Kekurangan Nutrisi",
      description:
        "Anak tidak mendapatkan asupan gizi yang cukup dalam jangka waktu lama, terutama protein, zat besi, dan vitamin penting.",
    },
    {
      year: "Infeksi Berulang",
      title: "Penyakit Berulang",
      description:
        "Infeksi seperti diare, ISPA, atau cacingan dapat mengganggu penyerapan nutrisi sehingga pertumbuhan anak terhambat.",
    },
    {
      year: "Pola Asuh",
      title: "Pola Asuh Tidak Tepat",
      description:
        "Kurangnya pengetahuan orang tua tentang pemberian ASI, MPASI, dan pola makan sehat bagi anak.",
    },
    {
      year: "Sanitasi Buruk",
      title: "Lingkungan Tidak Sehat",
      description:
        "Air bersih dan sanitasi yang buruk meningkatkan risiko penyakit pada anak.",
    },
    {
      year: "Ekonomi Keluarga",
      title: "Kemiskinan",
      description:
        "Keterbatasan ekonomi menyebabkan keluarga sulit menyediakan makanan bergizi.",
    },
  ];
  return (
    <section ref={detailRef} className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Penyebab Stunting
        </h2>
        <div className="relative flex items-center justify-center">
          <img
            src={stunting}
            className=" border-emerald-200 border-2 rounded-xl w-screen h-[450px] shadow-xl mb-6 object-cover transition-opacity duration-500  transition-all duration-700 transition-transform duration-700 ease-out hover:scale-105 "
          />
        </div>
        <p className="text-gray-600 leading-relaxed mb-6 text-justify">
          Menurut World Health Organization (WHO), Penyebab stunting antara lain
          yaitu asupan gizi dan status kesehatan yang meliputi ketahanan pangan
          (ketersediaan, keterjangkauan dan akses pangan bergizi), lingkungan
          sosial (norma, makanan bayi dan anak, hygiene, pendidikan, dan tempat
          kerja), lingkungan kesehatan (akses, pelayanan preventif dan kuratif),
          dan lingkungan pemukiman (air, sanitasi, kondisi bangunan).
        </p>
        <div className="mt-5">
          <ScrollTimeline
            events={penyebabStunting}
            title="Penyebab Stunting"
            subtitle="Faktor yang dapat menyebabkan stunting pada anak"
            progressIndicator={true}
            cardAlignment="alternating"
            revealAnimation="fade"
          />
        </div>
        <button
          onClick={handleClose}
          className="mt-8 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Tutup
        </button>
      </div>
    </section>
  );
};
export default PenyebabDetail;
