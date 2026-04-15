<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Deteksi extends Model
{
    protected $table = 'deteksis';

    protected $fillable = [
        'balita_id',
        'tgl_deteksi',
        'umur',
        'berat',
        'tinggi',
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

    // AMAN ACCESSOR UMUR
    public function getUmurAttribute($value)
    {
        if (!$this->relationLoaded('balita') || !$this->balita) {
            return $value; // fallback DB
        }

        if (!$this->tgl_deteksi || !$this->balita->tgl_lahir) {
            return null;
        }

        return Carbon::parse($this->balita->tgl_lahir)
            ->diffInMonths(Carbon::parse($this->tgl_deteksi));
    }

    public function balita()
    {
        return $this->belongsTo(Balita::class);
    }

    public function detaildeteksis()
    {
        return $this->hasMany(DetailDeteksi::class);
    }
}
