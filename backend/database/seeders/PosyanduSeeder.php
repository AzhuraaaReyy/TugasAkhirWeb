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
                'nama_posyandu' => 'Posyandu Mekarsari 1',
                'alamat' => 'Dusun Indrakila,RT01 RW04, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.14155012271324,
                'longitude' => 110.37278088073869,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 2',
                'alamat' => 'Jalan Pulang Geni, RT.04/RW.02, Lerep, Ungaran Barat, Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.134777691078884,
                'longitude' => 110.38553673790365,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 3',
                'alamat' => 'Jalan Pulang Geni V, Lerep RT07 RW 03, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.132266239450126,
                'longitude' => 110.3855414904869,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mukti Arum',
                'alamat' => 'Jl. Srikandi Raya, Suko, Ungaran, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'latitude' => -7.126613,
                'longitude' => 110.391507,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 5',
                'alamat' => 'Gg. Cakra 3 No.3, Tegalrejo, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50511',
                'latitude' => -7.123174993638521,
                'longitude' =>  110.39537771169648,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 7',
                'alamat' => 'karangbolo rt 01 rw 07 lerep ungaran barat, Suko, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50511',
                'latitude' => -7.1270048034793945,
                'longitude' => 110.39894689566486,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 8',
                'alamat' => 'Jl. Buntu, Kretak, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.122620424473068,
                'longitude' =>  110.39837077946449,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            [
                'nama_posyandu' => 'Posyandu Ngesti Rahayu 9',
                'alamat' => 'Jl. BIMA III Kamang-tengah, Lerep RT8 RW9, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.116123789911839,
                'longitude' => 110.39639096267996,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Ngesti Rahayu 10',
                'alamat' => 'Jl. Yudistira Raya No.KM 3, Mapagan, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.114641256651064,
                'longitude' => 110.3971407762645,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Nuju Sehat',
                'alamat' => 'Jl. Yudistira Raya No.KM 3, Mapagan, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'latitude' => -7.120241324072709,
                'longitude' =>  110.39028766398877,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($posyandu as $posyandu) {
            Posyandu::create($posyandu);
        }
    }
}
