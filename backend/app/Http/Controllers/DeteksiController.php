<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use App\Models\Penimbangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DeteksiController extends Controller
{
    public function index()
    {
        //ambil data terbaru saja
        $deteksi = Deteksi::with('balita')
            ->whereIn('id', function ($query) {
                $query->selectRaw('MAX(id)')
                    ->from('deteksis')
                    ->groupBy('balita_id');
            })
            ->get();
        $data = $deteksi->map(function ($deteksi) {
            return [
                'id' => $deteksi->id,
                'name' => $deteksi->balita?->name,
                'umur' => $deteksi->umur,
                'berat' => $deteksi->berat,
                'tinggi' => $deteksi->tinggi,
                'status_tb_u' => $deteksi->status_tb_u,
                'tgl_deteksi' => $deteksi->tgl_deteksi,
            ];
        });
        return response()->json($data);
    }

    public function deteksi(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'tgl_deteksi' => 'required|date|after_or_equal:tgl_lahir',
            'berat' => 'required|numeric',
            'tinggi' => 'required|numeric',
            'jk' => 'required|in:L,P',
            'tgl_lahir' => 'required|date',
            'umur' => 'nullable|integer|min:0',
        ]);

        $balita = Balita::where('name', $request->name)
            ->where('tgl_lahir', $request->tgl_lahir)
            ->first();

        if (!$balita) {
            $balita = Balita::create([
                'name' => $request->name,
                'jk' => $request->jk,
                'tgl_lahir' => $request->tgl_lahir,
            ]);
        }
        //hitung umur
        $umur = $request->umur;
        if (is_null($umur)) {
            $umur = $this->hitungUmur($request->tgl_lahir, $request->tgl_deteksi);
        }

        $umurAsli = $this->hitungUmur($request->tgl_lahir, $request->tgl_deteksi);

        $warning = null;

        if (!is_null($request->umur) && abs($request->umur - $umurAsli) > 1) {
            $warning = 'Umur tidak sesuai dengan tanggal lahir';
        }

        $jk = $balita->jk;
        $bb = $request->berat;
        $tb = $request->tinggi;


        $z_bbu = $this->hitungZScoreBBU($umur, $jk, $bb);
        $z_tbu = $this->hitungZScoreTBU($umur, $jk, $tb);
        $z_bbtb = $this->hitungZScoreBBTB($tb, $jk, $bb);

        $status_bbu = $this->deteksiBBU($z_bbu);
        $status_tbu = $this->deteksiTBU($z_tbu);
        $status_bbtb = $this->deteksiBBTB($z_bbtb);

        //create
        $deteksi = Deteksi::create([
            'balita_id' => $balita->id,
            'tgl_deteksi' => Carbon::parse($request->tgl_deteksi)->format('Y-m-d'),
            'berat' => $request->berat,
            'tinggi' => $request->tinggi,
            'umur' => $umur,
            'zscore_tb_u' => round($z_tbu, 2),
            'zscore_bb_u' => round($z_bbu, 2),
            'zscore_tb_bb' => round($z_bbtb, 2),
            'status_tb_u' => $status_tbu,
            'status_bb_u' => $status_bbu,
            'status_tb_bb' => $status_bbtb,
            'warning' => $warning,

        ]);
        return response()->json([
            'id' => $deteksi->id,
            'balita_id' => $balita->id,
            'name' => $balita->name,
            'tgl_deteksi' => Carbon::parse($request->tgl_deteksi)->format('Y-m-d'),
            'umur' => $umur,
            'bb' => $bb,
            'tb' => $tb,
            'zscore_bbu' => round($z_bbu, 2),
            'zscore_tbu' => round($z_tbu, 2),
            'zscore_bbtb' => round($z_bbtb, 2),
            'status_bbu' => $this->formatStatusBBU($z_bbu),
            'status_tbu' => $this->formatStatusTBU($z_tbu),
            'status_bb_tb' => $this->formatStatusBBTB($z_bbtb),
            'rekomendasi_bbu' => $this->rekomendasiBBU($this->deteksiBBU($z_bbu)),
            'rekomendasi_tbu' => $this->rekomendasiTBU($this->deteksiTBU($z_tbu)),
            'rekomendasi_bbtb' => $this->rekomendasiBBTB($this->deteksiBBTB($z_bbtb)),

        ]);
    }

    public function destroy($id)
    {
        $deteksi = Deteksi::findOrFail($id);
        $deteksi->delete();
        return response()->json([
            'message' => 'Data berhasil dihapus',
        ]);
    }

    public function chartStunting()
    {
        $data = Deteksi::all();
        $grouped = [];

        foreach ($data as $item) {
            $month = $item->tgl_deteksi->format('m');
            $year = $item->tgl_deteksi->format('Y');
            $key = $year . '-' . $month;

            if (!isset($grouped[$key])) {
                $grouped[$key] = [
                    'month' => $month,
                    'year' => (int) $year,
                    'stunting' => 0,
                    'tidakStunting' => 0,
                ];
            }

            $status = $this->deteksiTBU($item->zscore_tb_u); // <-- ini harus bisa dipanggil
            if ($status === 'Sangat pendek (severely stunted)' || $status === 'Pendek (stunted)') {
                $grouped[$key]['stunting'] += 1;
            } else {
                $grouped[$key]['tidakStunting'] += 1;
            }
        }

        return response()->json(array_values($grouped));
    }




    private function hitungUmur($tgl_lahir, $tgl_deteksi)
    {
        return Carbon::parse($tgl_lahir)
            ->diffInMonths(Carbon::parse($tgl_deteksi));
    }


    private function formatStatusBBU($z)
    {
        $status = $this->deteksiBBU($z);
        return [
            'status' => $status,
            'warna' => $this->warnaBBU($status),
            'keterangan' => $this->keteranganBBU($status),
        ];
    }

    private function formatStatusTBU($z)
    {
        $status = $this->deteksiTBU($z);
        return [
            'status' => $status,
            'warna' => $this->warnaTBU($status),
            'keterangan' => $this->keteranganTBU($status),
        ];
    }

    private function formatStatusBBTB($z)
    {
        $status = $this->deteksiBBTB($z);
        return [
            'status' => $status,
            'warna' => $this->warnaBBTB($status),
            'keterangan' => $this->keteranganBBTB($status),
        ];
    }


    private function deteksiBBU($z)
    {
        if ($z < -3) return "Berat badan sangat kurang (severely underweight)";
        if ($z >= -3 && $z < -2) return "Berat badan kurang (underweight)";
        if ($z >= -2 && $z <= 2) return "Berat badan normal";
        if ($z > 2) return "Risiko berat badan lebih";
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

    private function deteksiBBTB($z)
    {
        if ($z < -3) return "Gizi buruk (severely wasted)";
        if ($z >= -3 && $z < -2) return "Gizi kurang (wasted)";
        if ($z >= -2 && $z <= 1) return "Gizi baik (normal)";
        if ($z > 1 && $z <= 2) return "Berisiko gizi lebih (possible risk of overweight)";
        if ($z > 2 && $z <= 3) return "Gizi lebih (overweight)";
        if ($z > 3) return "Obesitas (obese)";
        return "-";
    }


    private function warnaBBU($status)
    {
        return match ($status) {
            "Berat badan sangat kurang (severely underweight)" => "bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Berat badan kurang (underweight)" => "bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Berat badan normal" => "bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Risiko berat badan lebih" => "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold",
            default => "bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-semibold",
        };
    }

    private function warnaTBU($status)
    {
        return match ($status) {
            "Sangat pendek (severely stunted)" => "bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Pendek (stunted)" => "bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Normal" => "bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Tinggi" => "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold",
            default => "bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-semibold",
        };
    }

    private function warnaBBTB($status)
    {
        return match ($status) {
            "Gizi buruk (severely wasted)" => "bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Gizi kurang (wasted)" => "bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Gizi baik (normal)" => "bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Berisiko gizi lebih (possible risk of overweight)" => "bg-blue-300 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Gizi lebih (overweight)" => "bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold",
            "Obesitas (obese)" => "bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold",
            default => "bg-gray-300 text-black px-3 py-1 rounded-full text-sm font-semibold",
        };
    }


    private function keteranganBBU($status)
    {
        return match ($status) {
            "Berat badan sangat kurang (severely underweight)" => "Berat badan sangat rendah dibandingkan umur, menunjukkan kemungkinan kekurangan gizi berat",
            "Berat badan kurang (underweight)" => "Berat badan kurang dibandingkan umur, mengindikasikan adanya masalah gizi",
            "Berat badan normal" => "Berat badan sesuai dengan umur",
            "Risiko berat badan lebih" => "Berat badan cenderung melebihi standar umur dan berisiko menjadi gizi lebih",
            default => "-",
        };
    }

    private function keteranganTBU($status)
    {
        return match ($status) {
            "Sangat pendek (severely stunted)" => "Tinggi badan sangat rendah dibandingkan umur, menunjukkan kemungkinan kekurangan gizi kronis",
            "Pendek (stunted)" => "Tinggi badan kurang dibandingkan umur, mengindikasikan risiko stunting",
            "Normal" => "Tinggi badan sesuai dengan umur",
            "Tinggi" => "Tinggi badan lebih tinggi dibandingkan rata-rata umur",
            default => "-",
        };
    }

    private function keteranganBBTB($status)
    {
        return match ($status) {
            "Gizi buruk (severely wasted)" => "Berat badan sangat rendah dibandingkan tinggi badan (gizi buruk akut)",
            "Gizi kurang (wasted)" => "Berat badan kurang dibandingkan tinggi badan",
            "Gizi baik (normal)" => "Berat badan sesuai dengan tinggi badan",
            "Berisiko gizi lebih (possible risk of overweight)" => "Berat badan mulai melebihi proporsi ideal terhadap tinggi badan",
            "Gizi lebih (overweight)" => "Berat badan lebih dibandingkan tinggi badan",
            "Obesitas (obese)" => "Berat badan sangat berlebih dibandingkan tinggi badan (obesitas)",
            default => "-",
        };
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
    private function hitungZScoreBBTB($tb, $jk, $bb)
    {
        $tb = round($tb * 2) / 2;

        $dataWHO = DB::table('who_bb_tb')
            ->whereRaw('ABS(height - ?) < 0.01', [$tb])
            ->where('gender', $jk)
            ->first();

        if (!$dataWHO) return null;

        if ($dataWHO->l == 0) {
            return log($bb / $dataWHO->m) / $dataWHO->s;
        }

        return (pow(($bb / $dataWHO->m), $dataWHO->l) - 1) / ($dataWHO->l * $dataWHO->s);
    }

    //rekomendasi 
    private function rekomendasiBBTB($status)
    {
        $rekomendasi = include base_path('storage/data/rekomendasi.php');
        return $rekomendasi['bbtb'][$status] ?? ["-"];
    }

    private function rekomendasiTBU($status)
    {
        $rekomendasi = include base_path('storage/data/rekomendasi.php');
        return $rekomendasi['tbu'][$status] ?? ["-"];
    }

    private function rekomendasiBBU($status)
    {
        $rekomendasi = include base_path('storage/data/rekomendasi.php');
        return $rekomendasi['bbu'][$status] ?? ["-"];
    }
}
