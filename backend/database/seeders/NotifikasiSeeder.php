<?php

namespace Database\Seeders;

use App\Models\Notifikasi;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class NotifikasiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $notifikasi = [
            [
                'pengirim_id' => 1,
                'penerima_id' => 2,
                'judul' => 'Jadwal Posyandu',
                'pesan' => 'Jangan lupa datang ke posyandu besok pukul 08.00.',
                'tipe' => 'dashboard',
                'status_baca' => false,
                'waktu_kirim' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'pengirim_id' => 1,
                'penerima_id' => 3,
                'judul' => 'Pemeriksaan Balita',
                'pesan' => 'Segera lakukan pemeriksaan rutin untuk balita Anda.',
                'tipe' => 'email',
                'status_baca' => true,
                'waktu_kirim' => Carbon::now()->subHours(5),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($notifikasi as $notifikasi) {
            Notifikasi::create($notifikasi);
        }
    }
}
