import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";
import { kaderMenu, orangTuaMenu } from "../Menu";

const Sidebar = ({ open }) => {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div
        className={`fixed left-0 top-0 h-screen ${
          open ? "w-64" : "w-20"
        } bg-gray-200 animate-pulse`}
      />
    );
  }

  if (!user) return null;

  const menu = user.role === "kader" ? kaderMenu : orangTuaMenu;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen z-40 transition-all duration-300
      ${open ? "w-64" : "w-20"}
      bg-gray-50 shadow-2xl flex flex-col`}
    >
      {/* ===== Logo ===== */}
      <div className="h-24 flex items-center justify-center border-b border-gray-100 flex-col mt-6">
        <h1 className="font-bold tracking-wide text-xl text-emerald-600">
          {open ? "GrowthChildCare" : "GC"}
        </h1>

        <span className="font-bold tracking-wide text-sm text-emerald-500">
          {open ? "Monitoring Sistem" : ""}
        </span>
      </div>

      {/* ===== Menu ===== */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto -mt-2">
        {menu.map((item) => (
          <NavLink key={item.id} to={item.link}>
            {({ isActive }) => (
              <div
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  
                  ${
                    isActive
                      ? "bg-emerald-100 text-emerald-700 shadow-sm"
                      : "text-gray-600 hover:bg-emerald-700 hover:text-white"
                  }

                  ${!open ? "justify-center" : ""}
                `}
              >
                {/* Active Indicator */}
                <span
                  className={`absolute right-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded-r-lg transition-all
                  ${isActive ? "bg-emerald-500" : "bg-transparent"}`}
                />

                {/* Icon */}
                <span
                  className={`text-lg transition-all duration-200
                  ${
                    isActive
                      ? "text-emerald-600"
                      : "text-emerald-600 group-hover:text-white"
                  }`}
                >
                  {item.icon}
                </span>

                {/* Label */}
                {open && (
                  <span
                    className={`transition-colors duration-200
                    ${
                      isActive ? "text-emerald-700" : "group-hover:text-white"
                    }`}
                  >
                    {item.label}
                  </span>
                )}

                {/* Tooltip */}
                {!open && (
                  <span className="absolute left-16 scale-0 group-hover:scale-100 origin-left transition bg-slate-800 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap z-50">
                    {item.label}
                  </span>
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ===== Logout ===== */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
          text-red-500 hover:bg-red-100 transition-all duration-200
          ${!open ? "justify-center" : ""}`}
        >
          <span className="text-lg">⎋</span>

          {open && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
