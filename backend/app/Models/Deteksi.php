<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deteksi extends Model
{
    protected $table = 'deteksis';
    protected $fillable = [
        'balita_id',
        'tgl_deteksi',
        'zscore_tb_u',
        'zscore_bb_u',
        'zscore_tb_bb',
        'status_tb_u',
        'status_bb_u',
        'status_tb_bb',

    ];

    protected $casts = [
        'tgl_deteksi' => 'date',
    ];

    public function balita()
    {
        return $this->belongsTo(Balita::class);
    }

    public function detaildeteksis()
    {
        return $this->hasMany(DetailDeteksi::class);
    }
}
