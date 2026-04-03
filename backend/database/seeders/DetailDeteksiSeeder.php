<?php

namespace Database\Seeders;

use App\Models\DetailDeteksi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DetailDeteksiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $detaildeteksis = [
            [
                'deteksi_id' => 1,
                'keterangan' => 'balita ini mendekati stunting segera lakukan pemeriksaan lebih lanjut',
                'rekomendasi' => 'lakukan pemberian MPASI rutin',
            ],
            [
                'deteksi_id' => 2,
                'keterangan' => 'balita ini normal tidak ada indikasi stunting',
                'rekomendasi' => 'jangan lupa imunisasi anak',
            ],
        ];
        foreach ($detaildeteksis as $detaildeteksis) {
            DetailDeteksi::create($detaildeteksis);
        }
    }
}
