<?php

namespace App\Http\Controllers;

use App\Models\PickupRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminPickupController extends Controller
{
    /**
     * Display a listing of all pickup requests (Admin Only).
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Pickups', [
            'pickups' => PickupRequest::with('user')->latest()->get(),
        ]);
    }

    /**
     * Update the status of the specified pickup request.
     */
    public function updateStatus(Request $request, $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Pending,Scheduled,Completed,Cancelled',
            'notes' => 'nullable|string',
        ]);

        $pickup = PickupRequest::findOrFail($id);
        
        $pickup->update([
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? $pickup->notes,
        ]);

        return redirect()->back()->with('status', 'Pickup request status updated successfully!');
    }
}
