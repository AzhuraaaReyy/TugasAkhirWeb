const EdukasiCard = ({ image, alt }) => {
  return (
    <div className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
      {/* Image */}
      <img
        src={image}
        alt={alt}
        className="w-full h-[420px] object-cover transition duration-700 ease-out group-hover:scale-110"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-70 group-hover:opacity-90 transition duration-500"></div>

      {/* Glow Border */}
      <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 group-hover:ring-white/30 transition"></div>
    </div>
  );
};

export default EdukasiCard;
