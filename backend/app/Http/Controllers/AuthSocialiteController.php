<?php

namespace App\Http\Controllers;

use App\Models\User;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;



class AuthSocialiteController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }
    public function callback()
    {
        try {
            $socialUser = Socialite::driver('google')->user();

            $user = User::where('google_id', $socialUser->id)
                ->orWhere('email', $socialUser->email)
                ->first();


            if (!$user) {
                $user = User::create([
                    'name' => $socialUser->name,
                    'email' => $socialUser->email,
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $socialUser->id,
                    'google_token' => $socialUser->token,
                    'google_refresh_token' => $socialUser->refreshToken,
                    'no_telp' => '-',
                    'role' => 'orangtua',
                    'alamat' => '-',
                ]);
            }

            // 🔑 generate token Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            // 🚀 redirect sesuai role
            return redirect("http://localhost:5173/auth/callback?token=$token&role=$user->role");
        } catch (\Exception $e) {
            dd($e->getMessage());
            return redirect("http://localhost:5173/login?error=google_login_failed");
        }
    }
}
