<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Deteksi extends Model
{
    protected $table = 'deteksis';
    protected $fillable = [
        'balita_id',
        'tgl_penimbangan',
        'z-score_tb_u',
        'z-score_bb_u',
        'z-score_tb_bb',
        'status_tb_u',
        'status_bb_u',
        'status_tb_bb',
        'kesimpulan',
    ];

    protected $casts = [
        'tgl_penimbangan' => 'date',
    ];
}
