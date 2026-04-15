<?php

namespace Database\Seeders;

use App\Models\Penimbangan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PenimbanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $penimbangan = [
            [
                'balita_id' => 1,
                'umur' => 24, // bulan
                'tgl_penimbangan' => Carbon::now(),
                'berat' => 10.5,
                'tinggi' => 82.0,
                'lingkar_kepala' => 47.0,
                'lingkar_lengan' => 14.5,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'balita_id' => 2,
               
                'umur' => 18,
                'tgl_penimbangan' => Carbon::now()->subDays(7),
                'berat' => 9.2,
                'tinggi' => 78.0,
                'lingkar_kepala' => 46.0,
                'lingkar_lengan' => 13.8,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($penimbangan as $penimbangan) {
            Penimbangan::create($penimbangan);
        }
    }
}
