<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use Illuminate\Http\Request;

class BalitaController extends Controller
{
    public function index()
    {
        $balitas = Balita::with(['user', 'posyandu'])->orderBy('id', 'asc') // 🔥 urut dari ID kecil ke besar
            ->get();


        $data = $balitas->map(function ($balita) {
            return [
                'id' => $balita->id,
                'nama' => $balita->name,
                'orangtua' => $balita->user?->name,
                'jk' => $balita->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tanggal' => $balita->tgl_lahir,
                'tempatlahir' => $balita->tmp_lahir,
                'alamat' => $balita->alamat,
                'posyandu' => $balita->posyandu?->nama_posyandu,
            ];
        });

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'jk' => 'required|in:L,P',
            'tgl_lahir' => 'required|date',
            'tmp_lahir' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posyandu_id' => 'required|exists:posyandus,id',
        ]);

        $balita = Balita::create($validated);
        return response()->json([
            'message' => 'Data balita berhasil ditambahkan',
            'data' => $balita
        ], 201);
    }

    public function show($id)
    {
        $balita = Balita::with(['user', 'posyandu'])->findOrFail($id);

        return response()->json([
            'message' => 'Detail data balita',
            'data' => [
                'id' => $balita->id,
                'name' => $balita->name,
                'jk' => $balita->jk,
                'tgl_lahir' => $balita->tgl_lahir,
                'tmp_lahir' => $balita->tmp_lahir,
                'alamat' => $balita->alamat,

                'posyandu_id' => $balita->posyandu_id,
                'user_id' => $balita->user_id,

                'posyandu' => $balita->posyandu?->nama_posyandu,
                'orangtua' => $balita->user?->name,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $balita = Balita::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'jk' => 'required|in:L,P',
            'tgl_lahir' => 'required|date',
            'tmp_lahir' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posyandu_id' => 'required|exists:posyandus,id',
        ]);

        $balita->update($validated);
        return response()->json([
            'message' => 'Data berhasil di update',
            'data' => $balita
        ]);
    }
    public function destroy($id)
    {
        $balita = Balita::findOrFail($id);

        $balita->delete();

        return response()->json([
            'message' => 'Data balita berhasil dihapus'
        ]);
    }
}
