<?php

namespace App\Http\Controllers;

use App\Models\EwasteCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminFacilityController extends Controller
{
    /**
     * Display a listing of the facilities.
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Facilities/Index', [
            'facilities' => EwasteCenter::latest()->get(),
        ]);
    }

    /**
     * Show the form for creating a new facility.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Facilities/Create');
    }

    /**
     * Store a newly created facility in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'pincode' => 'required|string|max:10',
            'phone' => 'required|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'open_time' => 'required',
            'close_time' => 'required',
            'accepted_items' => 'required|string',
        ]);

        EwasteCenter::create($validated);

        return redirect()->route('admin.facilities.index')
            ->with('status', 'Facility created successfully!');
    }

    /**
     * Show the form for editing the specified facility.
     */
    public function edit(EwasteCenter $facility): Response
    {
        return Inertia::render('Admin/Facilities/Edit', [
            'facility' => $facility,
        ]);
    }

    /**
     * Update the specified facility in storage.
     */
    public function update(Request $request, EwasteCenter $facility): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'pincode' => 'required|string|max:10',
            'phone' => 'required|string|max:20',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'open_time' => 'required',
            'close_time' => 'required',
            'accepted_items' => 'required|string',
        ]);

        $facility->update($validated);

        return redirect()->route('admin.facilities.index')
            ->with('status', 'Facility updated successfully!');
    }

    /**
     * Remove the specified facility from storage.
     */
    public function destroy(EwasteCenter $facility): RedirectResponse
    {
        $facility->delete();

        return redirect()->route('admin.facilities.index')
            ->with('status', 'Facility deleted successfully!');
    }
}
