const ContentCard = ({ image, title, description, location, price }) => {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 
                    overflow-hidden w-full max-w-sm 
                    shadow-[0_8px_25px_rgba(0,0,0,0.06)]
                    hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]
                    transition-all duration-300"
    >
      {/* Image Section */}
      <div className="p-4">
        <div
          className="h-56 w-full overflow-hidden rounded-xl
                        shadow-[0_30px_20px_-15px_rgba(0,0,0,0.3)]
                        transition-all duration-300"
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover 
                       hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-500 text-sm mb-4">{description}</p>

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t">
          <div className="text-gray-500 text-sm">📍 {location}</div>
          <div className="font-semibold text-lg">${price}/night</div>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
