<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Deteksi;
use App\Models\Balita;

class MonitoringController extends Controller
{
    public function getPerkembangan($id)
    {
        $balita = Balita::find($id);

        if (!$balita) {
            return response()->json([
                'message' => 'Data balita tidak ditemukan'
            ], 404);
        }

        // =========================
        // DETEKSI TERAKHIR
        // =========================
        $deteksiTerbaru = Deteksi::where('balita_id', $id)
            ->orderBy('tgl_deteksi', 'desc')
            ->first();

        if (!$deteksiTerbaru) {
            return response()->json([
                'message' => 'Data deteksi belum tersedia'
            ], 404);
        }

        // =========================
        // BULAN & TAHUN SEKARANG
        // =========================
        $tanggalSekarang = Carbon::parse($deteksiTerbaru->tgl_deteksi);

        $bulanSekarang = $tanggalSekarang->month;
        $tahunSekarang = $tanggalSekarang->year;

        // =========================
        // BULAN SEBELUMNYA
        // =========================
        $tanggalLalu = $tanggalSekarang->copy()->subMonth();

        $bulanLalu = $tanggalLalu->month;
        $tahunLalu = $tanggalLalu->year;

        // =========================
        // DATA TERAKHIR BULAN LALU
        // =========================
        $dataLalu = Deteksi::where('balita_id', $id)
            ->whereMonth('tgl_deteksi', $bulanLalu)
            ->whereYear('tgl_deteksi', $tahunLalu)
            ->orderBy('tgl_deteksi', 'desc')
            ->first();

        $bbLalu = $dataLalu ? $dataLalu->berat : 0;
        $tbLalu = $dataLalu ? $dataLalu->tinggi : 0;

        // =========================
        // SELISIH
        // =========================
        $selisihBb = $deteksiTerbaru->berat - $bbLalu;
        $selisihTb = $deteksiTerbaru->tinggi - $tbLalu;

        // =========================
        // STATUS
        // =========================
        $statusBb = $this->tentukanStatus($selisihBb);
        $statusTb = $this->tentukanStatus($selisihTb);

        return response()->json([

            'berat_badan' => [
                'tanggal_lalu' => $dataLalu?->tgl_deteksi,
                'tanggal_ini' => $deteksiTerbaru->tgl_deteksi,

                'bulan_lalu' => $bbLalu,
                'bulan_ini' => $deteksiTerbaru->berat,

                'perubahan' => $selisihBb,

                'status' => $statusBb,

                'pesan' => "Berat badan mengalami "
                    . strtolower($statusBb)
                    . " "
                    . abs($selisihBb)
                    . " kg dari bulan lalu."
            ],

            'tinggi_badan' => [
                'tanggal_lalu' => $dataLalu?->tgl_deteksi,
                'tanggal_ini' => $deteksiTerbaru->tgl_deteksi,

                'bulan_lalu' => $tbLalu,
                'bulan_ini' => $deteksiTerbaru->tinggi,

                'perubahan' => $selisihTb,

                'status' => $statusTb,

                'pesan' => "Tinggi badan mengalami "
                    . strtolower($statusTb)
                    . " "
                    . abs($selisihTb)
                    . " cm dari bulan lalu."
            ]
        ]);
    }


    private function tentukanStatus($selisih)
    {
        if ($selisih > 0) {
            return "Kenaikan Pertumbuhan";
        } elseif ($selisih < 0) {
            return "Penurunan Pertumbuhan";
        } else {
            return "Stagnan";
        }
    }
}
