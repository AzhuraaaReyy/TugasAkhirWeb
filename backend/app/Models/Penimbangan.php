<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penimbangan extends Model
{
    protected $table = 'penimbangans';

    protected $fillable = [
        'balita_id',
        'user_id',
        'umur',
        'tgl_penimbangan',
        'berat',
        'tinggi',
        'lingkar_kepala',
        'lingkar_lengan',
    ];

    protected $casts = [
        'tgl_penimbangan' => 'date',
    ];

    // relasi ke balita
    public function balita()
    {
        return $this->belongsTo(Balita::class);
    }

    // relasi ke user (kader)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
