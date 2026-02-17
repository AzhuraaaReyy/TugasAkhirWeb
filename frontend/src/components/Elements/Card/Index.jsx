const Card = (props) => {
  const { title = false, desc, variant } = props;

  return (
    <div className={`flex flex-col h-full ${variant}`}>
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
  );
};

export default Card;
