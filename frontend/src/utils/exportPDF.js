import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const statusColor = (status) => {
  switch (status) {
    // TBU
    case "Sangat pendek (severely stunted)":
      return [220, 38, 38];
    case "Pendek (stunted)":
      return [251, 191, 36];
    case "Normal":
      return [34, 197, 94];
    case "Tinggi":
      return [59, 130, 246];

    // BBU
    case "Berat badan sangat kurang (severely underweight)":
      return [220, 38, 38];
    case "Berat badan kurang (underweight)":
      return [251, 191, 36];
    case "Berat badan normal":
      return [34, 197, 94];
    case "Risiko berat badan lebih":
      return [59, 130, 246];

    // BBTB
    case "Gizi buruk (severely wasted)":
      return [220, 38, 38];
    case "Gizi kurang (wasted)":
      return [251, 191, 36];
    case "Gizi baik (normal)":
      return [34, 197, 94];
    case "Berisiko gizi lebih (possible risk of overweight)":
      return [147, 197, 253];
    case "Gizi lebih (overweight)":
      return [59, 130, 246];
    case "Obesitas (obese)":
      return [139, 92, 246];

    default:
      return [209, 213, 219];
  }
};

const fmtTgl = (x) => (x ? new Date(x).toLocaleDateString("id-ID") : "-");

const selStatus = (status) => ({
  content: status || "-",
  styles: {
    fillColor: statusColor(status),
    textColor: [255, 255, 255],
  },
});

/**
 * Urutan argumen disesuaikan dengan Laporan.jsx:
 *   exportPDF(balita, deteksi, rujukan, statusTimbang)
 */
export const exportPDF = (
  balita = [],
  deteksi = [],
  rujukan = [],
  statusTimbang = [],
) => {
  const doc = new jsPDF("p", "pt", "a4");
  const margin = 20;
  let yOffset = margin;

  const gariskan = {
    theme: "grid",
    headStyles: { fillColor: [220, 220, 220] },
    margin: { left: margin, right: margin },
    styles: {
      lineWidth: 0.8,
      lineColor: [0, 0, 0],
      fontSize: 8,
    },
  };

  const judul = (teks) => {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(teks, margin, yOffset);
    yOffset += 10;
  };

  const lanjut = () => {
    yOffset = doc.lastAutoTable.finalY + 20;
  };

  // ====== HEADER ======
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Data Posyandu", 310, yOffset, { align: "center" });
  yOffset += 30;

  // ====== LAPORAN BALITA ======
  judul("Laporan Data Balita");
  autoTable(doc, {
    startY: yOffset,
    head: [
      [
        "No",
        "Nama Balita",
        "Orang Tua",
        "Jenis Kelamin",
        "TTL",
        "Alamat",
        "Posyandu",
      ],
    ],
    body: balita.map((b, i) => [
      i + 1,
      b.name,
      b.orangtua || "-",
      b.jk,
      `${b.tmp_lahir || "-"}, ${fmtTgl(b.tgl_lahir)}`,
      b.alamat || "-",
      b.posyandu || "-",
    ]),
    ...gariskan,
  });
  lanjut();

  // ====== LAPORAN PENIMBANGAN (dari data deteksi) ======
  judul("Laporan Data Penimbangan");
  autoTable(doc, {
    startY: yOffset,
    head: [
      ["No", "Nama Balita", "Umur", "Tanggal", "Berat (kg)", "Tinggi (cm)"],
    ],
    body: deteksi.map((d, i) => [
      i + 1,
      d.balitaname,
      `${d.umur} Bulan`,
      fmtTgl(d.tanggal),
      d.berat,
      d.tinggi,
    ]),
    ...gariskan,
  });
  lanjut();

  // ====== LAPORAN DETEKSI ======
  judul("Laporan Data Deteksi");
  autoTable(doc, {
    startY: yOffset,
    head: [
      [
        "No",
        "Nama Balita",
        "Tanggal Deteksi",
        "ZScore TB/U",
        "ZScore BB/U",
        "ZScore TB/BB",
        "Status Stunting",
        "Status Wasting",
        "Status Underweight",
      ],
    ],
    body: deteksi.map((d, i) => [
      i + 1,
      d.balitaname,
      fmtTgl(d.tanggal),
      d.zscore_tb_u,
      d.zscore_bb_u,
      d.zscore_tb_bb,
      selStatus(d.status_tb_u),
      selStatus(d.status_tb_bb),
      selStatus(d.status_bb_u),
    ]),
    ...gariskan,
  });
  lanjut();

  // ====== LAPORAN RUJUKAN (dengan kolom keterangan pembeda) ======
  judul("Laporan Data Rujukan");
  autoTable(doc, {
    startY: yOffset,
    head: [
      [
        "No",
        "Nama Balita",
        "Umur",
        "Tanggal",
        "Status Stunting",
        "Status Wasting",
        "Status Underweight",
        "Alasan",
        "Keterangan",
      ],
    ],
    body: rujukan.length
      ? rujukan.map((d, i) => [
          i + 1,
          d.balitaname,
          `${d.umur} Bulan`,
          fmtTgl(d.tanggal),
          selStatus(d.status_tb_u),
          selStatus(d.status_tb_bb),
          selStatus(d.status_bb_u),
          d.alasan || "-",
          d.periode
            ? `${d.periode}${d.keterangan ? ". " + d.keterangan : ""}`
            : "-",
        ])
      : [
          [
            {
              content: "Tidak ada balita yang perlu dirujuk",
              colSpan: 9,
              styles: { halign: "center" },
            },
          ],
        ],
    ...gariskan,
  });
  lanjut();

  // ====== STATUS PENIMBANGAN BULAN INI (sudah + belum) ======
  judul("Laporan Status Penimbangan Bulan Ini");
  autoTable(doc, {
    startY: yOffset,
    head: [
      ["No", "Nama Balita", "Orang Tua", "Posyandu", "Status", "Tgl Timbang"],
    ],
    body: statusTimbang.length
      ? statusTimbang.map((b, i) => [
          i + 1,
          b.name || b.balitaname,
          b.orangtua || "-",
          b.posyandu || "-",
          {
            content:
              b.status ||
              (b.sudah_ditimbang ? "Sudah ditimbang" : "Belum ditimbang"),
            styles: {
              fillColor: b.sudah_ditimbang ? [34, 197, 94] : [220, 38, 38],
              textColor: [255, 255, 255],
            },
          },
          b.tanggal_timbang ? fmtTgl(b.tanggal_timbang) : "-",
        ])
      : [
          [
            {
              content: "Data balita tidak tersedia",
              colSpan: 6,
              styles: { halign: "center" },
            },
          ],
        ],
    ...gariskan,
  });

  doc.save("Laporan_Posyandu.pdf");
};
