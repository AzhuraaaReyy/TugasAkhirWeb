<?php

namespace App\Http\Controllers;

use App\Models\DetailDeteksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Deteksi;
use Carbon\Carbon;

class DetailDeteksiController extends Controller
{
    public function detaildeteksi($id)
    {
        $detaildeteksi = DetailDeteksi::with('deteksi.balita.deteksis')->findOrFail($id);
        $detail = $detaildeteksi->deteksi;

        // ambil zscore dari DB
        $z_bbu = $detail->zscore_bb_u;
        $z_tbu = $detail->zscore_tb_u;
        $z_bbtb = $detail->zscore_tb_bb;

        // hitung ulang status (REAL-TIME & AKURAT)
        $status_bbu = $this->deteksiBBU($z_bbu);
        $status_tbu = $this->deteksiTBU($z_tbu);
        $status_bbtb = $this->deteksiBBTB($z_bbtb);

        //hitung perbandingan berat dan tinggi

        $penimbangan = $detail->balita
            ->deteksis()
            ->orderByDesc('id') // 🔥 ini kunci utama
            ->get();

        $sekarang = $penimbangan->first();
        $sebelumnya = $penimbangan->skip(1)->first();

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
            'message' => "Detail data deteksi",
            'data' => [
                'id' => $detaildeteksi->id,
                'deteksi_id' => $detail->id,

                // data balita
                'name' => $detail->balita?->name,
                'jk' => $detail->balita?->jk,
                'tgl_lahir' => $detail->balita?->tgl_lahir,

                // data pengukuran
                'tgl_deteksi' => Carbon::parse($detail->tgl_deteksi)->format('Y-m-d'),
                'umur' => $detail->umur,
                'berat' => $detail->berat,
                'tinggi' => $detail->tinggi,


                // perbandingan
                'berat_sekarang' => $sekarang?->berat,
                'berat_sebelumnya' => $sebelumnya?->berat,
                'tinggi_sekarang' => $sekarang?->tinggi,
                'tinggi_sebelumnya' => $sebelumnya?->tinggi,

                // status hasil perbandingan
                'status_berat' => $status_berat,
                'status_tinggi' => $status_tinggi,

                // z-score (DARI DB)
                'zscore_bbu' => $z_bbu,
                'zscore_tbu' => $z_tbu,
                'zscore_bbtb' => $z_bbtb,

                // status (HITUNG ULANG)
                'status' => [
                    'bbu' => $status_bbu,
                    'tbu' => $status_tbu,
                    'bbtb' => $status_bbtb,
                ],

                // keterangan & rekomendasi
                'keterangan' => $detaildeteksi->keterangan,
                'rekomendasi' => $detaildeteksi->rekomendasi,
                'total_deteksi' => $detail->balita?->deteksis()->count(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'deteksi_id' => 'required|exists:deteksis,id',
            ]);

            $deteksi = Deteksi::findOrFail($validated['deteksi_id']);

            $z_bbu = $deteksi->zscore_bb_u ?? 0;
            $z_tbu = $deteksi->zscore_tb_u ?? 0;
            $z_bbtb = $deteksi->zscore_tb_bb ?? 0;

            $status_bbu = $this->deteksiBBU($z_bbu);
            $status_tbu = $this->deteksiTBU($z_tbu);
            $status_bbtb = $this->deteksiBBTB($z_bbtb);

            // 🔥 SELALU GENERATE DARI SISTEM (tidak tergantung input user)
            $keterangan = implode("\n", [
                "Stunting: " . $this->keteranganTBU($status_tbu),
                "Wasting: " . $this->keteranganBBTB($status_bbtb),
                "Underweight: " . $this->keteranganBBU($status_bbu),
            ]);

            $rekomendasi = implode("\n", [
                "Stunting: " . implode(', ', (array) $this->rekomendasiTBU($status_tbu)),
                "Wasting: " . implode(', ', (array) $this->rekomendasiBBTB($status_bbtb)),
                "Underweight: " . implode(', ', (array) $this->rekomendasiBBU($status_bbu)),
            ]);

            $detail = DetailDeteksi::create([
                'deteksi_id' => $validated['deteksi_id'],
                'keterangan' => $keterangan,
                'rekomendasi' => $rekomendasi,
            ]);

            return response()->json([
                'message' => 'Data detail berhasil ditambahkan',
                'data' => $detail
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    private function deteksiBBU($z)
    {
        if ($z < -3) return "Berat badan sangat kurang (severely underweight)";
        if ($z < -2) return "Berat badan kurang (underweight)";
        if ($z <= 2) return "Berat badan normal";
        return "Risiko berat badan lebih";
    }

    private function deteksiTBU($z)
    {
        if ($z < -3) return "Sangat pendek (severely stunted)";
        if ($z < -2) return "Pendek (stunted)";
        if ($z <= 3) return "Normal";
        return "Tinggi";
    }

    private function deteksiBBTB($z)
    {
        if ($z < -3) return "Gizi buruk (severely wasted)";
        if ($z < -2) return "Gizi kurang (wasted)";
        if ($z <= 1) return "Gizi baik (normal)";
        if ($z <= 2) return "Berisiko gizi lebih (possible risk of overweight)";
        if ($z <= 3) return "Gizi lebih (overweight)";
        return "Obesitas (obese)";
    }



    private function keteranganBBU($status)
    {
        return match ($status) {
            "Berat badan sangat kurang (severely underweight)" =>
            "z-score berat badan anak sangat rendah dibandingkan standar usianya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan kemungkinan kekurangan gizi berat dan perlu penanganan segera.",

            "Berat badan kurang (underweight)" =>
            "z-score berat badan anak berada di bawah standar usianya (z-score antara -3 SD hingga -2 SD). Hal ini mengindikasikan adanya masalah gizi yang perlu diperhatikan.",

            "Berat badan normal" =>
            "z-score berat badan anak berada dalam rentang normal sesuai standar WHO (z-score antara -2 SD hingga +1 SD), menunjukkan kondisi gizi yang baik.",

            "Risiko berat badan lebih" =>
            "z-score berat badan anak berada di atas standar usianya (z-score > +1 SD), sehingga berisiko mengalami kelebihan berat badan jika tidak dikontrol.",

            default => "-",
        };
    }

    private function keteranganTBU($status)
    {
        return match ($status) {
            "Sangat pendek (severely stunted)" =>
            "z-score tinggi badan anak sangat rendah dibandingkan standar usianya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan stunting berat akibat kekurangan gizi kronis dalam jangka panjang.",

            "Pendek (stunted)" =>
            "z-score tinggi badan anak berada di bawah standar usianya (z-score antara -3 SD hingga -2 SD). Anak terindikasi stunting yang menandakan adanya gangguan pertumbuhan kronis.",

            "Normal" =>
            "z-score tinggi badan anak berada dalam rentang normal sesuai standar WHO (z-score antara -2 SD hingga +3 SD), menunjukkan pertumbuhan yang baik.",

            "Tinggi" =>
            "z-score tinggi badan anak berada di atas rata-rata usianya (z-score > +3 SD), namun masih perlu dipantau agar tetap proporsional.",

            default => "-",
        };
    }

    private function keteranganBBTB($status)
    {
        return match ($status) {
            "Gizi buruk (severely wasted)" =>
            "z-score berat badan anak sangat rendah dibandingkan tinggi badannya (z-score < -3 SD menurut WHO). Kondisi ini menunjukkan gizi buruk akut yang memerlukan penanganan segera.",

            "Gizi kurang (wasted)" =>
            "z-score berat badan anak berada di bawah standar tinggi badannya (z-score antara -3 SD hingga -2 SD), menandakan adanya kekurangan gizi akut.",

            "Gizi baik (normal)" =>
            "z-score berat badan anak proporsional dengan tinggi badannya (z-score antara -2 SD hingga +1 SD), menunjukkan kondisi gizi yang baik.",

            "Berisiko gizi lebih (possible risk of overweight)" =>
            "z-score berat badan anak mulai melebihi proporsi ideal terhadap tinggi badan (z-score > +1 SD), sehingga berisiko mengalami kelebihan berat badan.",

            "Gizi lebih (overweight)" =>
            "z-score berat badan anak lebih tinggi dibandingkan standar tinggi badannya (z-score > +2 SD), menunjukkan kondisi gizi lebih.",

            "Obesitas (obese)" =>
            "z-score berat badan anak sangat berlebih dibandingkan tinggi badannya (z-score > +3 SD), termasuk dalam kategori obesitas dan perlu perhatian khusus.",

            default => "-",
        };
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
