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
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Dusun Indrakila,RT01 RW04, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Senin, 08.00 - 11.00',
                'telepon' => '085700000001',
                'gambar' => 'posyandu/posyandu1.jpg',
                'latitude' => -7.14155012271324,
                'longitude' => 110.37278088073869,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 2',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jalan Pulang Geni, RT.04/RW.02, Lerep, Ungaran Barat, Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Selasa, 08.00 - 11.00',
                'telepon' => '085700000002',
                'gambar' => 'posyandu/posyandu2.jpg',
                'latitude' => -7.134777691078884,
                'longitude' => 110.38553673790365,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 3',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jalan Pulang Geni V, Lerep RT07 RW 03, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Rabu, 08.00 - 11.00',
                'telepon' => '085700000003',
                'gambar' => 'posyandu/posyandu3.jpg',
                'latitude' => -7.132266239450126,
                'longitude' => 110.3855414904869,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mukti Arum',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jl. Srikandi Raya, Suko, Ungaran, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah',
                'jadwal' => 'Kamis, 08.00 - 11.00',
                'telepon' => '085700000004',
                'gambar' => 'posyandu/posyandu4.jpg',
                'latitude' => -7.126613,
                'longitude' => 110.391507,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 5',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Gg. Cakra 3 No.3, Tegalrejo, Lerep, Kec. Ungaran Bar., Kabupaten Semarang, Jawa Tengah 50511',
                'jadwal' => 'Jumat, 08.00 - 11.00',
                'telepon' => '085700000005',
                'gambar' => 'posyandu/posyandu5.jpg',
                'latitude' => -7.123174993638521,
                'longitude' =>  110.39537771169648,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 7',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'karangbolo rt 01 rw 07 lerep ungaran barat, Suko, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50511',
                'jadwal' => 'Senin, 09.00 - 12.00',
                'telepon' => '085700000007',
                'gambar' => 'posyandu/posyandu6.jpg',
                'latitude' => -7.1270048034793945,
                'longitude' => 110.39894689566486,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Mekarsari 8',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jl. Buntu, Kretak, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Selasa, 09.00 - 12.00',
                'telepon' => '085700000008',
                'gambar' => 'posyandu/posyandu7.jpg',
                'latitude' => -7.122620424473068,
                'longitude' =>  110.39837077946449,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],

            [
                'nama_posyandu' => 'Posyandu Ngesti Rahayu 9',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jl. BIMA III Kamang-tengah, Lerep RT8 RW9, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Rabu, 09.00 - 12.00',
                'telepon' => '085700000009',
                'gambar' => 'posyandu/posyandu8.jpg',
                'latitude' => -7.116123789911839,
                'longitude' => 110.39639096267996,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Ngesti Rahayu 10',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jl. Yudistira Raya No.KM 3, Mapagan, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Kamis, 09.00 - 12.00',
                'telepon' => '085700000010',
                'gambar' => 'posyandu/posyandu9.jpg',
                'latitude' => -7.114641256651064,
                'longitude' => 110.3971407762645,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'nama_posyandu' => 'Posyandu Nuju Sehat',
                'kota' => 'Kabupaten Semarang',
                'alamat' => 'Jl. Yudistira Raya No.KM 3, Mapagan, Lerep, Kec. Ungaran Barat., Kabupaten Semarang, Jawa Tengah 50519',
                'jadwal' => 'Jumat, 09.00 - 12.00',
                'telepon' => '085700000011',
                'gambar' => 'posyandu/posyandu10.jpg',
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
