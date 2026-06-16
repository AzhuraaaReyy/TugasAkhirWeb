import * as XLSX from "xlsx";

const fmtTgl = (x) => (x ? new Date(x).toLocaleDateString("id-ID") : "-");

/**
 * Urutan argumen disesuaikan dengan Laporan.jsx:
 *   exportExcel(balita, deteksi, rujukan, statusTimbang)
 */
export const exportExcel = (
  balita = [],
  deteksi = [],
  rujukan = [],
  statusTimbang = [],
) => {
  const wb = XLSX.utils.book_new();

  // BALITA
  const balitaSheet = XLSX.utils.json_to_sheet(
    balita.map((b, i) => ({
      No: i + 1,
      Nama: b.name,
      Orang_Tua: b.orangtua || "-",
      Jenis_Kelamin: b.jk,
      TTL: `${b.tmp_lahir || "-"}, ${fmtTgl(b.tgl_lahir)}`,
      Alamat: b.alamat || "-",
      Posyandu: b.posyandu || "-",
    })),
  );
  XLSX.utils.book_append_sheet(wb, balitaSheet, "Balita");

  // PENIMBANGAN (dari data deteksi)
  const penimbanganSheet = XLSX.utils.json_to_sheet(
    deteksi.map((d, i) => ({
      No: i + 1,
      Nama_Balita: d.balitaname,
      Umur: `${d.umur} Bulan`,
      Tanggal: fmtTgl(d.tanggal),
      Berat: d.berat,
      Tinggi: d.tinggi,
    })),
  );
  XLSX.utils.book_append_sheet(wb, penimbanganSheet, "Penimbangan");

  // DETEKSI
  const deteksiSheet = XLSX.utils.json_to_sheet(
    deteksi.map((d, i) => ({
      No: i + 1,
      Nama_Balita: d.balitaname,
      Tanggal_Deteksi: fmtTgl(d.tanggal),
      ZScore_TB_U: d.zscore_tb_u,
      ZScore_BB_U: d.zscore_bb_u,
      ZScore_TB_BB: d.zscore_tb_bb,
      Status_Stunting: d.status_tb_u,
      Status_Wasting: d.status_tb_bb,
      Status_Underweight: d.status_bb_u,
    })),
  );
  XLSX.utils.book_append_sheet(wb, deteksiSheet, "Deteksi");

  // RUJUKAN (dengan keterangan pembeda)
  const rujukanSheet = XLSX.utils.json_to_sheet(
    rujukan.length
      ? rujukan.map((d, i) => ({
          No: i + 1,
          Nama_Balita: d.balitaname,
          Umur: `${d.umur} Bulan`,
          Tanggal_Deteksi: fmtTgl(d.tanggal),
          Status_Stunting: d.status_tb_u,
          Status_Wasting: d.status_tb_bb,
          Status_Underweight: d.status_bb_u,
          Alasan: d.alasan || "-",
          Periode: d.periode || "-",
          Keterangan: d.keterangan || "-",
        }))
      : [{ Keterangan: "Tidak ada balita yang perlu dirujuk" }],
  );
  XLSX.utils.book_append_sheet(wb, rujukanSheet, "Rujukan");

  // STATUS PENIMBANGAN BULAN INI (sudah + belum)
  const timbangSheet = XLSX.utils.json_to_sheet(
    statusTimbang.length
      ? statusTimbang.map((b, i) => ({
          No: i + 1,
          Nama_Balita: b.name || b.balitaname,
          Orang_Tua: b.orangtua || "-",
          Posyandu: b.posyandu || "-",
          Status:
            b.status ||
            (b.sudah_ditimbang ? "Sudah ditimbang" : "Belum ditimbang"),
          Tanggal_Timbang: b.tanggal_timbang ? fmtTgl(b.tanggal_timbang) : "-",
        }))
      : [{ Keterangan: "Data balita tidak tersedia" }],
  );
  XLSX.utils.book_append_sheet(wb, timbangSheet, "Status Penimbangan");

  XLSX.writeFile(wb, "Laporan_Posyandu.xlsx");
};
