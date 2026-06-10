<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use App\Models\Penimbangan;
use Illuminate\Http\Request;

class LaporanController extends Controller
{
    public function laporan(Request $request)
    {
        // ====== DATA BALITA ======
        $balitaQuery = Balita::with(['posyandu', 'user']);

        if ($request->search) {
            $balitaQuery->where('name', 'like', '%' . $request->search . '%');
        }

        $balita = $balitaQuery->paginate(10)->through(function ($b) {
            return [
                'id'        => $b->id,
                'name'      => $b->name,
                'jk'        => $b->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tgl_lahir' => $b->tgl_lahir,
                'tmp_lahir' => $b->tmp_lahir,
                'posyandu'  => $b->posyandu?->nama_posyandu,
                'orangtua'  => $b->user?->name,
                'alamat'    => $b->user?->alamat,
            ];
        });

        // ====== DATA DETEKSI ======
        $deteksiQuery = Deteksi::with('balita');

        if ($request->search) {
            $deteksiQuery->whereHas('balita', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->tanggal) {
            $deteksiQuery->whereDate('tgl_deteksi', $request->tanggal);
        }

        $deteksi = $deteksiQuery->paginate(10)->through(function ($d) {
            return [
                'id'           => $d->id,
                'balitaname'   => $d->balita?->name,
                'tanggal'      => $d->tgl_deteksi,
                'umur'         => $d->umur,
                'berat'        => $d->berat,
                'tinggi'       => $d->tinggi,
                'zscore_tb_u'  => $d->zscore_tb_u,
                'zscore_bb_u'  => $d->zscore_bb_u,
                'zscore_tb_bb' => $d->zscore_tb_bb,
                'status_tb_u'  => $d->status_tb_u,
                'status_bb_u'  => $d->status_bb_u,
                'status_tb_bb' => $d->status_tb_bb,
                'metode'       => $d->metode,
            ];
        });

        return response()->json([
            'balita'  => $balita,
            'deteksi' => $deteksi,
        ]);
    }
}
