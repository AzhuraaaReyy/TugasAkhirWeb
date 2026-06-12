<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Penimbangan;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\Deteksi;

class PenimbanganController extends Controller
{
    public function index()
    {
        $data = Deteksi::with(['balita', 'user'])
            ->orderByDesc('tgl_deteksi') // pengukuran terbaru di atas
            ->orderByDesc('id')          // pemecah seri bila tgl sama
            ->get()
            ->groupBy('balita_id')
            ->map(fn($items) => $items->first()) // ambil yang terbaru tiap balita
            ->values()                           // reset key agar jadi array bersih
            ->map(function ($deteksi) {
                return [
                    'id'              => $deteksi->id,
                    'nama_balita'     => $deteksi->balita?->name,
                    'nama_kader'      => $deteksi->user?->name,
                    'umur'            => $deteksi->umur,
                    'tgl_penimbangan' => $deteksi->tgl_deteksi?->toDateString(),
                    'berat'           => $deteksi->berat,
                    'tinggi'          => $deteksi->tinggi,

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
        $validated['user_id'] = Auth::id();

        $penimbangan = Penimbangan::create($validated);

        return response()->json([
            'message' => 'Data berhasil ditambahkan',
            'data' => $penimbangan
        ]);
    }

    public function update(Request $request, $id)
    {
        $deteksi = Deteksi::findOrFail($id);

        $validated = $request->validate([
            'balita_id' => 'required|exists:balitas,id',
            'tgl_deteksi' => 'required|date',
            'berat' => 'required|decimal:0,2',
            'tinggi' => 'required|decimal:0,2',

        ]);

        $balita = Balita::findOrFail($validated['balita_id']);

        // hitung umur (bulan) saat deteksi
        $tglLahir = Carbon::parse($balita->tgl_lahir ?? $balita->tanggal);
        $tglDeteksi = Carbon::parse($validated['tgl_deteksi']);

        $bulan =
            ($tglDeteksi->year - $tglLahir->year) * 12 +
            ($tglDeteksi->month - $tglLahir->month);

        if ($tglDeteksi->day < $tglLahir->day) {
            $bulan -= 1;
        }
        $umur = $bulan < 0 ? 0 : $bulan;

        // simpan ke kolom yang sesuai: tgl_penimbangan (input) -> tgl_deteksi (kolom)
        $deteksi->update([
            'balita_id' => $validated['balita_id'],
            'tgl_deteksi' => $validated['tgl_deteksi'],
            'berat' => $validated['berat'],
            'tinggi' => $validated['tinggi'],

            'umur' => $umur,
        ]);

        return response()->json([
            'message' => 'Data berhasil di update',
            'data' => $deteksi->load(['balita', 'user']),
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
        $deteksi = Deteksi::with(['user', 'balita'])->findOrFail($id);

        return response()->json([
            'message' => 'Detail data Deteksi',
            'data' => [
                'id' => $deteksi->id,
                'balita_id' => $deteksi->balita_id,
                'nama_balita' => $deteksi->balita?->name,
                'nama_kader' => $deteksi->user?->name,
                'umur' => $deteksi->umur,
                'tgl_deteksi' => $deteksi->tgl_deteksi?->toDateString(),
                'berat' => $deteksi->berat,
                'tinggi' => $deteksi->tinggi,
            ]
        ]);
    }
}
