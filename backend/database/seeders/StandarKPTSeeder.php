<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class StandarKPTSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $file = fopen(storage_path('app/public/dataKPT.csv'), 'r');

        // Skip header CSV
        fgetcsv($file);

        while (($data = fgetcsv($file, 1000, ',')) !== false) {

            DB::table('standar_kpt')->insert([
                'interval_bulan' => $data[0],
                'umur_awal'      => $data[1],
                'umur_akhir'     => $data[2],
                'gender'         => trim($data[3]),
                'kpt_cm'         => $data[4],
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);
        }

        fclose($file);
    }
}
