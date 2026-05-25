<?php

namespace App\Http\Controllers;

use App\Models\Balita;
use App\Models\Deteksi;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;

class BalitaController extends Controller
{
    public function index()
    {
        //ambil data deteksi yang berelasi dengan balita
        $deteksis = Deteksi::with('balita')
            ->orderBy('tgl_deteksi', 'desc')
            ->get();

        //ambil data terbaru saja
        $deteksiTerbaru = Deteksi::with('balita')
            ->latest()
            ->get()
            ->groupBy('balita_id')
            ->map(fn($items) => $items->first())
            ->values();

        $stunting = $deteksiTerbaru->filter(function ($item) {
            $status = strtolower(trim($item->status_tb_u ?? ''));

            return str_contains($status, 'pendek');
        })->count();

        $tidakStunting = $deteksiTerbaru->filter(function ($item) {
            $status = strtolower(trim($item->status_tb_u ?? ''));

            return str_contains($status, 'normal') ||
                str_contains($status, 'tinggi');
        })->count();

        //ambil data balita
        $balitas = Balita::with(['user', 'posyandu'])->orderBy('id', 'asc')
            ->get();


        $data = $balitas->map(function ($balita) {
            return [
                'id' => $balita->id,
                'name' => $balita->name,
                'orangtua' => $balita->user?->name,
                'jk' => $balita->jk === 'L' ? 'Laki-Laki' : 'Perempuan',
                'tgl_lahir' => $balita->tgl_lahir,
                'tmp_lahir' => $balita->tmp_lahir,
                'posyandu' => $balita->posyandu?->nama_posyandu,
            ];
        });
        $totalBalita = Balita::count();
        $lastUpdate = Carbon::parse(Deteksi::max('updated_at'))
            ->timezone('Asia/Jakarta')
            ->toDateTimeString();
        return response()->json([
            'data' => $data,
            'total_balita' => $totalBalita,
            'stunting' => $stunting,
            'tidak_stunting' => $tidakStunting,
            'last_update' => $lastUpdate
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate(
            [
                // ================= DATA BALITA =================
                'name' => 'required|string|max:255|unique:balitas,name|regex:/^[A-Za-z\s\.\']+$/',
                'jk' => 'required|in:L,P',
                'tgl_lahir' => 'required|date',
                'tmp_lahir' => 'required|string|max:255',
                'posyandu_id' => 'required|exists:posyandus,id',

                // ================= DATA ORANG TUA =================
                'nama_orangtua' => 'required|string|max:255|regex:/^[A-Za-z\s\.\']+$/',
                'no_telp' => 'required|regex:/^[0-9]+$/|digits_between:12,13|unique:users,no_telp',
                'alamat' => 'required|string',
            ],
            [
                // ================= BALITA =================
                'name.required' => 'Nama balita wajib diisi.',
                'name.regex' => 'Nama balita hanya boleh berisi huruf.',
                'name.unique' => 'Balita sudah terdaftar.',
                'jk.required' => 'Jenis kelamin wajib dipilih.',
                'jk.in' => 'Jenis kelamin tidak valid.',
                'tgl_lahir.required' => 'Tanggal lahir wajib diisi.',
                'tgl_lahir.date' => 'Format tanggal lahir tidak valid.',
                'tmp_lahir.required' => 'Tempat lahir wajib diisi.',
                'posyandu_id.required' => 'Posyandu wajib dipilih.',
                'posyandu_id.exists' => 'Posyandu tidak ditemukan.',

                // ================= ORANG TUA =================
                'nama_orangtua.required' => 'Nama orang tua wajib diisi.',
                'nama_orangtua.regex' => 'Nama orang tua hanya boleh berisi huruf.',
                'no_telp.required' => 'Nomor WhatsApp wajib diisi.',
                'no_telp.regex' => 'Nomor WhatsApp hanya boleh berisi angka.',
                'no_telp.digits_between' => 'Nomor WhatsApp harus terdiri dari 12 sampai 13 digit.',
                'no_telp.unique' => 'Nomor WhatsApp sudah terdaftar.',
                'alamat.required' => 'Alamat wajib diisi.',
            ]
        );

        try {

            // ================= SIMPAN DATA ORANG TUA =================
            $passwordDefault = Carbon::parse(
                $validated['tgl_lahir']
            )->format('dmY');
            $orangtua = User::create([
                'name' => $validated['nama_orangtua'],
                'no_telp' => $validated['no_telp'],
                'alamat' => $validated['alamat'],
                'email' => 'orangtua' . time() . '@gmail.com',
                'password' => Hash::make($passwordDefault),
                'role' => 'orangtua',
            ]);

            // ================= SIMPAN DATA BALITA =================
            $balita = Balita::create([
                'user_id' => $orangtua->id,
                'name' => $validated['name'],
                'jk' => $validated['jk'],
                'tgl_lahir' => $validated['tgl_lahir'],
                'tmp_lahir' => $validated['tmp_lahir'],
                'posyandu_id' => $validated['posyandu_id'],
            ]);

            return response()->json([
                'message' => 'Data balita berhasil ditambahkan',
                'data' => $balita->load('user'),
            ], 201);
        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Terjadi kesalahan saat menyimpan data',
                'error' => $e->getMessage(),
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
                'alamat' => $balita->alamat,

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

        $balita->update($validated);
        return response()->json([
            'message' => 'Data berhasil di update',
            'data' => $balita
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
