<?php

use App\Http\Controllers\BalitaController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PosyanduController;
use App\Http\Controllers\RegisterController;

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);



Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [LoginController::class, 'user']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', function () {
            return response()->json([
                'message' => 'Dashboard Admin',
                'role' => 'admin'
            ]);
        });
    });


    Route::middleware('role:kader')->group(function () {
        Route::get('/kader/dashboard', function () {
            return response()->json([
                'message' => 'Dashboard Kader',
                'role' => 'kader'
            ]);
        });
        Route::get('/balitas', [BalitaController::class, 'index']);
        Route::post('/balitas', [BalitaController::class, 'store']);
        Route::put('/balitas/{id}', [BalitaController::class, 'update']);
        Route::get('/balitas/detail/{id}', [BalitaController::class, 'show']);
        Route::delete('/balitas/{id}', [BalitaController::class, 'destroy']);

        Route::get('/users', [LoginController::class, 'ambiluser']);

        Route::get('/posyandu', [PosyanduController::class, 'index']);
       
    });


    Route::middleware('role:orangtua')->group(function () {
        Route::get('/orangtua/dashboard', function () {
            return response()->json([
                'message' => 'Dashboard Orang Tua',
                'role' => 'orangtua'
            ]);
        });
    });
});
