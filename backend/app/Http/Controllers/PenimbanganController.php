<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Penimbangan;
use Illuminate\Http\Request;
use Carbon\Carbon;

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
            'tgl_penimbangan' => 'required|date',
            'berat' => 'required|decimal:0,2',
            'tinggi' => 'required|decimal:0,2',
            'lingkar_kepala' => 'required|decimal:0,2',
            'lingkar_lengan' => 'required|decimal:0,2'
        ]);

        $balita = Balita::findOrFail($validated['balita_id']);

        $tglLahir = Carbon::parse($balita->tgl_lahir ?? $balita->tanggal);
        $tglTimbang = Carbon::parse($validated['tgl_penimbangan']);

        $bulan =
            ($tglTimbang->year - $tglLahir->year) * 12 +
            ($tglTimbang->month - $tglLahir->month);

        if ($tglTimbang->day < $tglLahir->day) {
            $bulan -= 1;
        }

        $validated['umur'] = $bulan < 0 ? 0 : $bulan;
        $validated['user_id'] = auth()->id();

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
            'tgl_penimbangan' => 'required|date',
            'berat' => 'required|decimal:0,2',
            'tinggi' => 'required|decimal:0,2',
            'lingkar_kepala' => 'required|decimal:0,2',
            'lingkar_lengan' => 'required|decimal:0,2',
        ]);

        $balita = Balita::findOrFail($validated['balita_id']);

        $tglLahir = Carbon::parse($balita->tgl_lahir ?? $balita->tanggal);
        $tglTimbang = Carbon::parse($validated['tgl_penimbangan']);

        $bulan =
            ($tglTimbang->year - $tglLahir->year) * 12 +
            ($tglTimbang->month - $tglLahir->month);

        if ($tglTimbang->day < $tglLahir->day) {
            $bulan -= 1;
        }
        $validated['umur'] = $bulan < 0 ? 0 : $bulan;

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
                'balita_id' => $penimbangan->balita_id,
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
