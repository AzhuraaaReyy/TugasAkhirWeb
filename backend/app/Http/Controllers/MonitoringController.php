<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Deteksi;
use App\Models\Balita;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class MonitoringController extends Controller
{
    public function getPerkembangan($id)
    {
        $balita = Balita::find($id);
        if (!$balita) {
            return response()->json(['message' => 'Data balita tidak ditemukan'], 404);
        }

        $deteksiTerbaru = Deteksi::where('balita_id', $id)
            ->orderByDesc('tgl_deteksi')->orderByDesc('id')->first();

        if (!$deteksiTerbaru) {
            return response()->json(['message' => 'Data deteksi belum tersedia'], 404);
        }

        // Pembanding = pengukuran terakhir sebelum yang terbaru


        return response()->json(
            $this->susunPerkembangan($balita, $deteksiTerbaru)
        );
    }

    public function detailMonitoringBalita($balitaId)
    {
        // Ambil deteksi terbaru milik balita
        $deteksi = Deteksi::with([
            'user',
            'balita.user',
            'balita.posyandu',
            'detaildeteksis',
        ])
            ->where('balita_id', $balitaId)
            ->latest('id')
            ->first();

        if (!$deteksi) {
            return response()->json([
                'message' => 'Belum ada data monitoring',
            ], 404);
        }

        $detaildeteksi = $deteksi->detaildeteksis()->latest('id')->first();

        // ===== Z-score & status terkini (Permenkes No. 2 Tahun 2020) =====
        $z_bbu  = $deteksi->zscore_bb_u;
        $z_tbu  = $deteksi->zscore_tb_u;
        $z_bbtb = $deteksi->zscore_tb_bb;

        $status_bbu  = $this->deteksiBBU($z_bbu);
        $status_tbu  = $this->deteksiTBU($z_tbu);
        $status_bbtb = $this->deteksiBBTB($z_bbtb);

        // ===== Riwayat penimbangan (untuk analisis tren) =====
        $penimbangan = Deteksi::where('balita_id', $balitaId)
            ->orderByDesc('id')
            ->get();

        $sekarang   = $penimbangan->first();
        $sebelumnya = $penimbangan->skip(1)->first();

        // Status naik/turun berat & tinggi (dipertahankan)
        $status_berat  = 'Belum ada data pembanding';
        $status_tinggi = 'Belum ada data pembanding';
        if ($sekarang && $sebelumnya) {
            if ($sekarang->berat > $sebelumnya->berat) {
                $status_berat = 'Naik';
            } elseif ($sekarang->berat < $sebelumnya->berat) {
                $status_berat = 'Turun';
            } else {
                $status_berat = 'Tetap';
            }

            if ($sekarang->tinggi > $sebelumnya->tinggi) {
                $status_tinggi = 'Naik';
            } elseif ($sekarang->tinggi < $sebelumnya->tinggi) {
                $status_tinggi = 'Turun';
            } else {
                $status_tinggi = 'Tetap';
            }
        }

        // ===== Analisis tren riwayat (Aturan E: pemicu deteksi dini) =====
        $tren = $this->analisisTren($penimbangan);

        // ===== Tentukan tingkat rekomendasi / Tier (Aturan C) =====
        $tier     = $this->tentukanTier($z_tbu, $z_bbtb, $z_bbu, $tren);
        $metaTier = $this->metaTier($tier);

        // Fokus nutrisi yang ditonjolkan saat tier >= 1 (Aturan D, Lapis 2)
        $fokus_nutrisi = $tier >= 1
            ? ['Protein', 'Zat Besi', 'Seng', 'Energi', 'Kalsium & Vitamin D', 'Vitamin A']
            : [];

        // Penanda gizi lebih (di luar fokus stunting, tetap diinformasikan)
        $catatan_gizi_lebih = ($z_bbtb !== null && $z_bbtb > 1);

        // ===== Rekomendasi per indikator (dari storage/data/rekomendasi.php) =====
        $rekomendasidata = require storage_path('data/rekomendasi.php');

        return response()->json([
            'message' => 'Detail monitoring balita',

            'data' => [
                'id'         => $detaildeteksi?->id,
                'deteksi_id' => $deteksi->id,
                'nama_user'  => Auth::user()?->name,
                'name'       => $deteksi->balita?->name,
                'jk'         => $deteksi->balita?->jk,
                'tgl_lahir'  => $deteksi->balita?->tgl_lahir,
                'orang_tua'  => $deteksi->balita?->user?->name ?? '-',

                'tgl_deteksi' => $deteksi->tgl_deteksi,
                'umur'        => $deteksi->umur,
                'berat'       => $deteksi->berat,
                'tinggi'      => $deteksi->tinggi,

                'berat_sekarang'    => $sekarang?->berat,
                'berat_sebelumnya'  => $sebelumnya?->berat,
                'tinggi_sekarang'   => $sekarang?->tinggi,
                'tinggi_sebelumnya' => $sebelumnya?->tinggi,
                'status_berat'      => $status_berat,
                'status_tinggi'     => $status_tinggi,

                'zscore_bbu'  => $z_bbu,
                'zscore_tbu'  => $z_tbu,
                'zscore_bbtb' => $z_bbtb,

                'status' => [
                    'bbu'  => $status_bbu,
                    'tbu'  => $status_tbu,
                    'bbtb' => $status_bbtb,
                ],

                'keterangangizi' => [
                    'stunting'    => $this->keteranganTBU($status_tbu),
                    'wasting'     => $this->keteranganBBTB($status_bbtb),
                    'underweight' => $this->keteranganBBU($status_bbu),
                ],

                // ===== INTI NOVELTY: tingkat rekomendasi terpadu + keterlacakan =====
                'tingkat_rekomendasi' => [
                    'tier'               => $tier,
                    'label'              => $metaTier['label'],
                    'tindakan_utama'     => $metaTier['tindakan_utama'],
                    'fokus_nutrisi'      => $fokus_nutrisi,
                    'pemicu_tren'        => $tren['pemicu'],   // alasan eskalasi (boleh kosong)
                    'catatan_gizi_lebih' => $catatan_gizi_lebih,
                    'dasar'              => 'Permenkes No. 2 Tahun 2020 (status gizi) & Permenkes No. 28 Tahun 2019 (AKG)',
                ],

                // Rekomendasi rinci per indikator (tetap, untuk pendalaman)
                'rekomendasigizi' => [
                    'stunting'    => $rekomendasidata['tbu'][$status_tbu] ?? [],
                    'wasting'     => $rekomendasidata['bbtb'][$status_bbtb] ?? [],
                    'underweight' => $rekomendasidata['bbu'][$status_bbu] ?? [],
                ],

                // AKG (Permenkes 28/2019). Dibatasi balita <= 60 bulan.
                'kebutuhan_gizi' => $deteksi->umur <= 60
                    ? $this->akgUntukUmur((int) $deteksi->umur)
                    : null,

                'total_deteksi'   => $penimbangan->count(),
                'lokasi_posyandu' => $deteksi->balita?->posyandu?->nama_posyandu ?? 'Posyandu Wilayah',
                'kader_pemeriksa' => $deteksi->user?->name ?? 'Kader Posyandu',

                'riwayat' => $penimbangan->map(function ($item) {
                    return [
                        'id'         => $item->id,
                        'tanggal'    => $item->tgl_deteksi,
                        'umur'       => $item->umur,
                        'berat'      => (float) $item->berat,
                        'tinggi'     => (float) $item->tinggi,
                        'zscore_tbu' => $item->zscore_tb_u, // untuk grafik tren
                    ];
                }),
            ],
        ]);
    }

    public function LihatMonitoring($balitaId, $deteksiId)
    {
        $deteksi = Deteksi::where('id', $deteksiId)
            ->where('balita_id', $balitaId)
            ->first();

        if (!$deteksi) {
            return response()->json([
                'message' => 'Data tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'balita_id' => $balitaId,
            'deteksi_id' => $deteksiId,
            'tanggal_snapshot' => $deteksi->tgl_deteksi
        ]);
    }


    public function grafikSnapshot($deteksiId)
    {
        $deteksiDipilih = Deteksi::findOrFail($deteksiId);

        $deteksisRaw = Deteksi::where(
            'balita_id',
            $deteksiDipilih->balita_id
        )
            ->where(function ($q) use ($deteksiDipilih) {

                $q->where(
                    'tgl_deteksi',
                    '<',
                    $deteksiDipilih->tgl_deteksi
                )

                    ->orWhere(function ($q2) use ($deteksiDipilih) {

                        $q2->where(
                            'tgl_deteksi',
                            $deteksiDipilih->tgl_deteksi
                        )
                            ->where(
                                'id',
                                '<=',
                                $deteksiDipilih->id
                            );
                    });
            })
            ->with('balita')
            ->orderBy('tgl_deteksi', 'asc')
            ->get();

        if ($deteksisRaw->isEmpty()) {
            return response()->json([]);
        }

        // hindari tanggal duplicate
        $deteksis = $deteksisRaw->unique('tgl_deteksi')->values();

        $data = $deteksis->map(function ($item, $index) use ($deteksis) {

            // ZSCORE WHO
            $zScore = $item->zscore_tb_u;
            $ZScoreBBU = $item->zscore_bb_u;

            $status = $zScore !== null
                ? $this->deteksiTBU($zScore)
                : '-';

            $statusBBU = $ZScoreBBU !== null
                ? $this->deteksiBBU($ZScoreBBU)
                : '-';

            // DEFAULT VALUE
            $kenaikanBB = 0;
            $kenaikanTB = 0;

            $targetKbm = null;
            $targetKpt = null;

            $statusPertumbuhanBB = "Data Awal";
            $statusPertumbuhanTB = "Data Awal";
            $tooltipBB = "Data awal";
            $tooltipTB = "Data awal";

            //ambil status z-score
            $status_bbu = $this->deteksiBBU($ZScoreBBU);
            $status_tbu = $this->deteksiTBU($zScore);


            // CEK PERTUMBUHAN
            if ($index > 0) {

                // data sebelumnya
                $prevItem = $deteksis[$index - 1];

                // hitung kenaikan langsung dari data sebelumnya
                $kenaikanBB = round(
                    (float)$item->berat - (float)$prevItem->berat,
                    2
                );

                $kenaikanTB = round(
                    (float)$item->tinggi - (float)$prevItem->tinggi,
                    2
                );
                $umurSebelumnya = (int)$prevItem->umur;
                $umurSekarang = (int)$item->umur;

                // interval real antar penimbangan
                $intervalAktual = $umurSekarang - $umurSebelumnya;
                $umurAnak = (int)$item->umur;
                $genderAnak = strtolower(trim($item->balita->jk));

                $genderDB = $genderAnak == 'l'
                    ? 'laki-laki'
                    : 'perempuan';

                //Hitung ideal KBM
                $kbmStandar = DB::table('standar_kbm')
                    ->whereRaw('LOWER(TRIM(gender)) = ?', [strtolower(trim($genderDB))])
                    ->where('umur_awal', '<=', $umurAnak)
                    ->where('umur_akhir', '>=', $umurAnak)
                    ->orderByRaw('ABS(interval_bulan - ?)', [$intervalAktual])
                    ->first();

                if ($kbmStandar) {

                    $targetKbm = (float)$kbmStandar->kbm_kg;

                    $statusPertumbuhanBB =
                        $kenaikanBB >= $targetKbm
                        ? "Telah Tercapai"
                        : "Belum Tercapai";
                } else {

                    // fallback ke WHO
                    $statusPertumbuhanBB = $statusBBU;
                }

                //Hitung Ideal KPT
                $kptStandar = DB::table('standar_kpt')
                    ->whereRaw('LOWER(TRIM(gender)) = ?', [$genderDB])

                    ->where('umur_awal', '<=', $umurAnak)
                    ->where('umur_akhir', '>=', $umurAnak)

                    // cari interval yang <= interval aktual
                    ->orderByRaw('ABS(interval_bulan - ?)', [$intervalAktual])

                    ->first();

                if ($kptStandar) {

                    $targetKpt = (float)$kptStandar->kpt_cm;

                    $statusPertumbuhanTB =
                        $kenaikanTB >= $targetKpt
                        ? "Telah Tercapai"
                        : "Belum Tercapai";
                } else {

                    // fallback ke WHO
                    $statusPertumbuhanTB = $status;
                }

                $selisihBB = $targetKbm !== null
                    ? round($kenaikanBB - $targetKbm, 2)
                    : 0;
                $selisihTB = $targetKpt !== null
                    ? round($kenaikanTB - $targetKpt, 2)
                    : 0;

                //Tooltip BB
                if ($targetKbm !== null) {

                    if ($kenaikanBB >= $targetKbm) {

                        $tooltipBB =
                            "Pertumbuhan luar biasa (+" . $kenaikanBB . " kg), " .
                            "melampaui standar minimal +" . $targetKbm . " kg (selisih +" . $selisihBB . " kg)";
                    } else {

                        $tooltipBB =
                            "Pertumbuhan kurang optimal (" . $kenaikanBB . " kg), " .
                            "standar minimal " . $targetKbm . " kg, " .
                            "kurang " . abs($selisihBB) . " kg dari target.";
                    }
                } else {
                    $tooltipBB = $statusPertumbuhanBB;
                }




                //Tooltip TB
                if ($targetKpt !== null) {

                    if ($kenaikanTB >= $targetKpt) {

                        $tooltipTB =
                            "Pertumbuhan luar biasa (+" . $kenaikanTB . " cm), " .
                            "melampaui standar minimal +" . $targetKpt . " cm (selisih +" . $selisihTB . " cm)";
                    } else {

                        $tooltipTB =
                            $tooltipTB =
                            "Pertumbuhan kurang optimal (" . $kenaikanTB . " cm), " .
                            "standar minimal " . $targetKpt . " cm, " .
                            "kurang " . abs($selisihTB) . " cm dari target.";
                    }
                } else {
                    $tooltipTB = $statusPertumbuhanTB;
                }
            }

            $warnaBB = "gray";

            if ($targetKbm !== null) {
                if ($kenaikanBB >= $targetKbm) {
                    $warnaBB = "green";
                } else {
                    $warnaBB = "red";
                }
            }

            $warnaTB = "gray";

            if ($targetKpt !== null) {
                if ($kenaikanTB >= $targetKpt) {
                    $warnaTB = "green";
                } else {
                    $warnaTB = "red";
                }
            }
            // Ambil WHO TB/U
            $gender = strtoupper(trim($item->balita->jk));
            $who = DB::table('who_tb_u')
                ->where('month', $item->umur)
                ->where('gender', $gender)
                ->first();

            //Ambil WHO BB/U    
            $whobbu = DB::table('who_bb_u')
                ->where('month', $item->umur)
                ->where('gender', $gender)
                ->first();

            return [
                'id' => $item->id,

                'umur' => (int)$item->umur,

                'tinggi' => (float)$item->tinggi,
                'berat' => (float)$item->berat,


                // TOOLTIP DATA
                'kenaikan_berat' => $kenaikanBB,
                'targetKbm' => $targetKbm,

                'kenaikan_tinggi' => $kenaikanTB,
                'targetKpt' => $targetKpt,


                // TANGGAL
                'tgl_deteksi' => $item->tgl_deteksi,

                'tgl_label' => $item->tgl_deteksi
                    ? Carbon::parse($item->tgl_deteksi)
                    ->translatedFormat('d F Y')
                    : '-',

                'bulan' => $item->tgl_deteksi
                    ? Carbon::parse($item->tgl_deteksi)
                    ->translatedFormat('d M')
                    : '-',

                // STATUS
                'status' => $status,

                // status pertumbuhan dinamis
                'statusTinggi' => $statusPertumbuhanTB,
                'statusBBU' => $statusPertumbuhanBB,

                'tooltipBB' => $tooltipBB,
                'tooltipTB' => $tooltipTB,
                'warnaTB' => $warnaTB,
                'warnaBB' => $warnaBB,
                // ZSCORE
                'zscore' => $zScore,
                'ZScoreBBU' => $ZScoreBBU,

                // GARIS WHO TBU
                'median_tb' => $who->m ?? null,
                'minus2_tb' => $who ? $who->m - (2 * $who->s) : null,
                'minus3_tb' => $who ? $who->m - (3 * $who->s) : null,

                // GARIS WHO BBU
                'median_bb' => $whobbu->m ?? null,
                'minus2_bb' => $whobbu ? $whobbu->m - (2 * $whobbu->s) : null,
                'minus3_bb' => $whobbu ? $whobbu->m - (3 * $whobbu->s) : null,

                'statustbu' =>  $status_tbu,
                'statusbbu' =>  $status_bbu,
            ];
        });

        return response()->json($data);
    }


    public function detailMonitoringSnapshot($deteksiId)
    {
        $deteksi = Deteksi::with([
            'user',
            'balita.user',
            'balita.posyandu'
        ])->findOrFail($deteksiId);

        $rekomendasidata = include storage_path('data/rekomendasi.php');

        $z_bbu = $deteksi->zscore_bb_u;
        $z_tbu = $deteksi->zscore_tb_u;
        $z_bbtb = $deteksi->zscore_tb_bb;

        $status_bbu = $this->deteksiBBU($z_bbu);
        $status_tbu = $this->deteksiTBU($z_tbu);
        $status_bbtb = $this->deteksiBBTB($z_bbtb);

        $riwayat = Deteksi::where(
            'balita_id',
            $deteksi->balita_id
        )
            ->where(function ($q) use ($deteksi) {

                $q->where(
                    'tgl_deteksi',
                    '<',
                    $deteksi->tgl_deteksi
                )

                    ->orWhere(function ($q2) use ($deteksi) {

                        $q2->where(
                            'tgl_deteksi',
                            $deteksi->tgl_deteksi
                        )
                            ->where(
                                'id',
                                '<=',
                                $deteksi->id
                            );
                    });
            })
            ->orderBy('tgl_deteksi')
            ->get();

        return response()->json([
            'data' => [

                'id' => $deteksi->id,
                'nama_user' => Auth::user()?->name,
                'name' => $deteksi->balita->name,
                'orang_tua' => $deteksi->balita?->user?->name ?? '-',
                'jk' => $deteksi->balita->jk,
                'tgl_lahir' => $deteksi->balita?->tgl_lahir,
                'umur' => $deteksi->umur,
                'berat' => $deteksi->berat,
                'tinggi' => $deteksi->tinggi,

                'tgl_deteksi' => $deteksi->tgl_deteksi,

                'zscore_bbu' => $z_bbu,
                'zscore_tbu' => $z_tbu,
                'zscore_bbtb' => $z_bbtb,

                'total_deteksi' => $riwayat->count(),

                'status' => [
                    'bbu' => $status_bbu,
                    'tbu' => $status_tbu,
                    'bbtb' => $status_bbtb,
                ],

                'keterangangizi' => [
                    'stunting' => $this->keteranganTBU($status_tbu),
                    'wasting' => $this->keteranganBBTB($status_bbtb),
                    'underweight' => $this->keteranganBBU($status_bbu),
                ],

                'rekomendasigizi' => [
                    'stunting' => $rekomendasidata['tbu'][$status_tbu] ?? [],
                    'wasting' => $rekomendasidata['bbtb'][$status_bbtb] ?? [],
                    'underweight' => $rekomendasidata['bbu'][$status_bbu] ?? [],
                ],

                'kebutuhan_gizi' => $deteksi->umur <= 72
                    ? $this->akgUntukUmur((int) $deteksi->umur)
                    : null,

                'riwayat' => $riwayat->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'tanggal' => $item->tgl_deteksi,
                        'umur' => $item->umur,
                        'berat' => (float) $item->berat,
                        'tinggi' => (float) $item->tinggi,
                    ];
                }),
            ]
        ]);
    }


    public function perkembanganSnapshot($deteksiId)
    {
        $deteksiTerbaru = Deteksi::find($deteksiId);

        if (!$deteksiTerbaru) {
            return response()->json([
                'message' => 'Data deteksi tidak ditemukan'
            ], 404);
        }

        $balita = Balita::find($deteksiTerbaru->balita_id);

        if (!$balita) {
            return response()->json([
                'message' => 'Data balita tidak ditemukan'
            ], 404);
        }
        $this->pastikanMilikOrangTua($balita->id);
        $payload = $this->susunPerkembangan($balita, $deteksiTerbaru);

        $payload = [
            'snapshot' => [
                'deteksi_id' => $deteksiTerbaru->id,
                'tanggal'    => $deteksiTerbaru->tgl_deteksi,
                'umur'       => (int) $deteksiTerbaru->umur,
            ],
        ] + $payload;

        return response()->json($payload);
    }



    private function deteksiBBU($z)
    {
        if ($z < -3) return "Berat badan sangat kurang (severely underweight)";
        if ($z < -2) return "Berat badan kurang (underweight)";
        if ($z <= 2) return "Berat badan normal";
        return "Risiko berat badan lebih";
    }

    private function deteksiTBU($z)
    {
        if ($z < -3) return "Sangat pendek (severely stunted)";
        if ($z < -2) return "Pendek (stunted)";
        if ($z <= 3) return "Normal";
        return "Tinggi";
    }

    private function deteksiBBTB($z)
    {
        if ($z < -3) return "Gizi buruk (severely wasted)";
        if ($z < -2) return "Gizi kurang (wasted)";
        if ($z <= 1) return "Gizi baik (normal)";
        if ($z <= 2) return "Berisiko gizi lebih (possible risk of overweight)";
        if ($z <= 3) return "Gizi lebih (overweight)";
        return "Obesitas (obese)";
    }

    private function keteranganBBU($status)
    {
        return match ($status) {
            "Berat badan sangat kurang (severely underweight)" =>
            "z-score berat badan anak sangat rendah dibandingkan standar usianya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan kemungkinan kekurangan gizi berat dan perlu penanganan segera.",

            "Berat badan kurang (underweight)" =>
            "z-score berat badan anak berada di bawah standar usianya (z-score antara -3 SD hingga -2 SD). Hal ini mengindikasikan adanya masalah gizi yang perlu diperhatikan.",

            "Berat badan normal" =>
            "z-score berat badan anak berada dalam rentang normal sesuai standar WHO (z-score antara -2 SD hingga +1 SD), menunjukkan kondisi gizi yang baik.",

            "Risiko berat badan lebih" =>
            "z-score berat badan anak berada di atas standar usianya (z-score > +1 SD), sehingga berisiko mengalami kelebihan berat badan jika tidak dikontrol.",

            default => "-",
        };
    }

    private function keteranganTBU($status)
    {
        return match ($status) {
            "Sangat pendek (severely stunted)" =>
            "z-score tinggi badan anak sangat rendah dibandingkan standar usianya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan stunting berat akibat kekurangan gizi kronis dalam jangka panjang.",

            "Pendek (stunted)" =>
            "z-score tinggi badan anak berada di bawah standar usianya (z-score antara -3 SD hingga -2 SD). Anak terindikasi stunting yang menandakan adanya gangguan pertumbuhan kronis.",

            "Normal" =>
            "z-score tinggi badan anak berada dalam rentang normal sesuai standar WHO (z-score antara -2 SD hingga +3 SD), menunjukkan pertumbuhan yang baik.",

            "Tinggi" =>
            "z-score tinggi badan anak berada di atas rata-rata usianya (z-score > +3 SD), namun masih perlu dipantau agar tetap proporsional.",

            default => "-",
        };
    }

    private function keteranganBBTB($status)
    {
        return match ($status) {
            "Gizi buruk (severely wasted)" =>
            "z-score berat badan anak sangat rendah dibandingkan tinggi badannya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan gizi buruk akut yang memerlukan penanganan segera.",

            "Gizi kurang (wasted)" =>
            "z-score berat badan anak berada di bawah standar tinggi badannya (z-score antara -3 SD hingga -2 SD), menandakan adanya kekurangan gizi akut.",

            "Gizi baik (normal)" =>
            "z-score berat badan anak proporsional dengan tinggi badannya (z-score antara -2 SD hingga +1 SD), menunjukkan kondisi gizi yang baik.",

            "Berisiko gizi lebih (possible risk of overweight)" =>
            "z-score berat badan anak mulai melebihi proporsi ideal terhadap tinggi badan (z-score > +1 SD), sehingga berisiko mengalami kelebihan berat badan.",

            "Gizi lebih (overweight)" =>
            "z-score berat badan anak lebih tinggi dibandingkan standar tinggi badannya (z-score > +2 SD), menunjukkan kondisi gizi lebih.",

            "Obesitas (obese)" =>
            "z-score berat badan anak sangat berlebih dibandingkan tinggi badannya (z-score > +3 SD), termasuk dalam kategori obesitas dan perlu perhatian khusus.",

            default => "-",
        };
    }


    private function analisisTren($penimbangan)
    {
        $hasil = [
            'tbu_menurun'     => false,
            'berat_faltering' => false,
            'status_memburuk' => false,
            'pemicu'          => [],
        ];

        $records = $penimbangan->values(); // desc: index 0 = terbaru
        if ($records->count() < 2) {
            return $hasil;
        }

        $skrg = $records[0];
        $lalu = $records[1];

        // T1: Z-score TB/U menurun dibanding pengukuran sebelumnya
        if (
            $skrg->zscore_tb_u !== null && $lalu->zscore_tb_u !== null
            && $skrg->zscore_tb_u < $lalu->zscore_tb_u
        ) {
            $hasil['tbu_menurun'] = true;
            $hasil['pemicu'][]    = 'Z-score TB/U menurun dibanding pengukuran sebelumnya';
        }

        // T2: berat stagnan/turun (weight faltering); diperkuat bila 2 interval berturut-turut
        if ($skrg->berat !== null && $lalu->berat !== null && $skrg->berat <= $lalu->berat) {
            $duaIntervalTidakNaik = true;
            if ($records->count() >= 3) {
                $lalu2 = $records[2];
                $duaIntervalTidakNaik = ($lalu->berat !== null && $lalu2->berat !== null)
                    && ($lalu->berat <= $lalu2->berat);
            }
            if ($duaIntervalTidakNaik) {
                $hasil['berat_faltering'] = true;
                $hasil['pemicu'][]        = 'Berat badan tidak naik pada pemantauan berturut-turut';
            }
        }

        // T3: status TB/U memburuk antar periode (mis. Normal -> Pendek)
        $statusSkrg = $this->deteksiTBU($skrg->zscore_tb_u);
        $statusLalu = $this->deteksiTBU($lalu->zscore_tb_u);
        if ($this->peringkatTBU($statusSkrg) > $this->peringkatTBU($statusLalu)) {
            $hasil['status_memburuk'] = true;
            $hasil['pemicu'][]        = "Status TB/U memburuk: {$statusLalu} -> {$statusSkrg}";
        }

        return $hasil;
    }

    /**
     * Peringkat keparahan TB/U (semakin besar = semakin buruk),
     * dipakai untuk mendeteksi pemburukan status antar periode.
     */
    private function peringkatTBU($status)
    {
        return match ($status) {
            'Sangat pendek (severely stunted)' => 3,
            'Pendek (stunted)'                 => 2,
            default                            => 1, // Normal / Tinggi
        };
    }

    /**
     * Tentukan tingkat rekomendasi (Tier 0-3) dari status + tren.
     * Cutoff mengacu Permenkes No. 2 Tahun 2020.
     */
    private function tentukanTier($zTBU, $zBBTB, $zBBU, array $tren)
    {
        // Tier 3 — prioritas rujukan: sangat pendek ATAU gizi buruk (akut/berat)
        if (($zTBU !== null && $zTBU < -3) || ($zBBTB !== null && $zBBTB < -3)) {
            return 3;
        }

        // Tier 2 — perlu penanganan: pendek (stunting) ATAU gizi kurang (wasted)
        if (($zTBU !== null && $zTBU >= -3 && $zTBU < -2)
            || ($zBBTB !== null && $zBBTB >= -3 && $zBBTB < -2)
        ) {
            return 2;
        }

        // Tier 1 — perlu perhatian (berisiko): mendekati ambang TB/U,
        // BB/U kurang, atau ada tren menurun pada riwayat
        $mendekatiAmbang = ($zTBU !== null && $zTBU >= -2 && $zTBU < -1);
        $bbuKurang       = ($zBBU !== null && $zBBU < -2);
        $trenMenurun     = $tren['tbu_menurun'] || $tren['berat_faltering'] || $tren['status_memburuk'];

        if ($mendekatiAmbang || $bbuKurang || $trenMenurun) {
            return 1;
        }

        // Tier 0 — normal
        return 0;
    }

    /**
     * Label + tindakan utama per tier (Aturan D, Lapis 1).
     */
    private function metaTier($tier)
    {
        return match ($tier) {
            3 => [
                'label'          => 'Prioritas Rujukan',
                'tindakan_utama' => 'Rujuk segera ke tenaga kesehatan/puskesmas untuk evaluasi dan penanganan. Jangan ditangani mandiri; kader memastikan rujukan ditindaklanjuti.',
            ],
            2 => [
                'label'          => 'Perlu Penanganan',
                'tindakan_utama' => 'Konsultasikan ke tenaga kesehatan untuk evaluasi, perketat pemantauan, dan dampingi perbaikan asupan dengan penekanan protein hewani.',
            ],
            1 => [
                'label'          => 'Perlu Perhatian',
                'tindakan_utama' => 'Perketat pemantauan (mis. tiap 2-4 minggu) dan perbaiki asupan gizi. Anjurkan konsultasi ke tenaga kesehatan bila tidak membaik.',
            ],
            default => [
                'label'          => 'Normal',
                'tindakan_utama' => 'Pertahankan pola asuh dan gizi seimbang, serta lanjutkan pemantauan rutin setiap bulan di posyandu.',
            ],
        };
    }
}
