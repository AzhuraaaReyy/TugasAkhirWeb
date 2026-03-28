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
        'alamat',
        'posyandu_id'
    ];

    protected $casts = [
        'tgl_lahir' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function posyandu()
    {
        return $this->belongsTo(Posyandu::class);
    }
}
