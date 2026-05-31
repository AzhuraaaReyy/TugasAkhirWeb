// utils/analisaPertumbuhan.js
// Logika analisis tren pertumbuhan dipakai bersama oleh kartu & konteks chatbot.

// Toleransi (kg). Perubahan dalam ±EPS dianggap "tetap" (stagnan).
export const EPS_BERAT = 0.05;

/**
 * Hitung tren dari deret nilai (urut waktu menaik).
 * @returns {{ arah: "naik"|"turun"|"tetap"|null, panjang: number }}
 *  panjang = jumlah langkah berturut-turut terakhir yang searah.
 */
export function hitungTren(nilai = [], eps = EPS_BERAT) {
  const arr = nilai.map((v) => Number(v)).filter((v) => !isNaN(v));
  if (arr.length < 2) return { arah: null, panjang: 0 };

  let arah = null;
  let panjang = 0;

  for (let i = arr.length - 1; i > 0; i--) {
    const delta = arr[i] - arr[i - 1];
    const stepArah = delta <= -eps ? "turun" : delta >= eps ? "naik" : "tetap";

    if (arah === null) {
      arah = stepArah;
      panjang = 1;
    } else if (stepArah === arah) {
      panjang++;
    } else {
      break;
    }
  }

  return { arah, panjang };
}

/** Urutkan riwayat penimbangan berdasarkan tanggal/umur menaik. */
export function urutkanRiwayat(riwayat = []) {
  return [...riwayat].sort((a, b) => {
    const ta = new Date(a?.tanggal).getTime();
    const tb = new Date(b?.tanggal).getTime();
    if (!isNaN(ta) && !isNaN(tb)) return ta - tb;
    return (a?.umur ?? 0) - (b?.umur ?? 0);
  });
}

/**
 * Ringkas kondisi anak menjadi objek + teks, untuk dipakai sebagai
 * konteks chatbot agar AI paham situasi (naik/turun/stagnan + status gizi).
 */
export function ringkasKondisiAnak(detail = {}, riwayat = []) {
  const terurut = urutkanRiwayat(riwayat);
  const tren = hitungTren(terurut.map((r) => r.berat));

  const arahTeks =
    tren.arah === "turun"
      ? `turun ${tren.panjang} kali penimbangan berturut-turut`
      : tren.arah === "naik"
        ? `naik ${tren.panjang} kali penimbangan berturut-turut`
        : tren.arah === "tetap"
          ? `stagnan (tidak bertambah) ${tren.panjang} kali penimbangan berturut-turut`
          : "belum cukup data untuk menilai tren";

  const ringkasanTeks =
    `Anak: ${detail.name ?? "-"} (umur ${detail.umur ?? "-"} bulan, ` +
    `jenis kelamin ${detail.jk ?? "-"}). ` +
    `Status gizi — Stunting (TB/U): ${detail.statusTBU ?? "-"}; ` +
    `Underweight (BB/U): ${detail.statusBBU ?? "-"}; ` +
    `Wasting (BB/TB): ${detail.statusBBTB ?? "-"}. ` +
    `Tren berat badan: ${arahTeks}.`;

  return {
    nama: detail.name ?? null,
    umur: detail.umur ?? null,
    status: {
      stunting: detail.statusTBU ?? null,
      underweight: detail.statusBBU ?? null,
      wasting: detail.statusBBTB ?? null,
    },
    tren, // { arah, panjang }
    ringkasanTeks,
  };
}
