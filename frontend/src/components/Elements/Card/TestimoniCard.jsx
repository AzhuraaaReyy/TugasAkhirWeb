import { Star } from "lucide-react";

const TestimoniCard = ({ item }) => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col text-center transition hover:-translate-y-3 hover:shadow-xl">
      <img
        src={item.foto}
        alt={item.nama}
        className="w-16 h-16 rounded-full mx-auto object-cover"
      />

      <h4 className="mt-4 font-semibold text-gray-800">{item.nama}</h4>

      <span className="text-sm text-gray-500">{item.peran}</span>

      {/* Rating */}
      <div className="flex justify-center mt-3">
        {[...Array(item.rating)].map((_, i) => (
          <Star key={i} size={18} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>

      <p className="mt-4 text-gray-600 text-sm italic">“{item.komentar}”</p>
    </div>
  );
};

export default TestimoniCard;
