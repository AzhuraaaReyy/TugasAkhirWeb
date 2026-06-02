import HeaderProfile from "@/components/Fragments/Riwayat/HeaderProfile";
import TimelineCard from "@/components/Fragments/Riwayat/TimelineCard";
import MainLayouts from "@/layouts/MainLayouts";
import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import EvaluasiKenaikanBulanan from "@/components/Fragments/Riwayat/EvaluasiBulananCard";

export default function LihatRiwayat() {
  const { id } = useParams();
  const location = useLocation();
  const [form, setForm] = useState({
    name: "",
    umur: "",
    jk: "",
    tgl_deteksi: "",
    tinggi: "",
    berat: "",
    zscore_tbu: "",
    zscore_bbu: "",
    zscore_bbtb: "",
    status_tbu: "",
    status_bbu: "",
    status_bbtb: "",
    keterangan: "",
    rekomendasi: "",
    total_deteksi: "",
    berat_sekarang: "",
    berat_sebelumnya: "",
    tinggi_sekarang: "",
    tinggi_sebelumnya: "",
    orang_tua: "",
    status: "",
    riwayat: [],
    lokasi_posyandu: "",
    kader_pemeriksa: "",
    balita_id: "",
  });

  const metode = location.state?.metode || "stunting";
  const hasil = location.state?.hasil || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Timeline dulu (berbasis balita_id) -> sumber deteksi_id yang benar
        const resRiwayat = await api.get(`/ambilstatustimeline/${id}`);
        const dataRiwayat = resRiwayat.data?.data || [];

        const terbaru = dataRiwayat[dataRiwayat.length - 1] || {};
        const sebelumnya = dataRiwayat[dataRiwayat.length - 2] || {};

        // 2) Detail dipanggil dgn DETEKSI_ID terbaru (bukan balita_id)
        let data = {};
        if (terbaru.id) {
          const res = await api.get(`/detaildeteksi/${terbaru.id}`);
          data = res.data?.data || {};
        }

        // status: prioritaskan hasil deteksi baru, lalu data terbaru di timeline
        const statusMapping = {
          stunting: hasil?.status_tbu?.status || data.status?.tbu,
          wasting: hasil?.status_bb_tb?.status || data.status?.bbtb,
          underweight: hasil?.status_bbu?.status || data.status?.bbu,
        };
        const statusByMetode = {
          stunting: terbaru.status_tbu,
          wasting: terbaru.status_bbtb,
          underweight: terbaru.status_bbu,
        };

        setForm((prev) => ({
          ...prev,
          // angka inti diambil dari timeline (sudah dihitung & konsisten)
          umur: terbaru.umur ?? data.umur ?? "",
          tgl_deteksi: terbaru.tgl_deteksi ?? data.tgl_deteksi ?? "",
          status: statusMapping[metode] || statusByMetode[metode] || "-",

          berat_sekarang: terbaru.berat ?? data.berat ?? "",
          berat_sebelumnya: sebelumnya.berat ?? data.berat_sebelumnya ?? "",
          tinggi_sekarang: terbaru.tinggi ?? data.tinggi ?? "",
          tinggi_sebelumnya: sebelumnya.tinggi ?? data.tinggi_sebelumnya ?? "",

          // info tambahan dari detail (yang tidak ada di timeline)
          keterangan: data.keterangan ?? "",
          rekomendasi: data.rekomendasi ?? "",
          lokasi_posyandu:
            data.lokasi_posyandu || data.posyandu || "Posyandu Wilayah",
          kader_pemeriksa: data.kader_pemeriksa || "Kader Posyandu",

          riwayat: dataRiwayat,
        }));
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchData();
  }, [id, metode, hasil]);

  useEffect(() => {
    const fetchBalitas = async () => {
      try {
        const res = await api.get(`/balitas/${id}`);
        const data = res.data.data;

        setForm((prev) => ({
          ...prev,
          balita_id: data.id,
          name: data.name || "",
          jk:
            data.jk === "L" || data.jk?.toLowerCase() === "laki-laki"
              ? "L"
              : data.jk === "P" || data.jk?.toLowerCase() === "perempuan"
                ? "P"
                : "",
          orang_tua: data.orangtua || "",
          tgl_lahir: data.tgl_lahir || "",
          lokasi_posyandu:
            data.lokasi_posyandu || data.posyandu || "Posyandu Wilayah",
          kader_pemeriksa: data.kader_pemeriksa || "Kader Posyandu",
        }));
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchBalitas();
  }, [id]);
  console.log("ITEM RIWAYAT:", form.riwayat[0]);

  return (
    <MainLayouts type="lihatriwayat">
      <div className="min-h-screen bg-[#F4F7F4] font-sans antialiased py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-8 pb-2 border-b border-gray-200/60">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight sm:text-4xl">
              Lihat Riwayat Balita
            </h1>
            <p className=" w-full  text-sm text-gray-500 mt-2  leading-relaxed">
              Halaman ini menampilkan riwayat pemeriksaan dan hasil deteksi
              risiko stunting berdasarkan data pertumbuhan balita dari waktu ke
              waktu.
            </p>
          </div>

          {/* Grid Konten Utama */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
              <HeaderProfile form={form} />
              <EvaluasiKenaikanBulanan form={form} />
            </div>
            <div className="flex-1 w-full h-full">
              <TimelineCard form={form} metode={metode} />
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
