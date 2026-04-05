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
        $balitaQuery = Balita::with(['posyandu', 'user']);

        if ($request->search) {
            $balitaQuery->where('name', 'like', '%' . $request->search . '%');
        }

        $balita = $balitaQuery->paginate(10)->through(function ($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'jk' => $b->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tgl_lahir' => $b->tgl_lahir,
                'tmp_lahir' => $b->tmp_lahir,
                'alamat' => $b->alamat,
                'posyandu' => $b->posyandu?->nama_posyandu,
                'orangtua' => $b->user?->name,
            ];
        });

        $penimbanganQuery = Penimbangan::with('balita');

        if ($request->search) {
            $penimbanganQuery->whereHas('balita', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->tanggal) {
            $penimbanganQuery->whereDate('tgl_penimbangan', $request->tanggal);
        }

        $penimbangan = $penimbanganQuery->paginate(10)->through(function ($p) {
            return [
                'id' => $p->id,
                'balita' => $p->balita?->name,
                'umur' => $p->umur,
                'tanggal' => $p->tgl_penimbangan,
                'berat' => $p->berat,
                'tinggi' => $p->tinggi,
                'lingkar_kepala' => $p->lingkar_kepala,
                'lingkar_lengan' => $p->lingkar_lengan,
            ];
        });

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
                'id' => $d->id,
                'balitaname' => $d->balita?->name,
                'tanggal' => $d->tgl_deteksi,
                'zscore_tb_u' => $d->zscore_tb_u,
                'zscore_bb_u' => $d->zscore_bb_u,
                'zscore_tb_bb' => $d->zscore_tb_bb,
                'status_tb_u' => $d->status_tb_u,
                'status_bb_u' => $d->status_bb_u,
                'status_tb_bb' => $d->status_tb_bb,
            ];
        });

        return response()->json([
            'balita' => $balita,
            'penimbangan' => $penimbangan,
            'deteksi' => $deteksi,
        ]);
    }
}
