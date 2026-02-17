import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "leaflet/dist/leaflet.css";

import Hero from "../components/Fragments/HomeGuest/Hero";
import Map from "../components/Fragments/HomeGuest/Map";
import FiturSistem from "../components/Fragments/HomeGuest/FiturSistem";
import Edukasi from "../components/Fragments/HomeGuest/Edukasi";
import Berita from "../components/Fragments/HomeGuest/Berita";
import Testimoni from "../components/Fragments/HomeGuest/Testimoni";
import Navbar from "../components/Fragments/Navbar";
import Footer from "../components/Fragments/Footer";

const Homepage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <FiturSistem />
      <Edukasi />
      <Berita />
      <Map />
      <Testimoni />
      <Footer />
    </>
  );
};

export default Homepage;
