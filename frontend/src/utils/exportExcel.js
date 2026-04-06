import * as XLSX from "xlsx";

export const exportExcel = (balita, penimbangan, deteksi) => {
  const wb = XLSX.utils.book_new();

  // BALITA
  const balitaSheet = XLSX.utils.json_to_sheet(
    balita.map((b, i) => ({
      No: i + 1,
      Nama: b.name,
      Orang_Tua: b.orangtua,
      Jenis_Kelamin: b.jk,
      TTL: `${b.tmp_lahir}, ${new Date(b.tgl_lahir).toLocaleDateString("id-ID")}`,
      Alamat: b.alamat,
      Posyandu: b.posyandu,
    })),
  );
  XLSX.utils.book_append_sheet(wb, balitaSheet, "Balita");

  // PENIMBANGAN
  const penimbanganSheet = XLSX.utils.json_to_sheet(
    penimbangan.map((p, i) => ({
      No: i + 1,
      Nama_Balita: p.balita,
      Umur: `${p.umur} Bulan`,
      Tanggal: new Date(p.tanggal).toLocaleDateString("id-ID"),
      Berat: p.berat,
      Tinggi: p.tinggi,
      Lingkar_Lengan: p.lingkar_lengan,
      Lingkar_Kepala: p.lingkar_kepala,
    })),
  );
  XLSX.utils.book_append_sheet(wb, penimbanganSheet, "Penimbangan");

  // DETEKSI
  const deteksiSheet = XLSX.utils.json_to_sheet(
    deteksi.map((d, i) => ({
      No: i + 1,
      Nama_Balita: d.balitaname,
      Tanggal_Deteksi: new Date(d.tanggal).toLocaleDateString("id-ID"),
      ZScore_TB_U: d.zscore_tb_u,
      ZScore_BB_U: d.zscore_bb_u,
      ZScore_TB_BB: d.zscore_tb_bb,
      Status_Stunting: d.status_tb_u,
      Status_Wasting: d.status_tb_bb,
      Status_Underweight: d.status_bb_u,
    })),
  );
  XLSX.utils.book_append_sheet(wb, deteksiSheet, "Deteksi");

  XLSX.writeFile(wb, "Laporan_Posyandu.xlsx");
};
