<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PickupRequest;

class SystemController extends Controller
{
    // 1. ADMIN ACTION: Update the status of a pickup in the database
    public function updatePickupStatus(Request $request)
    {
        $pickup = PickupRequest::find($request->id);
        if ($pickup) {
            $pickup->status = $request->status;
            $pickup->save();
        }
        return response()->json(['success' => true]);
    }

    // 2. USER ACTION: Dynamically calculate a user's dashboard stats & leaderboard
    public function getUserStats(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return response()->json(['points' => 0, 'co2' => 0, 'metals' => 0, 'devices' => 0, 'pickups' => [], 'leaderboard' => []]);
        }

        // --- 1. CURRENT USER STATS ---
        $pickups = PickupRequest::where('user_email', $email)->orderBy('created_at', 'desc')->get();

        $points = 0;
        $co2Saved = 0;
        $metalsYieldGrams = 0; 
        $devicesRecycled = 0;

        foreach ($pickups as $p) {
            if ($p->status === 'Completed') {
                $devicesRecycled++;
                
                // Calculate dynamic yields based on the device type
                if ($p->device_type === 'laptop') {
                    $points += 500;
                    $co2Saved += 25.5;
                    $metalsYieldGrams += 96.4; // 95g Cu, 1.1g Ag, 0.3g Au
                } elseif ($p->device_type === 'mobile') {
                    $points += 150;
                    $co2Saved += 5.2;
                    $metalsYieldGrams += 16.4; // 16g Cu, 0.35g Ag, 0.05g Au
                } else {
                    $points += 200;
                    $co2Saved += 10.0;
                    $metalsYieldGrams += 35.0; // Average for appliances
                }
            }
        }

        // --- 2. DYNAMIC LEADERBOARD ---
        // Fetch all completed pickups across the entire platform
        $allCompleted = PickupRequest::where('status', 'Completed')->get();
        $leaderboardMap = [];

        // Group points by user
        foreach($allCompleted as $ac) {
            if(!isset($leaderboardMap[$ac->user_email])) {
                $leaderboardMap[$ac->user_email] = [
                    'name' => $ac->user_name,
                    'email' => $ac->user_email,
                    'points' => 0
                ];
            }
            if ($ac->device_type === 'laptop') $leaderboardMap[$ac->user_email]['points'] += 500;
            elseif ($ac->device_type === 'mobile') $leaderboardMap[$ac->user_email]['points'] += 150;
            else $leaderboardMap[$ac->user_email]['points'] += 200;
        }

        // If the current user has 0 completed pickups, they won't be in the loop above. 
        // We need to inject them at the bottom with 0 points so they see themselves!
        if (!isset($leaderboardMap[$email])) {
            $leaderboardMap[$email] = [
                'name' => $pickups->first()->user_name ?? 'You',
                'email' => $email,
                'points' => 0
            ];
        }
        
        // Sort the array by points (Highest to Lowest)
        usort($leaderboardMap, function($a, $b) {
            return $b['points'] <=> $a['points'];
        });
        
        // Format the top 5 for the React frontend
        $finalLeaderboard = [];
        $rank = 1;
        foreach(array_slice($leaderboardMap, 0, 5) as $lb) {
            $badge = 'Eco Beginner';
            if ($lb['points'] >= 1000) $badge = 'Green Warrior';
            if ($lb['points'] >= 5000) $badge = 'Earth Saver';

            $finalLeaderboard[] = [
                'rank' => $rank++,
                'name' => $lb['name'],
                'points' => $lb['points'],
                'badge' => $badge,
                'isCurrentUser' => ($lb['email'] === $email)
            ];
        }

        return response()->json([
            'points' => number_format($points),
            'co2' => number_format($co2Saved, 1),
            'metals' => number_format($metalsYieldGrams / 1000, 2), // Convert grams to kg!
            'devices' => $devicesRecycled,
            'pickups' => $pickups,
            'leaderboard' => $finalLeaderboard
        ]);
    }
}