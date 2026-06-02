<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Deteksi;
use App\Models\Balita;
use Illuminate\Support\Facades\DB;

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
        $dataLalu = Deteksi::where('balita_id', $id)
            ->where(function ($q) use ($deteksiTerbaru) {
                $q->where('tgl_deteksi', '<', $deteksiTerbaru->tgl_deteksi)
                    ->orWhere(function ($q2) use ($deteksiTerbaru) {
                        $q2->where('tgl_deteksi', $deteksiTerbaru->tgl_deteksi)
                            ->where('id', '<', $deteksiTerbaru->id);
                    });
            })
            ->orderByDesc('tgl_deteksi')->orderByDesc('id')->first();

        $bbIni  = (float) $deteksiTerbaru->berat;
        $tbIni  = (float) $deteksiTerbaru->tinggi;
        $bbLalu = $dataLalu ? (float) $dataLalu->berat : null;
        $tbLalu = $dataLalu ? (float) $dataLalu->tinggi : null;

        $selisihBb = $bbLalu !== null ? round($bbIni - $bbLalu, 2) : null;
        $selisihTb = $tbLalu !== null ? round($tbIni - $tbLalu, 2) : null;

        $statusBb = $this->tentukanStatus($selisihBb);
        $statusTb = $this->tentukanStatus($selisihTb);

        // ===== TARGET berbasis KBM/KPT =====
        $jk = $balita->jk; // 'L' / 'P'
        $umurLalu = ($dataLalu && $dataLalu->umur !== null) ? (int) $dataLalu->umur : null;
        $umurIni  = (int) $deteksiTerbaru->umur;
        $interval = $umurLalu !== null ? max(1, $umurIni - $umurLalu) : null;

        // --- Penilaian periode yang baru saja diukur (bulan lalu -> bulan ini) ---
        $kbm = $this->standarKenaikan('standar_kbm', 'kbm_kg', $jk, $umurLalu, $interval);
        $kpt = $this->standarKenaikan('standar_kpt', 'kpt_cm', $jk, $umurLalu, $interval);

        $targetBb = ($bbLalu !== null && $kbm['nilai'] !== null)
            ? round($bbLalu + $kbm['nilai'], 2) : null;
        $targetTb = ($tbLalu !== null && $kpt['nilai'] !== null)
            ? round($tbLalu + $kpt['nilai'], 2) : null;

        $memenuhiBb = ($selisihBb !== null && $kbm['nilai'] !== null) ? ($selisihBb >= $kbm['nilai']) : null;
        $memenuhiTb = ($selisihTb !== null && $kpt['nilai'] !== null) ? ($selisihTb >= $kpt['nilai']) : null;

        // --- Proyeksi target BERIKUTNYA sesuai interval (maju dari pengukuran ini) ---
        // Interval ke depan: ikuti cadence sebelumnya bila ada, default 2 bulan.
        $intervalForward = $kbm['interval'] ?? $kpt['interval'] ?? ($interval ?? 2);

        $kbmNext = $this->standarKenaikan('standar_kbm', 'kbm_kg', $jk, $umurIni, $intervalForward);
        $kptNext = $this->standarKenaikan('standar_kpt', 'kpt_cm', $jk, $umurIni, $intervalForward);

        // interval yang benar-benar dipakai (setelah snap) -> dasar tanggal target
        $ivNext = $kbmNext['interval'] ?? $kptNext['interval'] ?? $intervalForward;
        $tglTarget = Carbon::parse($deteksiTerbaru->tgl_deteksi)
            ->copy()->addMonths($ivNext)->toDateString();

        $targetNextBb = $kbmNext['nilai'] !== null ? round($bbIni + $kbmNext['nilai'], 2) : null;
        $targetNextTb = $kptNext['nilai'] !== null ? round($tbIni + $kptNext['nilai'], 2) : null;

        // Jika target sebelumnya BELUM tercapai, jangan majukan target.
        // Pertahankan target lama (anak harus mengejar dulu sebelum target baru).
        if ($memenuhiBb === false && $targetBb !== null) {
            $targetNextBb = $targetBb;
        }
        if ($memenuhiTb === false && $targetTb !== null) {
            $targetNextTb = $targetTb;
        }
        return response()->json([
            'balita' => [
                'nama'          => $balita->name ?? null,
                'usia_bulan'    => $umurIni,
                'jenis_kelamin' => $jk,
            ],

            'berat_badan' => [
                'tanggal_lalu'        => $dataLalu?->tgl_deteksi,
                'tanggal_ini'         => $deteksiTerbaru->tgl_deteksi,
                'bulan_lalu'          => $bbLalu,
                'bulan_ini'           => $bbIni,
                'perubahan'           => $selisihBb,
                'status'              => $statusBb,
                'pesan'               => $this->pesan('Berat badan', $statusBb, $selisihBb, 'kg'),
                'target'              => $targetBb,                 // = bulan_lalu + KBM
                'kenaikan_dibutuhkan' => $kbm['nilai'],             // KBM
                'interval_bulan'      => $kbm['interval'],
                'memenuhi_standar'    => $memenuhiBb,
                'status_kenaikan'     => $this->statusKenaikan($memenuhiBb),
                // target berikutnya (proyeksi maju sesuai interval):
                'target_berikutnya'   => $targetNextBb,
                'kenaikan_berikutnya' => $kbmNext['nilai'],
                'interval_target'     => $ivNext,
                'tanggal_target'      => $tglTarget,
                // status gizi (z-score) tetap dari hasil DeteksiController:
                'zscore'              => $deteksiTerbaru->zscore_bb_u,
                'status_gizi'         => $deteksiTerbaru->status_bb_u,
                'status_gizi_level'   => $this->level($deteksiTerbaru->status_bb_u),
            ],

            'tinggi_badan' => [
                'tanggal_lalu'        => $dataLalu?->tgl_deteksi,
                'tanggal_ini'         => $deteksiTerbaru->tgl_deteksi,
                'bulan_lalu'          => $tbLalu,
                'bulan_ini'           => $tbIni,
                'perubahan'           => $selisihTb,
                'status'              => $statusTb,
                'pesan'               => $this->pesan('Tinggi badan', $statusTb, $selisihTb, 'cm'),
                'target'              => $targetTb,                 // = bulan_lalu + KPT
                'kenaikan_dibutuhkan' => $kpt['nilai'],             // KPT
                'interval_bulan'      => $kpt['interval'],
                'memenuhi_standar'    => $memenuhiTb,
                'status_kenaikan'     => $this->statusKenaikan($memenuhiTb),
                'target_berikutnya'   => $targetNextTb,
                'kenaikan_berikutnya' => $kptNext['nilai'],
                'interval_target'     => $ivNext,
                'tanggal_target'      => $tglTarget,
                'zscore'              => $deteksiTerbaru->zscore_tb_u,
                'status_gizi'         => $deteksiTerbaru->status_tb_u,
                'status_gizi_level'   => $this->level($deteksiTerbaru->status_tb_u),
            ],

            'wasting' => [
                'zscore'            => $deteksiTerbaru->zscore_tb_bb,
                'status_gizi'       => $deteksiTerbaru->status_tb_bb,
                'status_gizi_level' => $this->level($deteksiTerbaru->status_tb_bb),
            ],
        ]);
    }

    public function detailMonitoringBalita($balitaId)
    {
        // Ambil deteksi terbaru milik balita
        $deteksi = Deteksi::with([
            'user',
            'balita.user',
            'balita.posyandu',
            'detaildeteksis'
        ])
            ->where('balita_id', $balitaId)
            ->latest('id')
            ->first();

        if (!$deteksi) {
            return response()->json([
                'message' => 'Belum ada data monitoring'
            ], 404);
        }

        $detaildeteksi = $deteksi
            ->detaildeteksis()
            ->latest('id')
            ->first();
        // z-score terbaru
        $z_bbu = $deteksi->zscore_bb_u;
        $z_tbu = $deteksi->zscore_tb_u;
        $z_bbtb = $deteksi->zscore_tb_bb;

        $status_bbu = $this->deteksiBBU($z_bbu);
        $status_tbu = $this->deteksiTBU($z_tbu);
        $status_bbtb = $this->deteksiBBTB($z_bbtb);

        // seluruh riwayat penimbangan
        $penimbangan = Deteksi::where('balita_id', $balitaId)
            ->orderByDesc('id')
            ->get();

        $sekarang = $penimbangan->first();
        $sebelumnya = $penimbangan->skip(1)->first();

        $status_berat = "Belum ada data pembanding";
        $status_tinggi = "Belum ada data pembanding";

        if ($sekarang && $sebelumnya) {

            if ($sekarang->berat > $sebelumnya->berat) {
                $status_berat = "Naik";
            } elseif ($sekarang->berat < $sebelumnya->berat) {
                $status_berat = "Turun";
            } else {
                $status_berat = "Tetap";
            }

            if ($sekarang->tinggi > $sebelumnya->tinggi) {
                $status_tinggi = "Naik";
            } elseif ($sekarang->tinggi < $sebelumnya->tinggi) {
                $status_tinggi = "Turun";
            } else {
                $status_tinggi = "Tetap";
            }
        }

        $rekomendasidata = include storage_path('data/rekomendasi.php');

        return response()->json([
            'message' => 'Detail monitoring balita',

            'data' => [
                'id' => $detaildeteksi?->id,
                'deteksi_id' => $deteksi->id,

                'name' => $deteksi->balita?->name,
                'jk' => $deteksi->balita?->jk,
                'tgl_lahir' => $deteksi->balita?->tgl_lahir,
                'orang_tua' => $deteksi->balita?->user?->name ?? '-',

                'tgl_deteksi' => $deteksi->tgl_deteksi,
                'umur' => $deteksi->umur,
                'berat' => $deteksi->berat,
                'tinggi' => $deteksi->tinggi,

                'berat_sekarang' => $sekarang?->berat,
                'berat_sebelumnya' => $sebelumnya?->berat,

                'tinggi_sekarang' => $sekarang?->tinggi,
                'tinggi_sebelumnya' => $sebelumnya?->tinggi,

                'status_berat' => $status_berat,
                'status_tinggi' => $status_tinggi,

                'zscore_bbu' => $z_bbu,
                'zscore_tbu' => $z_tbu,
                'zscore_bbtb' => $z_bbtb,

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

                'total_deteksi' => $penimbangan->count(),

                'lokasi_posyandu' =>
                $deteksi->balita?->posyandu?->nama_posyandu
                    ?? 'Posyandu Wilayah',

                'kader_pemeriksa' =>
                $deteksi->user?->name
                    ?? 'Kader Posyandu',

                'riwayat' => $penimbangan->map(function ($item) {
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

                'name' => $deteksi->balita->name,
                'orang_tua' => $deteksi->balita?->user?->name ?? '-',
                'jk' => $deteksi->balita->jk,

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

        // Pembanding = data sebelum snapshot yang dipilih
        $dataLalu = Deteksi::where('balita_id', $balita->id)
            ->where(function ($q) use ($deteksiTerbaru) {

                $q->where('tgl_deteksi', '<', $deteksiTerbaru->tgl_deteksi)

                    ->orWhere(function ($q2) use ($deteksiTerbaru) {

                        $q2->where('tgl_deteksi', $deteksiTerbaru->tgl_deteksi)
                            ->where('id', '<', $deteksiTerbaru->id);
                    });
            })
            ->orderByDesc('tgl_deteksi')
            ->orderByDesc('id')
            ->first();

        $bbIni = (float) $deteksiTerbaru->berat;
        $tbIni = (float) $deteksiTerbaru->tinggi;

        $bbLalu = $dataLalu ? (float) $dataLalu->berat : null;
        $tbLalu = $dataLalu ? (float) $dataLalu->tinggi : null;

        $selisihBb = $bbLalu !== null
            ? round($bbIni - $bbLalu, 2)
            : null;

        $selisihTb = $tbLalu !== null
            ? round($tbIni - $tbLalu, 2)
            : null;

        $statusBb = $this->tentukanStatus($selisihBb);
        $statusTb = $this->tentukanStatus($selisihTb);

        $jk = $balita->jk;

        $umurIni = (int) $deteksiTerbaru->umur;

        $umurLalu = $dataLalu && $dataLalu->umur !== null
            ? (int) $dataLalu->umur
            : null;

        $interval = $umurLalu !== null
            ? max(1, $umurIni - $umurLalu)
            : null;

        // ===============================
        // KBM & KPT
        // ===============================

        $kbm = $this->standarKenaikan(
            'standar_kbm',
            'kbm_kg',
            $jk,
            $umurLalu,
            $interval
        );

        $kpt = $this->standarKenaikan(
            'standar_kpt',
            'kpt_cm',
            $jk,
            $umurLalu,
            $interval
        );

        $targetBb = ($bbLalu !== null && $kbm['nilai'] !== null)
            ? round($bbLalu + $kbm['nilai'], 2)
            : null;

        $targetTb = ($tbLalu !== null && $kpt['nilai'] !== null)
            ? round($tbLalu + $kpt['nilai'], 2)
            : null;

        $memenuhiBb = ($selisihBb !== null && $kbm['nilai'] !== null)
            ? $selisihBb >= $kbm['nilai']
            : null;

        $memenuhiTb = ($selisihTb !== null && $kpt['nilai'] !== null)
            ? $selisihTb >= $kpt['nilai']
            : null;

        // ===============================
        // PROYEKSI TARGET BERIKUTNYA
        // ===============================

        $intervalForward =
            $kbm['interval']
            ?? $kpt['interval']
            ?? ($interval ?? 2);

        $kbmNext = $this->standarKenaikan(
            'standar_kbm',
            'kbm_kg',
            $jk,
            $umurIni,
            $intervalForward
        );

        $kptNext = $this->standarKenaikan(
            'standar_kpt',
            'kpt_cm',
            $jk,
            $umurIni,
            $intervalForward
        );

        $ivNext =
            $kbmNext['interval']
            ?? $kptNext['interval']
            ?? $intervalForward;

        $tglTarget = Carbon::parse(
            $deteksiTerbaru->tgl_deteksi
        )
            ->copy()
            ->addMonths($ivNext)
            ->toDateString();

        $targetNextBb = $kbmNext['nilai'] !== null
            ? round($bbIni + $kbmNext['nilai'], 2)
            : null;

        $targetNextTb = $kptNext['nilai'] !== null
            ? round($tbIni + $kptNext['nilai'], 2)
            : null;

        if ($memenuhiBb === false && $targetBb !== null) {
            $targetNextBb = $targetBb;
        }

        if ($memenuhiTb === false && $targetTb !== null) {
            $targetNextTb = $targetTb;
        }

        return response()->json([

            'snapshot' => [
                'deteksi_id' => $deteksiTerbaru->id,
                'tanggal'    => $deteksiTerbaru->tgl_deteksi,
                'umur'       => $umurIni,
            ],

            'balita' => [
                'nama'          => $balita->name,
                'usia_bulan'    => $umurIni,
                'jenis_kelamin' => $jk,
            ],

            'berat_badan' => [
                'tanggal_lalu'        => $dataLalu?->tgl_deteksi,
                'tanggal_ini'         => $deteksiTerbaru->tgl_deteksi,

                'bulan_lalu'          => $bbLalu,
                'bulan_ini'           => $bbIni,

                'perubahan'           => $selisihBb,

                'status'              => $statusBb,

                'pesan' => $this->pesan(
                    'Berat badan',
                    $statusBb,
                    $selisihBb,
                    'kg'
                ),

                'target'              => $targetBb,
                'kenaikan_dibutuhkan' => $kbm['nilai'],
                'interval_bulan'      => $kbm['interval'],

                'memenuhi_standar'    => $memenuhiBb,
                'status_kenaikan'     => $this->statusKenaikan($memenuhiBb),

                'target_berikutnya'   => $targetNextBb,
                'kenaikan_berikutnya' => $kbmNext['nilai'],
                'interval_target'     => $ivNext,
                'tanggal_target'      => $tglTarget,

                'zscore'            => $deteksiTerbaru->zscore_bb_u,
                'status_gizi'       => $deteksiTerbaru->status_bb_u,
                'status_gizi_level' => $this->level(
                    $deteksiTerbaru->status_bb_u
                ),
            ],

            'tinggi_badan' => [
                'tanggal_lalu'        => $dataLalu?->tgl_deteksi,
                'tanggal_ini'         => $deteksiTerbaru->tgl_deteksi,

                'bulan_lalu'          => $tbLalu,
                'bulan_ini'           => $tbIni,

                'perubahan'           => $selisihTb,

                'status'              => $statusTb,

                'pesan' => $this->pesan(
                    'Tinggi badan',
                    $statusTb,
                    $selisihTb,
                    'cm'
                ),

                'target'              => $targetTb,
                'kenaikan_dibutuhkan' => $kpt['nilai'],
                'interval_bulan'      => $kpt['interval'],

                'memenuhi_standar'    => $memenuhiTb,
                'status_kenaikan'     => $this->statusKenaikan($memenuhiTb),

                'target_berikutnya'   => $targetNextTb,
                'kenaikan_berikutnya' => $kptNext['nilai'],
                'interval_target'     => $ivNext,
                'tanggal_target'      => $tglTarget,

                'zscore'            => $deteksiTerbaru->zscore_tb_u,
                'status_gizi'       => $deteksiTerbaru->status_tb_u,
                'status_gizi_level' => $this->level(
                    $deteksiTerbaru->status_tb_u
                ),
            ],

            'wasting' => [
                'zscore'            => $deteksiTerbaru->zscore_tb_bb,
                'status_gizi'       => $deteksiTerbaru->status_tb_bb,
                'status_gizi_level' => $this->level(
                    $deteksiTerbaru->status_tb_bb
                ),
            ]
        ]);
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
    private function tentukanStatus($selisih)
    {
        if ($selisih === null) return null;
        if ($selisih > 0)      return "Kenaikan Pertumbuhan";
        if ($selisih < 0)      return "Penurunan Pertumbuhan";
        return "Stagnan";
    }

    private function pesan($label, $status, $selisih, $unit)
    {
        if ($selisih === null) return "Belum ada data pembanding dari pengukuran sebelumnya.";
        if ($status === 'Stagnan') return "$label tidak mengalami perubahan dari pengukuran sebelumnya.";
        return "$label mengalami " . strtolower($status) . " " . abs($selisih) . " $unit dari pengukuran sebelumnya.";
    }

    private function statusKenaikan(?bool $memenuhi): ?string
    {
        if ($memenuhi === null) return null;
        return $memenuhi ? 'Mengalami Kenaikan Pertumbuhan' : 'Mengalamai Penurunan Pertumbuhan';
    }

    /**
     * Ambil standar kenaikan (KBM/KPT) untuk interval & umur awal tertentu.
     * Tabel hanya menyediakan interval {2,3,4,6} bulan & umur 0-24 bulan.
     * Bila interval persis tak ada, pakai interval terdekat (dilaporkan di response).
     *
     * @return array{nilai: float|null, interval: int|null}
     */
    private function standarKenaikan(string $tabel, string $kolom, ?string $jk, ?int $umurAwal, ?int $interval): array
    {
        if (!$jk || $umurAwal === null || $interval === null) {
            return ['nilai' => null, 'interval' => null];
        }

        $gender = $this->genderStandar($jk);

        // urutkan interval tersedia dari yang paling dekat dengan interval aktual
        $tersedia = [2, 3, 4, 6];
        usort($tersedia, fn($a, $b) => abs($a - $interval) <=> abs($b - $interval));

        foreach ($tersedia as $iv) {
            $row = DB::table($tabel)
                ->where('gender', $gender)
                ->where('interval_bulan', $iv)
                ->where('umur_awal', '<=', $umurAwal)
                ->where('umur_akhir', '>=', $umurAwal)
                ->orderByRaw('ABS(umur_awal - ?)', [$umurAwal]) // utamakan bracket yang mulai di umur ini
                ->first();

            if ($row) {
                return ['nilai' => (float) $row->$kolom, 'interval' => $iv];
            }
        }

        return ['nilai' => null, 'interval' => null];
    }

    private function genderStandar(?string $jk): string
    {
        $v = strtolower(trim((string) $jk));
        return in_array($v, ['p', 'perempuan', 'female', 'f', '2'], true) ? 'perempuan' : 'laki-laki';
    }

    private function level(?string $status): ?string
    {
        if (!$status || $status === '-') return null;

        $bahaya = [
            'Berat badan sangat kurang (severely underweight)',
            'Berat badan kurang (underweight)',
            'Sangat pendek (severely stunted)',
            'Pendek (stunted)',
            'Gizi buruk (severely wasted)',
            'Gizi kurang (wasted)',
            'Obesitas (obese)',
        ];
        $waspada = [
            'Risiko berat badan lebih',
            'Berisiko gizi lebih (possible risk of overweight)',
            'Gizi lebih (overweight)',
        ];

        if (in_array($status, $bahaya, true))  return 'bahaya';
        if (in_array($status, $waspada, true)) return 'waspada';
        return 'normal';
    }
}
