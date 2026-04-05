<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Http\Request;

class RiwayatGrafikController extends Controller
{
    public function ambildatabalita($id)
    {
        $balita = Balita::with(['penimbangans.user', 'penimbanganTerakhir', 'user'])
            ->find($id);

        if (!$balita) {
            return response()->json(['message' => 'Balita tidak ditemukan'], 404);
        }

        // ambil deteksi terakhir
        $deteksi = Deteksi::where('balita_id', $id)
            ->latest('tgl_deteksi')
            ->first();


        // AMBIL 2 DATA TERAKHIR
        $penimbangans = $balita->penimbangans
            ->sortByDesc('tgl_penimbangan')
            ->values();

        $sekarang = $penimbangans->get(0);
        $sebelumnya = $penimbangans->get(1);


        // HITUNG STATUS
        $status_berat = "Belum ada data pembanding";
        $status_tinggi = "Belum ada data pembanding";

        if ($sekarang && $sebelumnya) {
            // BERAT
            if ($sekarang->berat > $sebelumnya->berat) {
                $status_berat = "Naik";
            } elseif ($sekarang->berat < $sebelumnya->berat) {
                $status_berat = "Turun";
            } else {
                $status_berat = "Tetap";
            }

            // TINGGI
            if ($sekarang->tinggi > $sebelumnya->tinggi) {
                $status_tinggi = "Naik";
            } elseif ($sekarang->tinggi < $sebelumnya->tinggi) {
                $status_tinggi = "Turun";
            } else {
                $status_tinggi = "Tetap";
            }
        }


        return response()->json([
            'id' => $balita->id,
            'name' => $balita->name,
            'jk' => $balita->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
            'tanggal_lahir' => $balita->tgl_lahir,

            // data terakhir
            'berat' => $sekarang?->berat ?? "",
            'tinggi' => $sekarang?->tinggi ?? "",
            'umur' => $sekarang?->umur ?? "",

            // perbandingan
            'berat_sekarang' => $sekarang?->berat,
            'berat_sebelumnya' => $sebelumnya?->berat,
            'tinggi_sekarang' => $sekarang?->tinggi,
            'tinggi_sebelumnya' => $sebelumnya?->tinggi,

            // status hasil perbandingan
            'status_berat' => $status_berat,
            'status_tinggi' => $status_tinggi,

            // lainnya
            'orang_tua' => $balita->user?->name ?? "",
            'total_penimbangan' => $balita->penimbangans->count(),
            'status_tbu' => $deteksi?->status_tb_u ?? "",
            'penimbangans' => $balita->penimbangans,
        ]);
    }

    public function grafik($id)
    {
        $balita = Balita::with('penimbangans')->findOrFail($id);
        $data = $balita->penimbangans
            ->sortBy('tgl_penimbangan') //ambil tanggal
            ->values()
            ->map(function ($item) {
                return [
                    'umur' => $item->umur, // pastikan ada field ini
                    'tinggi' => (float) $item->tinggi,
                    'berat' => (float) $item->berat,
                ];
            });
        return response()->json($data);
    }
}
