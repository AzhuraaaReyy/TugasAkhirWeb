<?php

namespace App\Http\Controllers;

use App\Models\Deteksi;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function chartStunting()
    {
        $data = Deteksi::all();
        $grouped = [];

        foreach ($data as $item) {
            $month = $item->tgl_deteksi->format('m'); // atau 'M' untuk Jan, Feb...
            $year = $item->tgl_deteksi->format('Y');
            $key = $year . '-' . $month;

            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'month' => $month,
                    'year' => (int) $year,
                    'stunting' => 0,
                    'tidakStunting' => 0,
                ];
            }

            $status = $this->deteksiTBU($item->zscore_tb_u);

            if ($status === 'Sangat pendek (severely stunted)' || $status === 'Pendek (stunted)') {
                $grouped[$key]['stunting'] += 1;
            } else {
                $grouped[$key]['tidakStunting'] += 1;
            }
        }

        return response()->json(array_values($grouped));
    }
}
