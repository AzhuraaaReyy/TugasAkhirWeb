import { useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Fragments/Sidebar";
import Header from "../components/Fragments/Header";
import { useAuth } from "../context/AuthContext";
import { kaderMenu, orangTuaMenu } from "../components/Menu";
const MainLayouts = ({ children }) => {
  const [open, setOpen] = useState(true);
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
  const markAllAsRead = () => {
    setNotifList([]);
  };
  //tandai baca
  const markAsRead = (id) => {
    setNotifList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    );
  };
  const menu = user?.role === "kader" ? kaderMenu : orangTuaMenu;
  const currentMenu = menu.find((item) => item.link === location.pathname);
  const pageName = currentMenu?.label || "Dashboard";
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      <Sidebar open={open} />

      <div
        className={`flex flex-col transition-all duration-300 ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        <Header
          toggleSidebar={() => setOpen(!open)}
          pageName={pageName}
          open={open}
          showNotif={showNotif}
          setShowNotif={setShowNotif}
          notifList={notifList}
          markAsRead={markAsRead}
          setNotifList={setNotifList}
          markAllAsRead={markAllAsRead}
        />

        <main className="mt-10 h-[calc(100vh-4rem)] overflow-y-auto ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayouts;
