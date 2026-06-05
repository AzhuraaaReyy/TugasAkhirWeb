<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Support\Carbon;
use App\Services\ChatbotEngine;

class DashboardOrangTuaController extends Controller
{
    public function __construct(private ChatbotEngine $engine) {}

    public function ask(Request $request)
    {
        $request->validate([
            'question'   => 'required|string',
            'balita_id'  => 'required|integer',
            'session_id' => 'nullable|string',
        ]);

        //Generate session_id otomatis kalau frontend belum kirim
        $sessionId = $request->session_id ?? 'sess_' . uniqid();

        $response = $this->engine->process(
            $sessionId,
            $request->balita_id,
            $request->question
        );

        return response()->json($response);
    }


    public function lengkapiNoTelp(Request $request)
    {
        $request->merge([
            'no_telp' => $this->normalisasiNoTelp($request->no_telp),
        ]);

        $request->validate([
            'no_telp' => 'required|regex:/^62[0-9]{9,13}$/',
        ], [
            'no_telp.regex' => 'Format nomor HP tidak valid. Contoh: 081234567890',
        ]);

        $user = $request->user();

        $pemilikLama = User::where('no_telp', $request->no_telp)
            ->where('id', '!=', $user->id)
            ->first();

        // nomor milik akun aktif lain -> bukan haknya
        if ($pemilikLama && $pemilikLama->akun_aktif) {
            return response()->json([
                'message' => 'Nomor HP ini sudah digunakan akun lain. Bila ini nomor Anda, silakan login dengan nomor tersebut.',
            ], 422);
        }

        $jumlahAnakPindah = 0;

        DB::transaction(function () use ($user, $pemilikLama, $request, &$jumlahAnakPindah) {

            // nomor milik akun PASIF buatan kader -> pindahkan anak-anaknya
            if ($pemilikLama && !$pemilikLama->akun_aktif) {
                $jumlahAnakPindah = Balita::where('user_id', $pemilikLama->id)
                    ->update(['user_id' => $user->id]);

                $pemilikLama->tokens()->delete();
                $pemilikLama->delete();
            }

            $user->update(['no_telp' => $request->no_telp]);
        });

        return response()->json([
            'message' => $jumlahAnakPindah > 0
                ? "Nomor HP tersimpan. {$jumlahAnakPindah} data anak Anda berhasil terhubung ke akun ini."
                : 'Nomor HP tersimpan.',
            'anak_tertaut' => $jumlahAnakPindah,
        ]);
    }


    public function getPerkembangan($id)
    {
        $this->pastikanMilikOrangTua($id);

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

        // ---------- Nilai dasar ----------
        $bbIni  = (float) $deteksiTerbaru->berat;
        $tbIni  = (float) $deteksiTerbaru->tinggi;
        $bbLalu = $dataLalu ? (float) $dataLalu->berat : null;
        $tbLalu = $dataLalu ? (float) $dataLalu->tinggi : null;

        $selisihBb = $bbLalu !== null ? round($bbIni - $bbLalu, 2) : null;
        $selisihTb = $tbLalu !== null ? round($tbIni - $tbLalu, 2) : null;

        $statusBb = $this->tentukanStatus($selisihBb);
        $statusTb = $this->tentukanStatus($selisihTb);

        // ---------- Umur & interval ----------
        $jk       = $balita->jk; // 'L' / 'P'
        $umurLalu = ($dataLalu && $dataLalu->umur !== null) ? (int) $dataLalu->umur : null;
        $umurIni  = (int) $deteksiTerbaru->umur;
        $interval = $umurLalu !== null ? max(1, $umurIni - $umurLalu) : null;

        $pengukuranPertama = $dataLalu === null;
        $lebihDari24       = $umurLalu !== null && $umurLalu > 24;

        // KBM/KPT (tabel = jendela 3 bulan)
        $kbm = $this->standarKenaikan('standar_kbm', 'kbm_kg', $jk, $umurLalu, $interval);
        $kpt = $this->standarKenaikan('standar_kpt', 'kpt_cm', $jk, $umurLalu, $interval);

        $kbmHarapan = $this->skalaInterval($kbm['nilai'], $kbm['interval'], $interval);
        $kptHarapan = $this->skalaInterval($kpt['nilai'], $kpt['interval'], $interval);

        $kbmBerlaku = $umurLalu !== null && $kbm['nilai'] !== null;
        $kptBerlaku = $umurLalu !== null && $kpt['nilai'] !== null;
        $intervalBeda = $interval !== null && $kbm['interval'] !== null && $interval !== (int) $kbm['interval'];

        // Proyeksi target berikutnya (jendela asli tabel = 3 bln)
        $intervalForward = $kbm['interval'] ?? $kpt['interval'] ?? 3;
        $kbmNext = $this->standarKenaikan('standar_kbm', 'kbm_kg', $jk, $umurIni, $intervalForward);
        $kptNext = $this->standarKenaikan('standar_kpt', 'kpt_cm', $jk, $umurIni, $intervalForward);
        $ivNext  = $kbmNext['interval'] ?? $kptNext['interval'] ?? 3;
        $tglTarget = Carbon::parse($deteksiTerbaru->tgl_deteksi)
            ->copy()->addMonths($ivNext)->toDateString();

        // ============================================================
        //  BERAT BADAN
        // ============================================================
        $zBbtb        = (float) $deteksiTerbaru->zscore_tb_bb;
        $statusGiziBb = $this->labelGiziBBTB($zBbtb);
        $arahBb       = $this->arahDariBBTB($zBbtb);

        $lmsBb = $this->lmsBBTB($tbIni, $jk);
        $idealMin = $idealMax = null;
        if ($lmsBb) {
            $idealMin = round($this->nilaiDariZScore(-2, $lmsBb->l, $lmsBb->m, $lmsBb->s), 1);
            $idealMax = round($this->nilaiDariZScore(1,  $lmsBb->l, $lmsBb->m, $lmsBb->s), 1);
        }
        $dalamIdeal = ($idealMin !== null && $bbIni >= $idealMin && $bbIni <= $idealMax);

        $penurunanDibutuhkan = null;
        $catatanBb = null;
        $kenaikanDibutuhkanBb = null;
        $kenaikanBerikutnyaBb = null;

        if ($arahBb === 'turun') {
            $penurunanDibutuhkan = ($idealMax !== null) ? max(0, round($bbIni - $idealMax, 1)) : 0;
            $targetBb   = $idealMax;
            $memenuhiBb = $dalamIdeal;
            $targetNextBb = $idealMax;

            if (!$dalamIdeal) {
                $catatanBb = "Berat anak berlebih. Jangan turunkan berat anak dengan cepat. Tanyakan ke petugas Posyandu cara yang aman.";
            }
        } else {
            $targetBb = ($bbLalu !== null && $kbmHarapan !== null) ? round($bbLalu + $kbmHarapan, 2) : null;
            $memenuhiBb = ($selisihBb !== null && $kbmHarapan !== null) ? ($selisihBb >= $kbmHarapan) : null;
            if ($dalamIdeal) $memenuhiBb = true;

            $targetNextBb = ($kbmNext['nilai'] !== null) ? round($bbIni + $kbmNext['nilai'], 2) : null;
            $kenaikanBerikutnyaBb = $kbmNext['nilai'];
            $kenaikanDibutuhkanBb = $kbmHarapan;

            if ($memenuhiBb === false && $targetBb !== null) {
                $targetNextBb = $targetBb;
            }

            if ($pengukuranPertama) {
                $catatanBb = "Ini penimbangan pertama, jadi belum ada pembandingnya. Hasil kenaikan berat baru terlihat di penimbangan berikutnya.";
            } elseif ($lebihDari24) {
                $catatanBb = "Anak sudah lebih dari 2 tahun. Di usia ini berat dinilai dari status gizinya, bukan dari target kenaikan.";
            } elseif ($intervalBeda) {
                $catatanBb = "Jarak penimbangan ini {$interval} bulan, padahal patokannya 3 bulan. Jadi angka ini hanya perkiraan. Sebaiknya timbang anak tiap 3 bulan.";
            }
        }

        $peringatanBb = null;
        if ($bbLalu !== null && $bbLalu > 0 && $selisihBb !== null && $interval !== null) {
            $persenPerBulan = abs($selisihBb) / $bbLalu * 100 / max(1, $interval);
            if ($persenPerBulan > 10) {
                $peringatanBb = "Berat anak berubah terlalu banyak ("
                    . ($selisihBb > 0 ? "naik" : "turun") . " " . abs(round($selisihBb, 1))
                    . " kg dalam {$interval} bulan). Coba cek lagi angkanya. Kalau benar, segera bawa anak ke petugas kesehatan.";
            }
        }

        // ============================================================
        //  TINGGI BADAN
        // ============================================================
        $zTbuIni  = (float) $deteksiTerbaru->zscore_tb_u;
        $zTbuLalu = $dataLalu ? (float) $dataLalu->zscore_tb_u : null;
        $modeTinggi = ($zTbuIni < -2) ? 'kejar' : 'normal';

        $targetTb   = ($tbLalu !== null && $kptHarapan !== null) ? round($tbLalu + $kptHarapan, 2) : null;
        $memenuhiTb = ($selisihTb !== null && $kptHarapan !== null) ? ($selisihTb >= $kptHarapan) : null;

        $kenaikanBerikutnyaTb = $kptNext['nilai'];
        $targetNextTb = ($kptNext['nilai'] !== null) ? round($tbIni + $kptNext['nilai'], 2) : null;

        if ($modeTinggi === 'kejar') {
            $LANGKAH_KEJAR = 0.05;
            $umurTarget = $umurIni + $ivNext;
            $lmsTbu = $this->lmsTBU($umurTarget, $jk);
            if ($lmsTbu) {
                $zTarget = min(-2.0, $zTbuIni + $LANGKAH_KEJAR * $ivNext);
                $tinggiTarget = $this->nilaiDariZScore($zTarget, $lmsTbu->l, $lmsTbu->m, $lmsTbu->s);
                $kenaikanKejar = max($kptNext['nilai'] ?? 0, round($tinggiTarget - $tbIni, 2));
                $kenaikanBerikutnyaTb = round($kenaikanKejar, 2);
                $targetNextTb = round($tbIni + $kenaikanKejar, 1);
            }
        }

        if ($memenuhiTb === false && $targetTb !== null) {
            $targetNextTb = $targetTb;
        }

        $trenZTbu = null;
        if ($zTbuLalu !== null) {
            $selisihZ = round($zTbuIni - $zTbuLalu, 2);
            $trenZTbu = $selisihZ > 0.02 ? 'membaik' : ($selisihZ < -0.02 ? 'memburuk' : 'tetap');
        }

        $catatanTb = null;
        if ($pengukuranPertama) {
            $catatanTb = "Ini pengukuran pertama, jadi belum ada pembandingnya. Hasil kenaikan tinggi baru terlihat di pengukuran berikutnya.";
        } elseif ($lebihDari24) {
            $catatanTb = "Anak sudah lebih dari 2 tahun. Di usia ini tinggi dinilai dari status gizinya. Kalau anak pendek, akan diberi target tambahan untuk mengejar.";
        } elseif ($intervalBeda) {
            $catatanTb = "Jarak pengukuran ini {$interval} bulan, padahal patokannya 3 bulan. Jadi angka ini hanya perkiraan. Sebaiknya ukur tinggi anak tiap 3 bulan.";
        }

        $peringatanTb = null;
        if ($selisihTb !== null && $selisihTb < 0) {
            $peringatanTb = "Tinggi anak tercatat berkurang dari sebelumnya. Tinggi tidak mungkin berkurang, jadi mungkin ada salah ketik atau salah ukur. Coba cek lagi datanya.";
        }

        // ---------- Bulatkan SEMUA angka tampilan ke 1 desimal ----------
        $r1 = fn($x) => $x === null ? null : round((float) $x, 1);

        // ============================================================
        //  RESPONSE
        // ============================================================
        return response()->json([
            'balita' => [
                'nama'          => $balita->name ?? null,
                'usia_bulan'    => $umurIni,
                'jenis_kelamin' => $jk,
            ],

            'berat_badan' => [
                'tanggal_lalu'         => $dataLalu?->tgl_deteksi,
                'tanggal_ini'          => $deteksiTerbaru->tgl_deteksi,
                'bulan_lalu'           => $r1($bbLalu),
                'bulan_ini'            => $r1($bbIni),
                'perubahan'            => $r1($selisihBb),
                'status'               => $statusBb,
                'pesan'                => $this->pesan('Berat badan', $statusBb, $selisihBb, 'kg'),

                'arah_target'          => $arahBb,
                'ideal_min'            => $r1($idealMin),
                'ideal_max'            => $r1($idealMax),
                'penurunan_dibutuhkan' => $r1($penurunanDibutuhkan),

                'target'               => $r1($targetBb),
                'kenaikan_dibutuhkan'  => $r1($kenaikanDibutuhkanBb),
                'interval_bulan'       => $interval,
                'memenuhi_standar'     => $memenuhiBb,
                'status_kenaikan'      => $this->statusKenaikan($memenuhiBb),

                'target_berikutnya'    => $r1($targetNextBb),
                'kenaikan_berikutnya'  => $r1($kenaikanBerikutnyaBb),
                'interval_target'      => $ivNext,
                'tanggal_target'       => $tglTarget,

                'kbm_berlaku'          => $kbmBerlaku,
                'catatan'              => $catatanBb,
                'peringatan'           => $peringatanBb,

                'zscore'               => $deteksiTerbaru->zscore_tb_bb,
                'status_gizi'          => $statusGiziBb,
                'status_gizi_level'    => $this->level($deteksiTerbaru->status_tb_bb),
            ],

            'tinggi_badan' => [
                'tanggal_lalu'         => $dataLalu?->tgl_deteksi,
                'tanggal_ini'          => $deteksiTerbaru->tgl_deteksi,
                'bulan_lalu'           => $r1($tbLalu),
                'bulan_ini'            => $r1($tbIni),
                'perubahan'            => $r1($selisihTb),
                'status'               => $statusTb,
                'pesan'                => $this->pesan('Tinggi badan', $statusTb, $selisihTb, 'cm'),

                'arah_target'          => 'naik',
                'mode_target'          => $modeTinggi,
                'ideal_min'            => null,
                'ideal_max'            => null,

                'target'               => $r1($targetTb),
                'kenaikan_dibutuhkan'  => $r1($kptHarapan),
                'interval_bulan'       => $interval,
                'memenuhi_standar'     => $memenuhiTb,
                'status_kenaikan'      => $this->statusKenaikan($memenuhiTb),

                'target_berikutnya'    => $r1($targetNextTb),
                'kenaikan_berikutnya'  => $r1($kenaikanBerikutnyaTb),
                'interval_target'      => $ivNext,
                'tanggal_target'       => $tglTarget,

                'kpt_berlaku'          => $kptBerlaku,
                'catatan'              => $catatanTb,
                'peringatan'           => $peringatanTb,

                'zscore'               => $zTbuIni,
                'zscore_lalu'          => $zTbuLalu,
                'tren_zscore'          => $trenZTbu,
                'status_gizi'          => $deteksiTerbaru->status_tb_u,
                'status_gizi_level'    => $this->level($deteksiTerbaru->status_tb_u),
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
        $this->pastikanMilikOrangTua($balitaId);
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

    public function grafik($balita_id)
    {
        $this->pastikanMilikOrangTua($balita_id);
        $deteksisRaw = Deteksi::where('balita_id', $balita_id)
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


    //helper
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




    private function arahDariBBTB($z)
    {
        if ($z < -2) return 'naik';        // gizi buruk / kurang
        if ($z <= 1) return 'pertahankan'; // gizi baik (normal)
        return 'turun';                    // berisiko / lebih / obesitas
    }

    /** Label singkat status gizi BB/TB untuk badge kartu. */
    private function labelGiziBBTB($z)
    {
        if ($z < -3) return 'Gizi Buruk';
        if ($z < -2) return 'Gizi Kurang';
        if ($z <= 1) return 'Gizi Baik';
        if ($z <= 2) return 'Risiko Gizi Lebih';
        if ($z <= 3) return 'Gizi Lebih';
        return 'Obesitas';
    }

    /** Ambil baris L,M,S BB/TB untuk tinggi & gender (snap 0.5 cm). */
    private function lmsBBTB($tb, $jk)
    {
        $tb = round($tb * 2) / 2;
        return DB::table('who_bb_tb')
            ->whereRaw('ABS(height - ?) < 0.01', [$tb])
            ->where('gender', $jk)
            ->first();
    }

    /** Ambil baris L,M,S TB/U untuk umur & gender. */
    private function lmsTBU($umur, $jk)
    {
        return DB::table('who_tb_u')
            ->where('month', (int) $umur)
            ->where('gender', $jk)
            ->first();
    }

    /** Kebalikan rumus z-score: cari nilai (kg / cm) pada z tertentu. */
    private function nilaiDariZScore($z, $l, $m, $s)
    {
        if ($l == 0) return $m * exp($s * $z);
        return $m * pow(1 + $l * $s * $z, 1 / $l);
    }

    private function skalaInterval($nilai, $intervalStandar, $intervalAktual)
    {
        if ($nilai === null || !$intervalStandar || $intervalAktual === null) {
            return $nilai;
        }
        if ((int) $intervalAktual === (int) $intervalStandar) {
            return $nilai;
        }
        return round($nilai * ($intervalAktual / $intervalStandar), 3);
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
}
