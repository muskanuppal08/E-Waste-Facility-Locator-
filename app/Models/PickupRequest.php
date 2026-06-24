<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PickupRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_type',
        'brand',
        'model',
        'pickup_date',
        'pickup_time',
        'address',
        'contact_phone',
        'status',
        'notes'
    ];

    protected $casts = [
        'pickup_date' => 'date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
