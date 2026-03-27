<?php

namespace Database\Seeders;

use App\Models\FAQ;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class FAQSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faq = [
            [
                'pertanyaan' => 'Apa itu stunting?',
                'jawaban' => 'Stunting adalah kondisi gagal tumbuh pada anak akibat kekurangan gizi kronis.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'pertanyaan' => 'Apa penyebab utama stunting?',
                'jawaban' => 'Penyebab utama adalah kekurangan gizi dalam waktu lama, infeksi berulang, dan pola asuh yang kurang tepat.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($faq as $faq) {
            FAQ::create($faq);
        }
    }
}
