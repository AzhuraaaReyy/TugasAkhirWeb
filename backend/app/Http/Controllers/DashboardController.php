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

        // ================= BELUM TIMBANG =================
        $listBelumTimbang = Balita::whereDoesntHave('deteksis', function ($q) use ($bulanIni, $tahunIni) {
            $q->whereMonth('tgl_deteksi', $bulanIni)
                ->whereYear('tgl_deteksi', $tahunIni);
        })
            ->select('id', 'name')
            ->get();

        $belumTimbang = $listBelumTimbang->count();

        // ================= TURUN BB =================
        $listTurunBB = [];

        $balitas = Balita::with(['deteksis' => function ($q) {
            $q->orderByDesc('tgl_deteksi');
        }])->get();

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
                        'selisih' => $sekarang->berat - $sebelumnya->berat, // negatif = turun
                        'tgl_sekarang' => $sekarang->tgl_deteksi,
                        'tgl_sebelumnya' => $sebelumnya->tgl_deteksi,
                    ];
                }
            }
        }

        $turunBB = count($listTurunBB);

        // ================= RUJUKAN =================
        $listRujukan = Deteksi::where('zscore_tb_u', '<', -3)
            ->with('balita')
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

                if (!is_null($item->zscore_bb_tb) && $item->zscore_bb_tb < -3) {
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
                    'tgl_deteksi' => Carbon::parse($item->tgl_deteksi)->translatedFormat('d F Y'),
                ];
            });

        $rujukan = $listRujukan->count();

        // ================= JADWAL =================
        $jadwalNotif = Notifikasi::where('tipe', 'Jadwal Posyandu')
            ->orderByDesc('tanggal')
            ->first();

        $jadwal = $jadwalNotif
            ? Carbon::parse($jadwalNotif->tanggal)->translatedFormat('d F Y')
            : '-';

        // ================= RESPONSE =================
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
            ->orderBy('tgl_deteksi', 'asc')
            ->get();
        $deteksiTerbaru = $deteksis
            ->groupBy('balita_id')
            ->map(function ($items) {
                return $items->first();
            });
        $data = $deteksiTerbaru
            ->groupBy(function ($item) {
                return Carbon::parse($item->tgl_deteksi)->format('M');
            })
            ->map(function ($items, $month) {

                return $items->groupBy(function ($item) {
                    return $item->balita->posyandu->nama_posyandu ?? 'Tidak diketahui';
                })->map(function ($group, $posyandu) use ($month) {

                    return [
                        'month' => $month,
                        'posyandu' => $posyandu,

                        'stunting' => $group->filter(function ($item) {
                            $status = strtolower($item->status_tb_u ?? '');
                            return str_contains($status, 'pendek');
                        })->count(),

                        'tidakStunting' => $group->filter(function ($item) {
                            $status = strtolower($item->status_tb_u ?? '');
                            return str_contains($status, 'normal') ||
                                str_contains($status, 'tinggi');
                        })->count(),
                    ];
                });
            })
            ->flatten(1)
            ->values();

        return response()->json($data);
    }

    public function grafikPerbandinganTahunan()
    {
        $deteksis = Deteksi::with('balita')
            ->orderBy('tgl_deteksi', 'desc')
            ->get();

        $deteksiTerbaru = $deteksis
            ->groupBy('balita_id')
            ->map(fn($items) => $items->first())
            ->values();


        $data = $deteksiTerbaru
            ->groupBy(function ($item) {
                return Carbon::parse($item->tgl_deteksi)->format('Y');
            })
            ->map(function ($items, $year) {

                return $items->groupBy(function ($item) {
                    return Carbon::parse($item->tgl_deteksi)->format('M');
                })->map(function ($group, $month) use ($year) {

                    return [
                        'month' => $month,
                        'year' => (int)$year,

                        'stunting' => $group->filter(function ($item) {
                            $status = strtolower($item->status_tb_u ?? '');
                            return str_contains($status, 'pendek');
                        })->count(),

                        'tidakStunting' => $group->filter(function ($item) {
                            $status = strtolower($item->status_tb_u ?? '');
                            return str_contains($status, 'normal') ||
                                str_contains($status, 'tinggi');
                        })->count(),
                    ];
                });
            })
            ->flatten(1)
            ->values();

        return response()->json($data);
    }
    public function grafikPieStatus()
    {
        $deteksis = Deteksi::orderBy('tgl_deteksi', 'desc')->get();


        $deteksiTerbaru = $deteksis
            ->groupBy('balita_id')
            ->map(fn($items) => $items->first())
            ->values();


        $normal = 0;
        $stunting = 0;


        foreach ($deteksiTerbaru as $item) {
            $status = strtolower($item->status_tb_u ?? '');

            if (str_contains($status, 'pendek')) {
                $stunting++;
            } elseif (str_contains($status, 'normal') ||  str_contains($status, 'tinggi')) {
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
        $data = Posyandu::with(['balitas.deteksis'])->get();

        $result = $data->map(function ($posyandu) {

            $balitas = $posyandu->balitas;

            $balitaCount = $balitas->count();

            $stuntingIds = [];
            $berisikoIds = [];

            foreach ($balitas as $balita) {

                $isStunting = false;
                $isBerisiko = false;

                foreach ($balita->deteksis as $deteksi) {
                    if (
                        $deteksi->zscore_tb_u < -3 ||
                        $deteksi->zscore_bb_u < -3 ||
                        $deteksi->zscore_tb_bb < -3
                    ) {
                        $isStunting = true;
                    }


                    if (
                        (
                            ($deteksi->zscore_tb_u >= -3 && $deteksi->zscore_tb_u < -2) ||
                            ($deteksi->zscore_bb_u >= -3 && $deteksi->zscore_bb_u < -2) ||
                            ($deteksi->zscore_tb_bb >= -3 && $deteksi->zscore_tb_bb < -2)
                        )
                    ) {
                        $isBerisiko = true;
                    }
                }

                if ($isStunting) $stuntingIds[] = $balita->id;
                else if ($isBerisiko) $berisikoIds[] = $balita->id;
            }

            return [
                'wilayah' => $posyandu->nama_posyandu,
                'balita' => $balitaCount,
                'stunting' => count(array_unique($stuntingIds)),
                'berisiko' => count(array_unique($berisikoIds)),
                'coordinates' => [
                    (float) $posyandu->latitude,
                    (float) $posyandu->longitude
                ],
            ];
        });

        return response()->json($result);
    }
}
