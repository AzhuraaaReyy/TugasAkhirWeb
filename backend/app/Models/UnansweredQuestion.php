<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UnansweredQuestion extends Model
{
    protected $table = 'unanswered_questions';
    protected $fillable = ['pertanyaan', 'extracted_keywords', 'status'];
    protected $casts = ['extracted_keywords' => 'array'];
}
