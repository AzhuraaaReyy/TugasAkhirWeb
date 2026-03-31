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
                'penimbangan_id' => 1,
                'zscore_tb_u' => -2.5,
                'zscore_bb_u' => -2.2,
                'zscore_tb_bb' => -1.8,
                'status_tb_u' => 'Pendek',
                'status_bb_u' => 'Gizi Kurang',
                'status_tb_bb' => 'Normal',
                'kesimpulan' => 'Berisiko Stunting',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'penimbangan_id' => 2,
                'zscore_tb_u' => -1.0,
                'zscore_bb_u' => -0.8,
                'zscore_tb_bb' => -0.5,
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
