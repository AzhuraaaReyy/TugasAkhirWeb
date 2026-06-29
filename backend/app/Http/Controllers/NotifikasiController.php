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
            'lokasi'  => 'nullable|string',
            'target'  => 'required|in:semua,tertentu',
            'user_id' => 'nullable|exists:users,id',
        ]);

        // Simpan notifikasi
        $notif = Notifikasi::create([
            'pengirim_id' => Auth::id(),
            'judul'       => $request->judul,
            'tipe'        => $request->tipe,
            'pesan'       => $request->pesan,
            'lokasi'      => $request->lokasi,
            'tanggal'     => $request->tanggal,
        ]);

        // Ambil target user
        if ($request->target == 'semua') {
            $users = User::where('role', 'orangtua')->get();
        } else {
            $users = User::where('id', $request->user_id)->get();
        }

        // Ringkasan hasil
        $berhasil = 0;
        $gagal = 0;
        $detailGagal = [];

        foreach ($users as $user) {

            $status = 'pending';
            $keterangan = '';

            try {

                $message = $notif->pesan;

                // ==========================
                // FORMAT NOMOR WHATSAPP
                // ==========================
                $no_telp = null;

                if (!empty($user->no_telp)) {

                    if (substr($user->no_telp, 0, 2) == '62') {
                        $no_telp = $user->no_telp;
                    } else {
                        $no_telp = '62' . ltrim($user->no_telp, '0');
                    }
                }

                // ==========================
                // DASHBOARD
                // ==========================
                if ($request->metode == 'dashboard') {

                    $status = 'terkirim';
                    $keterangan = 'Notifikasi dashboard berhasil dibuat';
                }

                // ==========================
                // WHATSAPP
                // ==========================
                elseif ($request->metode == 'whatsapp') {

                    if (empty($user->no_telp)) {

                        $status = 'gagal';
                        $keterangan = 'Nomor WhatsApp belum diisi';
                    } else {

                        Log::info('Mengirim WhatsApp', [
                            'nama' => $user->name,
                            'nomor' => $no_telp
                        ]);

                        $waResponse = $wa->send($no_telp, $message);

                        Log::info('Response WhatsApp', $waResponse);

                        if (
                            isset($waResponse['status']) &&
                            $waResponse['status'] == true
                        ) {

                            $status = 'terkirim';
                            $keterangan = 'WhatsApp berhasil dikirim';
                        } else {

                            $status = 'gagal';
                            $keterangan = $waResponse['reason'] ?? 'Gagal mengirim WhatsApp';
                        }
                    }
                }

                // ==========================
                // EMAIL
                // ==========================
                elseif ($request->metode == 'email') {

                    if (empty($user->email)) {

                        $status = 'gagal';
                        $keterangan = 'Email belum diisi';
                    } else {

                        Mail::raw($message, function ($mail) use ($user, $notif) {
                            $mail->to($user->email)
                                ->subject($notif->judul);
                        });

                        $status = 'terkirim';
                        $keterangan = 'Email berhasil dikirim';
                    }
                }
            } catch (\Exception $e) {

                Log::error('ERROR SAAT MENGIRIM NOTIFIKASI', [
                    'user' => $user->id,
                    'nama' => $user->name,
                    'metode' => $request->metode,
                    'message' => $e->getMessage(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile(),
                ]);

                $status = 'gagal';
                $keterangan = $e->getMessage();
            }

            // ==========================
            // SIMPAN KE USER_NOTIFICATIONS
            // ==========================
            UserNotifikasi::create([
                'notification_id' => $notif->id,
                'user_id'         => $user->id,
                'metode'          => $request->metode,
                'status_kirim'    => $status,
                'keterangan'      => $keterangan,
                'status_baca'     => false,
            ]);

            // ==========================
            // HITUNG HASIL
            // ==========================
            if ($status == 'terkirim') {

                $berhasil++;
            } else {

                $gagal++;

                $detailGagal[] = [
                    'id' => $user->id,
                    'nama' => $user->name,
                    'metode' => $request->metode,
                    'alasan' => $keterangan
                ];
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Proses pengiriman notifikasi selesai.',
            'total_penerima' => $users->count(),
            'berhasil' => $berhasil,
            'gagal' => $gagal,
            'detail_gagal' => $detailGagal
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
        $data = Notifikasi::with('userNotifikasi.user')
            ->latest()
            ->get()
            ->map(function ($n) {

                $rows = $n->userNotifikasi;

                $total = $rows->count();
                $terkirim = $rows->where('status_kirim', 'terkirim')->count();
                $gagal = $rows->where('status_kirim', 'gagal')->count();
                $dibaca = $rows->where('status_baca', true)->count();

                $status = 'pending';

                if ($total > 0) {
                    if ($gagal == $total) {
                        $status = 'gagal';
                    } elseif ($terkirim > 0) {
                        $status = 'terkirim';
                    }
                }

                // daftar user yang gagal
                $detailGagal = $rows
                    ->where('status_kirim', 'gagal')
                    ->map(function ($item) {
                        return [
                            'user' => $item->user->name ?? '-',
                            'keterangan' => $item->keterangan,
                        ];
                    })
                    ->values();

                return [

                    'id' => $n->id,
                    'judul' => $n->judul,
                    'tipe' => $n->tipe,
                    'pesan' => $n->pesan,
                    'lokasi' => $n->lokasi,

                    'metode' => optional($rows->first())->metode ?? '-',

                    'tanggal' => $n->tanggal
                        ? \Carbon\Carbon::parse($n->tanggal)->format('Y-m-d')
                        : '-',

                    'status_kirim' => $status,

                    'total_penerima' => $total,

                    'berhasil' => $terkirim,

                    'gagal' => $gagal,

                    'dibaca' => $dibaca,

                    'detail_gagal' => $detailGagal,

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
