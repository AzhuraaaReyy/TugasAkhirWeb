import { FcGoogle } from "react-icons/fc";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Link } from "react-router-dom";
const AuthLayouts = (props) => {
  const { children, type } = props;
  return (
    <div
      className="min-h-screen flex items-center justify-center  relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://images.unsplash.com/photo-1633356122544-f134324a6cee)",
      }}
    >
      <div className="relative w-full max-w-5xl min-h-[650px] mx-auto bg-[#f3f3f3] rounded-[40px] shadow-2xl flex p-3">
        {/* LEFT SIDE */}
        <div className="hidden md:block w-1/2 relative overflow-hidden rounded-l-[35px]">
          <div
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div
          className="w-full md:w-1/2 px-14 py-12 flex flex-col justify-center bg-[#f3f3f3]"
          style={{
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
          }}
        >
          {/* HEADER */}
          <div className="flex justify-between ">
            <h1 className="font-bold text-xl tracking-wider">UISOCIAL</h1>
          </div>

          {/* TITLE */}

          <p className="text-gray-500 mb-8">
            {type === "login" ? "Selamat Datang" : "Daftar Stunting"}
          </p>

          {/* FORM FIELDS */}
          <div>{children}</div>

          {/* FOOTER */}
          <div className="flex flex-row justify-center items-center gap-1 mt-3">
            {type === "login" ? (
              <>
                <span className="text-sm text-gray-500">Belum Punya Akun?</span>
                <Link
                  to="/register"
                  className="text-[#ff4a3d] font-semibold hover:underline"
                >
                  Daftar Sekarang
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-700">Sudah Punya Akun?</span>
                <Link
                  to="/login"
                  className="text-[#ff4a3d] font-semibold hover:underline"
                >
                  Login Sekarang
                </Link>
              </>
            )}
          </div>

          {/* SOCIAL */}
          <div className="flex justify-center gap-5 mt-4 text-gray-500 text-lg">
            <FaFacebookF />
            <FaTwitter />
            <FaLinkedinIn />
            <FaInstagram />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayouts;
