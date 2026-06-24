<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RewardCalculation;
use App\Models\User;
use Inertia\Inertia;

class RewardCalculatorController extends Controller
{
    public function index()
    {
        $calculations = [];
        if (auth()->check()) {
            $calculations = auth()->user()->rewardCalculations()->latest()->get();
        }

        return Inertia::render('Reward/Calculator', [
            'pastCalculations' => $calculations
        ]);
    }

    public function calculate(Request $request)
    {
        $validated = $request->validate([
            'device_type' => 'required|string|in:Mobile,Laptop,Battery,TV,Printer',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'condition' => 'required|string|in:Excellent,Good,Average,Poor',
        ]);

        $deviceType = $validated['device_type'];
        $condition = $validated['condition'];

        // Base values definition
        $basePoints = 0;
        $baseCarbon = 0.0;
        $metals = [];

        switch ($deviceType) {
            case 'Mobile':
                $basePoints = 100;
                $baseCarbon = 2.5;
                $metals = [
                    ['name' => 'Gold', 'amount' => '15 mg'],
                    ['name' => 'Silver', 'amount' => '300 mg'],
                    ['name' => 'Copper', 'amount' => '15 g'],
                    ['name' => 'Palladium', 'amount' => '5 mg']
                ];
                break;
            case 'Laptop':
                $basePoints = 250;
                $baseCarbon = 15.0;
                $metals = [
                    ['name' => 'Copper', 'amount' => '150 g'],
                    ['name' => 'Gold', 'amount' => '25 mg'],
                    ['name' => 'Aluminum', 'amount' => '300 g'],
                    ['name' => 'Silver', 'amount' => '1000 mg']
                ];
                break;
            case 'Battery':
                $basePoints = 80;
                $baseCarbon = 1.2;
                $metals = [
                    ['name' => 'Cadmium', 'amount' => '30 g'],
                    ['name' => 'Nickel', 'amount' => '50 g'],
                    ['name' => 'Lithium', 'amount' => '20 g']
                ];
                break;
            case 'TV':
                $basePoints = 150;
                $baseCarbon = 8.0;
                $metals = [
                    ['name' => 'Lead', 'amount' => '500 g'],
                    ['name' => 'Copper', 'amount' => '80 g'],
                    ['name' => 'Gold', 'amount' => '10 mg']
                ];
                break;
            case 'Printer':
                $basePoints = 100;
                $baseCarbon = 4.5;
                $metals = [
                    ['name' => 'Copper', 'amount' => '40 g'],
                    ['name' => 'Aluminum', 'amount' => '120 g']
                ];
                break;
        }

        // Condition multiplier logic
        $multiplier = 1.0;
        if ($condition === 'Good') {
            $multiplier = 0.8;
        } elseif ($condition === 'Average') {
            $multiplier = 0.6;
        } elseif ($condition === 'Poor') {
            $multiplier = 0.4;
        }

        $ecoPoints = (int) ($basePoints * $multiplier);
        $carbonSaved = round($baseCarbon * $multiplier, 2);

        // Adjust metal amounts based on multiplier (estimating actual recovered metal yields)
        $adjustedMetals = array_map(function($metal) use ($multiplier) {
            // Split amount and unit
            preg_match('/^(\d+)\s*([a-zA-Z]+)$/', $metal['amount'], $matches);
            if (count($matches) === 3) {
                $val = floatval($matches[1]) * $multiplier;
                // Round nicely
                $val = $val >= 10 ? round($val) : round($val, 1);
                return [
                    'name' => $metal['name'],
                    'amount' => $val . ' ' . $matches[2]
                ];
            }
            return $metal;
        }, $metals);

        // Save to DB
        $calc = RewardCalculation::create([
            'user_id' => auth()->id(),
            'device_type' => $deviceType,
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'condition' => $condition,
            'eco_points' => $ecoPoints,
            'carbon_saved' => $carbonSaved,
            'metals_data' => $adjustedMetals
        ]);

        // Update authenticated user points
        if (auth()->check()) {
            $user = auth()->user();
            $user->eco_points += $ecoPoints;
            $user->save();
            $user->checkAndAwardBadges();
        }

        return response()->json([
            'calculation' => $calc,
            'user_eco_points' => auth()->check() ? auth()->user()->eco_points : null
        ]);
    }
}
