<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login'    => 'required_without:email|string',
            'email'    => 'required_without:login|string',
            'password' => 'required',
        ]);

        // Ambil identitas dari field mana pun yang dikirim
        $identifier = $request->input('login', $request->input('email'));

        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);

        $user = $isEmail
            ? User::where('email', $identifier)->first()
            : User::where('no_telp', $this->normalisasiNoTelp($identifier))->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email/No. HP atau password salah'
            ], 401);
        }

        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token'   => $token,
            'user'    => [
                'id'         => $user->id,
                'name'       => $user->name,
                'email'      => $user->email,
                'no_telp'    => $user->no_telp,
                'role'       => $user->role,
                'akun_aktif' => $user->akun_aktif,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function ambiluser(Request $request)
    {
        $role = $request->query('role'); // ambil ?role=orangtua
        $users = User::when($role, fn($q) => $q->where('role', $role))
            ->get(['id', 'name', 'email', 'no_telp']);

        return response()->json(['data' => $users]);
    }
}
