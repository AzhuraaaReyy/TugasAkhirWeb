<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailDeteksi extends Model
{
    protected $table = 'detaildeteksis';
    protected $fillable = [
        'deteksi_id',
        'keterangan',
        'rekomendasi'
    ];

    public function deteksis()
    {
        return $this->belongsTo(Deteksi::class);
    }
}
