<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\PlayController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/play', [PlayController::class, 'index'])->name('play');

require __DIR__.'/auth.php';
