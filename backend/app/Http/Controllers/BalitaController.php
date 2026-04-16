<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Http\Request;
use Carbon\Carbon;

class BalitaController extends Controller
{
    public function index()
    {
        //ambil data deteksi yang berelasi dengan balita
        $deteksis = Deteksi::with('balita')
            ->orderBy('tgl_deteksi', 'desc')
            ->get();

        //ambil data terbaru saja
        $deteksiTerbaru = $deteksis
            ->groupBy('balita_id')
            ->map(function ($items) {
                return $items->first(); // karena sudah di sort desc
            });

        //menghitung stunting dan tidak stunting
        $stunting = $deteksiTerbaru->filter(function ($item) {
            $status = strtolower($item->status_tb_u ?? '');

            return str_contains($status, 'sangat pendek') ||
                str_contains($status, 'pendek');
        })->count();

        $tidakStunting = $deteksiTerbaru->filter(function ($item) {
            $status = strtolower($item->status_tb_u ?? '');

            return str_contains($status, 'normal') ||
                str_contains($status, 'tinggi');
        })->count();

        //ambil data balita
        $balitas = Balita::with(['user', 'posyandu'])->orderBy('id', 'asc')
            ->get();


        $data = $balitas->map(function ($balita) {
            return [
                'id' => $balita->id,
                'name' => $balita->name,
                'orangtua' => $balita->user?->name,
                'jk' => $balita->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tgl_lahir' => $balita->tgl_lahir,
                'tmp_lahir' => $balita->tmp_lahir,
                'alamat' => $balita->alamat,
                'posyandu' => $balita->posyandu?->nama_posyandu,
                'status_tb_u' => $deteksi->status_tb_u ?? '-',
                'status_bb_u' => $deteksi->status_bb_u ?? '-',
                'tgl_deteksi_terakhir' => $deteksi->tgl_deteksi ?? null,
            ];
        });
        $totalBalita = Balita::count();
        $lastUpdate = Carbon::parse(Deteksi::max('updated_at'))
            ->timezone('Asia/Jakarta')
            ->toDateTimeString();
        return response()->json([
            'data' => $data,
            'total_balita' => $totalBalita,
            'stunting' => $stunting,
            'tidak_stunting' => $tidakStunting,
            'last_update' => $lastUpdate
        ]);
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
