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
    case "Risiko Berat badan lebih":
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

export const exportPDF = (balita, penimbangan, deteksi) => {
  const doc = new jsPDF("p", "pt", "a4");
  const margin = 20;
  let yOffset = margin;

  // HEADER
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Data Posyandu", 310, yOffset, { align: "center" });
  yOffset += 30;

  // LAPORAN BALITA
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Data Balita", margin, yOffset);
  yOffset += 10;

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
      b.orangtua,
      b.jk,
      `${b.tmp_lahir}, ${new Date(b.tgl_lahir).toLocaleDateString("id-ID")}`,
      b.alamat,
      b.posyandu,
    ]),
    theme: "grid",
    headStyles: { fillColor: [220, 220, 220] },
    margin: { left: margin, right: margin },
    styles: {
      lineWidth: 0.8, // default 0.4, lebih besar = garis lebih tebal
      lineColor: [0, 0, 0], // warna garis hitam
    },
  });

  yOffset = doc.lastAutoTable.finalY + 20;

  // LAPORAN PENIMBANGAN
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Data Penimbangan", margin, yOffset);
  yOffset += 10;

  autoTable(doc, {
    startY: yOffset,
    head: [
      [
        "No",
        "Nama Balita",
        "Umur",
        "Tanggal",
        "Berat (kg)",
        "Tinggi (cm)",
        "Lingkar Lengan",
        "Lingkar Kepala",
      ],
    ],
    body: penimbangan.map((p, i) => [
      i + 1,
      p.balita,
      `${p.umur} Bulan`,
      new Date(p.tanggal).toLocaleDateString("id-ID"),
      p.berat,
      p.tinggi,
      p.lingkar_lengan,
      p.lingkar_kepala,
    ]),
    theme: "grid",
    headStyles: { fillColor: [220, 220, 220] },
    margin: { left: margin, right: margin },
    styles: {
      lineWidth: 0.8, // default 0.4, lebih besar = garis lebih tebal
      lineColor: [0, 0, 0], // warna garis hitam
    },
  });

  yOffset = doc.lastAutoTable.finalY + 20;

  // LAPORAN DETEKSI
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Data Deteksi", margin, yOffset);
  yOffset += 10;

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
      new Date(d.tanggal).toLocaleDateString("id-ID"),
      d.zscore_tb_u,
      d.zscore_bb_u,
      d.zscore_tb_bb,
      {
        content: d.status_tb_u || "-",
        styles: {
          fillColor: statusColor(d.status_tb_u),
          textColor: [255, 255, 255],
        },
      },
      {
        content: d.status_tb_bb || "-",
        styles: {
          fillColor: statusColor(d.status_tb_bb),
          textColor: [255, 255, 255],
        },
      },
      {
        content: d.status_bb_u || "-",
        styles: {
          fillColor: statusColor(d.status_bb_u),
          textColor: [255, 255, 255],
        },
      },
    ]),
    theme: "grid",
    headStyles: { fillColor: [220, 220, 220] },
    margin: { left: margin, right: margin },
    styles: {
      lineWidth: 0.8, // default 0.4, lebih besar = garis lebih tebal
      lineColor: [0, 0, 0], // warna garis hitam
    },
  });

  doc.save("Laporan_Posyandu.pdf");
};
