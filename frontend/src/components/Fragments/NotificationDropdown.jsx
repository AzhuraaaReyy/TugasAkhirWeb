export default function NotificationDropdown({ notifList }) {
  return (
    <div className="absolute right-0 mt-4 w-96 bg-[#111] text-white rounded-2xl shadow-2xl p-5 z-50 animate-fadeIn border border-gray-800">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Notification</h2>
        <button className="text-xs text-gray-400 hover:text-white">
          Mark all as read
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {notifList.map((item, index) => (
          <div
            key={index}
            className="flex gap-3 items-start bg-[#1a1a1a] p-3 rounded-xl hover:bg-[#222] transition"
          >
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-sm">
              🔔
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>

              {item.action && (
                <button className="mt-2 bg-green-400 text-black text-xs px-3 py-1 rounded-lg">
                  {item.action}
                </button>
              )}
            </div>

            {/* TIME */}
            <span className="text-xs text-gray-500">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
