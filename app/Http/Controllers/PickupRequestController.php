<?php

namespace App\Http\Controllers;

use App\Models\PickupRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PickupRequestController extends Controller
{
    /**
     * Display the list of pickup requests and scheduling form.
     */
    public function index(): Response
    {
        $pickups = [];
        if (auth()->check()) {
            $pickups = auth()->user()->pickupRequests()->latest()->get();
        }

        return Inertia::render('Pickup/Index', [
            'pastPickups' => $pickups
        ]);
    }

    /**
     * Store a new home pickup request in database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'device_type' => 'required|string|in:Mobile,Laptop,Battery,TV,Printer,Other',
            'brand' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'pickup_date' => 'required|date|after_or_equal:today',
            'pickup_time' => 'required|string|in:Morning (9 AM - 12 PM),Afternoon (12 PM - 3 PM),Evening (3 PM - 6 PM)',
            'address' => 'required|string|min:10',
            'contact_phone' => 'required|string|min:8',
            'notes' => 'nullable|string'
        ]);

        $request->user()->pickupRequests()->create([
            'device_type' => $validated['device_type'],
            'brand' => $validated['brand'],
            'model' => $validated['model'],
            'pickup_date' => $validated['pickup_date'],
            'pickup_time' => $validated['pickup_time'],
            'address' => $validated['address'],
            'contact_phone' => $validated['contact_phone'],
            'status' => 'Pending',
            'notes' => $validated['notes']
        ]);

        return redirect()->back()->with('status', 'E-waste home pickup request submitted successfully!');
    }

    /**
     * Cancel an existing pending pickup request.
     */
    public function cancel($id): RedirectResponse
    {
        $pickup = auth()->user()->pickupRequests()->findOrFail($id);

        if ($pickup->status !== 'Pending') {
            return redirect()->back()->with('error', 'Only pending requests can be cancelled.');
        }

        $pickup->update(['status' => 'Cancelled']);

        return redirect()->back()->with('status', 'Pickup request cancelled successfully.');
    }
}
