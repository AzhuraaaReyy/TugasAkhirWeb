import { Bell, Settings, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = ({ toggleSidebar, pageName, open }) => {
  const { user } = useAuth();
  return (
    <div
      className={`fixed top-0 right-0 h-16 bg-white shadow-sm flex justify-between items-center px-6 z-30 transition-all duration-300 ${
        open ? "left-64" : "left-20"
      }`}
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <Menu
          onClick={toggleSidebar}
          className="cursor-pointer text-gray-600"
        />

        <div>
          <p className="text-sm text-gray-400">
            Selamat Datang, {user?.name || "User"}
          </p>
          <h1 className="text-2xl font-bold capitalize">{pageName}</h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search here"
          className="border rounded-lg px-4 py-2 text-sm"
        />

        <Bell className="cursor-pointer text-gray-600" />
        <Settings className="cursor-pointer text-gray-600" />
      </div>
    </div>
  );
};

export default Header;
