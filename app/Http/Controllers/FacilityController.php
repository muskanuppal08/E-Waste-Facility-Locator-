<?php

namespace App\Http\Controllers;

use App\Models\EwasteCenter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FacilityController extends Controller
{
    /**
     * Show the facility locator page.
     */
    public function index()
    {
        return Inertia::render('Facility/Locator');
    }

    public function nearby(Request $request)
    {
        $lat = $request->query('lat');
        $lng = $request->query('lng');
        $radius = $request->query('radius', 50); // Default 50km
        $sort = $request->query('sort', 'distance'); // distance or rating

        if (!$lat || !$lng) {
            return response()->json(['error' => 'Latitude and Longitude are required'], 400);
        }

        // Haversine formula
        $query = EwasteCenter::select('*')
            ->selectRaw(
                "(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance",
                [$lat, $lng, $lat]
            )
            ->having('distance', '<=', $radius);

        if ($sort === 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->orderBy('distance');
        }

        $facilities = $query->get();

        return response()->json($facilities);
    }

    /**
     * API: Search by city or pincode.
     */
    public function search(Request $request)
    {
        $query = $request->query('query');

        if (!$query) {
            return response()->json([]);
        }

        $facilities = EwasteCenter::where('address', 'LIKE', "%{$query}%")
            ->orWhere('name', 'LIKE', "%{$query}%")
            ->get();

        return response()->json($facilities);
    }

    /**
     * API: Get a specific facility.
     */
    public function show($id)
    {
        $facility = EwasteCenter::findOrFail($id);
        return response()->json($facility);
    }

    /**
     * API: Get centers open now.
     */
    public function openNow()
    {
        $now = now()->format('H:i:s');
        
        $facilities = EwasteCenter::where(function ($query) use ($now) {
            $query->where('open_time', '<=', $now)
                  ->where('close_time', '>=', $now);
        })->get();

        return response()->json($facilities);
    }

    /**
     * API: POST a review for a facility.
     */
    public function storeReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $facility = EwasteCenter::findOrFail($id);

        $facility->reviews()->create([
            'user_id' => auth()->id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Update average rating
        $avgRating = $facility->reviews()->avg('rating');
        $totalReviews = $facility->reviews()->count();

        $facility->update([
            'rating' => $avgRating,
            'total_reviews' => $totalReviews,
        ]);

        return response()->json(['message' => 'Review submitted successfully']);
    }
}
