const EarlyWarning = ({
  berat_sekarang,
  berat_sebelumnya,
  tinggi_sekarang,
  tinggi_sebelumnya,
}) => {
  if (berat_sebelumnya == null || tinggi_sebelumnya == null) {
    return (
      <p className="text-gray-400 mt-4">Data belum cukup untuk analisis</p>
    );
  }
  const successMessages = [];
  const warnings = [];

  // BERAT
  if (berat_sekarang < berat_sebelumnya) {
    warnings.push(
      `Berat badan turun dari ${berat_sebelumnya} kg menjadi ${berat_sekarang} kg`,
    );
  } else if (berat_sekarang > berat_sebelumnya) {
    successMessages.push(
      `Berat badan naik dari ${berat_sebelumnya} kg menjadi ${berat_sekarang} kg`,
    );
  }

  // TINGGI
  if (tinggi_sekarang <= tinggi_sebelumnya) {
    warnings.push(`Tinggi badan tidak bertambah (${tinggi_sekarang} cm)`);
  } else {
    successMessages.push(
      `Tinggi badan naik dari ${tinggi_sebelumnya} cm menjadi ${tinggi_sekarang} cm`,
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {/* ================= WARNING ================= */}
      {warnings.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 animate-pulse">
          <h2 className="text-red-600 font-bold text-sm mb-2">
            ⚠ Berat Badan mengalamai penurunan
          </h2>

          <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
            {warnings.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {successMessages.length > 0 && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4">
          <h2 className="text-green-600 font-bold text-sm mb-2">
            {" "}
           - Berat Badan atau Tinggi Badan mengalami kenaikan pertumbuhan! -
          </h2>

          <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
            {successMessages.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default EarlyWarning;
