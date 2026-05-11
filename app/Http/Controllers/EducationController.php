<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;

class EducationController extends Controller
{
    /**
     * API: Get all devices.
     */
    public function index()
    {
        return response()->json(Device::all());
    }

    /**
     * API: Create a new device (Admin Only).
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'harmful_materials' => 'required|array',
            'environmental_impact' => 'required|string',
            'health_effects' => 'required|string',
            'recycling_benefits' => 'required|string',
            'risk_level' => 'required|in:Low,Medium,High',
            'icon' => 'nullable|string',
        ]);

        $device = Device::create($validated);

        return response()->json($device);
    }

    /**
     * API: Update a device (Admin Only).
     */
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();

        $device = Device::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'harmful_materials' => 'sometimes|array',
            'environmental_impact' => 'sometimes|string',
            'health_effects' => 'sometimes|string',
            'recycling_benefits' => 'sometimes|string',
            'risk_level' => 'sometimes|in:Low,Medium,High',
            'icon' => 'nullable|string',
        ]);

        $device->update($validated);

        return response()->json($device);
    }

    /**
     * API: Delete a device (Admin Only).
     */
    public function destroy($id)
    {
        $this->authorizeAdmin();

        $device = Device::findOrFail($id);
        $device->delete();

        return response()->json(['message' => 'Device deleted successfully']);
    }

    /**
     * Helper to check if current user is admin.
     */
    protected function authorizeAdmin()
    {
        if (!auth()->user() || !auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }
    }
}
