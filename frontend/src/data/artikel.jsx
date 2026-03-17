import makananbergizi from "../assets/images/makananbergizi.png";
import menumapsi from "../assets/images/menumapsi.png";
import nafsumakan from "../assets/images/nafsumakan.png";
import polasuh from "../assets/images/polaasuh.jpg";
import imunisasi from "../assets/images/‫imunisasi.webp";
import TipsMakanan from "@/components/Fragments/Gizi/TipsMakanan";
import Menu from "@/components/Fragments/Gizi/Menu";
import NafsuMakan from "@/components/Fragments/Gizi/NafsuMakan";
import PolaAsuh from "@/components/Fragments/Gizi/PolaAsuh";
import Imunisasi from "@/components/Fragments/Gizi/Imunisasi";
export const artikel = [
  {
    title: "Tips Makanan Bergizi",
    image: makananbergizi,
    desc: "Makanan bergizi merupakan salah satu faktor utama dalam mendukung pertumbuhan dan perkembangan balita.",
    component: TipsMakanan,
  },
  {
    title: "Menu MPASI",
    image: menumapsi,
    desc: "MPASI atau Makanan Pendamping ASI merupakan makanan tambahan yang diberikan kepada bayi setelah berusia enam bulan.",
    component: Menu,
  },
  {
    title: "Nafsu Makan Anak",
    image: nafsumakan,
    desc: "Untuk meningkatkan nafsu makan anak, orang tua dapat mencoba beberapa cara seperti memberikan variasi menu makanan, menyajikan makanan dengan tampilan yang menarik, serta menciptakan suasana makan yang nyaman.",
    component: NafsuMakan,
  },
  {
    title: "Pola Asuh Anak",
    image: polasuh,
    desc: "Pola asuh yang baik memiliki peran penting dalam mendukung perkembangan fisik maupun mental anak. Orang tua perlu memberikan perhatian, kasih sayang, serta stimulasi yang cukup agar anak dapat tumbuh dan berkembang dengan optimal.",
    component: PolaAsuh,
  },
  {
    title: "Pentingnya Imunisasi",
    image: imunisasi,
    desc: "Imunisasi merupakan salah satu upaya penting dalam melindungi anak dari berbagai penyakit berbahaya. Melalui imunisasi, tubuh anak akan membentuk kekebalan terhadap penyakit tertentu sehingga risiko terkena penyakit dapat berkurang.",
    component: Imunisasi,
  },
];
export default artikel;
