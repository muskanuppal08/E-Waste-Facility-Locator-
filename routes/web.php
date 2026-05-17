<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\FacilityController;
use App\Http\Controllers\PickupController;
use App\Models\PickupRequest;
use App\Http\Controllers\SystemController;

//Home Page
Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/locator', function () {
    return Inertia::render('Facility/Locator');
});

Route::get('/education', function () {
    return Inertia::render('DeviceEducation');
});

// User Dashboard (Clerk protects this on the frontend)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
});

// Pickup Request Form
Route::get('/pickup/create', function () {
    return Inertia::render('SchedulePickup');
});

Route::get('/privacy', function () {
    return Inertia::render('Legal/Privacy');
});

Route::get('/terms', function () {
    return Inertia::render('Legal/Terms');
});

Route::get('/contact', function () {
    return Inertia::render('Support/Contact');
});

// Admin Routes
Route::get('/admin/dashboard', function () {
    return Inertia::render('AdminDashboard');
});

Route::get('/admin/facilities', function () {
    return Inertia::render('FacilityManager');
});

Route::get('/admin/users', function () {
    return Inertia::render('UserManager');
});

Route::get('/admin/education', function () {
    return Inertia::render('ContentManager');
});

// Internal API route for the map
Route::get('/api/facilities/search', [FacilityController::class, 'search']);

// 🚀 NEW: Form Submission Route
Route::post('/pickup/store', [PickupController::class, 'store']);

// 🚀 UPDATED: Pass real DB data to the Admin Dashboard
Route::get('/admin/dashboard', function () {
    return Inertia::render('AdminDashboard', [
        // Grab all pickups, newest first
        'dbPickups' => PickupRequest::orderBy('created_at', 'desc')->get() 
    ]);
});

//End-to-End routes
Route::post('/api/admin/pickup/status', [SystemController::class, 'updatePickupStatus']);
Route::get('/api/user/stats', [SystemController::class, 'getUserStats']);


// (You can leave the rest of the file as-is for now)
require __DIR__.'/auth.php';