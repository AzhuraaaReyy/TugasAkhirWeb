<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use App\Models\Notifikasi;
use App\Models\Posyandu;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

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
            // hanya deteksi TERBARU tiap anak
            ->whereIn('id', function ($q) {
                $q->selectRaw('MAX(id)')->from('deteksis')->groupBy('balita_id');
            })
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
            ->whereDate('tanggal', '>=', Carbon::today())
            ->orderBy('tanggal')   // yang paling dekat dari hari ini
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
        $deteksis = Deteksi::with('balita')
            ->orderBy('tgl_deteksi', 'asc')
            ->get();

        // Bulan-bulan yang punya data (Y-m), urut menaik
        $bulanList = $deteksis
            ->map(fn($d) => Carbon::parse($d->tgl_deteksi)->format('Y-m'))
            ->unique()
            ->sort()
            ->values();

        $data = $bulanList->map(function ($bulanKey) use ($deteksis) {
            $akhirBulan = Carbon::parse($bulanKey . '-01')->endOfMonth();

            // ✅ Carry-forward: status TERAKHIR tiap balita sampai akhir bulan ini
            $latestPerBalita = $deteksis
                ->filter(fn($d) => Carbon::parse($d->tgl_deteksi)->lessThanOrEqualTo($akhirBulan))
                ->sortBy([['tgl_deteksi', 'desc'], ['id', 'desc']])
                ->groupBy('balita_id')
                ->map(fn($items) => $items->first());

            $stunting = $latestPerBalita->filter(function ($item) {
                $status = strtolower(trim($item->status_tb_u ?? ''));
                return str_contains($status, 'pendek');
            })->count();

            $tidakStunting = $latestPerBalita->filter(function ($item) {
                $status = strtolower(trim($item->status_tb_u ?? ''));
                return str_contains($status, 'normal') || str_contains($status, 'tinggi');
            })->count();

            $tgl = Carbon::parse($bulanKey . '-01');
            return [
                'monthKey'      => $bulanKey,
                'month'         => $tgl->translatedFormat('M Y'),
                'stunting'      => $stunting,
                'tidakStunting' => $tidakStunting,
                'total'         => $latestPerBalita->count(),
            ];
        })->values();

        return response()->json($data);
    }


    public function grafikPerbandinganTahunan()
    {
        $tahunIni  = now()->year;
        $tahunLalu = $tahunIni - 1;

        // Ambil SEMUA deteksi (perlu data lama untuk carry-forward), urut tanggal
        $deteksis = Deteksi::orderBy('tgl_deteksi', 'asc')->get();

        // Bulan yang DITAMPILKAN = bulan ber-data dalam rentang tahun lalu–tahun ini
        $bulanList = $deteksis
            ->filter(function ($d) use ($tahunLalu, $tahunIni) {
                $th = (int) Carbon::parse($d->tgl_deteksi)->format('Y');
                return $th >= $tahunLalu && $th <= $tahunIni;
            })
            ->map(fn($d) => Carbon::parse($d->tgl_deteksi)->format('Y-m'))
            ->unique()
            ->sort()
            ->values();

        $data = $bulanList->map(function ($monthKey) use ($deteksis) {
            $akhirBulan = Carbon::parse($monthKey . '-01')->endOfMonth();

            // ✅ Carry-forward memakai SEMUA data (termasuk sebelum tahun lalu)
            $latestPerBalita = $deteksis
                ->filter(fn($d) => Carbon::parse($d->tgl_deteksi)->lessThanOrEqualTo($akhirBulan))
                ->sortBy([['tgl_deteksi', 'desc'], ['id', 'desc']])
                ->groupBy('balita_id')
                ->map(fn($items) => $items->first());

            $stunting = $latestPerBalita->filter(function ($item) {
                $status = strtolower(trim($item->status_tb_u ?? ''));
                return str_contains($status, 'pendek');
            })->count();

            $tidakStunting = $latestPerBalita->filter(function ($item) {
                $status = strtolower(trim($item->status_tb_u ?? ''));
                return str_contains($status, 'normal') || str_contains($status, 'tinggi');
            })->count();

            $tgl = Carbon::parse($monthKey . '-01');
            return [
                'month'         => $tgl->translatedFormat('M'),
                'monthNum'      => (int) $tgl->format('n'),
                'year'          => (int) $tgl->format('Y'),
                'stunting'      => $stunting,
                'tidakStunting' => $tidakStunting,
                'total'         => $latestPerBalita->count(),
            ];
        })
            ->sortBy([['year', 'asc'], ['monthNum', 'asc']])
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

    public function heatmap()
    {
        // 1) Total balita TERDAFTAR per posyandu
        $totalBalita = DB::table('balitas')
            ->select('posyandu_id', DB::raw('COUNT(*) as total'))
            ->groupBy('posyandu_id')
            ->get()
            ->keyBy('posyandu_id');

        // 2) Status TERBARU tiap balita (MAX(id) per balita), rekap per posyandu.
        //    Label status persis hasil deteksiTBU().
        $rekap = DB::table('deteksis as d')
            ->whereIn('d.id', function ($q) {
                $q->selectRaw('MAX(id)')->from('deteksis')->groupBy('balita_id');
            })
            ->join('balitas as b', 'b.id', '=', 'd.balita_id')
            ->select(
                'b.posyandu_id',
                DB::raw('COUNT(*) as terdeteksi'),
                DB::raw("SUM(CASE WHEN d.status_tb_u = 'Sangat pendek (severely stunted)' THEN 1 ELSE 0 END) as stunting"),
                DB::raw("SUM(CASE WHEN d.status_tb_u = 'Pendek (stunted)' THEN 1 ELSE 0 END) as berisiko")
            )
            ->groupBy('b.posyandu_id')
            ->get()
            ->keyBy('posyandu_id');

        // 3) Gabungkan dengan data posyandu
        $hasil = DB::table('posyandus')->get()->map(function ($p) use ($rekap, $totalBalita) {
            $r          = $rekap->get($p->id);
            $terdeteksi = (int) ($r->terdeteksi ?? 0);
            $stunting   = (int) ($r->stunting ?? 0);  // sangat pendek
            $berisiko   = (int) ($r->berisiko ?? 0);  // pendek
            $normal     = max(0, $terdeteksi - $stunting - $berisiko);
            $total      = (int) ($totalBalita->get($p->id)->total ?? 0);

            // Skor keparahan 0..1 (bahan warna heatmap)
            $intensitas = $terdeteksi > 0
                ? round((1.0 * $stunting + 0.5 * $berisiko) / $terdeteksi, 3)
                : 0;

            return [
                'posyandu_id'     => $p->id,
                'wilayah'         => $p->nama_posyandu,
                'alamat'          => $p->alamat,
                'coordinates'     => [
                    (float) ($p->latitude ?? 0),
                    (float) ($p->longitude ?? 0),
                ],
                'balita'          => $total,
                'terdeteksi'      => $terdeteksi,
                'stunting'        => $stunting,   // sangat pendek (merah)
                'berisiko'        => $berisiko,   // pendek (orange)
                'normal'          => $normal,     // hijau
                'persen_stunting' => $terdeteksi > 0 ? round($stunting / $terdeteksi * 100, 1) : 0,
                'persen_berisiko' => $terdeteksi > 0 ? round($berisiko / $terdeteksi * 100, 1) : 0,
                'intensitas'      => $intensitas, // 0..1
            ];
        })
            ->filter(fn($x) => $x['coordinates'][0] != 0 && $x['coordinates'][1] != 0)
            ->values();

        return response()->json($hasil);
    }
}
