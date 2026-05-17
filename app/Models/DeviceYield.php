<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class DeviceYield extends Model
{
    protected $fillable = ['category', 'brand', 'model', 'gold_g', 'silver_g', 'copper_g', 'palladium_g', 'base_points'];
}