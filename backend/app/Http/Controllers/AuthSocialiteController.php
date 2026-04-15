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


            $user = User::where('email', $socialUser->email)->first();

            if ($user) {


                if (!$user->google_id) {
                    $user->update([
                        'google_id' => $socialUser->id,
                        'google_token' => $socialUser->token,
                        'google_refresh_token' => $socialUser->refreshToken,
                    ]);
                }
            } else {

                $user = User::create([
                    'name' => $socialUser->name,
                    'email' => $socialUser->email,
                    'password' => Hash::make(Str::random(16)),
                    'google_id' => $socialUser->id,
                    'google_token' => $socialUser->token,
                    'google_refresh_token' => $socialUser->refreshToken,
                    'no_telp' => '-',
                    'role' => 'orangtua', // default role
                    'alamat' => '-',
                ]);
            }

            // 🔑 token Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            return redirect("http://localhost:5173/auth/callback?token=$token&role=$user->role");
        } catch (\Exception $e) {
            return redirect("http://localhost:5173/login?error=google_login_failed");
        }
    }
}
