<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

abstract class Controller
{
    public function index()
    {
        return view('welcome');
    }

    protected function pastikanMilikOrangTua($balitaId)
    {
        $user = Auth::user(); // perlu object user karena membaca role

        if ($user && $user->role === 'orangtua') {
            $milik = Balita::where('id', $balitaId)
                ->where('user_id', Auth::id())
                ->exists();

            if (!$milik) {
                abort(403, 'Anda tidak memiliki akses ke data balita ini.');
            }
        }
    }

    protected function normalisasiNoTelp(?string $no): ?string
    {
        if (!$no) return null;

        $no = preg_replace('/[^0-9]/', '', $no);   // buang spasi, +, strip

        if (str_starts_with($no, '62'))  return $no;
        if (str_starts_with($no, '0'))   return '62' . substr($no, 1);

        return '62' . $no;
    }

    protected function susunPerkembangan(Balita $balita, Deteksi $deteksiTerbaru): array
    {
        // Pembanding = pengukuran terakhir sebelum deteksi acuan
        $dataLalu = Deteksi::where('balita_id', $balita->id)
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

        $intervalBeda = $interval !== null && $kbm['interval'] !== null && $interval !== (int) $kbm['interval'];

        // Jarak pengukuran terlalu jauh -> KBM/KPT tidak dapat dinilai
        // (skala linear dari jendela 3 bulan tidak sahih untuk rentang panjang)
        $BATAS_INTERVAL = 6; // bulan
        $intervalTerlaluJauh = $interval !== null && $interval > $BATAS_INTERVAL;
        if ($intervalTerlaluJauh) {
            $kbmHarapan = null;   // target & evaluasi periode lalu otomatis hilang
            $kptHarapan = null;
        }

        $kbmBerlaku = $umurLalu !== null && $kbm['nilai'] !== null && !$intervalTerlaluJauh;
        $kptBerlaku = $umurLalu !== null && $kpt['nilai'] !== null && !$intervalTerlaluJauh;

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
                $catatanBb = "Berat badan anak melebihi batas ideal. Penurunan berat tidak boleh dilakukan secara drastis. Konsultasikan penanganan yang aman kepada petugas Posyandu.";
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
                $catatanBb = "Ini merupakan penimbangan pertama sehingga belum ada data pembanding. Penilaian kenaikan berat badan dapat dilakukan pada penimbangan berikutnya.";
            } elseif ($lebihDari24) {
                $catatanBb = "Anak telah berusia lebih dari 24 bulan. Pada usia ini berat badan dinilai berdasarkan status gizi, bukan target kenaikan minimal.";
            } elseif ($intervalTerlaluJauh) {
                $catatanBb = "Jarak penimbangan terlalu jauh ({$interval} bulan) sehingga kenaikan berat tidak dapat dinilai dengan standar KBM. Penilaian menggunakan status gizi saat ini. Mulailah menimbang anak secara rutin setiap bulan.";
            } elseif ($intervalBeda) {
                $catatanBb = "Jarak penimbangan saat ini {$interval} bulan, sedangkan standar penilaian menggunakan jendela 3 bulan, sehingga target bersifat perkiraan. Dianjurkan menimbang anak sesuai jadwal standar.";
            }
        }

        $peringatanBb = null;
        if ($bbLalu !== null && $bbLalu > 0 && $selisihBb !== null && $interval !== null) {
            $persenPerBulan = abs($selisihBb) / $bbLalu * 100 / max(1, $interval);
            if ($persenPerBulan > 10) {
                $arahKata   = $selisihBb > 0 ? 'bertambah' : 'berkurang';
                $besarNilai = abs(round($selisihBb, 1));
                $peringatanBb = "Berat badan anak tercatat {$arahKata} cukup drastis, yaitu {$besarNilai} kg dalam {$interval} bulan. "
                    . "Perubahan sebesar ini jarang terjadi secara wajar pada balita, sehingga kemungkinan terdapat kekeliruan saat menimbang atau mencatat data. "
                    . "Mohon periksa kembali ketepatan data penimbangan. Apabila data sudah benar, segera konsultasikan kondisi anak kepada tenaga kesehatan.";
            }
        }

        // ============================================================
        //  TINGGI BADAN
        // ============================================================
        $zTbuIni  = (float) $deteksiTerbaru->zscore_tb_u;
        $zTbuLalu = $dataLalu ? (float) $dataLalu->zscore_tb_u : null;
        $modeTinggi = ($zTbuIni < -2) ? 'kejar' : 'normal';

        // Rentang tinggi ideal WHO TB/U pada umur saat ini (informasi saja)
        $lmsTb = $this->lmsTBU($umurIni, $jk);
        $idealMinTb = $idealMaxTb = null;
        if ($lmsTb) {
            $idealMinTb = round($this->nilaiDariZScore(-2, $lmsTb->l, $lmsTb->m, $lmsTb->s), 1);
            $idealMaxTb = round($this->nilaiDariZScore(3,  $lmsTb->l, $lmsTb->m, $lmsTb->s), 1);
        }

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
            $catatanTb = "Ini merupakan pengukuran pertama sehingga belum ada data pembanding. Penilaian pertambahan tinggi badan dapat dilakukan pada pengukuran berikutnya.";
        } elseif ($lebihDari24) {
            $catatanTb = "Anak telah berusia lebih dari 24 bulan. Pada usia ini tinggi badan dinilai berdasarkan status gizi; anak dengan tinggi di bawah standar diberikan target kejar (catch-up).";
        } elseif ($intervalTerlaluJauh) {
            $catatanTb = "Jarak pengukuran terlalu jauh ({$interval} bulan) sehingga pertambahan tinggi tidak dapat dinilai dengan standar KPT. Penilaian menggunakan status gizi saat ini. Mulailah mengukur anak secara rutin setiap bulan.";
        } elseif ($intervalBeda) {
            $catatanTb = "Jarak pengukuran saat ini {$interval} bulan, sedangkan standar penilaian menggunakan jendela 3 bulan, sehingga target bersifat perkiraan. Dianjurkan mengukur tinggi anak sesuai jadwal standar.";
        }

        $peringatanTb = null;
        if ($selisihTb !== null && $selisihTb < 0) {
            $peringatanTb = "Tinggi badan anak tercatat berkurang dibandingkan pengukuran sebelumnya. Tinggi badan tidak mungkin berkurang, sehingga kemungkinan terjadi kesalahan pencatatan atau pengukuran. Mohon periksa kembali data tersebut.";
        }

        // ---------- Bulatkan SEMUA angka tampilan ke 1 desimal ----------
        $r1 = fn($x) => $x === null ? null : round((float) $x, 1);

        return [
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
                'ideal_min'            => $r1($idealMinTb),
                'ideal_max'            => $r1($idealMaxTb),
                'ideal_info'           => true,

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
        ];
    }


    protected function akgUntukUmur(int $umurBulan): ?array
    {
        $akg = \Illuminate\Support\Facades\DB::table('akg_balitas')
            ->where('umur_awal', '<=', $umurBulan)
            ->where('umur_akhir', '>=', $umurBulan)
            ->first();

        if (!$akg) return null;

        // Kirim SEMUA kolom apa adanya (vitamin & mineral baru otomatis ikut,
        // begitu pula kolom apa pun yang ditambahkan di masa depan)...
        $data = (array) $akg;

        // ...lalu rapikan field yang punya bentuk khusus
        $data['kelompok_umur'] = $akg->label_kelompok;
        $data['sumber']        = 'Permenkes No. 28 Tahun 2019 (AKG)';
        $data['padanan']       = $akg->padanan ? json_decode($akg->padanan, true) : null;

        // field internal yang tidak perlu dikirim ke frontend
        unset($data['id'], $data['created_at'], $data['updated_at']);

        return $data;
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
}
