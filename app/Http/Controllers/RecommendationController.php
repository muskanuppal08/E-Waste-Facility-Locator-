<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\EwasteCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\JsonResponse;

class RecommendationController extends Controller
{
    /**
     * Display the AI Assistant recommendation page.
     */
    public function index(): Response
    {
        return Inertia::render('Recommendation/Index');
    }

    /**
     * Suggest recycling details based on user natural language query.
     */
    public function suggest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'required|string|max:500',
            'lat' => 'nullable|numeric',
            'lng' => 'nullable|numeric',
        ]);

        $query = strtolower($validated['query']);
        
        // 1. Match Device Type
        $deviceType = null;
        if (str_contains($query, 'laptop') || str_contains($query, 'computer') || str_contains($query, 'pc')) {
            $deviceType = 'Laptop';
        } elseif (str_contains($query, 'phone') || str_contains($query, 'mobile') || str_contains($query, 'smartphone') || str_contains($query, 'iphone') || str_contains($query, 'android')) {
            $deviceType = 'Mobile';
        } elseif (str_contains($query, 'battery') || str_contains($query, 'batteries') || str_contains($query, 'cell')) {
            $deviceType = 'Battery';
        } elseif (str_contains($query, 'tv') || str_contains($query, 'television') || str_contains($query, 'monitor') || str_contains($query, 'screen') || str_contains($query, 'display')) {
            $deviceType = 'TV';
        } elseif (str_contains($query, 'printer') || str_contains($query, 'scanner') || str_contains($query, 'copier')) {
            $deviceType = 'Printer';
        }

        if (!$deviceType) {
            return response()->json([
                'error' => "We couldn't determine the device type. Please mention whether it is a Mobile, Laptop, Battery, TV, or Printer in your query."
            ], 422);
        }

        // 2. Match Brand
        $brand = 'Generic';
        $brandsList = ['dell', 'apple', 'samsung', 'hp', 'lenovo', 'acer', 'asus', 'sony', 'lg', 'toshiba', 'panasonic', 'canon', 'epson', 'brother', 'nokia', 'motorola', 'google', 'oneplus', 'xiaomi', 'redmi', 'oppo', 'vivo'];
        foreach ($brandsList as $b) {
            if (str_contains($query, $b)) {
                $brand = ucfirst($b);
                break;
            }
        }

        // 3. Match Condition & Multiplier
        $condition = 'Average';
        $multiplier = 0.6;

        $poorKeywords = ['broken', 'dead', 'damaged', 'smashed', 'crack', 'faulty', 'ruined', 'not working', 'destroyed', 'junk', 'old'];
        $goodKeywords = ['good', 'working', 'fine', 'functional', 'intact'];
        $excellentKeywords = ['excellent', 'perfect', 'new'];

        foreach ($poorKeywords as $w) {
            if (str_contains($query, $w)) {
                $condition = 'Poor';
                $multiplier = 0.4;
                break;
            }
        }

        if ($condition === 'Average') {
            foreach ($excellentKeywords as $w) {
                if (str_contains($query, $w)) {
                    $condition = 'Excellent';
                    $multiplier = 1.0;
                    break;
                }
            }
        }

        if ($condition === 'Average') {
            foreach ($goodKeywords as $w) {
                if (str_contains($query, $w)) {
                    $condition = 'Good';
                    $multiplier = 0.8;
                    break;
                }
            }
        }

        // 4. Calculate Proximity (Closest certified center accepting this item)
        $lat = $request->input('lat', 28.6139); // Delhi fallback
        $lng = $request->input('lng', 77.2090);

        $distanceSql = "
            (6371 * acos(
                LEAST(1, GREATEST(-1, 
                    cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + 
                    sin(radians(?)) * sin(radians(latitude))
                ))
            ))
        ";

        // Query centers that accept the device category
        $closestRecycler = EwasteCenter::select('*')
            ->selectRaw("ROUND($distanceSql, 2) AS distance", [$lat, $lng, $lat])
            ->where('accepted_items', 'LIKE', "%{$deviceType}%")
            ->orderBy('distance')
            ->first();

        // Fallback to any closest center if none filters by items
        if (!$closestRecycler) {
            $closestRecycler = EwasteCenter::select('*')
                ->selectRaw("ROUND($distanceSql, 2) AS distance", [$lat, $lng, $lat])
                ->orderBy('distance')
                ->first();
        }

        // 5. Reward Estimation
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

        $ecoPoints = (int) ($basePoints * $multiplier);
        $carbonOffset = round($baseCarbon * $multiplier, 2);

        // Scale metals
        $scaledMetals = [];
        foreach ($metals as $m) {
            $amountVal = floatval(preg_replace('/[^0-9.]/', '', $m['amount']));
            $unit = preg_replace('/[0-9. ]/', '', $m['amount']);
            $scaledAmount = round($amountVal * $multiplier, 2);
            $scaledMetals[] = [
                'name' => $m['name'],
                'amount' => "{$scaledAmount} {$unit}"
            ];
        }

        // 6. Educational Content / Instructions
        $deviceInfo = Device::where('name', 'LIKE', "%{$deviceType}%")->first();

        return response()->json([
            'device_type' => $deviceType,
            'brand' => $brand,
            'condition' => $condition,
            'closest_recycler' => $closestRecycler,
            'rewards' => [
                'eco_points' => $ecoPoints,
                'carbon_offset' => $carbonOffset,
                'metals' => $scaledMetals
            ],
            'instructions' => $deviceInfo ? [
                'risk_level' => $deviceInfo->risk_level,
                'harmful_materials' => $deviceInfo->harmful_materials,
                'environmental_impact' => $deviceInfo->environmental_impact,
                'health_effects' => $deviceInfo->health_effects,
                'recycling_benefits' => $deviceInfo->recycling_benefits
            ] : null
        ]);
    }
}
