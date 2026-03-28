<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Posyandu extends Model
{
    protected $table = 'posyandus';

    protected $fillable = [
        'nama_posyandu',
        'alamat',
        'latitude',
        'longitude',
    ];

    public function balitas()
    {
        return $this->hasMany(Balita::class);
    }
}
