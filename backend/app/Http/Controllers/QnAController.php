<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeBase;
use App\Models\UnansweredQuestion;
use App\Models\Deteksi;
use App\Services\ChatbotEngine;

class QnAController extends Controller
{
    public function __construct(private ChatbotEngine $engine) {}

    public function ask(Request $request)
    {
        $request->validate([
            'question'   => 'required|string',
            'balita_id'  => 'required|integer',
            'session_id' => 'nullable|string',
        ]);

        // 🔥 Generate session_id otomatis kalau frontend belum kirim
        $sessionId = $request->session_id ?? 'sess_' . uniqid();

        $response = $this->engine->process(
            $sessionId,
            $request->balita_id,
            $request->question
        );

        return response()->json($response);
    }
}
