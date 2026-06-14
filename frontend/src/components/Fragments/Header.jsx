import { Bell, Settings, Menu } from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { useRef, useEffect } from "react";
import gustimg from "../../assets/images/Guest.jpg";

const Header = ({
  toggleSidebar,
  pageName,
  open,
  showNotif,
  setShowNotif,
  notifList,
  markAsRead,
  markAllAsRead,
}) => {
  const { user } = useAuth();
  const notifRef = useRef(null);

  // CLICK OUTSIDE → CLOSE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!notifRef.current) return;
      if (!notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowNotif]);

  // Offset kiri HANYA di desktop; di HP header penuh dari kiri ke kanan
  const baseHeader =
    "fixed top-0 left-0 right-0 h-16 bg-white shadow-sm flex justify-between items-center gap-3 px-4 sm:px-6 z-20 transition-all duration-300";

  const sidebarState = open ? "md:left-64" : "md:left-20";

  return (
    <div className={`${baseHeader} ${sidebarState}`}>
      {/* LEFT */}
      <div className="flex items-center gap-3 min-w-0">
        <Menu
          onClick={toggleSidebar}
          className="cursor-pointer text-gray-600 shrink-0"
        />
        <h1 className="text-lg sm:text-2xl font-bold capitalize truncate">
          {pageName}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0" ref={notifRef}>
        {/* SEARCH — sembunyi di HP */}
        <input
          type="text"
          placeholder="Search here"
          className="hidden md:block border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* SETTINGS — sembunyi di layar sangat kecil */}
        <Settings className="hidden sm:block cursor-pointer text-gray-600 shrink-0" />

        {/* NOTIFICATION */}
        <div className="relative shrink-0">
          <button
            aria-label="Buka notifikasi"
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell className="text-gray-600" />
            {notifList?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {notifList.length > 9 ? "9+" : notifList.length}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 mt-3 w-72 sm:w-80 max-w-[calc(100vw-2rem)] bg-gray-900 text-white rounded-xl p-4 z-[9999] shadow-2xl animate-fadeIn">
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Notification</h2>
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Mark all as read
                </button>
              </div>

              {notifList?.length > 0 ? (
                notifList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      markAsRead(item.id);
                      setShowNotif(false);
                    }}
                    className="bg-gray-800 p-3 rounded mb-2 cursor-pointer hover:bg-gray-700 transition"
                  >
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 text-center">
                  Semua notifikasi sudah dibaca 🎉
                </p>
              )}
            </div>
          )}
        </div>

        {/* PROFILE — avatar selalu tampil, teks hanya di layar lebar */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <img
              src={gustimg}
              alt="profile"
              className="w-10 h-10 sm:w-11 sm:h-11 object-cover rounded-full ring-2 ring-indigo-500"
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>

          <div className="hidden lg:flex flex-col leading-tight">
            <span className="font-semibold text-base text-gray-500">
              {user?.name || "User"}
            </span>
            <span className="text-sm text-black capitalize">
              {user?.role} Posyandu
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
