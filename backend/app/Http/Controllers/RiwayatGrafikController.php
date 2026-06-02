<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RiwayatGrafikController extends Controller
{

    public function ambilstatustimeline($balitaId)
    {
        $deteksis = Deteksi::where('balita_id', $balitaId)
            ->with('balita') // <- TAMBAHKAN: accessor umur menghitung dari tgl_lahir (sama dgn profil)
            ->orderBy('tgl_deteksi', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        $data = $deteksis->map(function ($d) {
            return [
                'id'             => $d->id,
                'tgl_deteksi'    => $d->tgl_deteksi,
                'tgl_label'      => $d->tgl_deteksi
                    ? Carbon::parse($d->tgl_deteksi)->locale('id')->translatedFormat('d M Y')
                    : '-',
                'umur'           => $d->umur,
                'berat'          => $d->berat,
                'tinggi'         => $d->tinggi,
                'lingkar_kepala' => $d->lingkar_kepala ?? null,
                'zscore_tbu'     => $d->zscore_tb_u,
                'zscore_bbu'     => $d->zscore_bb_u,
                'zscore_bbtb'    => $d->zscore_tb_bb,
                'status_tbu'     => $d->status_tb_u  ?? $this->deteksiTBU($d->zscore_tb_u),
                'status_bbu'     => $d->status_bb_u  ?? $this->deteksiBBU($d->zscore_bb_u),
                'status_bbtb'    => $d->status_tb_bb ?? $this->deteksiBBTB($d->zscore_tb_bb),
            ];
        });

        return response()->json([
            'success' => true,
            'data'    => $data,
        ]);
    }


    public function ambildatabalita($id)
    {
        $balita = Balita::with(['penimbangans.user', 'penimbanganTerakhir', 'user'])
            ->find($id);

        if (!$balita) {
            return response()->json(['message' => 'Balita tidak ditemukan'], 404);
        }

        // ambil deteksi terakhir
        $deteksi = Deteksi::where('balita_id', $id)
            ->latest('tgl_deteksi')
            ->first();


        // AMBIL 2 DATA TERAKHIR
        $penimbangans = $balita->penimbangans
            ->sortByDesc('tgl_penimbangan')
            ->values();

        $sekarang = $penimbangans->get(0);
        $sebelumnya = $penimbangans->get(1);


        // HITUNG STATUS
        $status_berat = "Belum ada data pembanding";
        $status_tinggi = "Belum ada data pembanding";

        if ($sekarang && $sebelumnya) {
            // BERAT
            if ($sekarang->berat > $sebelumnya->berat) {
                $status_berat = "Naik";
            } elseif ($sekarang->berat < $sebelumnya->berat) {
                $status_berat = "Turun";
            } else {
                $status_berat = "Tetap";
            }

            // TINGGI
            if ($sekarang->tinggi > $sebelumnya->tinggi) {
                $status_tinggi = "Naik";
            } elseif ($sekarang->tinggi < $sebelumnya->tinggi) {
                $status_tinggi = "Turun";
            } else {
                $status_tinggi = "Tetap";
            }
        }


        return response()->json([
            'id' => $balita->id,
            'name' => $balita->name,
            'jk' => $balita->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
            'tanggal_lahir' => $balita->tgl_lahir,

            // data terakhir
            'berat' => $sekarang?->berat ?? "",
            'tinggi' => $sekarang?->tinggi ?? "",
            'umur' => $sekarang?->umur ?? "",

            // perbandingan
            'berat_sekarang' => $sekarang?->berat,
            'berat_sebelumnya' => $sebelumnya?->berat,
            'tinggi_sekarang' => $sekarang?->tinggi,
            'tinggi_sebelumnya' => $sebelumnya?->tinggi,

            // status hasil perbandingan
            'status_berat' => $status_berat,
            'status_tinggi' => $status_tinggi,

            // lainnya
            'orang_tua' => $balita->user?->name ?? "",
            'total_penimbangan' => $balita->penimbangans->count(),
            'status_tbu' => $deteksi?->status_tb_u ?? "",
            'penimbangans' => $balita->penimbangans,
        ]);
    }



    public function grafik($balita_id)
    {
        $deteksisRaw = Deteksi::where('balita_id', $balita_id)
            ->with('balita')
            ->orderBy('tgl_deteksi', 'asc')
            ->get();

        if ($deteksisRaw->isEmpty()) {
            return response()->json([]);
        }

        // hindari tanggal duplicate
        $deteksis = $deteksisRaw->unique('tgl_deteksi')->values();

        $data = $deteksis->map(function ($item, $index) use ($deteksis) {

            // ZSCORE WHO
            $zScore = $item->zscore_tb_u;
            $ZScoreBBU = $item->zscore_bb_u;

            $status = $zScore !== null
                ? $this->deteksiTBU($zScore)
                : '-';

            $statusBBU = $ZScoreBBU !== null
                ? $this->deteksiBBU($ZScoreBBU)
                : '-';

            // DEFAULT VALUE
            $kenaikanBB = 0;
            $kenaikanTB = 0;

            $targetKbm = null;
            $targetKpt = null;

            $statusPertumbuhanBB = "Data Awal";
            $statusPertumbuhanTB = "Data Awal";
            $tooltipBB = "Data awal";
            $tooltipTB = "Data awal";

            //ambil status z-score
            $status_bbu = $this->deteksiBBU($ZScoreBBU);
            $status_tbu = $this->deteksiTBU($zScore);


            // CEK PERTUMBUHAN
            if ($index > 0) {

                // data sebelumnya
                $prevItem = $deteksis[$index - 1];

                // hitung kenaikan langsung dari data sebelumnya
                $kenaikanBB = round(
                    (float)$item->berat - (float)$prevItem->berat,
                    2
                );

                $kenaikanTB = round(
                    (float)$item->tinggi - (float)$prevItem->tinggi,
                    2
                );
                $umurSebelumnya = (int)$prevItem->umur;
                $umurSekarang = (int)$item->umur;

                // interval real antar penimbangan
                $intervalAktual = $umurSekarang - $umurSebelumnya;
                $umurAnak = (int)$item->umur;
                $genderAnak = strtolower(trim($item->balita->jk));

                $genderDB = $genderAnak == 'l'
                    ? 'laki-laki'
                    : 'perempuan';

                //Hitung ideal KBM
                $kbmStandar = DB::table('standar_kbm')
                    ->whereRaw('LOWER(TRIM(gender)) = ?', [strtolower(trim($genderDB))])
                    ->where('umur_awal', '<=', $umurAnak)
                    ->where('umur_akhir', '>=', $umurAnak)
                    ->orderByRaw('ABS(interval_bulan - ?)', [$intervalAktual])
                    ->first();

                if ($kbmStandar) {

                    $targetKbm = (float)$kbmStandar->kbm_kg;

                    $statusPertumbuhanBB =
                        $kenaikanBB >= $targetKbm
                        ? "Telah Tercapai"
                        : "Belum Tercapai";
                } else {

                    // fallback ke WHO
                    $statusPertumbuhanBB = $statusBBU;
                }

                //Hitung Ideal KPT
                $kptStandar = DB::table('standar_kpt')
                    ->whereRaw('LOWER(TRIM(gender)) = ?', [$genderDB])

                    ->where('umur_awal', '<=', $umurAnak)
                    ->where('umur_akhir', '>=', $umurAnak)

                    // cari interval yang <= interval aktual
                    ->orderByRaw('ABS(interval_bulan - ?)', [$intervalAktual])

                    ->first();

                if ($kptStandar) {

                    $targetKpt = (float)$kptStandar->kpt_cm;

                    $statusPertumbuhanTB =
                        $kenaikanTB >= $targetKpt
                        ? "Telah Tercapai"
                        : "Belum Tercapai";
                } else {

                    // fallback ke WHO
                    $statusPertumbuhanTB = $status;
                }

                $selisihBB = $targetKbm !== null
                    ? round($kenaikanBB - $targetKbm, 2)
                    : 0;
                $selisihTB = $targetKpt !== null
                    ? round($kenaikanTB - $targetKpt, 2)
                    : 0;

                //Tooltip BB
                if ($targetKbm !== null) {

                    if ($kenaikanBB >= $targetKbm) {

                        $tooltipBB =
                            "Pertumbuhan luar biasa (+" . $kenaikanBB . " kg), " .
                            "melampaui standar minimal +" . $targetKbm . " kg (selisih +" . $selisihBB . " kg)";
                    } else {

                        $tooltipBB =
                            "Pertumbuhan kurang optimal (" . $kenaikanBB . " kg), " .
                            "standar minimal " . $targetKbm . " kg, " .
                            "kurang " . abs($selisihBB) . " kg dari target.";
                    }
                } else {
                    $tooltipBB = $statusPertumbuhanBB;
                }




                //Tooltip TB
                if ($targetKpt !== null) {

                    if ($kenaikanTB >= $targetKpt) {

                        $tooltipTB =
                            "Pertumbuhan luar biasa (+" . $kenaikanTB . " cm), " .
                            "melampaui standar minimal +" . $targetKpt . " cm (selisih +" . $selisihTB . " cm)";
                    } else {

                        $tooltipTB =
                            $tooltipTB =
                            "Pertumbuhan kurang optimal (" . $kenaikanTB . " cm), " .
                            "standar minimal " . $targetKpt . " cm, " .
                            "kurang " . abs($selisihTB) . " cm dari target.";
                    }
                } else {
                    $tooltipTB = $statusPertumbuhanTB;
                }
            }

            $warnaBB = "gray";

            if ($targetKbm !== null) {
                if ($kenaikanBB >= $targetKbm) {
                    $warnaBB = "green";
                } else {
                    $warnaBB = "red";
                }
            }

            $warnaTB = "gray";

            if ($targetKpt !== null) {
                if ($kenaikanTB >= $targetKpt) {
                    $warnaTB = "green";
                } else {
                    $warnaTB = "red";
                }
            }
            // Ambil WHO TB/U
            $gender = strtoupper(trim($item->balita->jk));
            $who = DB::table('who_tb_u')
                ->where('month', $item->umur)
                ->where('gender', $gender)
                ->first();

            //Ambil WHO BB/U    
            $whobbu = DB::table('who_bb_u')
                ->where('month', $item->umur)
                ->where('gender', $gender)
                ->first();


            return [
                'id' => $item->id,

                'umur' => (int)$item->umur,

                'tinggi' => (float)$item->tinggi,
                'berat' => (float)$item->berat,


                // TOOLTIP DATA
                'kenaikan_berat' => $kenaikanBB,
                'targetKbm' => $targetKbm,

                'kenaikan_tinggi' => $kenaikanTB,
                'targetKpt' => $targetKpt,


                // TANGGAL
                'tgl_deteksi' => $item->tgl_deteksi,

                'tgl_label' => $item->tgl_deteksi
                    ? Carbon::parse($item->tgl_deteksi)
                    ->translatedFormat('d F Y')
                    : '-',

                'bulan' => $item->tgl_deteksi
                    ? Carbon::parse($item->tgl_deteksi)
                    ->translatedFormat('d M')
                    : '-',

                // STATUS
                'status' => $status,

                // status pertumbuhan dinamis
                'statusTinggi' => $statusPertumbuhanTB,
                'statusBBU' => $statusPertumbuhanBB,

                'tooltipBB' => $tooltipBB,
                'tooltipTB' => $tooltipTB,
                'warnaTB' => $warnaTB,
                'warnaBB' => $warnaBB,
                // ZSCORE
                'zscore' => $zScore,
                'ZScoreBBU' => $ZScoreBBU,

                // GARIS WHO TBU
                'median_tb' => $who->m ?? null,
                'minus2_tb' => $who ? $who->m - (2 * $who->s) : null,
                'minus3_tb' => $who ? $who->m - (3 * $who->s) : null,

                // GARIS WHO BBU
                'median_bb' => $whobbu->m ?? null,
                'minus2_bb' => $whobbu ? $whobbu->m - (2 * $whobbu->s) : null,
                'minus3_bb' => $whobbu ? $whobbu->m - (3 * $whobbu->s) : null,

                'statustbu' =>  $status_tbu,
                'statusbbu' =>  $status_bbu,
            ];
        });

        return response()->json($data);
    }



    private function deteksiBBTB($z)
    {
        if (!is_numeric($z)) return "-";
        if ($z < -3) return "Gizi buruk (severely wasted)";
        if ($z >= -3 && $z < -2) return "Gizi kurang (wasted)";
        if ($z >= -2 && $z <= 1) return "Gizi baik (normal)";
        if ($z > 1 && $z <= 2) return "Berisiko gizi lebih (possible risk of overweight)";
        if ($z > 2 && $z <= 3) return "Gizi lebih (overweight)";
        if ($z > 3) return "Obesitas (obese)";
        return "-";
    }

    private function deteksiTBU($z)
    {
        if ($z < -3) return "Sangat pendek (severely stunted)";
        if ($z >= -3 && $z < -2) return "Pendek (stunted)";
        if ($z >= -2 && $z <= 3) return "Normal";
        if ($z > 3) return "Tinggi";
        return "-";
    }
    private function hitungZScoreTBU($umur, $jk, $tb)
    {
        $umur = (int) $umur;

        $dataWHO = DB::table('who_tb_u')
            ->where('month', $umur)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return null;

        if ($dataWHO->l == 0) {
            return log($tb / $dataWHO->m) / $dataWHO->s;
        }

        return (pow(($tb / $dataWHO->m), $dataWHO->l) - 1) / ($dataWHO->l * $dataWHO->s);
    }

    private function hitungZScoreBBU($umur, $jk, $bb)
    {
        $umur = (int) $umur;

        $dataWHO = DB::table('who_bb_u')
            ->where('month', $umur)
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return null;

        if ($dataWHO->l == 0) {
            return log($bb / $dataWHO->m) / $dataWHO->s;
        }

        return (pow(($bb / $dataWHO->m), $dataWHO->l) - 1) / ($dataWHO->l * $dataWHO->s);
    }

    private function deteksiBBU($z)
    {
        if ($z < -3) return "Berat badan sangat kurang (severely underweight)";
        if ($z >= -3 && $z < -2) return "Berat badan kurang (underweight)";
        if ($z >= -2 && $z <= 2) return "Berat badan normal";
        if ($z > 2) return "Risiko berat badan lebih";
        return "-";
    }
}
