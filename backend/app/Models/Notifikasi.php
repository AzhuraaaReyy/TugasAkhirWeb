<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasis';
    protected $fillable = [
        'pengirim_id',
        'penerima_id',
        'judul',
        'pesan',
        'tipe',
        'status_baca',
        'waktu_kirim',
    ];

    protected $casts = [
        'status_baca' => 'boolean',
        'waktu_kirim' => 'datetime',
    ];
}
