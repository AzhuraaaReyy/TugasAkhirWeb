<?php

namespace Database\Seeders;

use App\Models\Edukasi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
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
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),

            ],
            [
                'judul' => 'Cara Mencegah Stunting',
                'konten' => 'Pencegahan stunting dapat dilakukan dengan memberikan gizi seimbang dan pemeriksaan rutin.',
                'tipe' => 'artikel',
                'url_video' => null,
                'thumbnail' => 'pencegahan.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'judul' => 'Video Edukasi Stunting',
                'konten' => null,
                'tipe' => 'video',
                'url_video' => 'https://www.youtube.com/watch?v=abcd1234',
                'thumbnail' => 'video_stunting.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($edukasi as $edukasi) {
            Edukasi::create($edukasi);
        }
    }
}
