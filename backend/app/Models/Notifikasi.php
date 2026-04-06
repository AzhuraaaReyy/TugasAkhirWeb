<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notifikasi extends Model
{
    protected $table = 'notifikasis';
    protected $fillable = [
        'pengirim_id',
        'judul',
        'pesan',
        'tipe',
        'tanggal',
    ];

    protected $casts = [
        'status_baca' => 'boolean',
        'waktu_kirim' => 'datetime',
    ];

    public function pengirim()
    {
        return $this->belongsTo(User::class, 'pengirim_id');
    }

    public function recipients()
    {
        return $this->hasMany(UserNotifikasi::class);
    }
}
