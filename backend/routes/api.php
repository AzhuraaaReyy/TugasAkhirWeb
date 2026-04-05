<?php

use App\Http\Controllers\BalitaController;
use App\Http\Controllers\DetailDeteksiController;
use App\Http\Controllers\DeteksiController;
use App\Http\Controllers\LaporanController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\PenimbanganController;
use App\Http\Controllers\PosyanduController;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\RiwayatGrafikController;

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

        Route::get('/penimbangans', [PenimbanganController::class, 'index']);
        Route::post('/penimbangans', [PenimbanganController::class, 'store']);
        Route::put('/penimbangans/{id}', [PenimbanganController::class, 'update']);
        Route::get('/penimbangans/detail/{id}', [PenimbanganController::class, 'show']);
        Route::delete('/penimbangans/{id}', [PenimbanganController::class, 'destroy']);

        Route::get('/users', [LoginController::class, 'ambiluser']);

        Route::get('/posyandu', [PosyanduController::class, 'index']);

        Route::get('/ambilbalita', [DeteksiController::class, 'ambildatabalita']);
        Route::post('/deteksi', [DeteksiController::class, 'deteksi']);
        Route::delete('/deteksi/delete/{id}', [DeteksiController::class, 'destroy']);
        Route::get('/deteksi', [DeteksiController::class, 'index']);

        Route::get('/detaildeteksi/{id}', [DetailDeteksiController::class, 'detaildeteksi']);
        Route::post('/detaildeteksi/store', [DetailDeteksiController::class, 'store']);

        Route::get('/riwayat/{id}', [RiwayatGrafikController::class, 'ambildatabalita']);
        Route::get('/grafik/{id}', [RiwayatGrafikController::class, 'grafik']);

        Route::get('/laporan', [LaporanController::class, 'laporan']);
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
