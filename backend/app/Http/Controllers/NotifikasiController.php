<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use App\Models\User;
use App\Models\UserNotifikasi;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class NotifikasiController extends Controller
{
    public function store(Request $request, WhatsAppService $wa)
    {
        $request->validate([
            'judul' => 'required',
            'tipe' => 'required',
            'metode' => 'required|in:whatsapp,email,dashboard',
            'pesan' => 'required',
            'tanggal' => 'nullable|date',
            'target' => 'required|in:semua,tertentu',
            'user_id' => 'nullable|exists:users,id'
        ]);

        // 1. Simpan Notifikasi
        $notif = Notifikasi::create([
            'pengirim_id' => auth()->id(),
            'judul' => $request->judul,
            'tipe' => $request->tipe,
            'pesan' => $request->pesan,
            'tanggal' => $request->tanggal ?? now(),
        ]);

        // 2. Tentukan target user
        if ($request->target === 'semua') {
            $users = User::where('role', 'orangtua')->get();
        } else {
            $users = User::where('id', $request->user_id)->get();
        }

        foreach ($users as $user) {

            $status = 'terkirim';

            try {
                // FORMAT NOMOR WA
                if ($user->no_telp) {
                    if (substr($user->no_telp, 0, 2) == '62') {
                        $no_telp = $user->no_telp;
                    } else {
                        $no_telp = '62' . ltrim($user->no_telp, '0');
                    }
                }

                $message = $notif->pesan;

                // 3. Kirim berdasarkan metode
                if ($request->metode === 'whatsapp' && $user->no_telp) {
                    $waResponse = $wa->send($no_telp, $message);
                    if (isset($waResponse['status']) && $waResponse['status'] == true) {
                        $status = 'terkirim';
                    } else {
                        $status = 'gagal';
                    }
                }
                if ($request->metode === 'email' && $user->email) {
                    try {
                        Mail::raw($message, function ($mail) use ($user, $notif) {
                            $mail->to($user->email)
                                ->subject($notif->judul);
                        });

                        $status = 'terkirim';
                    } catch (\Exception $e) {
                        $status = 'gagal';
                        Log::error('Email gagal: ' . $e->getMessage());
                    }
                }

                // dashboard = tidak kirim apa2 (hanya simpan)

            } catch (\Exception $e) {
                $status = 'gagal';
            }

            // 4. Simpan ke user_notifikasi
            UserNotifikasi::create([
                'notification_id' => $notif->id,
                'user_id' => $user->id,
                'metode' => $request->metode,
                'status_kirim' => $status,
                'status_baca' => false,
            ]);
        }

        return response()->json([
            'message' => 'Notifikasi berhasil dikirim'
        ]);
    }


    public function index()
    {
        $user = auth()->user();

        $data = UserNotifikasi::with('notifikasi')
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return response()->json($data);
    }

    public function tampildata()
    {
        $data = UserNotifikasi::with(['notifikasi', 'user'])->orderBy('id', 'asc')
            ->get();

        $result = $data->map(function ($item) {
            return [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'judul' => $item->notifikasi->judul ?? '-',
                'tipe' => $item->notifikasi->tipe ?? '-',
                'metode' => $item->metode ?? '-',
                'tanggal' => $item->notifikasi->tanggal ?? '-',
                'status_kirim' => $item->status_kirim ?? '-',
                'status_baca' => $item->status_baca ?? '-',
            ];
        });

        return response()->json($result);
    }
    public function getOrangTua()
    {
        $users = User::where('role', 'orangtua')
            ->select('id', 'name', 'email', 'no_telp')
            ->get();

        return response()->json($users);
    }
}
