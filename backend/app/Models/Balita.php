<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Balita extends Model
{
    protected $table = 'balitas';

    protected $fillable = [
        'user_id',
        'name',
        'jk',
        'tgl_lahir',
        'tmp_lahir',
        'alamat'
    ];

    protected $casts = [
        'tgl_lahir' => 'date',
    ];
}
