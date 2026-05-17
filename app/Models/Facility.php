<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    protected $fillable = ['name', 'address', 'pincode', 'lat', 'lng', 'contact', 'accepted_devices', 'status'];
    
    protected $casts = [
        'accepted_devices' => 'array', // Automatically handles the JSON conversion!
    ];
}