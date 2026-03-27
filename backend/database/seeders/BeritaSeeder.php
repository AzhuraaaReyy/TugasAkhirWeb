<?php

namespace Database\Seeders;

use App\Models\Berita;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
            ],
            [
                'judul' => 'Peran Orang Tua dalam Gizi Anak',
                'isi' => 'Orang tua memiliki peran penting dalam memastikan asupan gizi seimbang untuk anak.',
                'gambar' => 'gizi_anak.jpg',
                'tanggal' => '2024-02-15',
            ],

        ];
        foreach ($berita as $berita) {
            Berita::create($berita);
        }
    }
}
