<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PickupRequest extends Model
{
    protected $fillable = ['request_id', 'user_name', 'user_email', 'device_type', 'condition', 'address', 'pincode', 'scheduled_date', 'time_slot', 'status'];
}