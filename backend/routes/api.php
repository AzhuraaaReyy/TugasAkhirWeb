<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;

// 🔓 PUBLIC ROUTE (TIDAK PERLU LOGIN)
Route::post('/login', [LoginController::class, 'login']);


// 🔐 PROTECTED ROUTE (WAJIB LOGIN SANCTUM)
Route::middleware('auth:sanctum')->group(function () {

    // 🔥 ADMIN
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'message' => 'Dashboard Admin',
                'role' => 'admin'
            ]);
        });
    });

    // 🔥 KADER
    Route::middleware('role:kader')->group(function () {
        Route::get('/kader/dashboard', function () {
            return response()->json([
                'message' => 'Dashboard Kader',
                'role' => 'kader'
            ]);
        });
    });

    // 🔥 ORANG TUA
    Route::middleware('role:orangtua')->group(function () {
        Route::get('/orangtua/dashboard', function () {
            return response()->json([
                'message' => 'Dashboard Orang Tua',
                'role' => 'orangtua'
            ]);
        });
    });
});
