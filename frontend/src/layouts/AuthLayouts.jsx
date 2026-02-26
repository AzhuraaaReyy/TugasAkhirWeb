import stunting from "../assets/images/3efe462b-579d-4a62-b536-77b6b867ae4a.png";
import FadeSlide from "../components/Animations/FadeSlide";
import FadeUp from "../components/Animations/FadeUp";
const AuthLayout = (props) => {
  const { children, type } = props;

  return (
    <div className="flex min-h-screen ">
      {/* Bagian kanan (Gambar / Informasi) */}

      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <img
          src={stunting}
          alt="Illustration"
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
        {/* Teks di atas gambar */}
        <div className="absolute text-black text-2xl font-bold  p-4 rounded-lg"></div>
      </div>
      {/* Bagian kiri (Form Login) */}

      <div className="w-1/2 flex justify-center items-center bg-white relative overflow-hidden">
        <div className="w-full max-w-sm">
          {/* BACKGROUND BLUR DECORATION */}
          <div className="absolute -top-40 bottom-0 -left-50 w-[400px] h-[400px] bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse z-0"></div>

          <div className="absolute top-100 -right-60 w-[400px] h-[400px] bg-blue-300 rounded-full blur-3xl opacity-30 animate-pulse z-0"></div>

          {/* Logo */}
          <FadeUp delay={200}>
            <div className="flex justify-center font-poppins tracking-wide text-black text-4xl mt-10">
              {type == "login" ? (
                <span className="font-bold text-emerald-400 ">Login</span>
              ) : (
                <>
                  <span className="font-bold text-emerald-400">Register</span>
                </>
              )}
            </div>
          </FadeUp>
          {/* Form */}
          <FadeSlide direction="left" delay={200}>
            <div className="mt-10">{children}</div>
          </FadeSlide>
          {/* sign in with google end */}
          {/* sign in with Facebook start */}
          <div className="mb-3">
            <a
              href="https://www.facebook.com/?locale2=id_ID&_rdr"
              target="_blank"
              rel="noopener noreferrer"
            ></a>
          </div>
          {/* sign in with Facebook end */}

          <FadeSlide direction="right" delay={200}>
            {/* Link Register */}
            <div className="flex justify-center mt-5">
              {type == "login" ? (
                <a href="/register" className="text-black text-sm ">
                  <span className="">Don’t have an acount? </span>
                  <span className="font-bold underline text-emerald-400 hover:text-emerald-600">
                    Register
                  </span>
                </a>
              ) : (
                <>
                  <span className="">Already have an acount? </span>
                  <a href="/login" className="text-black text-sm ">
                    <span className="font-bold text-emerald-400 underline hover:text-emerald-600">
                      Login
                    </span>
                  </a>
                </>
              )}
            </div>
          </FadeSlide>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
