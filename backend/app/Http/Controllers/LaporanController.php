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

        // ====== DETEKSI TERBARU PER BALITA (untuk rujukan & bermasalah) ======
        // Diambil satu deteksi terbaru tiap anak agar tidak muncul berulang.
        $deteksiTerbaru = Deteksi::with('balita')
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('balita', function ($b) use ($request) {
                    $b->where('name', 'like', '%' . $request->search . '%');
                });
            })
            ->when($request->tanggal, function ($q) use ($request) {
                $q->whereDate('tgl_deteksi', $request->tanggal);
            })
            ->orderByDesc('tgl_deteksi')
            ->orderByDesc('id')
            ->get()
            ->groupBy('balita_id')
            ->map(fn($grup) => $grup->first()); // first() = paling baru (sudah diurutkan desc)

        $mapDeteksi = fn($d) => [
            'id'           => $d->id,
            'balitaname'   => $d->balita?->name,
            'tanggal'      => $d->tgl_deteksi,
            'umur'         => $d->umur,
            'status_tb_u'  => $d->status_tb_u,
            'status_bb_u'  => $d->status_bb_u,
            'status_tb_bb' => $d->status_tb_bb,
        ];

        // ====== DATA RUJUKAN (status gizi berat) ======
        $statusRujukanTBU = ['Sangat pendek (severely stunted)', 'Pendek (stunted)'];
        $statusRujukanBBTB = ['Gizi buruk (severely wasted)', 'Obesitas (obese)'];
        $statusRujukanBBU  = ['Berat badan sangat kurang (severely underweight)'];

        $rujukan = $deteksiTerbaru
            ->filter(function ($d) use ($statusRujukanTBU, $statusRujukanBBTB, $statusRujukanBBU) {
                return in_array($d->status_tb_u, $statusRujukanTBU, true)
                    || in_array($d->status_tb_bb, $statusRujukanBBTB, true)
                    || in_array($d->status_bb_u, $statusRujukanBBU, true);
            })
            ->map(function ($d) use ($mapDeteksi, $statusRujukanTBU, $statusRujukanBBU) {
                $alasan = [];
                if (in_array($d->status_tb_u, $statusRujukanTBU, true)) $alasan[] = 'stunting berat';
                if ($d->status_tb_bb === 'Gizi buruk (severely wasted)')  $alasan[] = 'gizi buruk';
                if ($d->status_tb_bb === 'Obesitas (obese)')              $alasan[] = 'obesitas';
                if (in_array($d->status_bb_u, $statusRujukanBBU, true))   $alasan[] = 'berat badan sangat kurang';

                return array_merge($mapDeteksi($d), [
                    'alasan' => implode(', ', $alasan),
                ]);
            })
            ->values();

        // ====== DATA BERMASALAH (tidak normal pada salah satu indikator) ======
        $bermasalah = $deteksiTerbaru
            ->filter(function ($d) {
                $tbuNormal  = in_array($d->status_tb_u, ['Normal', 'Tinggi'], true);
                $bbtbNormal = $d->status_tb_bb === 'Gizi baik (normal)';
                $bbuNormal  = $d->status_bb_u === 'Berat badan normal';
                return !($tbuNormal && $bbtbNormal && $bbuNormal);
            })
            ->map($mapDeteksi)
            ->values();

        // ====== DATA BELUM DITIMBANG (tidak ada deteksi pada periode terpilih) ======
        // Periode = bulan dari tanggal filter bila ada, selain itu bulan berjalan.
        $tahun = $request->tanggal ? date('Y', strtotime($request->tanggal)) : now()->year;
        $bulan = $request->tanggal ? date('m', strtotime($request->tanggal)) : now()->month;

        $sudahTimbang = Deteksi::whereYear('tgl_deteksi', $tahun)
            ->whereMonth('tgl_deteksi', $bulan)
            ->pluck('balita_id')
            ->unique();

        $belumTimbang = Balita::with(['posyandu', 'user'])
            ->whereNotIn('id', $sudahTimbang)
            ->when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            })
            ->get()
            ->map(function ($b) {
                return [
                    'id'               => $b->id,
                    'name'             => $b->name,
                    'orangtua'         => $b->user?->name,
                    'posyandu'         => $b->posyandu?->nama_posyandu,
                    'terakhir_timbang' => Deteksi::where('balita_id', $b->id)->max('tgl_deteksi'),
                ];
            })
            ->values();

        return response()->json([
            'balita'        => $balita,
            'deteksi'       => $deteksi,
            'rujukan'       => $rujukan,
            'belum_timbang' => $belumTimbang,
            'bermasalah'    => $bermasalah,
        ]);
    }
}
