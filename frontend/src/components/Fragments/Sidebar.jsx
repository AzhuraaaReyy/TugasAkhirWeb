import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { kaderMenu, orangTuaMenu } from "../Menu";

const Sidebar = ({ open }) => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const menu = user.role === "kader" ? kaderMenu : orangTuaMenu;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300
      ${open ? "w-64" : "w-20"}
      bg-gradient-to-b from-emerald-900 via-emerald-800 to-white-900
      text-white shadow-2xl flex flex-col`}
    >
      {/* ===== Logo Section ===== */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <h1
          className={`font-bold tracking-wide transition-all ${open ? "text-xl" : "text-lg"}`}
        >
          {open ? "StuntingCare" : "PC"}
        </h1>
      </div>

      {/* ===== Profile Section ===== */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 transition-all ${
          !open && "justify-center"
        }`}
      >
        <div className="relative">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-11 h-11 rounded-full ring-2 ring-indigo-400"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></span>
        </div>

        {open && (
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-sm">{user.name || "User"}</span>
            <span className="text-xs text-slate-400 capitalize">
              {user.role}
            </span>
          </div>
        )}
      </div>

      {/* ===== Menu Section ===== */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }
              ${!open && "justify-center"}`
            }
          >
            {/* Active left indicator */}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-lg transition-all"></span>

            <span className="text-lg">{item.icon}</span>

            {open && <span>{item.label}</span>}

            {/* Tooltip when collapsed */}
            {!open && (
              <span className="absolute left-16 scale-0 group-hover:scale-100 origin-left transition bg-black text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== Logout Section ===== */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
          text-red-400 hover:bg-red-500/20 transition-all duration-200
          ${!open && "justify-center"}`}
        >
          <span className="text-lg">⎋</span>
          {open && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
