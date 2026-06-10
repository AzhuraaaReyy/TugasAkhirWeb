<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KnowledgeBase;
use App\Models\UnansweredQuestion;
use App\Models\Deteksi;
use App\Services\ChatbotEngine;
use App\Models\Balita;
use Illuminate\Support\Facades\Auth;

class QnAController extends Controller
{
    public function __construct(private ChatbotEngine $engine) {}

    public function ask(Request $request)
    {
        $request->validate([
            'question'   => 'required|string',
            'balita_id'  => 'required|integer|exists:balitas,id',
            'session_id' => 'nullable|string',
        ]);

        $user = Auth::user();

        $balita = Balita::findOrFail($request->balita_id);

        // ORANG TUA: hanya boleh akses anak miliknya
        if ($user->role === 'orangtua') {

            if ($balita->user_id != $user->id) {
                return response()->json([
                    'message' => 'Akses ditolak'
                ], 403);
            }
        }



        $sessionId = $request->session_id ?? 'sess_' . uniqid();

        $response = $this->engine->process(
            $sessionId,
            $request->balita_id,
            $request->question
        );

        return response()->json($response);
    }

    
    public function askSnapshot(Request $request)
    {
        $request->validate([
            'question'   => 'required|string',
            'balita_id'  => 'required|integer|exists:balitas,id',
            'deteksi_id' => 'required|integer|exists:deteksis,id',
            'session_id' => 'nullable|string',
        ]);

        $user = Auth::user();
        $balita = Balita::findOrFail($request->balita_id);

        if ($user->role === 'orangtua' && $balita->user_id != $user->id) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        // Pastikan deteksi ini memang milik balita tersebut
        // (mencegah orang menebak-nebak id deteksi anak lain)
        $deteksi = Deteksi::where('id', $request->deteksi_id)
            ->where('balita_id', $request->balita_id)
            ->first();

        if (!$deteksi) {
            return response()->json([
                'message' => 'Deteksi tidak ditemukan untuk balita ini',
            ], 404);
        }

        $sessionId = $request->session_id ?? 'sess_' . uniqid();

        $response = $this->engine->process(
            $sessionId,
            $request->balita_id,
            $request->question,
            $deteksi->id            // <-- konteks snapshot
        );

        return response()->json($response);
    }
}
