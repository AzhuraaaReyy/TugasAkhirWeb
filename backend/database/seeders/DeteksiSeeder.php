<?php

namespace Database\Seeders;

use App\Models\Deteksi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DeteksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $deteksi = [
            [
                'balita_id' => 1,
                'tgl_penimbangan' => Carbon::now(),
                'z-score_tb_u' => -2.5,
                'z-score_bb_u' => -2.2,
                'z-score_tb_bb' => -1.8,
                'status_tb_u' => 'Pendek',
                'status_bb_u' => 'Gizi Kurang',
                'status_tb_bb' => 'Normal',
                'kesimpulan' => 'Berisiko Stunting',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'balita_id' => 2,
                'tgl_penimbangan' => Carbon::now(),
                'z-score_tb_u' => -1.0,
                'z-score_bb_u' => -0.8,
                'z-score_tb_bb' => -0.5,
                'status_tb_u' => 'Normal',
                'status_bb_u' => 'Normal',
                'status_tb_bb' => 'Normal',
                'kesimpulan' => 'Normal',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

        ];
        foreach ($deteksi as $deteksi) {
            Deteksi::create($deteksi);
        }
    }
}
