<?php

namespace App\Http\Controllers;

use App\Models\EwasteCenter;
use App\Models\User;
use App\Models\Review;
use App\Models\PickupRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_facilities' => EwasteCenter::count(),
                'total_users' => User::where('role', 'user')->count(),
                'total_reviews' => Review::count(),
                'total_calculations' => \App\Models\RewardCalculation::count(),
                'total_pickups' => PickupRequest::count(),
                'pending_pickups' => PickupRequest::where('status', 'Pending')->count(),
            ]
        ]);
    }
}
