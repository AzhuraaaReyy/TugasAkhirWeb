<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use App\Models\Notifikasi;
use App\Models\Posyandu;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;


        // Anak belum timbang
        $listBelumTimbang = Balita::whereDoesntHave('deteksis', function ($q) use ($bulanIni, $tahunIni) {
            $q->whereMonth('tgl_deteksi', $bulanIni)
                ->whereYear('tgl_deteksi', $tahunIni);
        })
            ->select('id', 'name')
            ->get();

        $belumTimbang = $listBelumTimbang->count();

        //Ukur berat badan
        $listTurunBB = [];

        $balitas = Balita::with([
            'deteksis' => function ($q) {
                $q->orderByDesc('tgl_deteksi')
                    ->orderByDesc('id');
            }
        ])->get();

        foreach ($balitas as $balita) {

            $deteksi = $balita->deteksis;

            if ($deteksi->count() >= 2) {

                $sekarang = $deteksi[0];
                $sebelumnya = $deteksi[1];

                if ($sekarang->berat < $sebelumnya->berat) {

                    $listTurunBB[] = [
                        'id' => $balita->id,
                        'name' => $balita->name,

                        'berat_sekarang' => $sekarang->berat,
                        'berat_sebelumnya' => $sebelumnya->berat,

                        'selisih' => $sekarang->berat - $sebelumnya->berat,

                        'tgl_sekarang' => $sekarang->tgl_deteksi,
                        'tgl_sebelumnya' => $sebelumnya->tgl_deteksi,
                    ];
                }
            }
        }

        $turunBB = count($listTurunBB);


        //buat rujukan
        $listRujukan = Deteksi::with('balita')
            ->where(function ($q) {
                $q->where('zscore_tb_u', '<', -3)
                    ->orWhere('zscore_bb_u', '<', -3)
                    ->orWhere('zscore_tb_bb', '<', -3);
            })
            ->get()
            ->map(function ($item) {

                $alasan = [];

                $keterangan = "Perlu pemeriksaan lebih lanjut untuk memastikan kondisi pertumbuhan.";

                if (!is_null($item->zscore_tb_u) && $item->zscore_tb_u < -3) {
                    $alasan[] = "Pertumbuhan tinggi badan belum sesuai usia";
                }

                if (!is_null($item->zscore_bb_u) && $item->zscore_bb_u < -3) {
                    $alasan[] = "Berat badan berada di bawah standar usia";
                }

                if (!is_null($item->zscore_tb_bb) && $item->zscore_tb_bb < -3) {
                    $alasan[] = "Berat badan tidak seimbang dengan tinggi badan";
                }

                if (count($alasan) >= 2) {
                    $keterangan = "Disarankan untuk segera berkonsultasi ke puskesmas.";
                }

                return [
                    'id' => $item->balita->id,
                    'name' => $item->balita->name,

                    'keterangan' => $keterangan,

                    'alasan' => $alasan,

                    'tgl_deteksi' => Carbon::parse($item->tgl_deteksi)
                        ->translatedFormat('d F Y'),
                ];
            });

        $rujukan = $listRujukan->count();


        //jadwal posyandu
        $jadwalNotif = Notifikasi::where('tipe', 'Jadwal Posyandu')
            ->latest('tanggal')
            ->first();

        $jadwal = $jadwalNotif
            ? Carbon::parse($jadwalNotif->tanggal)
            ->translatedFormat('d F Y')
            : '-';

        return response()->json([
            'belum_timbang' => $belumTimbang,
            'list_belum_timbang' => $listBelumTimbang,

            'turun_bb' => $turunBB,
            'list_turun_bb' => $listTurunBB,

            'rujukan' => $rujukan,
            'list_rujukan' => $listRujukan,

            'jadwal' => $jadwal,
        ]);
    }


    public function grafikStunting()
    {
        $deteksis = Deteksi::with('balita.posyandu')
            ->orderBy('created_at', 'asc')
            ->get();

        $data = $deteksis
            ->groupBy(function ($item) {
                return Carbon::parse($item->created_at)->format('Y-m');
            })
            ->map(function ($itemsPerBulan, $bulanKey) {


                //ambil data terbaru tiap bulan
                $latestPerBalita = $itemsPerBulan
                    ->sortByDesc('created_at')
                    ->groupBy('balita_id')
                    ->map(function ($items) {
                        return $items->first();
                    });

                //list berdasarkan posyandu
                return $latestPerBalita
                    ->groupBy(function ($item) {
                        return $item->balita->posyandu->nama_posyandu
                            ?? 'Tidak diketahui';
                    })
                    ->map(function ($group, $posyandu) use ($bulanKey) {

                        $stunting = $group->filter(function ($item) {

                            $status = strtolower(trim($item->status_tb_u ?? ''));

                            return str_contains($status, 'pendek');
                        })->count();

                        $tidakStunting = $group->filter(function ($item) {

                            $status = strtolower(trim($item->status_tb_u ?? ''));

                            return str_contains($status, 'normal') ||
                                str_contains($status, 'tinggi');
                        })->count();

                        return [
                            'month' => Carbon::parse($bulanKey . '-01')
                                ->translatedFormat('F Y'),

                            'posyandu' => $posyandu,

                            'stunting' => $stunting,

                            'tidakStunting' => $tidakStunting,

                            'total' => $group->count(),
                        ];
                    });
            })
            ->flatten(1)
            ->values();

        return response()->json($data);
    }


    public function grafikPerbandinganTahunan()
    {
        $deteksis = Deteksi::orderBy('created_at', 'asc')
            ->get();

        $data = $deteksis
            ->groupBy(function ($item) {
                return Carbon::parse($item->created_at)->format('Y');
            })
            ->map(function ($itemsPerTahun, $year) {

                return $itemsPerTahun
                    ->groupBy(function ($item) {
                        return Carbon::parse($item->created_at)->format('Y-m');
                    })
                    ->map(function ($itemsPerBulan, $monthKey) use ($year) {

                        $latestPerBalita = $itemsPerBulan
                            ->sortByDesc('created_at')
                            ->groupBy('balita_id')
                            ->map(fn($items) => $items->first());

                        $stunting = $latestPerBalita->filter(function ($item) {

                            $status = strtolower(trim($item->status_tb_u ?? ''));

                            return str_contains($status, 'pendek');
                        })->count();

                        $tidakStunting = $latestPerBalita->filter(function ($item) {

                            $status = strtolower(trim($item->status_tb_u ?? ''));

                            return str_contains($status, 'normal') ||
                                str_contains($status, 'tinggi');
                        })->count();

                        return [
                            'month' => Carbon::parse($monthKey . '-01')
                                ->translatedFormat('M'),

                            'year' => (int)$year,

                            'stunting' => $stunting,

                            'tidakStunting' => $tidakStunting,

                            'total' => $latestPerBalita->count(),
                        ];
                    });
            })
            ->flatten(1)
            ->values();

        return response()->json($data);
    }

    public function grafikPieStatus()
    {
        $deteksiTerbaru = Deteksi::latest()
            ->get()
            ->groupBy('balita_id')
            ->map(fn($items) => $items->first())
            ->values();

        $normal = 0;
        $stunting = 0;

        foreach ($deteksiTerbaru as $item) {

            $status = strtolower(trim($item->status_tb_u ?? ''));

            if (str_contains($status, 'pendek')) {

                $stunting++;
            } elseif (
                str_contains($status, 'normal') ||
                str_contains($status, 'tinggi')
            ) {

                $normal++;
            }
        }

        return response()->json([
            'normal' => $normal,
            'stunting' => $stunting,
        ]);
    }

    public function mapping()
    {
        $data = Posyandu::with([
            'balitas.deteksis' => function ($q) {
                $q->latest();
            }
        ])->get();

        $result = $data->map(function ($posyandu) {

            $balitas = $posyandu->balitas;

            $balitaCount = $balitas->count();

            $stuntingIds = [];
            $berisikoIds = [];

            foreach ($balitas as $balita) {

                $latestDeteksi = $balita->deteksis->first();

                if (!$latestDeteksi) {
                    continue;
                }

                //anak stunting
                if (
                    $latestDeteksi->zscore_tb_u < -3 ||
                    $latestDeteksi->zscore_bb_u < -3 ||
                    $latestDeteksi->zscore_tb_bb < -3
                ) {

                    $stuntingIds[] = $balita->id;
                }
                //anak tidak stunting
                elseif (

                    ($latestDeteksi->zscore_tb_u >= -3 &&
                        $latestDeteksi->zscore_tb_u < -2)

                    ||

                    ($latestDeteksi->zscore_bb_u >= -3 &&
                        $latestDeteksi->zscore_bb_u < -2)

                    ||

                    ($latestDeteksi->zscore_tb_bb >= -3 &&
                        $latestDeteksi->zscore_tb_bb < -2)

                ) {

                    $berisikoIds[] = $balita->id;
                }
            }

            return [
                'wilayah' => $posyandu->nama_posyandu,

                'balita' => $balitaCount,

                'stunting' => count(array_unique($stuntingIds)),

                'berisiko' => count(array_unique($berisikoIds)),

                'coordinates' => [
                    (float)$posyandu->latitude,
                    (float)$posyandu->longitude
                ],
            ];
        });

        return response()->json($result);
    }
}
