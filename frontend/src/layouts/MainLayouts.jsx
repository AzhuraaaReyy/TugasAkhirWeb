import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Fragments/Sidebar";
import Header from "../components/Fragments/Header";
import { useAuth } from "../context/useAuth";
import { kaderMenu, orangTuaMenu } from "../components/Menu";

const MainLayouts = ({ children }) => {
  const [open, setOpen] = useState(true); // collapse/expand di DESKTOP
  const [mobileOpen, setMobileOpen] = useState(false); // drawer di MOBILE
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
  const currentMenu = menu.find((item) => item.link === location.pathname);
  const pageName = currentMenu?.label || "Dashboard";

  // Tombol hamburger: di desktop -> collapse/expand, di mobile -> buka/tutup drawer
  const handleToggle = () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      setOpen((v) => !v);
    } else {
      setMobileOpen((v) => !v);
    }
  };

  // Tutup drawer saat sebuah menu (link) ditekan di dalam sidebar
  const handleSidebarClick = (e) => {
    if (e.target.closest("a")) setMobileOpen(false);
  };

  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {/* BACKDROP (mobile saja) */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
        />
      )}

      {/* SIDEBAR: <aside> yang mengatur posisi DAN lebar */}
      <aside
        onClick={handleSidebarClick}
        className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300
          w-64 ${open ? "md:w-64" : "md:w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <Sidebar open={open} />
      </aside>

      {/* KONTEN: margin kiri HANYA di desktop, mengikuti lebar sidebar */}
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
