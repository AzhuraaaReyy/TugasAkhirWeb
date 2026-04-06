<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserNotifikasi extends Model
{
    protected $table = 'user_notifications';
    protected $fillable = [
        'notification_id',
        'user_id',
        'metode',
        'status_kirim',
        'status_baca'
    ];

    public function notifikasi()
    {
        return $this->belongsTo(Notifikasi::class, 'notification_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
