import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Fragments/Sidebar";
import Header from "../components/Fragments/Header";
import { useAuth } from "../context/useAuth";
import { kaderMenu, orangTuaMenu } from "../components/Menu";

const MainLayouts = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [showNotif, setShowNotif] = useState(false);
  const [notifList, setNotifList] = useState([
    {
      id: 1,
      title: "Reminder Posyandu",
      desc: "Jadwal 15 Juli 2026 - Jangan lupa penimbangan anak",
      time: "Just now",
      isRead: false,
    },
    {
      id: 2,
      title: "Berat Badan Turun",
      desc: "Perlu perhatian, cek asupan gizi anak",
      time: "1 jam lalu",
      isRead: false,
    },
    {
      id: 3,
      title: "Data Berhasil Update",
      desc: "Tinggi badan anak berhasil diperbarui",
      time: "Kemarin",
      isRead: true,
    },
  ]);

  const markAllAsRead = () => setNotifList([]);
  const markAsRead = (id) =>
    setNotifList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );

  const menu = user?.role === "kader" ? kaderMenu : orangTuaMenu;
  const path = location.pathname;

  /* Halaman turunan -> menu induk dicari lewat kata kunci label sidebar.
   "catat" cocok dgn "Catat&Deteksi", "riwayat" cocok dgn "Riwayat Deteksi".
   Catatan path: lihatmonitoring != monitoring (TrenMonitoring di /monitoring). */
  const isKader = user?.role === "kader";

  const aturanTurunan = isKader
    ? [
        { cocok: (p) => p.includes("lihatmonitoring"), kunci: "catat" },
        { cocok: (p) => p.includes("detaildeteksi"), kunci: "catat" },
        { cocok: (p) => p.includes("manajemenbalita"), kunci: "catat" },
        { cocok: (p) => p.includes("penimbangan"), kunci: "catat" },
        { cocok: (p) => p.includes("lihatriwayat"), kunci: "riwayat" },
        { cocok: (p) => p.includes("/monitoring"), kunci: "riwayat" },
        {
          cocok: (p) => p.includes("/chatbot") && p.includes("snapshot"),
          kunci: "riwayat",
        },
        { cocok: (p) => p.includes("/chatbot"), kunci: "catat" },
      ]
    : [
        { cocok: (p) => p.includes("/monitoring"), kunci: "riwayat" },
        {
          cocok: (p) => p.includes("/chatbot") && p.includes("snapshot"),
          kunci: "riwayat",
        },
        { cocok: (p) => p.includes("/chatbot"), kunci: "dashboard" },
      ];

  // 1) cocok persis dengan link menu
  let currentMenu = menu.find((item) => item.link === path);
  // 2) halaman turunan -> cari menu induk lewat kata kunci label
  if (!currentMenu) {
    const aturan = aturanTurunan.find((r) => r.cocok(path));
    if (aturan) {
      currentMenu = menu.find((item) =>
        item.label?.toLowerCase().includes(aturan.kunci),
      );
    }
  }
  // 3) fallback: halaman detail di bawah sebuah menu (mis. /kader/laporan/5)
  if (!currentMenu) {
    currentMenu = menu.find(
      (item) =>
        item.link && item.link !== "/" && path.startsWith(item.link + "/"),
    );
  }

  const activeLink = currentMenu?.link ?? null;

  /* Judul header utk halaman turunan */
  const judulTurunan = [
    {
      cocok: (p) => p.includes("lihatmonitoring") || p.includes("/monitoring"),
      judul: "Tren Monitoring",
    },
    { cocok: (p) => p.includes("lihatriwayat"), judul: "Riwayat Balita" },
    { cocok: (p) => p.includes("detaildeteksi"), judul: "Detail Deteksi" },
    { cocok: (p) => p.includes("manajemenbalita"), judul: "Manajemen Balita" },
    { cocok: (p) => p.includes("penimbangan"), judul: "Manajemen Penimbangan" },
    { cocok: (p) => p.includes("/chatbot"), judul: "Asisten GrowthAI" },
  ];
  const judulKhusus = judulTurunan.find((r) => r.cocok(path))?.judul;
  const pageName = judulKhusus || currentMenu?.label || "Dashboard";

  const handleToggle = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setOpen((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  };

  const handleSidebarClick = (e) => {
    if (e.target.closest("a")) setMobileOpen(false);
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      <aside
        onClick={handleSidebarClick}
        className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300
          w-64 ${open ? "md:w-64" : "md:w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Sidebar open={open} activeLink={activeLink} />
      </aside>

      <div
        className={`flex flex-col transition-all duration-300 ${
          open ? "md:ml-64" : "md:ml-20"
        }`}
      >
        <Header
          toggleSidebar={handleToggle}
          pageName={pageName}
          open={open}
          showNotif={showNotif}
          setShowNotif={setShowNotif}
          notifList={notifList}
          markAsRead={markAsRead}
          setNotifList={setNotifList}
          markAllAsRead={markAllAsRead}
        />

        <main className="mt-10 h-[calc(100vh-4rem)] overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayouts;
