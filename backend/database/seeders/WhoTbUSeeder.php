<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WhoTbUSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $file = fopen(storage_path('app/public/who_tb_u.csv'), 'r');
        // skip header
        fgetcsv($file);

        while (($data = fgetcsv($file, 1000, ',')) !== FALSE) {
            DB::table('who_tb_u')->insert([
                'month' => $data[0],
                'l' => $data[1],
                'm' => $data[2],
                's' => $data[3],
                'sd' => $data[4],
                'sd_minus_3' => $data[5],
                'sd_minus_2' => $data[6],
                'sd_minus_1' => $data[7],
                'sd_0' => $data[8],
                'sd_1' => $data[9],
                'sd_2' => $data[10],
                'sd_3' => $data[11],
                'gender' => trim($data[12]),
            ]);
        }

        fclose($file);
    }
}
