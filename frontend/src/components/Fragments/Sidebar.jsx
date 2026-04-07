import { Navigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { kaderMenu, orangTuaMenu, adminMenu } from "../Menu";
import { useNavigate } from "react-router-dom";
const Sidebar = ({ open }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  if (loading)
    return (
      <div
        className={`fixed left-0 top-0 h-screen w-${open ? "64" : "20"} bg-gray-800 animate-pulse`}
      />
    );

  if (!user) return null;

  const menu =
    user.role === "admin"
      ? adminMenu
      : user.role === "kader"
        ? kaderMenu
        : orangTuaMenu;
  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300
      ${open ? "w-64" : "w-20"}
      bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
      text-white shadow-2xl flex flex-col`}
    >
      {/* ===== Logo ===== */}
      <div className="h-16 flex items-center justify-center border-b border-white/10">
        <h1 className="font-bold tracking-wide text-xl text-indigo-400">
          {open ? "StuntingCare" : "SC"}
        </h1>
      </div>

      {/* ===== Profile ===== */}
      <div
        className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 transition-all ${
          !open && "justify-center"
        }`}
      >
        <div className="relative">
          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="w-11 h-11 object-cover rounded-full ring-2 ring-indigo-500"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full"></span>
        </div>

        {open && (
          <div className="flex flex-col leading-tight">
            <span className="font-semibold text-lg">
              {user.name || "User"}
            </span>
            <span className="text-sm text-slate-400 capitalize">
              {user.role} Posyandu
            </span>
          </div>
        )}
      </div>

      {/* ===== Menu ===== */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.id}
            to={item.link}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              
              ${
                isActive
                  ? "bg-indigo-500/20 text-indigo-400 shadow-inner zoom-in"
                  : "text-slate-400 hover:bg-white/5 hover:text-white zoom-in"
              }

              ${!open && "justify-center"}`
            }
          >
            {/* Active Indicator */}
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-lg transition-all
              ${
                window.location.pathname === item.link
                  ? "bg-indigo-500"
                  : "bg-transparent"
              }`}
            />

            {/* Icon */}
            <span className="text-lg transition group-hover:scale-110">
              {item.icon}
            </span>

            {/* Label */}
            {open && <span>{item.label}</span>}

            {/* Tooltip */}
            {!open && (
              <span className="absolute left-16 scale-0 group-hover:scale-100 origin-left transition bg-slate-800 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
                {item.label}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== Logout ===== */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
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
