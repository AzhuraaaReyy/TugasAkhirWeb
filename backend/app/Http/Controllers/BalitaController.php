<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BalitaController extends Controller
{
    public function balitaSaya()
    {
        $anak = Balita::where('user_id', Auth::id())
            ->select('id', 'name', 'jk', 'tgl_lahir')
            ->orderBy('name')
            ->get()
            ->map(function ($b) {
                // Deteksi terakhir anak (boleh null bila belum pernah diukur)
                $terakhir = Deteksi::where('balita_id', $b->id)
                    ->orderByDesc('tgl_deteksi')
                    ->orderByDesc('id')
                    ->first();

                return [
                    'id'              => $b->id,
                    'name'            => $b->name,
                    'jk'              => $b->jk,
                    'tgl_lahir'       => optional($b->tgl_lahir)->format('Y-m-d'),
                    // info tambahan, berguna untuk kartu pilih anak:
                    'sudah_dideteksi' => $terakhir !== null,
                    'deteksi_terakhir' => $terakhir
                        ? optional($terakhir->tgl_deteksi)->format('Y-m-d')
                        : null,
                    'status_tb_u'     => $terakhir->status_tb_u ?? null,
                ];
            });

        return response()->json($anak);
    }

    public function index()
    {
        $deteksiTerbaru = Deteksi::with('balita')
            ->orderByDesc('tgl_deteksi')
            ->orderByDesc('id')
            ->get()
            ->groupBy('balita_id')
            ->map(fn($items) => $items->first()) // ambil pengukuran terbaru tiap balita
            ->values();

        $stunting = $deteksiTerbaru->filter(function ($item) {
            $status = strtolower(trim($item->status_tb_u ?? ''));
            return str_contains($status, 'pendek');
        })->count();

        $tidakStunting = $deteksiTerbaru->filter(function ($item) {
            $status = strtolower(trim($item->status_tb_u ?? ''));
            return str_contains($status, 'normal') || str_contains($status, 'tinggi');
        })->count();

        // Ambil data balita
        $balitas = Balita::with(['user', 'posyandu'])->orderBy('id', 'asc')->get();

        $data = $balitas->map(function ($balita) {
            return [
                'id'        => $balita->id,
                'name'      => $balita->name,
                'orangtua'  => $balita->user?->name,
                'jk'        => $balita->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tgl_lahir' => $balita->tgl_lahir,
                'tmp_lahir' => $balita->tmp_lahir,
                'posyandu'  => $balita->posyandu?->nama_posyandu,
            ];
        });

        $totalBalita = Balita::count();
        $lastUpdate = Carbon::parse(Deteksi::max('updated_at'))
            ->timezone('Asia/Jakarta')
            ->toDateTimeString();

        return response()->json([
            'data'           => $data,
            'total_balita'   => $totalBalita,
            'stunting'       => $stunting,
            'tidak_stunting' => $tidakStunting,
            'last_update'    => $lastUpdate,
        ]);
    }

    public function store(Request $request)
    {
        $kader = $request->user(); // kader yang sedang login (Sanctum)

        // pastikan kader sudah ditempatkan di sebuah posyandu
        if (!$kader->posyandu_id) {
            return response()->json([
                'message' => 'Akun kader belum terhubung dengan posyandu. Hubungi admin untuk penempatan posyandu.',
            ], 422);
        }

        $request->merge([
            'no_telp' => $this->normalisasiNoTelp($request->no_telp),
        ]);

        $validated = $request->validate(
            [
                // ===== DATA BALITA (posyandu_id dihapus dari sini) =====
                'name'       => 'required|string|max:255|unique:balitas,name|regex:/^[A-Za-z\s\.\']+$/',
                'jk'         => 'required|in:L,P',
                'tgl_lahir'  => 'required|date',
                'tmp_lahir'  => 'required|string|max:255',

                // ===== DATA ORANG TUA =====
                'nama_orangtua' => 'required|string|max:255|regex:/^[A-Za-z\s\.\']+$/',
                'no_telp'       => 'required|regex:/^62[0-9]{9,13}$/',
                'alamat'        => 'required|string',
            ],
            [
                'name.required'  => 'Nama balita wajib diisi.',
                'name.regex'     => 'Nama balita hanya boleh berisi huruf.',
                'name.unique'    => 'Balita sudah terdaftar.',
                'jk.required'    => 'Jenis kelamin wajib dipilih.',
                'jk.in'          => 'Jenis kelamin tidak valid.',
                'tgl_lahir.required' => 'Tanggal lahir wajib diisi.',
                'tgl_lahir.date'     => 'Format tanggal lahir tidak valid.',
                'tmp_lahir.required' => 'Tempat lahir wajib diisi.',
                'nama_orangtua.required' => 'Nama orang tua wajib diisi.',
                'nama_orangtua.regex'    => 'Nama orang tua hanya boleh berisi huruf.',
                'no_telp.required' => 'Nomor WhatsApp wajib diisi.',
                'no_telp.regex'    => 'Nomor WhatsApp tidak valid. Contoh: 081234567890',
                'alamat.required'  => 'Alamat wajib diisi.',
            ]
        );

        try {
            return DB::transaction(function () use ($validated, $kader) {

                /* ===== CARI ATAU BUAT AKUN WALI ===== */
                $orangtua = User::where('no_telp', $validated['no_telp'])->first();
                $passwordDefault = null;

                if (!$orangtua) {
                    $passwordDefault = Carbon::parse($validated['tgl_lahir'])->format('dmY');

                    $orangtua = User::create([
                        'name'       => $validated['nama_orangtua'],
                        'no_telp'    => $validated['no_telp'],
                        'alamat'     => $validated['alamat'],
                        'email'      => null,
                        'password'   => Hash::make($passwordDefault),
                        'role'       => 'orangtua',
                        'akun_aktif' => false,
                    ]);
                }

                /* ===== SIMPAN DATA BALITA ===== */
                $balita = Balita::create([
                    'user_id'     => $orangtua->id,
                    'name'        => $validated['name'],
                    'jk'          => $validated['jk'],
                    'tgl_lahir'   => $validated['tgl_lahir'],
                    'tmp_lahir'   => $validated['tmp_lahir'],
                    'posyandu_id' => $kader->posyandu_id, // <-- OTOMATIS dari kader login
                ]);

                return response()->json([
                    'message' => $passwordDefault
                        ? 'Data balita berhasil ditambahkan dan akun wali baru dibuat.'
                        : 'Data balita berhasil ditambahkan ke akun wali yang sudah ada.',
                    'data' => $balita->load(['user', 'posyandu']),
                    'info_akun' => $passwordDefault ? [
                        'login_dengan'     => 'Nomor WhatsApp',
                        'no_telp'          => $validated['no_telp'],
                        'password_default' => $passwordDefault,
                        'catatan'          => 'Sarankan orang tua segera mengganti password atau mendaftar mandiri dengan nomor yang sama untuk mengaktifkan akun.',
                    ] : null,
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    public function show($id)
    {
        $balita = Balita::with(['user', 'posyandu'])->findOrFail($id);

        return response()->json([
            'message' => 'Detail data balita',
            'data' => [
                'id' => $balita->id,
                'name' => $balita->name,
                'jk' => $balita->jk,
                'tgl_lahir' => $balita->tgl_lahir,
                'tmp_lahir' => $balita->tmp_lahir,
                'alamat' => $balita->user?->alamat,

                'posyandu_id' => $balita->posyandu_id,
                'user_id' => $balita->user_id,

                'posyandu' => $balita->posyandu?->nama_posyandu,
                'orangtua' => $balita->user?->name,
            ]
        ]);
    }

    public function update(Request $request, $id)
    {
        $balita = Balita::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'jk' => 'required|in:L,P',
            'tgl_lahir' => 'required|date',
            'tmp_lahir' => 'required|string|max:255',
            'alamat' => 'required|string',
            'posyandu_id' => 'required|exists:posyandus,id',
        ]);

        // update data balita (alamat tidak ikut, karena milik User)
        $balita->update([
            'user_id' => $validated['user_id'],
            'name' => $validated['name'],
            'jk' => $validated['jk'],
            'tgl_lahir' => $validated['tgl_lahir'],
            'tmp_lahir' => $validated['tmp_lahir'],
            'posyandu_id' => $validated['posyandu_id'],
        ]);

        // update alamat di akun wali terpilih
        User::findOrFail($validated['user_id'])->update([
            'alamat' => $validated['alamat'],
        ]);

        return response()->json([
            'message' => 'Data berhasil di update',
            'data' => $balita->load('user'),
        ]);
    }
    public function destroy($id)
    {
        $balita = Balita::findOrFail($id);

        $balita->delete();

        return response()->json([
            'message' => 'Data balita berhasil dihapus'
        ]);
    }
}
