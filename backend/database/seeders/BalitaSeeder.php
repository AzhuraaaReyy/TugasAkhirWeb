<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Balita;

class BalitaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $balita = [
            [
                'user_id' => 1,
                'name' => 'Mariadi Banana',
                'jk' => 'L',
                'tgl_lahir' => '2025-10-10',
                'tmp_lahir' => "Semarang",
                'alamat' => 'Soka Rt02/Rw04',
            ],
            [
                'user_id' => 2,
                'name' => 'Mariana Banana',
                'jk' => 'P',
                'tgl_lahir' => '2025-10-10',
                'tmp_lahir' => "Salatiga",
                'alamat' => 'Soka Rt05/Rw04',
            ],
        ];
        foreach ($balita as $balita) {
            Balita::create($balita);
        }
    }
}
