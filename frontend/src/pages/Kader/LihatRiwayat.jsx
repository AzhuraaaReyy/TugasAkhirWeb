import GrafikInsight from "@/components/Fragments/Riwayat/GrafikInsight";
import HeaderProfile from "@/components/Fragments/Riwayat/HeaderProfile";
import TimelineCard from "@/components/Fragments/Riwayat/TimelineCard";
import MainLayouts from "@/layouts/MainLayouts";
import { useParams, useLocation } from "react-router-dom";
import React from "react";
import { useEffect, useState } from "react";
import api from "@/services/api";
export default function Dashboard() {
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
  });
  const metode = location.state?.metode || "stunting";
  const hasil = location.state?.hasil || "";
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/detaildeteksi/${id}`);

        const data = res.data.data;

        console.log(data);
        const statusMapping = {
          stunting: hasil?.status_tbu?.status || data.status?.tbu,

          wasting: hasil?.status_bb_tb?.status || data.status?.bbtb,

          underweight: hasil?.status_bbu?.status || data.status?.bbu,
        };
        setForm((prev) => ({
          ...prev,
          umur: data.umur || "",
          tgl_deteksi: data.tgl_deteksi || "",
          status: statusMapping[metode] || "-",
        }));
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchData();
  }, [id, metode,hasil]);

  useEffect(() => {
    const fetchBalitas = async () => {
      try {
        const res = await api.get(`/balitas/${id}`);

        const data = res.data.data;

        setForm((prev) => ({
          ...prev,
          name: data.name || "",
          jk:
            data.jk === "L" || data.jk?.toLowerCase() === "laki-laki"
              ? "L"
              : data.jk === "P" || data.jk?.toLowerCase() === "perempuan"
                ? "P"
                : "",
          orang_tua: data.orangtua || "",
          tgl_lahir: data.tgl_lahir || "",
        }));
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchBalitas();
  }, [id]);

  return (
    <MainLayouts type="lihatriwayat">
      <div className="min-h-screen bg-[#F9FBFA] font-sans antialiased">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row gap-8">
          <HeaderProfile form={form} />
          <div className="flex-1 flex flex-col gap-6">
            <GrafikInsight />
            <TimelineCard />
          </div>
        </div>
      </div>
    </MainLayouts>
  );
}
