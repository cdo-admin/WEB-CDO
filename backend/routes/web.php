<?php

use Illuminate\Support\Facades\Route;

/*
 | Website React (hasil `npm run build:laravel` di folder frontend) disajikan dari public/app.
 | Semua alamat selain /api/* dan /storage/* diarahkan ke index.html React (React Router yang menangani).
 */
Route::fallback(function () {
    $spa = public_path('app/index.html');
    abort_unless(is_file($spa), 404, 'Frontend belum di-build. Jalankan: cd frontend && npm run build:laravel');

    return response()->file($spa, ['Content-Type' => 'text/html; charset=UTF-8', 'Cache-Control' => 'no-cache']);
});
