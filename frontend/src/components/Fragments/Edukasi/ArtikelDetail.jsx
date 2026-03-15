export default function ArtikelDetail({ artikel, onClose, artikelRefs }) {
  if (!artikel) return null;

  return (
    <div className="max-w-6xl mx-auto mt-16 mb-16 bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2">
      <img src={artikel.image} className="w-full h-full object-cover" />

      <div className="p-10 flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {artikel.title}
        </h2>
        <p className="text-gray-600 leading-relaxed">{artikel.desc}</p>

        <button
          onClick={() => {
            if (artikel?.index !== undefined) {
              artikelRefs.current[artikel.index]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
            onClose();
          }}
          className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
