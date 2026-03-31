<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DeteksiController extends Controller
{
    public function ambildatabalita()
    {
        $balita = Balita::with('penimbanganTerakhir')->get();

        return response()->json($balita->map(function ($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'jk' => $b->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tanggal_lahir' => $b->tgl_lahir,

                'berat' => $b->penimbanganTerakhir->berat ?? "",
                'tinggi' => $b->penimbanganTerakhir->tinggi ?? "",
                'tgl_penimbangan' => $b->penimbanganTerakhir->tgl_penimbangan ?? "",
            ];
        }));
    }

    public function deteksi(Request $request)
    {
        $request->validate([
            'balita_id' => 'required|exists:balita,id',
        ]);

        $balita = Balita::with('penimbanganTerakhir')->find($request->balita_id);

        if (!$balita || !$balita->penimbanganTerakhir) {
            return response()->json(['message' => 'Data penimbangan tidak ditemukan'], 404);
        }

        $umurBulan = $this->hitungUmurBulan($balita->tgl_lahir);
        $jk = $balita->jk;
        $bb = $balita->penimbanganTerakhir->berat;
        $tb = $balita->penimbanganTerakhir->tinggi;

        // Status BB/U
        $statusBBU = $this->deteksiBBU($umurBulan, $jk, $bb);

        // Status TB/U
        $statusTBU = $this->deteksiTBU($umurBulan, $jk, $tb);

        // Status BB/TB
        $statusBBTB = $this->deteksiBBTB($tb, $jk, $bb);

        return response()->json([
            'balita_id' => $balita->id,
            'name' => $balita->name,
            'umur_bulan' => $umurBulan,
            'bb' => $bb,
            'tb' => $tb,
            'status_bbu' => $statusBBU,
            'status_tbu' => $statusTBU,
            'status_bb_tb' => $statusBBTB,
        ]);
    }

    // ================================
    // Fungsi bantu
    // ================================

    private function hitungUmurBulan($tgl_lahir)
    {
        $lahir = Carbon::parse($tgl_lahir);
        $sekarang = Carbon::now();
        return $lahir->diffInMonths($sekarang);
    }

    private function deteksiBBU($umur, $jk, $bb)
    {
        $dataWHO = DB::table('who_bb_u')
            ->where('month', $umur)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return "Data WHO tidak ditemukan";

        $z = ($bb - $dataWHO->m) / $dataWHO->s;

        if ($z < -3) return "Gizi Buruk";
        if ($z >= -3 && $z < -2) return "Gizi Kurang";
        if ($z >= -2 && $z <= 2) return "Gizi Normal";
        if ($z > 2) return "Berat Badan Lebih";
    }

    private function deteksiTBU($umur, $jk, $tb)
    {
        $dataWHO = DB::table('who_tb_u')
            ->where('month', $umur)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return "Data WHO tidak ditemukan";

        $z = ($tb - $dataWHO->m) / $dataWHO->s;

        if ($z < -3) return "Sangat Pendek";
        if ($z >= -3 && $z < -2) return "Pendek";
        if ($z >= -2 && $z <= 3) return "Normal";
        if ($z > 3) return "Tinggi";
    }

    private function deteksiBBTB($tb, $jk, $bb)
    {
        // BB/TB lookup berdasarkan tinggi
        $dataWHO = DB::table('who_bb_tb')
            ->where('height', $tb)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return "Data WHO tidak ditemukan";

        $z = ($bb - $dataWHO->m) / $dataWHO->s;

        if ($z < -3) return "Sangat Kurus";
        if ($z >= -3 && $z < -2) return "Kurus";
        if ($z >= -2 && $z <= 1) return "Normal";
        if ($z > 1) return "Gemuk / Obesitas";
    }
}
