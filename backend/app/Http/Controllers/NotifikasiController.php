<?php

namespace App\Http\Controllers;

use App\Models\Notifikasi;
use App\Models\User;
use App\Models\UserNotifikasi;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class NotifikasiController extends Controller
{
    public function store(Request $request, WhatsAppService $wa)
    {
        $request->validate([
            'judul'   => 'required',
            'tipe'    => 'required',
            'metode'  => 'required|in:whatsapp,email,dashboard',
            'pesan'   => 'required',
            'tanggal' => 'nullable|date',
            'lokasi'  => 'nullable|string', // NEW
            'target'  => 'required|in:semua,tertentu',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // 1. Simpan Notifikasi
        $notif = Notifikasi::create([
            'pengirim_id' => Auth::id(),
            'judul'       => $request->judul,
            'tipe'        => $request->tipe,
            'pesan'       => $request->pesan,
            'lokasi'      => $request->lokasi,   // NEW
            // Biarkan null bila kosong: hanya notifikasi bertanggal yang tampil di kalender
            'tanggal'     => $request->tanggal,
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
                $no_telp = null;
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
                            $mail->to($user->email)->subject($notif->judul);
                        });
                        $status = 'terkirim';
                    } catch (\Exception $e) {
                        $status = 'gagal';
                        Log::error('Email gagal: ' . $e->getMessage());
                    }
                }

                // dashboard = tidak kirim apa-apa (hanya simpan)

            } catch (\Exception $e) {
                $status = 'gagal';
            }

            // 4. Simpan ke user_notifikasi (pivot)
            UserNotifikasi::create([
                'notification_id' => $notif->id,
                'user_id'         => $user->id,
                'metode'          => $request->metode,
                'status_kirim'    => $status,
                'status_baca'     => false,
            ]);
        }

        return response()->json([
            'message' => 'Notifikasi berhasil dikirim',
        ]);
    }

    // UPDATE: hanya mengubah ISI notifikasi (tidak mengirim ulang)
    public function update(Request $request, $id)
    {
        $request->validate([
            'judul'   => 'required',
            'tipe'    => 'required',
            'pesan'   => 'required',
            'tanggal' => 'nullable|date',
            'lokasi'  => 'nullable|string',
        ]);

        $notif = Notifikasi::findOrFail($id);

        $notif->update([
            'judul'   => $request->judul,
            'tipe'    => $request->tipe,
            'pesan'   => $request->pesan,
            'tanggal' => $request->tanggal,
            'lokasi'  => $request->lokasi,
        ]);

        return response()->json([
            'message' => 'Notifikasi berhasil diperbarui',
        ]);
    }

    // DESTROY: hapus notifikasi (baris user_notifications ikut terhapus via cascadeOnDelete)
    public function destroy($id)
    {
        $notif = Notifikasi::findOrFail($id);
        $notif->delete();

        return response()->json([
            'message' => 'Notifikasi berhasil dihapus',
        ]);
    }

    // Notifikasi milik user yang login (dipakai di halaman ortu)
    public function index()
    {
        $user = Auth::id();

        $data = UserNotifikasi::with('notifikasi')
            ->where('user_id', $user)
            ->latest()
            ->get();

        return response()->json($data);
    }

    // Riwayat untuk halaman KADER: SATU BARIS PER NOTIFIKASI (id = id Notifikasi)
    public function tampildata()
    {
        $data = Notifikasi::with('userNotifikasi')
            ->latest()
            ->get()
            ->map(function ($n) {
                $rows     = $n->userNotifikasi;
                $total    = $rows->count();
                $terkirim = $rows->where('status_kirim', 'terkirim')->count();
                $gagal    = $rows->where('status_kirim', 'gagal')->count();
                $dibaca   = $rows->where('status_baca', true)->count();

                // Status ringkas untuk badge di tabel
                $status = 'pending';
                if ($total > 0) {
                    if ($gagal === $total) {
                        $status = 'gagal';
                    } elseif ($terkirim > 0) {
                        $status = 'terkirim';
                    }
                }

                return [
                    'id'             => $n->id, // ID Notifikasi -> dipakai Edit & Hapus
                    'judul'          => $n->judul,
                    'tipe'           => $n->tipe,
                    'pesan'          => $n->pesan,
                    'lokasi'         => $n->lokasi,
                    'metode'         => optional($rows->first())->metode ?? '-',
                    'tanggal'        => $n->tanggal
                        ? \Carbon\Carbon::parse($n->tanggal)->format('Y-m-d')
                        : '-',
                    'status_kirim'   => $status,
                    'total_penerima' => $total,
                    'dibaca'         => $dibaca, // untuk fitur "dibaca X dari Y"
                ];
            });

        return response()->json($data);
    }

    public function getOrangTua()
    {
        $users = User::where('role', 'orangtua')
            ->select('id', 'name', 'email', 'no_telp')
            ->get();

        return response()->json($users);
    }

    // Semua event bertanggal -> tampil di kalender ortu
    public function kalender()
    {
        $events = Notifikasi::whereNotNull('tanggal')
            ->orderBy('tanggal')
            ->get()
            ->map(function ($n) {
                return [
                    'id'      => $n->id,
                    'judul'   => $n->judul,
                    'pesan'   => $n->pesan,
                    'tipe'    => $n->tipe,
                    'lokasi'  => $n->lokasi, // NEW
                    // WAJIB 'Y-m-d' — kalender membandingkan string persis
                    'tanggal' => \Carbon\Carbon::parse($n->tanggal)->format('Y-m-d'),
                ];
            });

        return response()->json($events);
    }
}
