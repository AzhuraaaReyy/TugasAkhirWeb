import { useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const AuthModal = ({ isOpen, onClose, onRegister }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay Blur */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/40 z-40" />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 relative animate-scaleUp text-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-400 hover:text-gray-700"
          >
            <X size={24} />
          </button>

          {/* Icon Warning */}
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-4 rounded-full">
              <AlertTriangle className="text-emerald-500" size={40} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Akses Terbatas
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Fitur ini hanya dapat digunakan oleh pengguna yang sudah terdaftar.
            Silakan buat akun terlebih dahulu untuk melanjutkan.
          </p>

          {/* Register Button */}
          <button
            onClick={onRegister}
            className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition"
          >
            Daftar Sekarang
          </button>

          {/* Optional Login Text */}
          <p className="text-sm text-gray-500 mt-4">
            Sudah punya akun?{" "}
            <span
              className="text-emerald-600 font-semibold cursor-pointer hover:underline"
              onClick={onClose}
            >
              Login di sini
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
