<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    protected $fillable = [
        'ewaste_center_id',
        'user_id',
        'rating',
        'comment',
        'approved'
    ];

    protected $casts = [
        'approved' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ewasteCenter()
    {
        return $this->belongsTo(EwasteCenter::class, 'ewaste_center_id');
    }
}
