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

  const menus = [
    { name: "Beranda", link: "hero" },
    { name: "Fitur", link: "fitur" },
    { name: "Edukasi", link: "edukasi" },
    { name: "Berita", link: "berita" },
    { name: "Testimoni", link: "testimoni" },
    { name: "Posyandu", link: "map" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-md backdrop-blur-md"
          : "bg-transparent text-red-600"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <h1 className="text-xl font-bold text-emerald-600">StuntingCare</h1>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8">
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
                    scrolled ? "text-gray-700 " : "text-white"
                  }`}
                >
                  {menu.name}
                </Link>

                {/* Underline Animation */}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full"></span>
              </li>
            ))}
          </ul>

          {/* CTA Desktop */}
          <div className="hidden md:flex gap-3">
            <NavLink
              to="/login"
              className="px-4 py-2 text-emerald-600 font-medium hover:underline"
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

          {/* Mobile Button */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ${
            open
              ? "max-h-96 opacity-100 pb-6"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <ul className="flex flex-col gap-4">
            {menus.map((menu, i) => (
              <li key={i}>
                <Link
                  to={menu.link}
                  smooth={true}
                  duration={600}
                  offset={-70}
                  className="block text-gray-700 hover:text-emerald-600"
                  onClick={() => setOpen(false)}
                >
                  {menu.name}
                </Link>
              </li>
            ))}

            <div className="flex flex-col gap-3 pt-4">
              <button className="text-emerald-600 font-medium">Login</button>

              <button className="bg-emerald-500 text-white py-2 rounded-xl">
                Daftar
              </button>
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
