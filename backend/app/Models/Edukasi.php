<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Edukasi extends Model
{
    protected $table = 'edukasis';
    protected $fillable = [
        'judul',
        'konten',
        'tipe',
        'url_video',
        'thumbnail',
    ];
}
