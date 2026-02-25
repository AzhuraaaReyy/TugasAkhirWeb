import { ChevronLeft } from "lucide-react";

const PrevArrow = ({ arrowRef }) => {
  return (
    <button
      ref={arrowRef}
      className="absolute left-6 top-1/2 -translate-y-1/2 z-20 
      bg-white/20 backdrop-blur-md 
      p-3 rounded-full 
      text-emerald-400 
      hover:text-white
      hover:bg-emerald-500 
      hover:scale-110
      transition duration-300 shadow-lg"
    >
      <ChevronLeft size={28} />
    </button>
  );
};

export default PrevArrow;
