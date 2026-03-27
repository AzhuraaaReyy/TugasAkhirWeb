<?php

namespace Database\Seeders;

use App\Models\Posyandu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PosyanduSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posyandu = [
            [
                'nama_posyandu' => 'Posyandu Melati 1',
                'alamat' => 'Jl. Melati No. 10, Semarang',
                'latitude' => -6.9900000,
                'longitude' => 110.4200000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mawar 2',
                'alamat' => 'Jl. Mawar No. 5, Semarang',
                'latitude' => -6.9950000,
                'longitude' => 110.4250000,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($posyandu as $posyandu) {
            Posyandu::create($posyandu);
        }
    }
}
