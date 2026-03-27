<?php

namespace Database\Seeders;

use App\Models\Edukasi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EdukasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $edukasi = [
            [
                'judul' => 'Apa itu Stunting?',
                'konten' => 'Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis.',
                'tipe' => 'artikel',
                'url_video' => null,
                'thumbnail' => 'stunting.jpg',
            ],
            [
                'judul' => 'Cara Mencegah Stunting',
                'konten' => 'Pencegahan stunting dapat dilakukan dengan memberikan gizi seimbang dan pemeriksaan rutin.',
                'tipe' => 'artikel',
                'url_video' => null,
                'thumbnail' => 'pencegahan.jpg',
            ],
            [
                'judul' => 'Video Edukasi Stunting',
                'konten' => null,
                'tipe' => 'video',
                'url_video' => 'https://www.youtube.com/watch?v=abcd1234',
                'thumbnail' => 'video_stunting.jpg',
            ],
        ];
        foreach ($edukasi as $edukasi) {
            Edukasi::create($edukasi);
        }
    }
}
