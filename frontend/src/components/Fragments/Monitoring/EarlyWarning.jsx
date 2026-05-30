const EarlyWarning = ({
  berat_sekarang,
  berat_sebelumnya,
  tinggi_sekarang,
  tinggi_sebelumnya,
  berat_history = [],
  tinggi_history = [],
}) => {
  const successMessages = [];
  const warnings = [];

  // ================= HELPER =================
  const toNumber = (val) =>
    val !== null && val !== undefined ? Number(val) : 0;

  const beratNow = toNumber(berat_sekarang);
  const beratPrev = toNumber(berat_sebelumnya);
  const tinggiNow = toNumber(tinggi_sekarang);
  const tinggiPrev = toNumber(tinggi_sebelumnya);

  // ================= CEK DATA AWAL =================
  const isFirstData = !berat_sebelumnya && !tinggi_sebelumnya;

  // ================= TREND HISTORY =================
  const isDecreasingTrend = (arr) => {
    if (!arr || arr.length < 3) return false;

    let count = 0;

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) {
        count++;
      } else {
        count = 0;
      }

      if (count >= 2) return true;
    }

    return false;
  };

  const weightWarning = isDecreasingTrend(berat_history);
  const heightWarning = isDecreasingTrend(tinggi_history);

  // ================= PERBANDINGAN =================
  const selisihBerat = beratNow - beratPrev;
  const selisihTinggi = tinggiNow - tinggiPrev;

  const persenBerat =
    beratPrev !== 0 ? ((selisihBerat / beratPrev) * 100).toFixed(1) : 0;

  // ================= LOGIC PESAN =================
  if (!isFirstData) {
    // ===== BERAT =====
    if (selisihBerat < 0) {
      warnings.push(
        `Berat badan turun ${Math.abs(selisihBerat).toFixed(
          2,
        )} kg (${persenBerat}%) dari ${beratPrev} kg menjadi ${beratNow} kg`,
      );
    } else if (selisihBerat > 0) {
      successMessages.push(
        `Berat badan naik ${selisihBerat.toFixed(
          2,
        )} kg (${persenBerat}%) dari ${beratPrev} kg menjadi ${beratNow} kg`,
      );
    } else {
      warnings.push(`Berat badan stagnan (${beratNow} kg)`);
    }

    // ===== TINGGI =====
    if (selisihTinggi < 0) {
      warnings.push(
        `Tinggi badan menurun ${Math.abs(selisihTinggi).toFixed(
          2,
        )} cm dari ${tinggiPrev} cm menjadi ${tinggiNow} cm`,
      );
    } else if (selisihTinggi > 0) {
      successMessages.push(
        `Tinggi badan naik ${selisihTinggi.toFixed(
          2,
        )} cm dari ${tinggiPrev} cm menjadi ${tinggiNow} cm`,
      );
    } else {
      warnings.push(`Tinggi badan tidak berubah (${tinggiNow} cm)`);
    }
  }

  // ================= TREND WARNING =================
  if (weightWarning) {
    warnings.push("Berat badan mengalami penurunan terus menerus");
  }

  if (heightWarning) {
    warnings.push("Tinggi badan mengalami penurunan terus menerus");
  }

  // ================= INSIGHT =================

  return (
    <div className="mt-4 space-y-4">
      {/* ================= DATA AWAL ================= */}
      {isFirstData && (
        <div className="bg-blue-50 border border-blue-300 rounded-xl p-4 animate-pulse">
          <h2 className="text-blue-600 font-bold text-sm mb-2">
            - Data Awal Tercatat! -
          </h2>
          <ul className="list-disc pl-5 text-sm text-blue-700 space-y-1">
            <li>Berat badan: {beratNow} kg</li>
            <li>Tinggi badan: {tinggiNow} cm</li>
          </ul>
        </div>
      )}

      {/* ================= WARNING ================= */}
      {!isFirstData && warnings.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4 animate-pulse">
          <h2 className="text-red-600 font-bold text-sm mb-2">
            - Berat Badan atau Tinggi Badan Perlu Perhatian Khusus! -
          </h2>
          <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
            {warnings.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ================= SUCCESS ================= */}
      {!isFirstData && successMessages.length > 0 && (
        <div className="bg-green-50 border border-green-300 rounded-xl p-4 animate-pulse">
          <h2 className="text-green-600 font-bold text-sm mb-2">
            - Berat Badan atau Tinggi Badan Mengalami Kenaikan Pertumbuhan! -
          </h2>
          <ul className="list-disc pl-5 text-sm text-green-700 space-y-1">
            {successMessages.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EarlyWarning;
