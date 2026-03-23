import { Bell, Settings, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useRef, useEffect } from "react";

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

  // CLASS CLEAN
  const baseHeader =
    "fixed top-0 right-0 h-16 bg-white shadow-sm flex justify-between items-center px-6 z-30 transition-all duration-300";

  const sidebarState = open ? "left-64" : "left-20";

  return (
    <div className={`${baseHeader} ${sidebarState}`}>
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
      <div className="flex items-center gap-4" ref={notifRef}>
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search here"
          className="border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* SETTINGS */}
        <Settings className="cursor-pointer text-gray-600" />

        {/* NOTIFICATION */}
        <div className="relative">
          {/* BUTTON */}
          <button
            aria-label="Buka notifikasi"
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell className="text-gray-600" />

            {/* BADGE */}
            {notifList?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 rounded-full">
                {notifList.length > 9 ? "9+" : notifList.length}
              </span>
            )}
          </button>

          {/* DROPDOWN */}
          {showNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-gray-900 text-white rounded-xl p-4 z-[9999] shadow-2xl animate-fadeIn">
              {/* HEADER */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold">Notification</h2>

                <button
                  onClick={markAllAsRead}
                  className="text-xs text-gray-400 hover:text-white"
                >
                  Mark all as read
                </button>
              </div>

              {/* LIST */}
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
      </div>
    </div>
  );
};

export default Header;
