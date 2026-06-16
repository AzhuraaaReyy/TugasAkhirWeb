import HeaderProfile from "@/components/Fragments/Riwayat/HeaderProfile";
import TimelineCard from "@/components/Fragments/Riwayat/TimelineCard";
import MainLayouts from "@/layouts/MainLayouts";
import { useParams, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import EvaluasiKenaikanBulanan from "@/components/Fragments/Riwayat/EvaluasiBulananCard";
import { Atom } from "react-loading-indicators";

export default function LihatRiwayat() {
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
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
    let aktif = true;

    const fetchSemua = async () => {
      setLoading(true);
      try {
        // Ambil timeline + data balita secara paralel
        const [resRiwayat, resBalita] = await Promise.all([
          api.get(`/ambilstatustimeline/${id}`),
          api.get(`/balitas/${id}`),
        ]);

        const dataRiwayat = resRiwayat.data?.data || [];
        const terbaru = dataRiwayat[dataRiwayat.length - 1] || {};
        const sebelumnya = dataRiwayat[dataRiwayat.length - 2] || {};
        const balita = resBalita.data?.data || {};

        // Detail dipanggil dgn DETEKSI_ID terbaru (bukan balita_id)
        let detail = {};
        if (terbaru.id) {
          const resDetail = await api.get(`/detaildeteksi/${terbaru.id}`);
          detail = resDetail.data?.data || {};
        }

        // status: prioritaskan hasil deteksi baru, lalu data terbaru di timeline
        const statusMapping = {
          stunting: hasil?.status_tbu?.status || detail.status?.tbu,
          wasting: hasil?.status_bb_tb?.status || detail.status?.bbtb,
          underweight: hasil?.status_bbu?.status || detail.status?.bbu,
        };
        const statusByMetode = {
          stunting: terbaru.status_tbu,
          wasting: terbaru.status_bbtb,
          underweight: terbaru.status_bbu,
        };

        if (!aktif) return;

        setForm((prev) => ({
          ...prev,

          // ----- dari /balitas/:id -----
          balita_id: balita.id ?? prev.balita_id ?? "",
          name: balita.name || "",
          jk:
            balita.jk === "L" || balita.jk?.toLowerCase() === "laki-laki"
              ? "L"
              : balita.jk === "P" || balita.jk?.toLowerCase() === "perempuan"
                ? "P"
                : "",
          orang_tua: balita.orangtua || "",
          tgl_lahir: balita.tgl_lahir || "",

          // ----- angka inti dari timeline (sudah dihitung & konsisten) -----
          umur: terbaru.umur ?? detail.umur ?? "",
          tgl_deteksi: terbaru.tgl_deteksi ?? detail.tgl_deteksi ?? "",
          status: statusMapping[metode] || statusByMetode[metode] || "-",

          berat_sekarang: terbaru.berat ?? detail.berat ?? "",
          berat_sebelumnya: sebelumnya.berat ?? detail.berat_sebelumnya ?? "",
          tinggi_sekarang: terbaru.tinggi ?? detail.tinggi ?? "",
          tinggi_sebelumnya:
            sebelumnya.tinggi ?? detail.tinggi_sebelumnya ?? "",

          // ----- info tambahan dari detail -----
          keterangan: detail.keterangan ?? "",
          rekomendasi: detail.rekomendasi ?? "",
          lokasi_posyandu:
            detail.lokasi_posyandu ||
            detail.posyandu ||
            balita.lokasi_posyandu ||
            balita.posyandu ||
            "Posyandu Wilayah",
          kader_pemeriksa:
            detail.kader_pemeriksa ||
            balita.kader_pemeriksa ||
            "Kader Posyandu",

          riwayat: dataRiwayat,
        }));
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        if (aktif) setLoading(false);
      }
    };

    fetchSemua();
    return () => {
      aktif = false;
    };
  }, [id, metode, hasil]);

  return (
    <MainLayouts type="lihatriwayat">
      <div className="relative min-h-screen bg-[#F4F7F4] font-sans antialiased py-6 sm:py-10">
        {loading && (
          <div className="fixed inset-0 bg-white/70 backdrop-blur-sm z-50 flex items-center justify-center">
            <Atom color="#10b981" size="medium" text="Memuat..." />
          </div>
        )}
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="mb-6 sm:mb-8 pb-2 border-b border-gray-200/60">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
              Lihat Riwayat Balita
            </h1>
            <p className="w-full text-sm text-gray-500 mt-2 leading-relaxed">
              Halaman ini menampilkan riwayat pemeriksaan dan hasil deteksi
              risiko stunting berdasarkan data pertumbuhan balita dari waktu ke
              waktu.
            </p>
          </div>

          {/* Grid Konten Utama */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="w-full md:w-80 shrink-0 flex flex-col gap-6">
              <HeaderProfile form={form} />
              <EvaluasiKenaikanBulanan form={form} />
            </div>
            <div className="flex-1 w-full min-w-0">
              <TimelineCard form={form} metode={metode} />
            </div>
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
