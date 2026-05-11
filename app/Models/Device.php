<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'icon',
        'harmful_materials',
        'environmental_impact',
        'health_effects',
        'recycling_benefits',
        'risk_level'
    ];

    protected $casts = [
        'harmful_materials' => 'array'
    ];
}
