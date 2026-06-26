<?php

namespace App\Http\Controllers;

use App\Models\EwasteCenter;
use App\Models\User;
use App\Models\PickupRequest;
use App\Models\Review;
use App\Models\RewardCalculation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminReportController extends Controller
{
    /**
     * Display the reports page (Admin Only).
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Reports', [
            'summaryStats' => [
                'total_facilities' => EwasteCenter::count(),
                'total_users' => User::where('role', 'user')->count(),
                'total_pickups' => PickupRequest::count(),
                'completed_pickups' => PickupRequest::where('status', 'Completed')->count(),
                'total_reviews' => Review::count(),
                'total_calculations' => RewardCalculation::count(),
                'total_eco_points' => User::sum('eco_points'),
            ]
        ]);
    }

    /**
     * Download the specified report as a CSV stream.
     */
    public function download($type): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$type}_report.csv\"",
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0'
        ];

        $callback = function () use ($type) {
            $file = fopen('php://output', 'w');

            if ($type === 'users') {
                fputcsv($file, ['ID', 'Name', 'Email', 'Role', 'Green Level', 'Eco Points', 'Created At']);
                $users = User::all();
                foreach ($users as $u) {
                    fputcsv($file, [
                        $u->id,
                        $u->name,
                        $u->email,
                        $u->role,
                        $u->green_level,
                        $u->eco_points,
                        $u->created_at->format('Y-m-d H:i:s'),
                    ]);
                }
            } elseif ($type === 'facilities') {
                fputcsv($file, ['ID', 'Name', 'Address', 'City', 'State', 'Pincode', 'Phone', 'Rating', 'Created At']);
                $facilities = EwasteCenter::all();
                foreach ($facilities as $f) {
                    fputcsv($file, [
                        $f->id,
                        $f->name,
                        $f->address,
                        $f->city,
                        $f->state,
                        $f->pincode,
                        $f->phone,
                        $f->rating,
                        $f->created_at->format('Y-m-d H:i:s'),
                    ]);
                }
            } elseif ($type === 'pickups') {
                fputcsv($file, ['ID', 'User Name', 'Email', 'Device Type', 'Brand', 'Model', 'Pickup Date', 'Time Slot', 'Phone', 'Address', 'Status', 'Notes', 'Created At']);
                $pickups = PickupRequest::with('user')->get();
                foreach ($pickups as $p) {
                    fputcsv($file, [
                        $p->id,
                        $p->user ? $p->user->name : 'N/A',
                        $p->user ? $p->user->email : 'N/A',
                        $p->device_type,
                        $p->brand,
                        $p->model,
                        $p->pickup_date ? $p->pickup_date->format('Y-m-d') : 'N/A',
                        $p->pickup_time,
                        $p->contact_phone,
                        $p->address,
                        $p->status,
                        $p->notes,
                        $p->created_at->format('Y-m-d H:i:s'),
                    ]);
                }
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
