<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'Eco Beginner',
                'description' => 'Joined the GreenByte community and started the recycling journey.',
                'icon' => 'Leaf',
                'rule_type' => 'points',
                'rule_value' => 0
            ],
            [
                'name' => 'First Carbon Cut',
                'description' => 'Performed your first e-waste reward calculation estimation.',
                'icon' => 'Flame',
                'rule_type' => 'calculations',
                'rule_value' => 1
            ],
            [
                'name' => 'Community Advocate',
                'description' => 'Wrote your first center review to help other members.',
                'icon' => 'MessageSquare',
                'rule_type' => 'reviews',
                'rule_value' => 1
            ],
            [
                'name' => 'Green Warrior',
                'description' => 'Accumulated 500 or more cumulative eco points.',
                'icon' => 'Shield',
                'rule_type' => 'points',
                'rule_value' => 500
            ],
            [
                'name' => 'Eco Champion',
                'description' => 'Successfully estimated e-waste items 5 or more times.',
                'icon' => 'Cpu',
                'rule_type' => 'calculations',
                'rule_value' => 5
            ],
            [
                'name' => 'Earth Saver',
                'description' => 'Earned 1500 or more cumulative eco points.',
                'icon' => 'Globe',
                'rule_type' => 'points',
                'rule_value' => 1500
            ]
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}
