<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KaderPosyandu extends Model
{
    protected $table = 'kaderposyandus';
    protected $fillable = [
        'user_id',
        'posyandu_id',
    ];
}
