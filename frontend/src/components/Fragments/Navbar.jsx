import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-scroll";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup menu mobile otomatis saat layar diperbesar ke desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menus = [
    { name: "Beranda", link: "hero" },
    { name: "Fitur", link: "fitur" },
    { name: "Edukasi", link: "edukasi" },
    { name: "Berita", link: "berita" },
    { name: "Posyandu", link: "map" },
    { name: "Testimoni", link: "testimoni" },
    { name: "FAQ", link: "faq" },
  ];

  // Saat menu mobile terbuka, paksa navbar punya latar putih agar teks terbaca
  const solid = scrolled || open;

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        solid ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-lg sm:text-xl font-bold text-emerald-600">
            GrowthChildCare
          </h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {menus.map((menu, i) => (
              <li key={i} className="relative group">
                <Link
                  to={menu.link}
                  smooth={true}
                  duration={600}
                  offset={-70}
                  spy={true}
                  activeClass="text-emerald-600 font-semibold"
                  className={`cursor-pointer transition ${
                    scrolled ? "text-gray-700" : "text-white"
                  }`}
                >
                  {menu.name}
                </Link>
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* CTA Desktop */}
          <div className="hidden md:flex gap-3">
            <NavLink
              to="/login"
              className="px-5 py-2 bg-white text-emerald-500 rounded-xl hover:bg-emerald-600 transition hover:text-white"
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="px-5 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition"
            >
              Daftar
            </NavLink>
          </div>

          {/* Tombol Mobile */}
          <button
            type="button"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className={`md:hidden p-1 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
              solid ? "text-emerald-600" : "text-white"
            }`}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden transition-all duration-300 ${
            open
              ? "max-h-[36rem] opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col gap-1 bg-white rounded-2xl shadow-lg p-4 mt-2">
            {menus.map((menu, i) => (
              <li key={i}>
                <Link
                  to={menu.link}
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="block py-2 px-3 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  {menu.name}
                </Link>
              </li>
            ))}

            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-gray-100">
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="text-center py-2 rounded-xl border border-emerald-500 text-emerald-600 font-medium hover:bg-emerald-50 transition"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setOpen(false)}
                className="text-center bg-emerald-500 text-white py-2 rounded-xl hover:bg-emerald-600 transition"
              >
                Daftar
              </NavLink>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
