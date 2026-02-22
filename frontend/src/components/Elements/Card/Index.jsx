const Card = (props) => {
  const { title = false, desc, variant, color } = props;
  const colors = {
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className={`flex flex-col h-full ${variant}`}>
      <div className={` rounded-xl shadow ${colors[color]}`}>
        <div className="bg-white rounded-lg px-6 py-5 shadow-xl flex flex-col h-full">
          {title && (
            <div className="text-lg font-semibold text-gray-700 pb-2">
              {title}
            </div>
          )}

          {/* isi card */}
          <div className="flex-1 flex flex-col">{desc}</div>
        </div>
      </div>
    </div>
  );
};

export default Card;
