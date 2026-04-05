<?php

namespace App\Http\Controllers;

use App\Models\DetailDeteksi;
use Illuminate\Http\Request;

class DetailDeteksiController extends Controller
{
    public function detaildeteksi($id)
    {
        $detaildeteksi = DetailDeteksi::with('deteksi.balita.penimbanganTerakhir')->findOrFail($id);

        $balita = $detaildeteksi->deteksi->balita;
        $penimbangan = $balita->penimbanganTerakhir;
        $deteksi = $detaildeteksi->deteksi;
        return response()->json([
            'message' => "Detail data deteksi",
            'data' => [
                'id' => $detaildeteksi->id,
                'name' => $balita->name,
                'umur' => $penimbangan->umur,
                'tgl_deteksi' => $deteksi->tgl_deteksi,
                'tinggi' => $penimbangan->tinggi,
                'berat' => $penimbangan->berat,
                'zscore_tbu' => $deteksi->zscore_tb_u,
                'zscore_bbu' => $deteksi->zscore_bb_u,
                'zscore_bbtb' => $deteksi->zscore_tb_bb,
                'status_tbu' => $deteksi->status_tb_u,
                'status_bbu' => $deteksi->status_bb_u,
                'status_bbtb' => $deteksi->status_tb_bb,
                'keterangan' => $detaildeteksi->keterangan,
                'rekomendasi' => $detaildeteksi->rekomendasi,
            ]
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'deteksi_id' => 'required|exists:deteksis,id',
                'keterangan' => 'required',
                'rekomendasi' => 'required',
            ]);

            $detaildeteksi = DetailDeteksi::create($validated);
            return response()->json([
                'message' => 'Data detail berhasil ditambahkan',
                'data' => $detaildeteksi
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage() // 🔥 tampilkan error asli
            ], 500);
        }
    }
}
