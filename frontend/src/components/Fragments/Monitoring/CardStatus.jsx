import Card from "../../Elements/Card/Index";
import { Icon } from "../../../assets/icons/Index";
const CardStatus = ({ status }) => {
  const statusWarnaTBU = {
    "Sangat pendek (severely stunted)": "bg-red-600 text-white",
    "Pendek (stunted)": "bg-yellow-500 text-white",
    Normal: "bg-green-500 text-white",
    Tinggi: "bg-blue-500 text-white",
    default: "bg-gray-300 text-black",
  };

  // rounded-xl + whitespace-normal => teks panjang bisa turun baris, tidak memaksa lebar
  const baseStyle =
    "inline-block max-w-full break-words whitespace-normal text-center leading-snug px-4 py-1.5 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300 ease-in-out";

  return (
    <Card
      variant="w-full min-w-0"
      desc={
        <div className="w-full bg-white rounded-2xl px-6 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative pb-7">
          {/* Icon kanan atas */}
          <div className="absolute top-3 right-3 bg-emerald-100 text-emerald-600 p-3 rounded-lg shadow-md">
            <Icon.Status />
          </div>

          {/* Title kecil */}
          <p className="text-black font-bold text-sm mb-2 pr-14">
            Status Gizi
          </p>

          {/* Status (bisa wrap) */}
          <h2
            className={`${baseStyle} ${
              statusWarnaTBU[status] || statusWarnaTBU.default
            }`}
          >
            {status || "-"}
          </h2>
        </div>
      }
    />
  );
};
export default CardStatus;
