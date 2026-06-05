<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use Illuminate\Support\Facades\Auth;

abstract class Controller
{
    public function index()
    {
        return view('welcome');
    }

    protected function pastikanMilikOrangTua($balitaId)
    {
        $user = Auth::user(); // perlu object user karena membaca role

        if ($user && $user->role === 'orangtua') {
            $milik = Balita::where('id', $balitaId)
                ->where('user_id', Auth::id())
                ->exists();

            if (!$milik) {
                abort(403, 'Anda tidak memiliki akses ke data balita ini.');
            }
        }
    }

    protected function normalisasiNoTelp(?string $no): ?string
    {
        if (!$no) return null;

        $no = preg_replace('/[^0-9]/', '', $no);   // buang spasi, +, strip

        if (str_starts_with($no, '62'))  return $no;
        if (str_starts_with($no, '0'))   return '62' . substr($no, 1);

        return '62' . $no;
    }
}
