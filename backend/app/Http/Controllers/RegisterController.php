<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function register(Request $request)
    {
      
        $request->merge([
            'no_telp' => $this->normalisasiNoTelp($request->no_telp),
        ]);

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8',
          
            'no_telp'  => 'required|regex:/^62[0-9]{8,13}$/',
            'alamat'   => 'required',
        ], [
            'no_telp.regex' => 'Format nomor HP tidak valid. Contoh: 081234567890',
        ]);

        $ada = User::where('no_telp', $request->no_telp)->first();

        // a) Sudah terdaftar dan aktif -> tolak
        if ($ada && $ada->akun_aktif) {
            return response()->json([
                'message' => 'Nomor HP sudah terdaftar. Silakan login, atau gunakan fitur lupa password.',
            ], 422);
        }

      
        if ($ada && !$ada->akun_aktif) {
            $ada->update([
                'name'       => $request->name,
                'email'      => $request->email,
                'password'   => Hash::make($request->password),
                'alamat'     => $request->alamat,
                'akun_aktif' => true,
            ]);

            $token = $ada->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'Akun berhasil diaktifkan. Data anak Anda sudah terhubung.',
                'user'    => $ada,
                'token'   => $token,
            ]);
        }


        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'no_telp'    => $request->no_telp,
            'role'       => 'orangtua',
            'alamat'     => $request->alamat,
            'akun_aktif' => true,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Register berhasil',
            'user'    => $user,
            'token'   => $token,
        ]);
    }
}
