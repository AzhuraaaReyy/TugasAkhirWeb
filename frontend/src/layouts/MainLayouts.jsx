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
        />

        <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto px-6 py-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayouts;
