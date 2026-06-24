<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class AdminReviewController extends Controller
{
    /**
     * Display a listing of all reviews (Admin Only).
     */
    public function index()
    {
        return Inertia::render('Admin/Reviews', [
            'reviews' => Review::with(['user', 'ewasteCenter'])->latest()->get(),
        ]);
    }

    /**
     * Approve the specified review.
     */
    public function approve($id): RedirectResponse
    {
        $review = Review::findOrFail($id);
        $review->update(['approved' => true]);
        
        // Recalculate rating
        $review->ewasteCenter->recalculateRating();

        // Check and award badges for the user who wrote the review
        if ($review->user) {
            $review->user->checkAndAwardBadges();
        }

        return redirect()->back()->with('status', 'Review approved successfully!');
    }

    /**
     * Delete/Reject the specified review.
     */
    public function destroy($id): RedirectResponse
    {
        $review = Review::findOrFail($id);
        $facility = $review->ewasteCenter;
        $review->delete();

        // Recalculate rating
        $facility->recalculateRating();

        return redirect()->back()->with('status', 'Review deleted successfully!');
    }
}
