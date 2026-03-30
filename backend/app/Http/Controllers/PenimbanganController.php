<?php

namespace App\Http\Controllers;

use App\Models\Penimbangan;
use Illuminate\Http\Request;

class PenimbanganController extends Controller
{
    public function index()
    {
        $penimbangan = Penimbangan::with(['user', 'balita'])->orderBy('id', 'asc')->get();
        $data = $penimbangan->map(function ($penimbangan) {
            return [
                'id' => $penimbangan->id,
                'nama_balita' => $penimbangan->balita?->name,
                'nama_kader' => $penimbangan->user?->name,
                'umur' => $penimbangan->umur,
                'tgl_penimbangan' => $penimbangan->tgl_penimbangan,
                'berat' => $penimbangan->berat,
                'tinggi' => $penimbangan->tinggi,
                'lingkar_kepala' => $penimbangan->lingkar_kepala,
                'lingkar_lengan' => $penimbangan->lingkar_lengan,
            ];
        });
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'user_id' => 'required|exists:users,id',
            'umur' => 'required|integer',
            'tgl_penimbangan' => 'required|date',
            'berat' => 'required|decimal:0,2',
            'tinggi' => 'required|decimal:0,2',
            'lingkar_kepala' => 'required|decimal:0,2',
            'lingkar_lengan' => 'required|decimal:0,2'
        ]);

        $penimbangan = Penimbangan::create($validated);
        return response()->json([
            'message' => 'Data berhasil ditambahkan',
            'data' => $penimbangan
        ]);
    }

    public function update(Request $request, $id)
    {
        $penimbangan = Penimbangan::findOrFail($id);
        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'user_id' => 'required|exists:users,id',
            'umur' => 'required|integer',
            'tgl_penimbangan' => 'required|date',
            'berat' => 'required|decimal:0,2',
            'tinggi' => 'required|decimal:0,2',
            'lingkar_kepala' => 'required|decimal:0,2',
            'lingkar_lengan' => 'required|decimal:0,2',
        ]);
        $penimbangan->update($validated);
        return response()->json([
            'message' => 'Data berhasil di update',
            'data' => $penimbangan
        ]);
    }
    public function destroy($id)
    {
        $penimbangan = Penimbangan::findOrFail($id);
        $penimbangan->delete();

        return response()->json([
            'message' => 'Data berhasil dihapus'
        ]);
    }

    public function show($id)
    {
        $penimbangan = Penimbangan::with(['user', 'balita'])->findOrFail($id);
        return response()->json([
            'message' => 'Detail data Penimbangan',
            'data' => [
                'id' => $penimbangan->id,
                'nama_balita' => $penimbangan->balita?->name,
                'nama_kader' => $penimbangan->user?->name,
                'umur' => $penimbangan->umur,
                'tgl_penimbangan' => $penimbangan->tgl_penimbangan,
                'berat' => $penimbangan->berat,
                'tinggi' => $penimbangan->tinggi,
                'lingkar_kepala' => $penimbangan->lingkar_kepala,
                'lingkar_lengan' => $penimbangan->lingkar_lengan,
            ]
        ]);
    }
}
