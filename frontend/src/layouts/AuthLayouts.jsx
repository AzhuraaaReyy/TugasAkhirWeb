import { Link } from "react-router-dom";
import stunting from "../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import FadeSlide from "../components/Animations/FadeSlide";
import FadeUp from "../components/Animations/FadeUp";
import Particles from "@/components/Animations/Particles";

const AuthLayout = (props) => {
  const { children, type } = props;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* GAMBAR: hanya tampil di desktop (kolom kiri). Di mobile disembunyikan */}
      <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center md:bg-gray-100">
        <img
          src={stunting}
          alt="Illustration"
          className="h-full w-full object-cover md:rounded-lg md:shadow-lg"
        />
      </div>

      {/* FORM: background putih polos, penuh di mobile & desktop */}
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center overflow-hidden bg-white md:w-1/2">
        {/* Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Particles
            particleColors={["#00ff1e"]}
            particleCount={200}
            particleSpread={10}
            speed={0.1}
            particleBaseSize={100}
            moveParticlesOnHover
            alphaParticles={false}
            disableRotation={false}
            pixelRatio={1}
          />
        </div>

        {/* DEKORASI BLUR — pointer-events-none */}
        <div className="absolute -top-40 bottom-0 -left-50 w-[400px] h-[400px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse z-0 pointer-events-none"></div>
        <div className="absolute top-100 -right-60 w-[400px] h-[400px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse z-0 pointer-events-none"></div>

        {/* KONTEN — tanpa kartu, langsung di atas background putih */}
        <div className="relative z-10 w-full max-w-sm px-6">
          {/* Logo */}
          <FadeUp delay={200}>
            <div className="flex justify-center font-poppins tracking-wide text-black text-4xl mt-10">
              {type == "login" ? (
                <span className="font-bold text-emerald-400">Login</span>
              ) : (
                <span className="font-bold text-emerald-400">Register</span>
              )}
            </div>
          </FadeUp>

          {/* Form */}
          <FadeSlide direction="left" delay={200}>
            <div className="mt-10">{children}</div>
          </FadeSlide>

          {/* sign in with Facebook */}
          <div className="mb-3">
            <a
              href="https://www.facebook.com/?locale2=id_ID&_rdr"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </div>

          {/* Link Register / Login */}
          <FadeSlide direction="right" delay={200}>
            <div className="flex justify-center mt-5">
              {type == "login" ? (
                <Link to="/register" className="text-black text-sm">
                  <span>Don’t have an acount? </span>
                  <span className="font-bold underline text-emerald-400 hover:text-emerald-600">
                    Register
                  </span>
                </Link>
              ) : (
                <span className="text-black text-sm">
                  Already have an acount?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-emerald-400 underline hover:text-emerald-600"
                  >
                    Login
                  </Link>
                </span>
              )}
            </div>
          </FadeSlide>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
