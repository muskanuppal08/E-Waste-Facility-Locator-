<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RewardCalculation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_type',
        'brand',
        'model',
        'condition',
        'eco_points',
        'carbon_saved',
        'metals_data'
    ];

    protected $casts = [
        'metals_data' => 'array',
        'carbon_saved' => 'float'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
