<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthSocialiteController;

Route::get('/', function () {
    return view('welcome');
});
Route::get(
    '/auth/google/redirect',
    [AuthSocialiteController::class, 'redirect']
);
Route::get(
    '/auth/{google}/callback',
    [AuthSocialiteController::class, 'callback']
);
