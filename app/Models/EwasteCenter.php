<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EwasteCenter extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'pincode',
        'phone',
        'latitude',
        'longitude',
        'open_time',
        'close_time',
        'accepted_items'
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function getIsOpenNowAttribute(): bool
    {
        if (!$this->open_time || !$this->close_time) return true;

        $now = now()->format('H:i:s');
        return $now >= $this->open_time && $now <= $this->close_time;
    }

    public function getAcceptedItemsArrayAttribute(): array
    {
        return $this->accepted_items ? explode(',', $this->accepted_items) : [];
    }

    protected $appends = ['is_open_now', 'accepted_items_array'];

    public function reviews()
    {
        return $this->hasMany(Review::class, 'ewaste_center_id');
    }

    public function recalculateRating(): void
    {
        $this->rating = $this->reviews()->where('approved', true)->avg('rating') ?: 0;
        $this->total_reviews = $this->reviews()->where('approved', true)->count();
        $this->save();
    }
}