<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use Illuminate\Http\Request;

class BalitaController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'jk' => 'required|in:L,P',
            'tgl_lahir' => 'required|date',
            'tmp_lahir' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posyandu' => 'required|string|max:255',
        ]);

        $balita = Balita::create($validated);
        return response()->json([
            'message' => 'Data balita berhasil ditambahkan',
            'data' => $balita
        ], 201);
    }
}
