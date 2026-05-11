<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserApiController;
use App\Http\Controllers\Api\ProfileApiController;

/*
|--------------------------------------------------------------------------
| API Routes — consumed by React components & Spring Boot microservice
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->prefix('v1')->name('api.')->group(function () {

    // Profile
    Route::get('/profile', [ProfileApiController::class, 'show'])->name('profile.show');
    Route::put('/profile', [ProfileApiController::class, 'update'])->name('profile.update');
    Route::post('/profile/picture', [ProfileApiController::class, 'updatePicture'])->name('profile.picture');

    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::get('/users', [UserApiController::class, 'index'])->name('users.index');
        Route::get('/users/{user}', [UserApiController::class, 'show'])->name('users.show');
        Route::put('/users/{user}/role', [UserApiController::class, 'updateRole'])->name('users.role');
    });
});

// Health check for Spring Boot microservice
Route::get('/health', fn() => response()->json(['status' => 'ok', 'service' => 'ewaste-laravel', 'version' => '1.0.0']));