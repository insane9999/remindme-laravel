<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::post('/session', [AuthController::class, 'login'])->name('login');
Route::put('/session', [AuthController::class, 'refresh']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::apiResource('reminders', ReminderController::class);
});