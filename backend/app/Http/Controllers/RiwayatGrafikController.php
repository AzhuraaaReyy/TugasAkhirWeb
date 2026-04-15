<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

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
        $deteksi = Deteksi::with('balita.deteksis')->findOrFail($id);

        $data = $deteksi->balita->deteksis
            ->sortBy('tgl_deteksi') // 🔥 urut berdasarkan tanggal
            ->values()
            ->map(function ($item) {

                $zScore = $item->zscore_tb_u;

                $ZScoreBBU = $item->zscore_bb_u;

                $status = $zScore !== null
                    ? $this->deteksiTBU($zScore)
                    : '-';

                $statusBBU = $ZScoreBBU !== null
                    ? $this->deteksiBBU($ZScoreBBU)
                    : '-';

                $who = DB::table('who_tb_u')
                    ->where('month', $item->umur)
                    ->where('gender', $item->balita->jk)
                    ->first();

                return [
                    'umur' => (int) $item->umur,
                    'tinggi' => (float) $item->tinggi,
                    'berat' => (float) $item->berat,

                    // 🔥 TANGGAL (PENTING)
                    'tgl_deteksi' => $item->tgl_deteksi,
                    'tgl_format' => $item->tgl_deteksi
                        ? Carbon::parse($item->tgl_deteksi)->format('Y-m-d')
                        : null,
                    'tgl_label' => $item->tgl_deteksi
                        ? Carbon::parse($item->tgl_deteksi)->translatedFormat('d M Y')
                        : '-',

                    'bulan' => $item->tgl_deteksi
                        ? Carbon::parse($item->tgl_deteksi)->translatedFormat('F')
                        : '-',

                    'status' => $status,
                    'statusBBU' => $statusBBU,
                    'zscore' => $zScore,
                    'ZScoreBBU'=> $ZScoreBBU,
                    'median_tb' => $who->m ?? null,
                    'minus2_tb' => $who ? $who->m - (2 * $who->s) : null,
                    'minus3_tb' => $who ? $who->m - (3 * $who->s) : null,
                ];
            });

        return response()->json($data);
    }


    private function deteksiTBU($z)
    {
        if ($z < -3) return "Sangat pendek (severely stunted)";
        if ($z >= -3 && $z < -2) return "Pendek (stunted)";
        if ($z >= -2 && $z <= 3) return "Normal";
        if ($z > 3) return "Tinggi";
        return "-";
    }
    private function hitungZScoreTBU($umur, $jk, $tb)
    {
        $umur = (int) $umur;

        $dataWHO = DB::table('who_tb_u')
            ->where('month', $umur)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return null;

        if ($dataWHO->l == 0) {
            return log($tb / $dataWHO->m) / $dataWHO->s;
        }

        return (pow(($tb / $dataWHO->m), $dataWHO->l) - 1) / ($dataWHO->l * $dataWHO->s);
    }

    private function hitungZScoreBBU($umur, $jk, $bb)
    {
        $umur = (int) $umur;

        $dataWHO = DB::table('who_bb_u')
            ->where('month', $umur)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return null;

        if ($dataWHO->l == 0) {
            return log($bb / $dataWHO->m) / $dataWHO->s;
        }

        return (pow(($bb / $dataWHO->m), $dataWHO->l) - 1) / ($dataWHO->l * $dataWHO->s);
    }

    private function deteksiBBU($z)
    {
        if ($z < -3) return "Berat badan sangat kurang (severely underweight)";
        if ($z >= -3 && $z < -2) return "Berat badan kurang (underweight)";
        if ($z >= -2 && $z <= 2) return "Berat badan normal";
        if ($z > 2) return "Risiko berat badan lebih";
        return "-";
    }
}
