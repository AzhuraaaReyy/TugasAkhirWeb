<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
class BeritaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $berita = [
            [
                'judul' => 'Pentingnya Deteksi Dini Stunting',
                'isi' => 'Deteksi dini stunting sangat penting untuk mencegah gangguan pertumbuhan pada anak sejak usia dini.',
                'gambar' => 'stunting1.jpg',
                'tanggal' => '2024-01-10',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'judul' => 'Peran Orang Tua dalam Gizi Anak',
                'isi' => 'Orang tua memiliki peran penting dalam memastikan asupan gizi seimbang untuk anak.',
                'gambar' => 'gizi_anak.jpg',
                'tanggal' => '2024-02-15',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

        ];
        foreach ($berita as $berita) {
            Berita::create($berita);
        }
    }
}
