import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Icon } from "../../assets/icons";
import { kaderMenu, orangTuaMenu } from "../Menu";
const Sidebar = ({ open }) => {
  // ✅ terima open
  const { user, logout } = useAuth();

  if (!user) return null;

  const menu = user.role === "kader" ? kaderMenu : orangTuaMenu;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen  bg-white shadow-lg flex flex-col transition-all duration-300 z-40 ${
        open ? "w-64" : "w-20"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b font-bold text-lg">
        {open ? "Posyandu" : "P"}
      </div>

      {/* Profile */}
      <div
        className={`flex items-center  gap-3 px-4 py-4 border-b ${
          !open && "justify-center"
        }`}
      >
        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          className="w-10 h-10 rounded-full "
        />

        {open && (
          <span className="font-medium text-xl ">{user.name || "User"}</span>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {menu.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200
              ${
                isActive
                  ? "bg-black text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }
              ${!open && "justify-center"}`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {open && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 transition ${
            !open && "justify-center"
          }`}
        >
          {open ? "Logout" : "⎋"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
