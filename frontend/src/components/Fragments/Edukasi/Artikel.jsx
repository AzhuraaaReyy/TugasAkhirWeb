import React, { forwardRef } from "react";

const Artikel = forwardRef(
  ({ item, index, active, setActive, onSelect }, ref) => {
    return (
      <div
        ref={ref}
        onMouseEnter={() => setActive(index)}
        className={`relative group rounded-2xl overflow-hidden cursor-pointer
      transition-[flex] duration-700 ease-in-out border border-gray-400 hover:shadow-xl
      ${active === index ? "flex-[4]" : "flex-[1]"}`}
      >
        {/* Background */}
        <img
          src={item.image}
          className={`absolute inset-0 w-full h-full object-cover
        transition-all duration-700 ease-in-out
        group-hover:scale-110
        ${active === index ? "grayscale-0" : "grayscale"}`}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-8">
          <h3
            className={`font-extrabold tracking-wide flex items-center gap-3
          transition-all duration-700 ease-in-out
          ${
            active === index
              ? "text-3xl mb-2"
              : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl -rotate-90"
          }`}
          >
            {item.title}
          </h3>

          {active === index && (
            <div className="max-w-md">
              <p className="text-gray-200 text-sm leading-relaxed">
                {item.desc}
              </p>
              <button
                onClick={() => onSelect(item, index)}
                className="mt-6 px-5 py-2 bg-emerald-500 border border-white/30 rounded-lg text-sm hover:bg-emerald-600 transition"
              >
                Selengkapnya
              </button>
            </div>
          )}
        </div>
      </div>
    );
  },
);

export default Artikel;
