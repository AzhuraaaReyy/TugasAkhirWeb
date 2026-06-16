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

        // ====== KRITERIA RUJUKAN ======
        $statusRujukanTBU  = ['Sangat pendek (severely stunted)', 'Pendek (stunted)'];
        $statusRujukanBBTB = ['Gizi buruk (severely wasted)', 'Obesitas (obese)'];
        $statusRujukanBBU  = ['Berat badan sangat kurang (severely underweight)'];

        $cekRujukan = function ($d) use ($statusRujukanTBU, $statusRujukanBBTB, $statusRujukanBBU) {
            return in_array($d->status_tb_u, $statusRujukanTBU, true)
                || in_array($d->status_tb_bb, $statusRujukanBBTB, true)
                || in_array($d->status_bb_u, $statusRujukanBBU, true);
        };

        // ====== DATA RUJUKAN (bulan ini + bulan sebelumnya, dengan pembeda) ======
        // Ambil SEMUA deteksi (hanya difilter search) agar riwayat rujukan lintas
        // bulan tetap terlihat. Tanggal TIDAK difilter di sini supaya bulan-bulan
        // sebelumnya ikut terbaca.
        $perBalita = Deteksi::with('balita')
            ->when($request->search, function ($q) use ($request) {
                $q->whereHas('balita', function ($b) use ($request) {
                    $b->where('name', 'like', '%' . $request->search . '%');
                });
            })
            ->orderByDesc('tgl_deteksi')
            ->orderByDesc('id')
            ->get()
            ->groupBy('balita_id');

        $bulanSekarang = now()->format('Y-m');

        $rujukan = $perBalita
            ->map(function ($grup) use ($cekRujukan, $bulanSekarang, $statusRujukanTBU, $statusRujukanBBU) {
                $latest = $grup->first(); // deteksi terbaru anak ini
                if (!$cekRujukan($latest)) {
                    return null; // status terkini sudah tidak perlu rujukan
                }

                $bulanLatest = $latest->tgl_deteksi
                    ? date('Y-m', strtotime($latest->tgl_deteksi))
                    : null;
                $bulanIni = $bulanLatest !== null && $bulanLatest === $bulanSekarang;

                // Pernah berstatus rujukan pada bulan yang LEBIH AWAL dari deteksi terbaru?
                $dirujukSebelumnya = $grup->slice(1)->contains(function ($d) use ($cekRujukan, $bulanLatest) {
                    if (!$cekRujukan($d)) {
                        return false;
                    }
                    if (!$bulanLatest || !$d->tgl_deteksi) {
                        return true;
                    }
                    return date('Y-m', strtotime($d->tgl_deteksi)) < $bulanLatest;
                });

                // Alasan rujukan dari deteksi terbaru
                $alasan = [];
                if (in_array($latest->status_tb_u, $statusRujukanTBU, true))  $alasan[] = 'stunting';
                if ($latest->status_tb_bb === 'Gizi buruk (severely wasted)') $alasan[] = 'gizi buruk';
                if ($latest->status_tb_bb === 'Obesitas (obese)')             $alasan[] = 'obesitas';
                if (in_array($latest->status_bb_u, $statusRujukanBBU, true))  $alasan[] = 'berat badan sangat kurang';

                // Pembeda untuk kader
                if ($dirujukSebelumnya) {
                    $periode    = 'Sudah dirujuk sebelumnya';
                    $keterangan = 'Sudah dirujuk pada bulan sebelumnya - cukup pantau tindak lanjut, tidak perlu rujukan baru.';
                } elseif ($bulanIni) {
                    $periode    = 'Rujukan baru (bulan ini)';
                    $keterangan = 'Rujukan baru terdeteksi bulan ini - perlu segera dirujuk ke Puskesmas.';
                } else {
                    $periode    = 'Bulan sebelumnya';
                    $keterangan = 'Terdeteksi pada bulan sebelumnya dan belum ada penimbangan ulang pada bulan ini.';
                }

                return [
                    'id'                       => $latest->id,
                    'balitaname'               => $latest->balita?->name,
                    'tanggal'                  => $latest->tgl_deteksi,
                    'umur'                     => $latest->umur,
                    'status_tb_u'              => $latest->status_tb_u,
                    'status_bb_u'              => $latest->status_bb_u,
                    'status_tb_bb'             => $latest->status_tb_bb,
                    'alasan'                   => implode(', ', $alasan),
                    'bulan_ini'                => $bulanIni,
                    'sudah_dirujuk_sebelumnya' => $dirujukSebelumnya,
                    'periode'                  => $periode,
                    'keterangan'               => $keterangan,
                ];
            })
            ->filter()
            ->values();

        // ====== DATA STATUS PENIMBANGAN BULAN INI (sudah + belum, jadi satu) ======
        // Periode = bulan dari tanggal filter bila ada, selain itu bulan berjalan.
        $tahun = $request->tanggal ? date('Y', strtotime($request->tanggal)) : now()->year;
        $bulan = $request->tanggal ? date('m', strtotime($request->tanggal)) : now()->month;

        $sudahIds = Deteksi::whereYear('tgl_deteksi', $tahun)
            ->whereMonth('tgl_deteksi', $bulan)
            ->pluck('balita_id')
            ->unique();

        $statusTimbang = Balita::with(['posyandu', 'user'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            })
            ->get()
            ->map(function ($b) use ($sudahIds, $tahun, $bulan) {
                $sudah = $sudahIds->contains($b->id);

                return [
                    'id'              => $b->id,
                    'name'            => $b->name,
                    'orangtua'        => $b->user?->name,
                    'posyandu'        => $b->posyandu?->nama_posyandu,
                    'sudah_ditimbang' => $sudah,
                    'status'          => $sudah ? 'Sudah ditimbang' : 'Belum ditimbang',
                    'tanggal_timbang' => $sudah
                        ? Deteksi::where('balita_id', $b->id)
                        ->whereYear('tgl_deteksi', $tahun)
                        ->whereMonth('tgl_deteksi', $bulan)
                        ->max('tgl_deteksi')
                        : null,
                    'terakhir_timbang' => Deteksi::where('balita_id', $b->id)->max('tgl_deteksi'),
                ];
            })
            ->values();

        return response()->json([
            'balita'         => $balita,
            'deteksi'        => $deteksi,
            'rujukan'        => $rujukan,
            'status_timbang' => $statusTimbang,
        ]);
    }
}
