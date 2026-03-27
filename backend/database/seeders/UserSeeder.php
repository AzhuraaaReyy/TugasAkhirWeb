<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin Utama',
                'email' => 'admin@gmail.com',
                'password' => Hash::make('123456'),
                'no_telp' => '081111111111',
                'role' => 'admin',
                'alamat' => 'Semarang',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Kader Posyandu',
                'email' => 'kader@gmail.com',
                'password' => Hash::make('123456'),
                'no_telp' => '082222222222',
                'role' => 'kader',
                'alamat' => 'Semarang',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Orang Tua 1',
                'email' => 'orangtua1@gmail.com',
                'password' => Hash::make('123456'),
                'no_telp' => '083333333333',
                'role' => 'orangtua',
                'alamat' => 'Semarang',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];
        foreach ($users as $users) {
            User::create($users);
        }
    }
}
