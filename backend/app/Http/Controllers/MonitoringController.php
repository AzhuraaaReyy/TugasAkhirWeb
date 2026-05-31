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
