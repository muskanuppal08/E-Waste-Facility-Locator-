<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Badge;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    /**
     * Display the Gamification Leaderboard & Badges Hub.
     */
    public function index(): Response
    {
        $user = auth()->user();

        // Dynamically verify and award any new badges before rendering
        if ($user) {
            $user->checkAndAwardBadges();
        }

        // Fetch leaderboard ranking (role: user, ordered by points desc)
        $rankings = User::where('role', 'user')
            ->select('id', 'name', 'email', 'eco_points')
            ->withCount(['badges', 'rewardCalculations'])
            ->orderBy('eco_points', 'desc')
            ->orderBy('name', 'asc')
            ->get();

        // Format rankings with rank index and level
        $rankings = $rankings->map(function ($item, $index) {
            return [
                'rank' => $index + 1,
                'id' => $item->id,
                'name' => $item->name,
                'initials' => $item->initials,
                'eco_points' => $item->eco_points,
                'green_level' => $item->green_level,
                'badges_count' => $item->badges_count,
                'calculations_count' => $item->reward_calculations_count,
            ];
        });

        // Fetch all badges so user knows what's available vs what is earned
        $allBadges = Badge::all();

        // Fetch user's specific earned badge IDs
        $earnedBadgeIds = $user ? $user->badges()->pluck('badges.id')->toArray() : [];

        return Inertia::render('Gamification/Leaderboard', [
            'rankings' => $rankings,
            'allBadges' => $allBadges,
            'earnedBadgeIds' => $earnedBadgeIds,
        ]);
    }
}
