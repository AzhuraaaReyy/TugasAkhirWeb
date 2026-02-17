import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-900 text-gray-300 pt-20 pb-8 overflow-hidden">
      {/* Background Blob */}
      <div className="absolute -top-20 left-0 w-[300px] h-[300px] bg-emerald-500 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-blue-500 rounded-full blur-3xl opacity-20"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">StuntingCare</h2>
            <p className="mt-4 text-sm leading-relaxed">
              Platform digital untuk membantu deteksi dini stunting serta
              memantau pertumbuhan anak secara lebih mudah, cepat, dan akurat.
            </p>
          </div>

          {/* Navigasi */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigasi</h3>

            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-emerald-400">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#fitur" className="hover:text-emerald-400">
                  Fitur
                </a>
              </li>
              <li>
                <a href="#edukasi" className="hover:text-emerald-400">
                  Edukasi
                </a>
              </li>
              <li>
                <a href="#berita" className="hover:text-emerald-400">
                  Berita
                </a>
              </li>
              <li>
                <a href="#map" className="hover:text-emerald-400">
                  Posyandu
                </a>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h3 className="text-white font-semibold mb-4">Kontak</h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <span>0812-3456-7890</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@stuntingcare.id</span>
              </li>

              <li className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Semarang, Jawa Tengah</span>
              </li>
            </ul>
          </div>

          {/* Sosial Media */}
          <div>
            <h3 className="text-white font-semibold mb-4">Ikuti Kami</h3>

            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-500 transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href="#"
                className="p-2 bg-gray-800 rounded-lg hover:bg-emerald-500 transition"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm">
          © {new Date().getFullYear()} StuntingCare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
