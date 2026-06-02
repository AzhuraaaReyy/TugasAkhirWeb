import Card from "../../Elements/Card/Index";
import { Icon } from "../../../assets/icons";
const CardBerat = ({ berat }) => {
  return (
    <Card
      variant="w-full min-w-0"
      desc={
        <div className="w-full bg-white rounded-2xl px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7">
          {/* Icon kanan atas */}
          <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-600 p-3 rounded-lg shadow-md">
            <Icon.Weight />
          </div>

          {/* Title kecil */}
          <p className="text-black font-bold text-sm mb-1 pr-40">
            Berat Badan
          </p>

          {/* Nominal besar */}
          <h2 className="text-2xl font-bold text-gray-800 mt-2">{berat} kg</h2>
        </div>
      }
    />
  );
};
export default CardBerat;
