<?php

namespace Database\Seeders;

use App\Models\Posyandu;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PosyanduSeeder extends Seeder
{
    public function run(): void
    {
        $posyandu = [
            [
                'nama_posyandu' => 'Posyandu Dusun Indrokilo',
                'alamat' => 'Jl. Parikesit II, Indrakila, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.141903843305074,
                'longitude' => 110.3719357492866,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Dusun Lerep',
                'alamat' => 'Jl. Kalimosodo Raya, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.133122,
                'longitude' => 110.386600,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Dusun Soka',
                'alamat' => 'Jl. Srikandi Raya, Suko, Ungaran, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.126613,
                'longitude' => 110.391507,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Dusun TegalRejo',
                'alamat' => 'Jl. Cakra Raya, Tegalrejo, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.123686676991353,
                'longitude' =>  110.3960718521375,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Dusun Kretek',
                'alamat' => 'Karangtolo, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.121019576960403,
                'longitude' =>  110.399069884054,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Dusun KarangBolo',
                'alamat' => 'Jl. Gg. Abimanyu III, Kretak, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.126846155974642,
                'longitude' => 110.39944357869479,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Dusun Mapagan',
                'alamat' => 'Jl. Yudistira Raya, Suruhan, Keji, Kec. Ungaran Bar., Kota Semarang, Jawa Tengah',
                'latitude' => -7.1141393088957585,
                'longitude' => 110.39511027547323,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($posyandu as $posyandu) {
            Posyandu::create($posyandu);
        }
    }
}
