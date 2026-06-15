import React, { useState, useEffect } from "react";
const EPS = 0.05;
const angka = (x) => {
  if (x === null || x === undefined || x === "") return null;
  const n = Number(x);
  return isNaN(n) ? null : n;
};
const abs1 = (x) => (x == null ? null : Math.round(Math.abs(x) * 10) / 10);
const arahDari = (v, eps = EPS) =>
  v == null ? null : v >= eps ? "naik" : v <= -eps ? "turun" : "tetap";

const urutkanRiwayat = (riwayat = []) =>
  [...riwayat].sort((a, b) => {
    const ta = new Date(a?.tanggal ?? a?.tgl_deteksi).getTime();
    const tb = new Date(b?.tanggal ?? b?.tgl_deteksi).getTime();
    if (!isNaN(ta) && !isNaN(tb)) return ta - tb;
    return (a?.umur ?? 0) - (b?.umur ?? 0);
  });

/* Streak arah perubahan untuk satu kolom (berat/tinggi) dari riwayat terurut. */
const hitungStreak = (riw = [], field = "berat", eps = EPS) => {
  const vals = riw
    .map((r) => Number(r?.[field]))
    .filter((v) => Number.isFinite(v));
  if (vals.length < 2) return { arah: null, panjang: 0 };
  let arahTerakhir = null;
  let jumlah = 0;
  for (let i = vals.length - 1; i > 0; i--) {
    const d = vals[i] - vals[i - 1];
    const a = d <= -eps ? "turun" : d >= eps ? "naik" : "tetap";
    if (!arahTerakhir) {
      arahTerakhir = a;
      jumlah = 1;
      continue;
    }
    if (a === arahTerakhir) jumlah++;
    else break;
  }
  return { arah: arahTerakhir, panjang: jumlah + 1 };
};

/* ---------- Klasifikasi status (sama acuan dgn CardPerkembangan) ---------- */
const klasifTBU = (s = "") => {
  const t = s.toLowerCase();
  if (/sangat pendek/.test(t)) return { key: "stunting", level: "berat" };
  if (/pendek/.test(t)) return { key: "stunting", level: "sedang" };
  if (/tinggi/.test(t)) return { key: "tinggi", level: "aman" };
  return { key: "normal", level: "normal" };
};
const klasifBBTB = (s = "") => {
  const t = s.toLowerCase();
  if (/(gizi buruk|buruk)/.test(t)) return { key: "wasting", level: "berat" };
  if (/(gizi kurang|kurus|kurang)/.test(t))
    return { key: "wasting", level: "sedang" };
  if (/(obes)/.test(t)) return { key: "obesitas", level: "berat" };
  if (/(risiko|resiko|berisiko)/.test(t))
    return { key: "lebih", level: "risiko" };
  if (/(gizi lebih|overweight|lebih)/.test(t))
    return { key: "lebih", level: "sedang" };
  return { key: "normal", level: "normal" };
};

const FRASA = {
  stunting: {
    berat:
      "tinggi badannya jauh tertinggal dari anak seusianya akibat kekurangan gizi yang berlangsung lama (stunting)",
    sedang:
      "tinggi badannya mulai tertinggal dari anak seusianya (berisiko stunting)",
  },
  wasting: {
    berat:
      "tubuhnya terlalu kurus dibanding tinggi badannya dan perlu penanganan segera (gizi buruk)",
    sedang:
      "tubuhnya mulai terlalu kurus dibanding tinggi badannya (gizi kurang)",
  },
  obesitas: {
    berat: "berat badannya jauh berlebih dibanding tinggi badannya (obesitas)",
  },
  lebih: {
    risiko: "berat badannya mulai berisiko berlebih dibanding tinggi badannya",
    sedang: "berat badannya berlebih dibanding tinggi badannya (gizi lebih)",
  },
};
const DAMPAK = {
  stunting:
    "Bila dibiarkan, stunting dapat menghambat perkembangan otak dan kemampuan belajar anak, menurunkan daya tahan tubuh, serta memengaruhi produktivitasnya saat dewasa.",
  wasting:
    "Tubuh yang terlalu kurus meningkatkan risiko infeksi dan, bila terlambat ditangani, dapat mengganggu pertumbuhan serta keselamatan anak.",
  lebih:
    "Kelebihan berat badan yang dibiarkan dapat berkembang menjadi obesitas serta meningkatkan risiko tekanan darah tinggi dan gangguan metabolik saat anak tumbuh besar.",
};

/* Padanan praktis makro per kelompok umur — cadangan bila backend belum kirim. */
const PADANAN_GIZI = {
  "6 - 11 bulan": {
    Energi: "ASI tetap diberikan + MPASI 2-3 kali sehari dan 1-2 kali selingan",
    Protein:
      "kira-kira 1 butir telur + 1 potong kecil ikan/ayam yang dilumatkan, ditambah ASI",
    Lemak:
      "sebagian besar dari ASI; tambahkan sekitar 1 sdt minyak/santan ke MPASI",
    Karbohidrat: "bubur/nasi tim sekitar 1/2 - 3/4 mangkuk kecil tiap makan",
    Serat: "sayur lembut 2-3 sdm tiap makan + buah lumat 1-2 kali sehari",
    Air: "sebagian besar dari ASI; air putih sekitar 1/2 gelas kecil sehari",
  },
  "1 - 3 tahun": {
    Energi: "3 kali makan utama + 2 kali selingan sehat",
    Protein:
      "kira-kira 1 butir telur + 1 potong kecil ikan/ayam + 1 potong tempe/tahu",
    Lemak: "sekitar 2-3 sdt minyak untuk memasak + lemak alami dari lauk",
    Karbohidrat: "nasi 3 porsi kecil sehari, boleh diganti ubi/kentang/roti",
    Serat: "sayur sekitar 1,5 gelas + buah 2-3 potong kecil sehari",
    Air: "sekitar 5 gelas kecil (200 ml) sehari",
  },
  "4 - 6 tahun": {
    Energi: "3 kali makan utama + 2 kali selingan sehat",
    Protein:
      "kira-kira 1 butir telur + 1 potong ikan/ayam + 2 potong tempe/tahu",
    Lemak: "sekitar 3 sdt minyak untuk memasak + lemak alami dari lauk",
    Karbohidrat: "nasi 3-4 porsi sehari, boleh diganti ubi/kentang/mi/roti",
    Serat: "sayur sekitar 2 gelas + buah 3 potong sehari",
    Air: "sekitar 6 gelas (240 ml) sehari",
  },
};
const PADANAN_TAB_VITAMIN = [
  "Vitamin A",
  "Vitamin C",
  "Folat",
  "Kalsium & Vitamin D",
  "Vitamin & Mineral",
];
const PADANAN_TAB_MINERAL = [
  "Zat Besi",
  "Seng",
  "Iodium",
  "Kalsium & Vitamin D",
  "Vitamin & Mineral",
];

/* Tingkat kewaspadaan (tier dari controller) — warna + kata sederhana. */
const TIER_STYLE = {
  0: {
    wrap: "bg-emerald-50 ring-emerald-100",
    badge: "bg-emerald-100 text-emerald-700",
  },
  1: {
    wrap: "bg-amber-50 ring-amber-100",
    badge: "bg-amber-100 text-amber-800",
  },
  2: {
    wrap: "bg-orange-50 ring-orange-100",
    badge: "bg-orange-100 text-orange-800",
  },
  3: { wrap: "bg-red-50 ring-red-100", badge: "bg-red-100 text-red-700" },
};
const TIER_LABEL = {
  0: "Aman",
  1: "Perlu diperhatikan",
  2: "Perlu tindakan",
  3: "Perlu segera ditangani",
};

const fmtNilai = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? `${+n.toFixed(3)}` : null;
};
const buatDaftarNilai = (defs) =>
  defs
    .map(([label, v, unit]) => {
      const n = fmtNilai(v);
      return n === null ? null : { label, nilai: `${n} ${unit}` };
    })
    .filter(Boolean);

function Reveal({ show, delay = 0, className = "", children }) {
  return (
    <div
      className={`transition-all duration-500 ease-out ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function DaftarRekomendasi({ items, tone = "emerald" }) {
  const dot =
    tone === "amber"
      ? "bg-amber-500"
      : tone === "red"
        ? "bg-red-500"
        : "bg-emerald-500";
  return (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-3 text-[13.5px] leading-relaxed text-gray-700"
        >
          <span
            className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${dot}`}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function GridNilai({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl bg-gray-50 px-3 py-2">
          <p className="text-[10.5px] uppercase tracking-wide text-gray-400">
            {it.label}
          </p>
          <p className="text-[13px] font-bold text-gray-800">{it.nilai}</p>
        </div>
      ))}
    </div>
  );
}

export default function CardKeteranganRekomendasi({ data, riwayat, gizi }) {
  const tinggi = data?.tinggi_badan || {};
  const berat = data?.berat_badan || {};
  const nama = data?.balita?.nama || data?.name || "Anak";

  gizi = gizi || data?.kebutuhanGizi || data?.kebutuhan_gizi || null;

  const [mounted, setMounted] = useState(false);
  const [tabKanan, setTabKanan] = useState(0); // 0 = Yang dilakukan, 1 = Kebutuhan gizi
  const [tabGizi, setTabGizi] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  // ===== STATUS (membaca perkembangan; fallback ke field lama) =====
  const sTBU = (tinggi.status_gizi || data?.statusTBU || "").trim();
  const sBBTB = (berat.status_gizi || data?.statusBBTB || "").trim();
  const cTBU = klasifTBU(sTBU);
  const cBBTB = klasifBBTB(sBBTB);

  const indikator = [];
  if (cTBU.key === "stunting")
    indikator.push({
      key: "stunting",
      singkat: "Tinggi badan (stunting)",
      level: cTBU.level,
      frasa: FRASA.stunting[cTBU.level],
      dampak: data?.dampakStunting || DAMPAK.stunting,
    });
  if (cBBTB.key === "wasting")
    indikator.push({
      key: "wasting",
      singkat: "Keseimbangan gizi (wasting)",
      level: cBBTB.level,
      frasa: FRASA.wasting[cBBTB.level],
      dampak: data?.dampakWasting || DAMPAK.wasting,
    });
  if (cBBTB.key === "obesitas")
    indikator.push({
      key: "obesitas",
      singkat: "Berat badan (obesitas)",
      level: "berat",
      frasa: FRASA.obesitas.berat,
      dampak: DAMPAK.lebih,
    });
  else if (cBBTB.key === "lebih")
    indikator.push({
      key: "lebih",
      singkat: "Berat badan (gizi lebih)",
      level: cBBTB.level,
      frasa: FRASA.lebih[cBBTB.level],
      dampak: DAMPAK.lebih,
    });

  const adaMasalah = indikator.length > 0;
  const banyakMasalah = indikator.length > 1;
  const tinggiJangkung = cTBU.key === "tinggi";

  // Ringkasan "apa yang terjadi"
  const frasaList = indikator.map((it) => it.frasa);
  let ringkasan;
  if (frasaList.length === 0) {
    ringkasan = `Pertumbuhan ${nama} berada dalam kisaran normal sesuai standar WHO${tinggiJangkung ? ", bahkan tinggi badannya di atas rata-rata (tetap aman dan tidak perlu diturunkan)" : ""}. Pertahankan pola makan bergizi dan pemantauan rutin.`;
  } else if (frasaList.length === 1) {
    ringkasan = `Saat ini ${nama} menunjukkan satu hal yang perlu diperhatikan, yaitu ${frasaList[0]}. Sebaiknya segera mendapat perhatian agar tumbuh kembangnya tetap optimal.`;
  } else {
    const gabung =
      frasaList.slice(0, -1).join("; ") +
      "; serta " +
      frasaList[frasaList.length - 1];
    ringkasan = `Saat ini ${nama} menunjukkan ${frasaList.length} hal yang perlu diperhatikan: ${gabung}. Kondisi ini sebaiknya ditangani bersama agar tumbuh kembang anak kembali ke jalur sehat.`;
  }

  // ===== ARAH PERTUMBUHAN GABUNGAN (tinggi + berat) =====
  const pTinggi = angka(tinggi.perubahan);
  const pBerat = angka(berat.perubahan);
  const errTinggi = !!tinggi.peringatan;
  const errBerat = !!berat.peringatan;
  const arTinggi = errTinggi ? null : arahDari(pTinggi);
  const arBerat = errBerat ? null : arahDari(pBerat);

  const kalimatUkuran = (label, ar, p, unit, err) => {
    if (err) return `${label} perlu diperiksa kembali (data tidak wajar)`;
    if (ar == null) return `${label} belum dapat dinilai`;
    if (ar === "tetap") return `${label} tidak berubah`;
    return `${label} ${ar} ${abs1(p)} ${unit}`;
  };

  const riwayatTerurut = urutkanRiwayat(
    (Array.isArray(riwayat) && riwayat.length ? riwayat : data?.riwayat) || [],
  );
  const streakBerat = hitungStreak(riwayatTerurut, "berat");
  const streakTinggi = hitungStreak(riwayatTerurut, "tinggi");
  const gagal2T =
    tinggi.gagal_berturut === true || berat.gagal_berturut === true;

  // tone & judul blok arah
  let arahTone = "emerald";
  let arahJudul = "Arah pertumbuhan bulan ini";
  const keduaNaik = arTinggi === "naik" && arBerat === "naik";
  const adaTurun = arTinggi === "turun" || arBerat === "turun";
  const adaStagnan = arTinggi === "tetap" || arBerat === "tetap";
  if (gagal2T || adaTurun) {
    arahTone = "red";
    arahJudul = "Arah pertumbuhan perlu perhatian";
  } else if (adaStagnan) {
    arahTone = "amber";
    arahJudul = "Sebagian pertumbuhan stagnan";
  } else if (keduaNaik) {
    arahJudul = "Pertumbuhan positif";
  }

  let arahKalimat = `Pada penimbangan bulan ini, ${kalimatUkuran("tinggi badan", arTinggi, pTinggi, "cm", errTinggi)} dan ${kalimatUkuran("berat badan", arBerat, pBerat, "kg", errBerat)}.`;
  if (keduaNaik)
    arahKalimat +=
      " Keduanya bergerak naik — pertumbuhan menunjukkan arah yang baik.";
  else if (arTinggi === "turun" && arBerat === "turun")
    arahKalimat += " Keduanya menurun — perlu segera diperhatikan.";
  else if (adaTurun)
    arahKalimat += " Ada ukuran yang menurun sehingga perlu perhatian.";
  else if (adaStagnan)
    arahKalimat += " Ada ukuran yang tidak bertambah pada periode ini.";

  // berturut (streak) — tampil bila ≥ 3 pengukuran searah
  const berturut = [];
  if (streakTinggi.arah && streakTinggi.panjang >= 3)
    berturut.push(
      `Tinggi badan ${streakTinggi.arah === "naik" ? "naik" : streakTinggi.arah === "turun" ? "menurun" : "tidak berubah"} ${streakTinggi.panjang} kali pengukuran berturut-turut.`,
    );
  if (streakBerat.arah && streakBerat.panjang >= 3)
    berturut.push(
      `Berat badan ${streakBerat.arah === "naik" ? "naik" : streakBerat.arah === "turun" ? "menurun" : "tidak berubah"} ${streakBerat.panjang} kali penimbangan berturut-turut.`,
    );
  if (gagal2T)
    berturut.push(
      "Pertumbuhan belum mencapai target 2 bulan berturut-turut (tanda 2T) — perlu pemeriksaan lanjutan.",
    );

  // ===== KONDISI per ukuran: STATUS GIZI + TREN (naik/stagnan/turun) =====
  const beratPosisiAtas = cBBTB.key === "obesitas" || cBBTB.key === "lebih";
  const beratHarusNaik = !beratPosisiAtas;

  const beratTurun = !errBerat && arBerat === "turun" && beratHarusNaik;
  const beratStagnan = !errBerat && arBerat === "tetap" && beratHarusNaik;
  const beratKurangNaik =
    !errBerat &&
    arBerat === "naik" &&
    berat.memenuhi_standar === false &&
    beratHarusNaik;
  const tinggiStagnan =
    !errTinggi && arTinggi === "tetap" && cTBU.key !== "stunting";
  const tinggiKurangNaik =
    !errTinggi &&
    arTinggi === "naik" &&
    tinggi.memenuhi_standar === false &&
    cTBU.key !== "stunting";

  const optimal =
    !adaMasalah &&
    !gagal2T &&
    !beratTurun &&
    !beratStagnan &&
    !beratKurangNaik &&
    !tinggiStagnan &&
    !tinggiKurangNaik;

  // ===== ALASAN — status gizi diutamakan; bila normal, TREN yang dipakai =====
  const alasan = [];
  if (cTBU.key === "stunting")
    alasan.push({
      teks:
        cTBU.level === "berat"
          ? "tinggi badan anak masih sangat pendek untuk usianya (stunting berat)"
          : "tinggi badan anak mulai pendek untuk usianya",
      sev: cTBU.level === "berat" ? 3 : 2,
    });
  else if (tinggiStagnan)
    alasan.push({
      teks: "tinggi badan anak belum bertambah pada bulan ini",
      sev: 1,
    });
  else if (tinggiKurangNaik)
    alasan.push({
      teks: "pertambahan tinggi badan belum mencapai target bulan ini",
      sev: 1,
    });

  if (cBBTB.key === "wasting")
    alasan.push({
      teks:
        cBBTB.level === "berat"
          ? "tubuh anak sangat kurus dibanding tingginya (gizi buruk)"
          : "tubuh anak mulai kurus dibanding tingginya (gizi kurang)",
      sev: cBBTB.level === "berat" ? 3 : 2,
    });
  else if (cBBTB.key === "obesitas")
    alasan.push({
      teks: "berat anak jauh berlebih dibanding tingginya (obesitas)",
      sev: 3,
    });
  else if (cBBTB.key === "lebih")
    alasan.push({
      teks:
        cBBTB.level === "sedang"
          ? "berat anak berlebih dibanding tingginya"
          : "berat anak mulai berisiko berlebih dibanding tingginya",
      sev: cBBTB.level === "sedang" ? 2 : 1,
    });
  else if (beratTurun)
    alasan.push({
      teks: "berat badan anak menurun dibanding bulan lalu",
      sev: 2,
    });
  else if (beratStagnan)
    alasan.push({
      teks: "berat badan anak belum bertambah pada bulan ini",
      sev: 1,
    });
  else if (beratKurangNaik)
    alasan.push({
      teks: "kenaikan berat badan belum mencapai target bulan ini",
      sev: 1,
    });

  if (gagal2T)
    alasan.push({
      teks: "pertumbuhan belum mencapai target 2 bulan berturut-turut",
      sev: 3,
    });

  const tingkatNum = alasan.reduce((m, a) => Math.max(m, a.sev), 0);
  const adaErrorData = errTinggi || errBerat;
  const FASE = {
    1: "kondisinya perlu diperhatikan",
    2: "anak perlu tindakan perbaikan",
    3: "anak perlu perhatian dan penanganan khusus",
  };
  const tierStyle = TIER_STYLE[tingkatNum] ?? TIER_STYLE[0];
  const tierLabel = TIER_LABEL[tingkatNum] ?? "Aman";
  const bannerPembuka =
    tingkatNum === 0
      ? `Pertumbuhan ${nama} berjalan baik dan berada di jalur yang sehat.`
      : alasan.length === 1
        ? `Karena ${alasan[0].teks}, ${FASE[tingkatNum]}.`
        : null;

  // ===== REKOMENDASI berbentuk POIN (minimal 4) — mengacu pada PNPK Tata
  //       Laksana Stunting (Kepmenkes HK.01.07/MENKES/1928/2022). Fokus pada
  //       peran posyandu: pemantauan, edukasi gizi (utamakan protein hewani),
  //       dan rujukan ke FKTP bila terindikasi. =====
  const poin = [];

  // 1) Pemeriksaan / rujukan — prioritas sesuai tingkat perhatian
  if (tingkatNum === 3)
    poin.push(
      `Segera periksakan ${nama} ke Posyandu atau Puskesmas (FKTP) untuk konfirmasi pengukuran dan penanganan oleh tenaga kesehatan; bila perlu, anak akan dirujuk ke dokter spesialis anak.`,
    );
  else if (tingkatNum === 2)
    poin.push(
      `Periksakan ${nama} ke Posyandu/Puskesmas (FKTP) untuk pemeriksaan lanjutan dan penelusuran penyebabnya.`,
    );
  else if (tingkatNum === 1)
    poin.push(
      `Pantau kembali pada penimbangan bulan depan di Posyandu; bila belum membaik, periksakan ${nama} ke Puskesmas.`,
    );
  else
    poin.push(
      optimal
        ? `Pertumbuhan ${nama} sehat dan optimal — lanjutkan pemberian makanan beragam dan seimbang setiap hari dengan protein hewani sebagai sumber utama.`
        : `Pertahankan pola makan bergizi ${nama} dan pantau kembali perkembangannya pada penimbangan berikutnya di Posyandu.`,
    );

  // 2) Tindakan gizi sesuai kondisi anak
  if (cTBU.key === "stunting" || tinggiStagnan || tinggiKurangNaik)
    poin.push(
      "Berikan makanan tinggi protein hewani setiap hari — telur, ikan, ayam, daging, atau susu dan olahannya — karena protein hewani terbukti membantu pertambahan tinggi badan.",
    );
  if (cBBTB.key === "wasting")
    poin.push(
      "Berikan makanan padat energi dengan lauk berprotein dalam porsi kecil namun lebih sering agar berat badan anak bertambah.",
    );
  else if (beratTurun || beratStagnan || beratKurangNaik)
    poin.push(
      "Tambah porsi dan frekuensi makan dengan lauk berprotein hewani agar kenaikan berat badan kembali mencapai target.",
    );
  if (beratPosisiAtas)
    poin.push(
      "Batasi gula, gorengan, dan makanan/minuman kemasan, perbanyak sayur dan buah, serta ajak anak aktif bergerak setiap hari.",
    );

  // 3) Pencegahan & edukasi umum (selalu, sesuai pencegahan primer PNPK)
  poin.push(
    "Lanjutkan ASI sesuai usia; untuk usia 6 bulan ke atas lengkapi dengan MPASI bergizi yang mengutamakan protein hewani.",
  );
  poin.push(
    "Lengkapi imunisasi sesuai usia serta jaga kebersihan diri dan lingkungan untuk mencegah infeksi berulang seperti diare.",
  );

  // 4) Stimulasi & istirahat (penting pada stunting)
  if (cTBU.key === "stunting")
    poin.push(
      "Berikan stimulasi tumbuh kembang sesuai usia dan pastikan anak cukup tidur untuk mendukung pertumbuhannya.",
    );

  // 5) Pemantauan rutin (selalu) — deteksi dini weight faltering
  poin.push(
    `Timbang dan ukur ${nama} setiap bulan di Posyandu untuk memantau pertumbuhan dan mendeteksi dini bila berat badan tidak naik.`,
  );

  // Hilangkan duplikat & pastikan minimal 4 poin
  const poinFinal = [...new Set(poin)];
  const poinTone =
    tingkatNum >= 2 ? "red" : tingkatNum === 1 ? "amber" : "emerald";

  // ===== KEBUTUHAN GIZI HARIAN (AKG) =====
  const padananKelompok =
    gizi?.padanan || (gizi && PADANAN_GIZI[gizi.kelompok_umur]) || {};
  const adaASI = Object.values(padananKelompok).some((v) =>
    /asi/i.test(String(v)),
  );
  const adaKurang = indikator.some((it) =>
    ["stunting", "wasting"].includes(it.key),
  );
  const adaLebih = beratPosisiAtas;

  const rekomendasiAKG = [];
  if (gizi) {
    if (gizi.catatan && /asi eksklusif/i.test(gizi.catatan)) {
      // ditangani di catatan
    } else if (adaKurang) {
      rekomendasiAKG.push(
        `Penuhi kebutuhan gizi harian usia ${gizi.kelompok_umur}: energi ±${gizi.energi_kkal} kkal dan protein ${gizi.protein_g} g per hari, utamakan protein hewani (Permenkes 28/2019).`,
      );
    } else if (adaLebih) {
      rekomendasiAKG.push(
        `Jaga asupan harian agar tidak melampaui kebutuhan usianya (${gizi.kelompok_umur}, sekitar ${gizi.energi_kkal} kkal/hari); batasi gula dan makanan ringan kemasan (Permenkes 28/2019).`,
      );
    }
  }

  const ringkasAKG = gizi
    ? [
        { label: "Energi", nilai: `${gizi.energi_kkal} kkal` },
        { label: "Protein", nilai: `${gizi.protein_g} g` },
        { label: "Lemak", nilai: `${gizi.lemak_g} g` },
        { label: "Karbohidrat", nilai: `${gizi.karbohidrat_g} g` },
        { label: "Serat", nilai: `${gizi.serat_g} g` },
        { label: "Air", nilai: `${gizi.air_ml} ml` },
      ].map((z) => ({ ...z, padanan: padananKelompok[z.label] || null }))
    : [];

  const vitaminItems = gizi
    ? buatDaftarNilai([
        ["Vitamin A", gizi.vit_a_re, "RE"],
        ["Vitamin D", gizi.vit_d_mcg, "mcg"],
        ["Vitamin E", gizi.vit_e_mcg, "mcg"],
        ["Vitamin K", gizi.vit_k_mcg, "mcg"],
        ["Vitamin C", gizi.vit_c_mg, "mg"],
        ["Vitamin B1", gizi.vit_b1_mg, "mg"],
        ["Vitamin B2", gizi.vit_b2_mg, "mg"],
        ["Vitamin B3", gizi.vit_b3_mg, "mg"],
        ["Vitamin B6", gizi.vit_b6_mg, "mg"],
        ["Vitamin B12", gizi.vit_b12_mcg, "mcg"],
        ["Folat", gizi.folat_mcg, "mcg"],
        ["Kolin", gizi.kolin_mg, "mg"],
      ])
    : [];
  const mineralItems = gizi
    ? buatDaftarNilai([
        ["Kalsium", gizi.kalsium_mg, "mg"],
        ["Fosfor", gizi.fosfor_mg, "mg"],
        ["Magnesium", gizi.magnesium_mg, "mg"],
        ["Zat Besi", gizi.besi_mg, "mg"],
        ["Iodium", gizi.iodium_mcg, "mcg"],
        ["Seng", gizi.seng_mg, "mg"],
        ["Selenium", gizi.selenium_mcg, "mcg"],
        ["Kalium", gizi.kalium_mg, "mg"],
        ["Natrium", gizi.natrium_mg, "mg"],
        ["Tembaga", gizi.tembaga_mcg, "mcg"],
      ])
    : [];
  const adaMikro = vitaminItems.length > 0 || mineralItems.length > 0;
  const padananUntuk = (keys) =>
    keys
      .filter((k) => padananKelompok[k])
      .map((k) => ({ label: k, teks: padananKelompok[k] }));
  const TAB_GIZI = ["Gizi utama", "Vitamin", "Mineral"];

  const SlideMakro = (
    <DaftarRekomendasi
      items={ringkasAKG.map((z) => (
        <span key={z.label}>
          <span className="font-semibold text-gray-800">
            {z.label} {z.nilai}
          </span>
          {z.padanan && <span className="text-gray-600"> = {z.padanan}</span>}
        </span>
      ))}
      tone="emerald"
    />
  );
  const SlideMikro = (items, padananList) => (
    <div className="space-y-3">
      <GridNilai items={items} />
      {padananList.length > 0 && (
        <DaftarRekomendasi
          items={padananList.map((p) => (
            <span key={p.label}>
              <span className="font-semibold text-gray-800">{p.label}</span>
              <span className="text-gray-600"> ≈ {p.teks}</span>
            </span>
          ))}
          tone="emerald"
        />
      )}
    </div>
  );

  const arahWrap =
    arahTone === "red"
      ? "bg-red-50 border-red-100"
      : arahTone === "amber"
        ? "bg-amber-50 border-amber-100"
        : "bg-emerald-50 border-emerald-100";
  const arahTitle =
    arahTone === "red"
      ? "text-red-800"
      : arahTone === "amber"
        ? "text-amber-800"
        : "text-emerald-800";

  return (
    <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-2">
      {/* ====== KIRI: KETERANGAN KONDISI ====== */}
      <Reveal show={mounted} delay={0}>
        <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-emerald-500" />
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
              Keterangan kondisi
            </h3>
          </div>
          {/* ARAH PERTUMBUHAN GABUNGAN */}
          <div className={`rounded-2xl border mt-5 px-4 py-3 ${arahWrap}`}>
            <h4 className={`text-sm font-bold ${arahTitle}`}>{arahJudul}</h4>
            <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
              {arahKalimat}
            </p>
            {berturut.length > 0 && (
              <ul className="mt-2 space-y-1">
                {berturut.map((b, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-[12px] leading-relaxed text-gray-600"
                  >
                    <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-5 space-y-4">
            {/* APA YANG TERJADI */}
            <div className="rounded-2xl bg-gray-50 p-4">
              <h4 className="text-sm font-bold text-emerald-700">
                Apa yang terjadi?
              </h4>
              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                {ringkasan}
              </p>
            </div>

            {/* DAMPAK */}
            <div className="rounded-2xl bg-gray-50 p-4">
              <h4 className="text-sm font-bold text-emerald-700">
                Dampak jangka panjang
              </h4>
              {adaMasalah ? (
                <div className="mt-2 space-y-2.5">
                  {banyakMasalah && (
                    <p className="text-[13px] leading-relaxed text-gray-600">
                      Bila tidak segera ditangani, kondisi ini berisiko saling
                      menumpuk:
                    </p>
                  )}
                  {indikator.map((it) => (
                    <p
                      key={it.key}
                      className="text-[13px] leading-relaxed text-gray-600"
                    >
                      {banyakMasalah && (
                        <span className="font-semibold text-gray-800">
                          {it.singkat}.{" "}
                        </span>
                      )}
                      {it.dampak}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-[13px] leading-relaxed text-gray-600">
                  Dengan asupan gizi dan pemantauan yang terjaga, anak
                  berpeluang besar tumbuh optimal sesuai potensinya.
                </p>
              )}
            </div>
          </div>

          <p className="mt-5 text-sm italic leading-relaxed text-gray-400">
            &ldquo;Pertumbuhan anak bukan lomba lari, tapi maraton yang butuh
            dukungan tepat.&rdquo;
          </p>
        </div>
      </Reveal>

      {/* ====== KANAN: REKOMENDASI ====== */}
      <Reveal show={mounted} delay={90}>
        <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-emerald-500" />
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
              Rekomendasi Tindakan
            </h3>
          </div>

          <div className="mt-5 flex-1 space-y-4">
            {/* TINGKAT PERHATIAN (selalu tampil — verdict kondisi) */}
            <div className={`rounded-2xl px-4 py-3.5 ring-1 ${tierStyle.wrap}`}>
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold ${tierStyle.badge}`}
                >
                  {tierLabel}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  Tingkat perhatian
                </span>
              </div>

              {bannerPembuka ? (
                <p className="mt-2.5 text-[13px] font-semibold leading-relaxed text-gray-700">
                  {bannerPembuka}
                </p>
              ) : (
                <div className="mt-2.5">
                  <p className="text-[12.5px] font-semibold text-gray-700">
                    Yang perlu diperhatikan:
                  </p>
                  <ul className="mt-1 space-y-1">
                    {alasan.map((a, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[12.5px] leading-relaxed text-gray-600"
                      >
                        <span className="mt-[6px] h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                        <span>{a.teks}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[12.5px] font-semibold text-gray-700">
                    Karena itu, {FASE[tingkatNum]}.
                  </p>
                </div>
              )}

              {adaErrorData && (
                <p className="mt-2 text-[11.5px] leading-relaxed text-amber-700">
                  Catatan: data pengukuran bulan ini perlu diperiksa karena
                  perubahannya tampak tidak wajar, jadi penilaian ini masih
                  sementara.
                </p>
              )}
            </div>

            {/* SLIDE: Yang dilakukan  vs  Kebutuhan gizi */}
            <div className="flex rounded-xl bg-gray-100 p-1">
              {["Yang dilakukan", "Kebutuhan gizi"].map((t, i) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTabKanan(i)}
                  className={`flex-1 rounded-lg py-1.5 text-[12px] font-semibold transition ${tabKanan === i ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* TAB 0 — YANG DILAKUKAN (poin tindakan sesuai kondisi anak) */}
            {tabKanan === 0 && (
              <div className="px-1">
                <p className="text-[11.5px] leading-relaxed text-gray-500">
                  Langkah yang sebaiknya dilakukan untuk kondisi {nama} saat
                  ini, berdasarkan hasil penimbangan dan trennya.
                </p>
                <div className="mt-2.5">
                  <DaftarRekomendasi items={poinFinal} tone={poinTone} />
                </div>
                {adaErrorData && (
                  <p className="mt-2.5 text-[11.5px] leading-relaxed text-amber-700">
                    Karena hasil pengukuran bulan ini tampak tidak wajar,
                    sebaiknya angka tersebut diperiksa atau diukur ulang lebih
                    dulu sebelum mengambil tindakan.
                  </p>
                )}
                <p className="mt-3 text-[10.5px] leading-relaxed text-gray-400">
                  Rekomendasi mengacu pada Pedoman Nasional Pelayanan Kedokteran
                  Tata Laksana Stunting (Kepmenkes RI No.
                  HK.01.07/MENKES/1928/2022) dan bersifat anjuran, bukan
                  diagnosis. Untuk pemeriksaan lebih lanjut, hubungi tenaga
                  kesehatan.
                </p>
              </div>
            )}

            {/* TAB 1 — KEBUTUHAN GIZI HARIAN (referensi sesuai usia) */}
            {tabKanan === 1 &&
              (gizi ? (
                <div className="px-1">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-[12.5px] font-semibold text-emerald-700">
                      Kebutuhan gizi harian
                    </p>
                    <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      {gizi.kelompok_umur}
                    </span>
                  </div>
                  <p className="mb-3 text-[11.5px] leading-relaxed text-gray-500">
                    Ini{" "}
                    <span className="font-semibold">
                      patokan kebutuhan harian
                    </span>{" "}
                    sesuai usia {nama} (referensi umum), bukan respons langsung
                    ke kondisi di atas. Yang penting makanannya beragam dan
                    seimbang setiap hari.
                  </p>

                  {adaASI && (
                    <div className="mb-3 rounded-xl bg-emerald-50/70 px-3 py-2 text-[11.5px] leading-relaxed text-gray-600 ring-1 ring-emerald-100">
                      Untuk usia ini,{" "}
                      <span className="font-semibold">
                        ASI tetap menjadi sumber utama
                      </span>{" "}
                      dan protein hewani diberikan sebagai bagian dari MPASI.
                      Jadi anjuran &ldquo;protein hewani&rdquo; pada tab
                      tindakan dan &ldquo;ASI&rdquo; di sini saling melengkapi,
                      bukan bertentangan.
                    </div>
                  )}

                  {rekomendasiAKG.length > 0 && (
                    <div className="mb-3">
                      <DaftarRekomendasi
                        items={rekomendasiAKG}
                        tone="emerald"
                      />
                    </div>
                  )}

                  {adaMikro ? (
                    <>
                      <div className="mb-3 flex rounded-xl bg-gray-100 p-1">
                        {TAB_GIZI.map((t, i) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTabGizi(i)}
                            className={`flex-1 rounded-lg py-1.5 text-[11px] font-semibold transition ${tabGizi === i ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <div className="overflow-hidden">
                        <div
                          className="flex items-start transition-transform duration-300 ease-out"
                          style={{
                            transform: `translateX(-${tabGizi * 100}%)`,
                          }}
                        >
                          <div className="w-full shrink-0 pr-0.5">
                            {SlideMakro}
                          </div>
                          <div className="w-full shrink-0 px-0.5">
                            {SlideMikro(
                              vitaminItems,
                              padananUntuk(PADANAN_TAB_VITAMIN),
                            )}
                          </div>
                          <div className="w-full shrink-0 pl-0.5">
                            {SlideMikro(
                              mineralItems,
                              padananUntuk(PADANAN_TAB_MINERAL),
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    SlideMakro
                  )}

                  {gizi.catatan && (
                    <p className="mt-3 rounded-xl bg-emerald-50/60 px-3 py-2 text-[11.5px] leading-relaxed text-gray-600 ring-1 ring-emerald-100/60">
                      {gizi.catatan}
                    </p>
                  )}
                  <p className="mt-2 text-[10.5px] text-gray-400">
                    Angka di atas adalah kebutuhan rata-rata per hari menurut{" "}
                    {gizi.sumber || "AKG"}. Gunakan sebagai acuan, bukan target
                    kaku. Untuk kebutuhan khusus anak, konsultasikan ke kader
                    Posyandu atau tenaga kesehatan.
                  </p>
                </div>
              ) : (
                <p className="px-1 text-sm text-gray-500">
                  Data kebutuhan gizi harian belum tersedia.
                </p>
              ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
