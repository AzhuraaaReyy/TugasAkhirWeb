<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatSession extends Model
{
    protected $table = 'chat_sessions';
    protected $fillable = [
        'session_id',
        'deteksi_id',
        'current_topic',
        'current_intent',
        'context',
        'history',
        'fail_count'
    ];
    protected $casts = [
        'context' => 'array',
        'history' => 'array',
    ];

    public function deteksi()
    {
        return $this->belongsTo(Deteksi::class);
    }
}
