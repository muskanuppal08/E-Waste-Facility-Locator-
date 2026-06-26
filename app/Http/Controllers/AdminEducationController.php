<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class AdminEducationController extends Controller
{
    /**
     * Display educational content manager dashboard (Admin Only).
     */
    public function index(): Response
    {
        return Inertia::render('Admin/Education');
    }
}
