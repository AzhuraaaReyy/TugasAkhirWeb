import React from "react";
import image from "../../../assets/images/anakstunting.png";
import image2 from "../../../assets/images/anakwasting.png";
import image3 from "../../../assets/images/anakunderweight.png";
export default function CardEdukasiStatusGizi() {
  const edukasiData = [
    {
      title: "Stunting (TB/U)",
      desc: "Stunting adalah kondisi gagal tumbuh pada anak balita akibat kekurangan gizi kronis dalam jangka panjang, sehingga anak terlalu pendek untuk usianya.",
      image: image,
      color: "bg-amber-50 border-amber-200",
    },
    {
      title: "Wasting (BB/TB)",
      desc: "Wasting adalah kondisi berat badan anak lebih rendah dibandingkan tinggi badannya akibat kekurangan gizi akut atau penyakit infeksi.",
      image: image2,
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Underweight (BB/U)",
      desc: "Underweight adalah kondisi berat badan anak lebih rendah dibandingkan standar usianya akibat kekurangan gizi kronis atau akut.",
      image: image3,
      color: "bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm w-full pb-10">
      <h3 className="text-lg font-extrabold text-gray-800 mb-3  tracking-wider">
        Tentang Pertumbuhan dan Gizi Anak
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5 text-justify">
        Memahami kondisi pertumbuhan anak sejak dini dapat membantu orang tua
        mengambil langkah yang tepat. Yuk kenali beberapa istilah penting
        seperti stunting, wasting, dan underweight agar tumbuh kembang si kecil
        dapat dipantau dengan lebih baik.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {edukasiData.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${item.color} flex items-start gap-3 transition-all hover:shadow-sm shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7`}
          >
            <div
              className={`w-30 h-30 border ${item.color} rounded-xl   flex items-center justify-center shrink-0 overflow-hidden shadow-sm`}
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-1">
              <h4 className="text-[14px] font-bold text-gray-800 tracking-wide">
                {item.title}
              </h4>
              <p className="text-[12px] text-gray-400 font-medium leading-relaxed text-justify">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
