import Card from "../../Elements/Card/Index";
import { Icon } from "../../../assets/icons";
const TotalNotifikasiCard = ({ notif }) => {
  return (
    <>
      <Card
        variant="min-w-[250px]"
        desc={
          <div className="bg-blue-400 rounded-2xl px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex-1 relative pb-7">
            {/* Icon kanan atas */}
            <div className="absolute top-0 right-0 bg-gray-800 text-white p-3 rounded-lg shadow-md">
              <Icon.Weight />
            </div>

            {/* Title kecil */}
            <p className="text-black font-semibold text-sm mb-1">
              Total Notifikasi
            </p>

            {/* Nominal besar */}
            <h2 className="text-2xl font-bold text-gray-800 mt-2 ">{notif}</h2>

            {/* Change */}
          
          </div>
        }
      />
    </>
  );
};
export default TotalNotifikasiCard;
