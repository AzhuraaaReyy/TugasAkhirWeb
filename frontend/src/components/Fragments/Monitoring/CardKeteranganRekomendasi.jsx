import React, { useState, useEffect } from "react";

const MIN_BERTURUT = 2;
const EPS_BERAT = 0.05;

const urutkanRiwayat = (riwayat = []) =>
  [...riwayat].sort((a, b) => {
    const ta = new Date(a?.tanggal).getTime();
    const tb = new Date(b?.tanggal).getTime();
    if (!isNaN(ta) && !isNaN(tb)) return ta - tb;
    return (a?.umur ?? 0) - (b?.umur ?? 0);
  });

const hitungTren = (riwayat = [], eps = EPS_BERAT) => {
  if (riwayat.length < 2) return { arah: null, panjang: 0 };

  let arahTerakhir = null;
  let jumlah = 0;

  for (let i = riwayat.length - 1; i > 0; i--) {
    const sekarang = Number(riwayat[i].berat);
    const sebelumnya = Number(riwayat[i - 1].berat);
    const delta = sekarang - sebelumnya;
    const arah = delta <= -eps ? "turun" : delta >= eps ? "naik" : "tetap";

    if (!arahTerakhir) {
      arahTerakhir = arah;
      jumlah = 1;
      continue;
    }
    if (arah === arahTerakhir) jumlah++;
    else break;
  }

  return { arah: arahTerakhir, panjang: jumlah + 1 };
};

/* Kategori hanya dipakai internal untuk dedup (agar saran yang nyaris sama
   tidak tampil berulang) — tidak ditampilkan ke layar. */
const kategoriKey = (teks = "") => {
  const t = teks.toLowerCase();
  if (/(protein|telur|ikan|ayam|hati|daging|tempe|tahu|lauk)/.test(t))
    return "protein";
  if (/(sayur|buah|vitamin|serat|zat besi)/.test(t)) return "sayur";
  if (/(stimulasi|motorik|aktivitas|merangkak|bermain|psikomotor)/.test(t))
    return "stimulasi";
  if (
    /(posyandu|puskesmas|periksa|konsultasi|tenaga kesehatan|dokter|bidan|evaluasi|spesialis)/.test(
      t,
    )
  )
    return "periksa";
  if (/(timbang|nimbang|pantau|mantau|pemantauan)/.test(t)) return "pantau";
  if (/(tidur|istirahat)/.test(t)) return "tidur";
  if (/(susu|asi|formula)/.test(t)) return "susu";
  if (
    /(sanitasi|cuci tangan|air bersih|kebersihan|jamban|sabun|imunisasi)/.test(
      t,
    )
  )
    return "sanitasi";
  if (/(energi|kalori|kkal|kebutuhan gizi|padat)/.test(t)) return "energi";
  return "umum";
};

/* Deteksi urgensi: rekomendasi dengan kata kunci di bawah dianggap "prioritas"
   (perlu dilakukan dalam waktu dekat), sisanya masuk "rutin". */
const URGEN_RX =
  /(puskesmas|rumah sakit|segera|secepatnya|dokter|ahli gizi|spesialis|rujuk|penanganan)/i;
const isPrioritas = (teks = "") => URGEN_RX.test(teks);

/* Dedup: buang teks duplikat, lalu batasi satu item per kategori. */
const dedupRekomendasi = (list = [], maks = Infinity) => {
  const seenText = new Set();
  const seenKat = new Set();
  const out = [];
  for (const r of list) {
    const txt = (r || "").trim();
    if (!txt || seenText.has(txt)) continue;
    const kat = kategoriKey(txt);
    if (seenKat.has(kat)) continue;
    seenText.add(txt);
    seenKat.add(kat);
    out.push(r);
    if (out.length >= maks) break;
  }
  return out;
};

/* Frasa bahasa awam untuk ringkasan "Apa yang terjadi?" */
const FRASA = {
  stunting: {
    berat:
      "tinggi badannya jauh tertinggal dari anak seusianya akibat kekurangan gizi yang berlangsung lama",
    sedang: "tinggi badannya mulai tertinggal dari anak seusianya",
  },
  underweight: {
    berat: "berat badannya sangat kurang untuk usianya",
    sedang: "berat badannya masih kurang untuk usianya",
  },
  wasting: {
    berat:
      "tubuhnya terlalu kurus dibanding tinggi badannya dan perlu penanganan segera",
    sedang: "tubuhnya mulai terlalu kurus dibanding tinggi badannya",
  },
  bbLebih: {
    risiko: "berat badannya mulai berisiko berlebih untuk usianya",
  },
  giziLebih: {
    risiko: "berat badannya mulai berisiko berlebih dibanding tinggi badannya",
    sedang: "berat badannya berlebih dibanding tinggi badannya",
    berat: "berat badannya jauh berlebih dibanding tinggi badannya (obesitas)",
  },
};

/* Padanan praktis (ukuran rumah tangga) untuk zat gizi makro, per kelompok
   umur — CADANGAN bila backend belum mengirim kolom akg_balitas.padanan. */
const PADANAN_GIZI = {
  "6 - 11 bulan": {
    Energi: "ASI tetap diberikan + MPASI 2-3 kali sehari dan 1-2 kali selingan",
    Protein:
      "kira-kira 1 butir telur + 1 potong kecil ikan/ayam yang dilumatkan, ditambah ASI",
    Lemak:
      "sebagian besar dari ASI; tambahkan sekitar 1 sdt minyak/santan ke MPASI setiap masak",
    Karbohidrat:
      "bubur atau nasi tim sekitar 1/2 - 3/4 mangkuk kecil (250 ml) setiap kali makan",
    Serat:
      "sayur lembut 2-3 sdm tiap makan + buah lumat (pisang/pepaya) 1-2 kali sehari",
    Air: "sebagian besar dari ASI; air putih sekitar 1/2 gelas kecil sehari",
  },
  "1 - 3 tahun": {
    Energi: "3 kali makan utama + 2 kali selingan sehat",
    Protein:
      "kira-kira 1 butir telur + 1 potong kecil ikan/ayam + 1 potong tempe/tahu",
    Lemak:
      "sekitar 2-3 sdt minyak untuk memasak + lemak alami dari lauk dan santan secukupnya",
    Karbohidrat:
      "nasi sekitar 3 porsi kecil sehari (1 porsi = 3/4 gelas), boleh diganti ubi/kentang/roti",
    Serat: "sayur sekitar 1,5 gelas + buah 2-3 potong kecil sehari",
    Air: "sekitar 5 gelas kecil (200 ml) sehari",
  },
  "4 - 6 tahun": {
    Energi: "3 kali makan utama + 2 kali selingan sehat",
    Protein:
      "kira-kira 1 butir telur + 1 potong ikan/ayam + 2 potong tempe/tahu, atau ditambah 1 gelas susu",
    Lemak: "sekitar 3 sdt minyak untuk memasak + lemak alami dari lauk",
    Karbohidrat:
      "nasi 3-4 porsi sehari (1 porsi = 3/4 gelas), boleh diganti ubi/kentang/mi/roti",
    Serat: "sayur sekitar 2 gelas + buah 3 potong sehari",
    Air: "sekitar 6 gelas (240 ml) sehari",
  },
};

/* Padanan mikronutrien mana yang relevan ditampilkan per tab */
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

/* Dampak cadangan, dipakai HANYA bila kolom DB dampak_* kosong */
const DAMPAK_DEFAULT = {
  stunting:
    "Bila dibiarkan, stunting dapat menghambat perkembangan otak dan kemampuan belajar anak, menurunkan daya tahan tubuh, serta memengaruhi produktivitasnya saat dewasa.",
  underweight:
    "Berat badan yang terus tertinggal membuat anak lebih mudah sakit dan lemas, serta memperlambat tumbuh kembangnya bila tidak segera diperbaiki.",
  wasting:
    "Kondisi ini meningkatkan risiko infeksi dan, bila terlambat ditangani, dapat mengganggu pertumbuhan serta keselamatan anak.",
  lebih:
    "Kelebihan berat badan yang dibiarkan dapat berkembang menjadi obesitas serta meningkatkan risiko gangguan kesehatan seperti tekanan darah tinggi dan masalah metabolik saat anak tumbuh besar.",
};

function Reveal({ show, delay = 0, className = "", children }) {
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* Daftar rekomendasi sederhana: penanda titik kecil + teks, tanpa icon. */
function DaftarRekomendasi({ items, tone = "emerald" }) {
  const dot = tone === "amber" ? "bg-amber-500" : "bg-emerald-500";
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

/* Grid angka ringkas untuk vitamin/mineral (2 kolom) */
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

/* Angka dari DB bisa berupa string desimal ("0.30") -> rapikan */
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

export default function CardKeteranganRekomendasi({ data, riwayat, gizi }) {
  const nama = data?.name || "Anak";

  // Sumber AKG fleksibel: prop `gizi` (endpoint perkembangan) ATAU
  // field kebutuhan_gizi dari endpoint detailmonitoring (lewat `data`).
  gizi = gizi || data?.kebutuhanGizi || data?.kebutuhan_gizi || null;

  const [mounted, setMounted] = useState(false);
  const [tabGizi, setTabGizi] = useState(0); // 0=Gizi utama, 1=Vitamin, 2=Mineral
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 40);
    return () => clearTimeout(t);
  }, []);

  const riwayatFinal =
    (Array.isArray(riwayat) && riwayat.length ? riwayat : data?.riwayat) || [];

  // ===== KLASIFIKASI SETIAP INDIKATOR (mengikuti data status) =====
  const tbu = (data?.statusTBU || "").toLowerCase();
  const bbu = (data?.statusBBU || "").toLowerCase();
  const bbtb = (data?.statusBBTB || "").toLowerCase();

  const indikatorMasalah = [];

  // Tinggi badan (TB/U)
  if (tbu.includes("sangat pendek"))
    indikatorMasalah.push({
      key: "stunting",
      singkat: "Tinggi badan (Stunting)",
      frasa: FRASA.stunting.berat,
      dampak: data?.dampakStunting || DAMPAK_DEFAULT.stunting,
    });
  else if (tbu.includes("pendek"))
    indikatorMasalah.push({
      key: "stunting",
      singkat: "Tinggi badan (Stunting)",
      frasa: FRASA.stunting.sedang,
      dampak: data?.dampakStunting || DAMPAK_DEFAULT.stunting,
    });

  // Berat badan menurut umur (BB/U)
  if (bbu.includes("sangat kurang"))
    indikatorMasalah.push({
      key: "underweight",
      singkat: "Berat badan (UnderWeight)",
      frasa: FRASA.underweight.berat,
      dampak: data?.dampakUnderweight || DAMPAK_DEFAULT.underweight,
    });
  else if (bbu.includes("kurang"))
    indikatorMasalah.push({
      key: "underweight",
      singkat: "Berat badan (UnderWeight)",
      frasa: FRASA.underweight.sedang,
      dampak: data?.dampakUnderweight || DAMPAK_DEFAULT.underweight,
    });
  else if (bbu.includes("lebih"))
    indikatorMasalah.push({
      key: "bbu_lebih",
      singkat: "Berat badan (UnderWeight)",
      frasa: FRASA.bbLebih.risiko,
      dampak: DAMPAK_DEFAULT.lebih,
    });

  // Berat badan menurut tinggi (BB/TB)
  if (bbtb.includes("gizi buruk"))
    indikatorMasalah.push({
      key: "wasting",
      singkat: "Keseimbangan gizi (Wasting)",
      frasa: FRASA.wasting.berat,
      dampak: data?.dampakWasting || DAMPAK_DEFAULT.wasting,
    });
  else if (bbtb.includes("gizi kurang"))
    indikatorMasalah.push({
      key: "wasting",
      singkat: "Keseimbangan gizi (Wasting)",
      frasa: FRASA.wasting.sedang,
      dampak: data?.dampakWasting || DAMPAK_DEFAULT.wasting,
    });
  else if (bbtb.includes("obesitas") || bbtb.includes("obese"))
    indikatorMasalah.push({
      key: "obesitas",
      singkat: "Keseimbangan gizi (Wasting)",
      frasa: FRASA.giziLebih.berat,
      dampak: DAMPAK_DEFAULT.lebih,
    });
  else if (bbtb.includes("berisiko"))
    indikatorMasalah.push({
      key: "risiko_lebih",
      singkat: "Keseimbangan gizi (Wasting)",
      frasa: FRASA.giziLebih.risiko,
      dampak: DAMPAK_DEFAULT.lebih,
    });
  else if (bbtb.includes("gizi lebih") || bbtb.includes("overweight"))
    indikatorMasalah.push({
      key: "gizi_lebih",
      singkat: "Keseimbangan gizi (Wasting)",
      frasa: FRASA.giziLebih.sedang,
      dampak: DAMPAK_DEFAULT.lebih,
    });

  const adaMasalah = indikatorMasalah.length > 0;
  const banyakMasalah = indikatorMasalah.length > 1;

  // Ringkasan bahasa awam
  const frasaMasalah = indikatorMasalah.map((it) => it.frasa);
  let ringkasan;
  if (frasaMasalah.length === 0) {
    ringkasan = `Pertumbuhan ${nama} berada dalam kisaran normal sesuai standar WHO. Tetap pertahankan pola makan bergizi dan pemantauan rutin agar tumbuh kembangnya terjaga.`;
  } else if (frasaMasalah.length === 1) {
    ringkasan = `Saat ini ${nama} menunjukkan satu hal yang perlu diperhatikan, yaitu ${frasaMasalah[0]}. Kondisi ini sebaiknya segera mendapat perhatian agar tumbuh kembang anak tetap optimal.`;
  } else {
    const gabung =
      frasaMasalah.length === 2
        ? `${frasaMasalah[0]}; serta ${frasaMasalah[1]}`
        : frasaMasalah.slice(0, -1).join("; ") +
          "; serta " +
          frasaMasalah[frasaMasalah.length - 1];
    ringkasan = `Saat ini ${nama} menunjukkan ${frasaMasalah.length} hal yang perlu diperhatikan: ${gabung}. Kondisi-kondisi ini sebaiknya ditangani bersama agar tumbuh kembang anak kembali ke jalur yang sehat.`;
  }

  // ===== TREN PENIMBANGAN =====
  const riwayatTerurut = urutkanRiwayat(riwayatFinal);
  const trenBerat = hitungTren(riwayatTerurut);

  const TREN_INFO = {
    turun: {
      wrap: "bg-red-50 border-red-100",
      titleColor: "text-red-800",
      title: "Berat badan menurun berturut-turut",
      desc: `${nama} mengalami penurunan berat badan selama ${trenBerat.panjang} kali penimbangan berturut-turut. Perlu segera diperiksakan.`,
    },
    tetap: {
      wrap: "bg-amber-50 border-amber-100",
      titleColor: "text-amber-800",
      title: "Pertumbuhan stagnan",
      desc: `${nama} tidak menunjukkan kenaikan berat badan selama ${trenBerat.panjang} kali penimbangan berturut-turut. Evaluasi pola makan dianjurkan.`,
    },
    naik: {
      wrap: "bg-emerald-50 border-emerald-100",
      titleColor: "text-emerald-800",
      title: "Pertumbuhan positif",
      desc: `${nama} menunjukkan kenaikan berat badan selama ${trenBerat.panjang} kali penimbangan berturut-turut. Pertahankan pola makan dan pemantauan rutin.`,
    },
  };
  const trenConfig = trenBerat.arah ? TREN_INFO[trenBerat.arah] : null;
  const adaPeringatanTren = trenConfig && trenBerat.panjang >= MIN_BERTURUT;

  const perluPerbaikan =
    adaPeringatanTren &&
    (trenBerat.arah === "turun" || trenBerat.arah === "tetap");

  const rekomendasiTren = perluPerbaikan
    ? [
        "Periksakan anak ke Posyandu/Puskesmas untuk evaluasi penyebab berat badan tidak naik.",
        "Tingkatkan pemberian makanan bergizi seimbang dan padat energi sesuai usia anak.",
        "Lakukan penimbangan rutin setiap bulan untuk memantau tren pertumbuhan.",
      ]
    : [];

  // ===== REKOMENDASI GIZI SESUAI UMUR (Permenkes 28/2019) =====
  const adaKurangGizi = indikatorMasalah.some((it) =>
    ["stunting", "underweight", "wasting"].includes(it.key),
  );
  const adaLebihGizi = indikatorMasalah.some((it) =>
    ["obesitas", "gizi_lebih", "risiko_lebih", "bbu_lebih"].includes(it.key),
  );

  const rekomendasiAKG = [];
  if (gizi) {
    if (gizi.catatan && /asi eksklusif/i.test(gizi.catatan)) {
      // 0-5 bulan: rekomendasinya BUKAN makanan, melainkan ASI eksklusif
      rekomendasiAKG.push(gizi.catatan);
    } else if (adaKurangGizi) {
      rekomendasiAKG.push(
        `Penuhi kebutuhan gizi harian anak usia ${gizi.kelompok_umur}: energi ±${gizi.energi_kkal} kkal dan protein ${gizi.protein_g} g per hari, utamakan protein hewani (sesuai Permenkes 28/2019).`,
      );
    } else if (adaLebihGizi) {
      rekomendasiAKG.push(
        `Jaga asupan harian anak agar tidak melampaui kebutuhan usianya (${gizi.kelompok_umur}, sekitar ${gizi.energi_kkal} kkal per hari); batasi gula dan makanan ringan kemasan (sesuai Permenkes 28/2019).`,
      );
    }
  }

  // AKG ditaruh paling depan karena paling spesifik (kuantitatif per umur),
  // lalu rekomendasi status dari DB, terakhir saran berbasis tren.
  const sumberRekomendasi = [
    ...rekomendasiAKG,
    ...(data?.rekomendasiStunting || []),
    ...(data?.rekomendasiWasting || []),
    ...(data?.rekomendasiUnderweight || []),
    ...rekomendasiTren,
  ];

  // ===== PEMBAGIAN REKOMENDASI =====
  const rekomendasiTunggal = dedupRekomendasi(sumberRekomendasi, 4);
  const rekomendasiPrioritas = dedupRekomendasi(
    sumberRekomendasi.filter(isPrioritas),
    3,
  );
  const rekomendasiRutin = dedupRekomendasi(
    sumberRekomendasi.filter((r) => !isPrioritas(r)),
    4,
  );
  const adaRekomendasi =
    rekomendasiPrioritas.length > 0 || rekomendasiRutin.length > 0;

  // ===== RINGKASAN AKG: MAKRO + VITAMIN + MINERAL =====
  // Padanan diutamakan dari backend (kolom akg_balitas.padanan);
  // konstanta lokal hanya cadangan bila backend belum mengirimnya.
  const padananKelompok =
    gizi?.padanan || (gizi && PADANAN_GIZI[gizi.kelompok_umur]) || {};

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

  // Bila backend belum punya kolom vitamin/mineral, kartu otomatis kembali
  // ke tampilan lama (satu daftar makro, tanpa tab).
  const adaMikro = vitaminItems.length > 0 || mineralItems.length > 0;

  const padananUntuk = (keys) =>
    keys
      .filter((k) => padananKelompok[k])
      .map((k) => ({ label: k, teks: padananKelompok[k] }));

  const padananVitamin = padananUntuk(PADANAN_TAB_VITAMIN);
  const padananMineral = padananUntuk(PADANAN_TAB_MINERAL);

  const TAB_GIZI = ["Gizi utama", "Vitamin", "Mineral"];

  /* ----- Isi tiap slide ----- */
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

            {/* DAMPAK JANGKA PANJANG */}
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
                  {indikatorMasalah.map((it) => (
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

            {/* BANNER TREN */}
            {adaPeringatanTren && (
              <div
                className={`rounded-2xl border px-4 py-3 ${trenConfig.wrap}`}
              >
                <h4 className={`text-sm font-bold ${trenConfig.titleColor}`}>
                  {trenConfig.title}
                </h4>
                <p className="mt-1 text-[12.5px] leading-relaxed text-gray-600">
                  {trenConfig.desc}
                </p>
              </div>
            )}
          </div>

          <p className="mt-5 text-sm italic leading-relaxed text-gray-400">
            &ldquo;Pertumbuhan anak bukan lomba lari, tapi maraton yang butuh
            dukungan tepat.&rdquo;
          </p>
        </div>
      </Reveal>

      {/* ====== KANAN: REKOMENDASI TINDAKAN ====== */}
      <Reveal show={mounted} delay={90}>
        <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="h-6 w-1.5 rounded-full bg-emerald-500" />
            <h3 className="text-xl font-extrabold tracking-tight text-gray-900">
              Rekomendasi tindakan
            </h3>
          </div>

          <div className="mt-5 flex-1">
            <div className="space-y-5">
              {/* Prioritas (hanya saat ada masalah) */}
              {adaMasalah && rekomendasiPrioritas.length > 0 && (
                <div className="rounded-2xl bg-amber-50/70 px-4 py-3.5 ring-1 ring-amber-100">
                  <p className="mb-2 text-[12.5px] font-semibold text-amber-800">
                    Sebaiknya segera dilakukan
                  </p>
                  <DaftarRekomendasi
                    items={rekomendasiPrioritas}
                    tone="amber"
                  />
                </div>
              )}

              {/* Anak tanpa masalah: rekomendasi umum tetap tampil */}
              {!adaMasalah && rekomendasiTunggal.length > 0 && (
                <div className="px-1">
                  <DaftarRekomendasi
                    items={rekomendasiTunggal}
                    tone="emerald"
                  />
                </div>
              )}

              {/* ===== KEBUTUHAN GIZI HARIAN (tab geser: makro / vitamin / mineral) ===== */}
              {gizi ? (
                <div className="px-1">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[12.5px] font-semibold text-emerald-700 ">
                      Kebutuhan gizi harian
                    </p>
                    <span className="rounded-lg bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                      {gizi.kelompok_umur}
                    </span>
                  </div>
                  <p className="mb-3 text-[12px] leading-relaxed text-gray-500">
                    Angka di bawah ini menunjukkan perkiraan kebutuhan gizi
                    harian {nama} sesuai usianya. Tidak perlu menghafal atau menghitung satu
                    per satu, yang terpenting adalah memberikan makanan yang
                    beragam dan seimbang setiap hari.
                  </p>
                  {adaMikro ? (
                    <>
                      {/* TAB */}
                      <div className="mb-3 flex rounded-xl bg-gray-100 p-1">
                        {TAB_GIZI.map((t, i) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTabGizi(i)}
                            className={`flex-1 rounded-lg py-1.5 text-[11.5px] font-semibold transition ${
                              tabGizi === i
                                ? "bg-white text-emerald-700 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>

                      {/* SLIDER */}
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
                            {SlideMikro(vitaminItems, padananVitamin)}
                          </div>
                          <div className="w-full shrink-0 pl-0.5">
                            {SlideMikro(mineralItems, padananMineral)}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Backend lama (belum ada kolom vitamin/mineral):
                       tampilan satu daftar seperti sebelumnya */
                    SlideMakro
                  )}

                  {gizi.catatan && (
                    <p className="mt-3 rounded-xl bg-emerald-50/60 px-3 py-2 text-[11.5px] leading-relaxed text-gray-600 ring-1 ring-emerald-100/60">
                      {gizi.catatan}
                    </p>
                  )}

                  <p className="mt-2 text-[10.5px] text-gray-400">
                    Angka di atas adalah kebutuhan rata-rata per
                    hari menurut {gizi.sumber}. Gunakan sebagai acuan, bukan
                    target kaku yang harus tepat setiap hari. Padanan porsi
                    mengikuti Pedoman Gizi Seimbang (Isi Piringku) dan bersifat
                    perkiraan. Untuk kebutuhan khusus anak, konsultasikan ke
                    kader posyandu atau tenaga kesehatan
                  </p>
                </div>
              ) : (
                /* Cadangan bila data AKG belum terkirim dari backend */
                adaMasalah &&
                rekomendasiRutin.length > 0 && (
                  <div className="px-1">
                    <p className="mb-2 text-[12.5px] font-semibold text-emerald-700">
                      Untuk dijaga sehari-hari
                    </p>
                    <DaftarRekomendasi
                      items={rekomendasiRutin}
                      tone="emerald"
                    />
                  </div>
                )
              )}

              {/* Fallback total bila benar-benar tidak ada apa pun */}
              {!gizi &&
                ((adaMasalah && !adaRekomendasi) ||
                  (!adaMasalah && rekomendasiTunggal.length === 0)) && (
                  <p className="text-sm text-gray-500">
                    Tidak ada rekomendasi tersedia.
                  </p>
                )}
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
