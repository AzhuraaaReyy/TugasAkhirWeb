import { useEffect, useRef } from "react";
export default function ErrorPage() {
  const gradientRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;

      if (gradientRef.current) {
        gradientRef.current.style.transform = `translate(${(x - 0.5) * 50}px, ${
          (y - 0.5) * 50
        }px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Gradient radial dengan warna custom — dipakai sebagai inline style
  const heroGradient = {
    background:
      "radial-gradient(circle at center, #adedd3 0%, rgba(249, 249, 255, 0) 70%)",
  };

  const quickAccessChips = [
    "Grafik Pertumbuhan",
    "Tips Nutrisi",
    "Jadwal Imunisasi",
    "Artikel Parenting",
  ];

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-surface dark:bg-surface-dim shadow-sm sticky top-0 z-50 w-full">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
          <div className="flex items-center gap-base">
            <span className="font-display-lg text-headline-md font-bold text-primary dark:text-inverse-primary">
              GrowthGuard
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-lg">
            {["Dashboard", "Growth Map", "Insights", "Resources"].map(
              (item) => (
                <a
                  key={item}
                  href="#"
                  className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary dark:hover:text-inverse-primary transition-colors font-body-md text-body-md"
                >
                  {item}
                </a>
              ),
            )}
          </nav>

          <div className="flex items-center gap-md">
            <div className="hidden md:block">
              <button className="bg-primary-container text-on-primary-container px-md py-sm rounded-xl font-label-md transition-all duration-200 active:opacity-80">
                Add Entry
              </button>
            </div>

            <div className="flex items-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant cursor-pointer p-xs hover:bg-surface-container rounded-full transition-colors">
                notifications
              </span>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-outline-variant">
                <img
                  alt="Parent profile avatar"
                  className="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUgfEeMQ9XFbhGT5vusXhZK1p5Y9q0liyYoYA7suMm5AbM2LX0Sk3j1nH4l4IQLHXp8ytkS0XDX-Nd1yPrL0_0l5X7F1qHxs13-5NsiQZ0XbN6PO9Oo0wW4a4eHSUYYugM3Y-qMPfKjR-vHKCg3vtnysxNgpXUlHwhDwKhoM_ES-BBhJXMKDyE-UpqS8HrzjrcRM11YET7eFw5O4rM34RH_dFXLIke5CFSHCBJ8ZexqyCo-jNL3x29uV8H2HM3Juso8a055NIa4Ko"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main 404 Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-xl relative">
        {/* Background Decor */}
        <div
          ref={gradientRef}
          className="absolute inset-0 pointer-events-none opacity-40 blur-3xl"
          style={heroGradient}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          {/* Toddler Illustration Section */}
          <div className="mb-lg relative inline-block animate-float">
            <img
              alt="404 Error: Halaman Tidak Ditemukan - Ilustrasi Balita yang Sedang Bingung"
              className="w-64 h-64 md:w-80 md:h-80 object-contain mx-auto"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCovkW7WElPzXA7ZshyW9p8VKRIkml0mfNmOLshpEaeFXC1uuLcdi5O8mrQr2PoYA7e48a1TnAt1hQKfbTcX2rj_Vsv21NqUJR095UgVlU2g8Ds42yY_S-WBPsY8f0ICo2pZ2mzYcXJIPlkcifdrQCgAo1fOWFYEJhj2vIbzWnKwU73X0wJoi_CT0t6dAAE3o-PrL3Mgpn3ttzfTnATHmL-AA3YutW4wceWKJYkuPYBdRW5J1Dz1_zjgmIM1XfYRYW0wBR3-Qa1-_Y"
            />

            {/* Decorative elements around illustration */}
            <div className="absolute -top-4 -right-4 bg-secondary-container p-sm rounded-full shadow-sm text-secondary">
              <span className="material-symbols-outlined text-headline-md">
                psychology
              </span>
            </div>
            <div className="absolute bottom-4 -left-8 bg-tertiary-fixed p-sm rounded-full shadow-sm text-tertiary">
              <span className="material-symbols-outlined text-headline-md">
                eco
              </span>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-md">
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-on-background">
              Oops! Halaman Tidak Ditemukan
            </h1>
            <p className="font-body-md text-body-md md:text-body-lg text-on-surface-variant px-md leading-relaxed">
              Sepertinya halaman yang Anda cari sedang dalam pertumbuhan atau
              tidak tersedia. Mari kita kembali ke jalur yang benar untuk
              memantau tumbuh kembang si kecil.
            </p>

            <div className="pt-md flex flex-col md:flex-row items-center justify-center gap-md">
              <a
                href="#"
                className="w-full md:w-auto bg-primary text-on-primary px-lg py-md rounded-full font-label-md text-body-md shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">home</span>
                Kembali ke Beranda
              </a>
              <a
                href="#"
                className="w-full md:w-auto border-2 border-secondary text-secondary px-lg py-md rounded-full font-label-md text-body-md hover:bg-secondary-container transition-all duration-300 flex items-center justify-center gap-sm"
              >
                <span className="material-symbols-outlined">help_center</span>
                Bantuan
              </a>
            </div>
          </div>

          {/* Quick Access Chips for 404 Recovery */}
          <div className="mt-xl">
            <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-md">
              Cari Sesuatu yang Lain?
            </p>
            <div className="flex flex-wrap justify-center gap-sm">
              {quickAccessChips.map((chip) => (
                <span
                  key={chip}
                  className="bg-tertiary-fixed text-on-tertiary-fixed px-md py-sm rounded-full text-label-md cursor-pointer hover:bg-tertiary-fixed-dim transition-colors"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container dark:bg-surface-container-high w-full border-t-0">
        <div className="flex flex-col md:flex-row justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-lg max-w-7xl mx-auto">
          <div className="mb-md md:mb-0 text-center md:text-left">
            <div className="font-display-lg text-label-md font-bold text-primary dark:text-inverse-primary mb-xs">
              GrowthGuard
            </div>
            <p className="text-on-surface-variant text-label-sm font-body-md">
              © 2024 GrowthGuard Pediatric Health. Supporting healthy
              development.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-md">
            {["Privacy Policy", "Terms of Service", "Support", "Contact"].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="text-on-surface-variant dark:text-on-surface-variant hover:text-primary transition-opacity duration-200 text-label-sm font-label-md"
                >
                  {link}
                </a>
              ),
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
