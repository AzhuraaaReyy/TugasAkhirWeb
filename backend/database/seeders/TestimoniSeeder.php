<?php

namespace Database\Seeders;

use App\Models\Testimoni;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TestimoniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $testimoni = [
            [
                'user_id' => 1,
                'rating' => 5,
                'komentar' => 'Aplikasi sangat membantu dalam memantau tumbuh kembang anak.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 2,
                'rating' => 4,
                'komentar' => 'Fitur deteksi stunting sangat berguna, tapi UI bisa ditingkatkan lagi.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($testimoni as $testimoni) {
            Testimoni::create($testimoni);
        }
    }
}
