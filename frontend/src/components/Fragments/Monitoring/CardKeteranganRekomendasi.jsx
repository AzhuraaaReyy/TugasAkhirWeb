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
  if (/(energi|kalori|padat)/.test(t)) return "energi";
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

export default function CardKeteranganRekomendasi({ data, riwayat }) {
  const nama = data?.name || "Anak";

  const [mounted, setMounted] = useState(false);
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

  // Rekomendasi DB lebih dulu (spesifik), tren menyusul.
  const sumberRekomendasi = [
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
            {adaMasalah ? (
              adaRekomendasi ? (
                <div className="space-y-5">
                  {rekomendasiPrioritas.length > 0 && (
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

                  {rekomendasiRutin.length > 0 && (
                    <div className="px-1">
                      <p className="mb-2 text-[12.5px] font-semibold text-emerald-700">
                        Untuk dijaga sehari-hari
                      </p>
                      <DaftarRekomendasi
                        items={rekomendasiRutin}
                        tone="emerald"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Tidak ada rekomendasi tersedia.
                </p>
              )
            ) : rekomendasiTunggal.length > 0 ? (
              <div className="px-1">
                <DaftarRekomendasi items={rekomendasiTunggal} tone="emerald" />
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                Tidak ada rekomendasi tersedia.
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
