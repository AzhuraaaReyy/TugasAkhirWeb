import React from "react";
import { Plus, User } from "lucide-react";
import gambar1 from "../../../assets/images/lanang.png";
import gambar2 from "../../../assets/images/wedok.png";

export default function Profile({ data }) {
  if (!data || !data.name)
    return (
      <div className="animate-pulse bg-gray-200 h-96 rounded-3xl w-full" />
    );

  const isLaki = data.jk === "L";
  const profileImage = isLaki ? gambar1 : gambar2;

  return (
    <div className="w-full h-full ">
      <div className="bg-white rounded-[24px] border border-white border-2 p-6 shadow-sm flex flex-col items-center hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7 pb-20 ">
        <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-emerald-200 bg-gray-100 mb-4 mt-5">
          <img
            src={profileImage}
            alt={data.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center break-words mb-5">
          {data.name}
        </h2>

        <div className="w-full mt-4 space-y-4 text-sm mt-5">
          <div className="flex justify-between gap-2 border-b border-gray-50 pb-2 ">
            <span className="text-gray-400 shrink-0 font-bold">
              Orang Tua :
            </span>
            <span className="font-bold text-gray-700 text-right break-words">
              {data.orang_tua || "-"}
            </span>
          </div>
          <div className="flex justify-between gap-2 border-b border-gray-50 pb-2 ">
            <span className="text-gray-400 shrink-0 font-bold">Usia :</span>
            <span className="font-bold text-gray-700 text-right">
              {data.umur || "-"} Bulan
            </span>
          </div>
          <div className="flex justify-between gap-2 pb-1 bg-white">
            <span className="text-gray-400 shrink-0 font-bold">
              Jenis Kelamin :
            </span>
            <span className="font-bold text-gray-700 flex items-center gap-2 ">
              {isLaki ? "Laki-laki" : "Perempuan"}
              <User
                className={isLaki ? "text-blue-500" : "text-pink-500"}
                size={16}
              />
            </span>
          </div>
          <div className="flex justify-between gap-2 border-b border-gray-50 pb-2 ">
            <span className="text-gray-400 shrink-0 font-bold">
              Tanggal Lahir :
            </span>
            <span className="font-bold text-gray-700 text-right">
              {data.tgl_lahir
                ? new Date(data.tgl_lahir).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
          <div className="flex items-start justify-between">
            {/* BAGIAN KIRI: Label */}
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-400  tracking-wide">
                Terakhir
              </span>
              <span className="text-xs font-bold text-gray-400  tracking-wide">
                Ditimbang
              </span>
            </div>

            {/* BAGIAN TENGAH: Titik Dua */}
            <div className="flex flex-col justify-center items-center h-full pt-1">
              <span className="text-xs font-extrabold text-gray-400">:</span>
            </div>

            {/* BAGIAN KANAN: Tanggal */}
            <span className="font-bold text-gray-700 text-right self-center">
              {data.tanggal
                ? new Date(data.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
