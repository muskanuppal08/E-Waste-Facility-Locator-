<?php

use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Home Page - Role Selection
Route::get('/', function () {
    return Inertia::render('Home');
})->name('home');

// ─── User Area (requires auth + email verified + user role) ───────────────
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ─── Admin Area (requires auth + admin role) ──────────────────────────────
Route::prefix('admin')->name('admin.')->group(function () {
    
    Route::middleware('guest')->group(function () {
        Route::get('/login', [AdminLoginController::class, 'showLoginForm'])->name('login');
        Route::post('/login', [AdminLoginController::class, 'login']);
    });

    Route::middleware(['auth', 'role:admin'])->group(function () {
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::post('/logout', [AdminLoginController::class, 'logout'])->name('logout');
    });
});

// ─── Facility Locator ──────────────────────────────────────────────────────
Route::get('/locator', [App\Http\Controllers\FacilityController::class, 'index'])->name('locator');

Route::prefix('api')->group(function () {
    Route::get('/facilities/nearby', [App\Http\Controllers\FacilityController::class, 'nearby']);
    Route::get('/facilities/search', [App\Http\Controllers\FacilityController::class, 'search']);
    Route::get('/facilities/open-now', [App\Http\Controllers\FacilityController::class, 'openNow']);
    Route::get('/facilities/{id}', [App\Http\Controllers\FacilityController::class, 'show']);
    Route::post('/facilities/{id}/review', [App\Http\Controllers\FacilityController::class, 'storeReview'])->middleware('auth');

    // E-Waste Education
    Route::get('/devices', [App\Http\Controllers\EducationController::class, 'index']);
    Route::post('/devices', [App\Http\Controllers\EducationController::class, 'store']);
    Route::put('/devices/{id}', [App\Http\Controllers\EducationController::class, 'update']);
    Route::delete('/devices/{id}', [App\Http\Controllers\EducationController::class, 'destroy']);
});

// ─── Shared Auth Routes (Breeze) ──────────────────────────────────────────
require __DIR__.'/auth.php';