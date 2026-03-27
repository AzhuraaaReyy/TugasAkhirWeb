<?php

namespace Database\Seeders;

use App\Models\KaderPosyandu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
class KaderPosyanduSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kaderposyandu = [
            [
                'user_id' => 1,
                'posyandu_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 2,
                'posyandu_id' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($kaderposyandu as $kaderposyandu) {
            KaderPosyandu::create($kaderposyandu);
        }
    }
}
