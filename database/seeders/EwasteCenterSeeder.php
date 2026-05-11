<?php

namespace Database\Seeders;

use App\Models\EwasteCenter;
use Illuminate\Database\Seeder;

class EwasteCenterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $centers = [
            // --- Delhi/NCR Centers ---
            [
                'name' => 'Green India Recycling',
                'address' => 'Okhla Phase III, New Delhi, Delhi 110020',
                'phone' => '+91 11 2345 6789',
                'latitude' => 28.5453,
                'longitude' => 77.2732,
                'open_time' => '09:00:00',
                'close_time' => '18:00:00',
                'accepted_items' => 'Mobiles,Laptops,Batteries,Appliances',
            ],
            [
                'name' => 'Eco-Friendly E-Waste Solutions',
                'address' => 'Gurgaon Sector 14, Haryana 122001',
                'phone' => '+91 124 987 6543',
                'latitude' => 28.4731,
                'longitude' => 77.0401,
                'open_time' => '10:00:00',
                'close_time' => '19:00:00',
                'accepted_items' => 'Laptops,Monitors,Wires,Printers',
            ],
            [
                'name' => 'Delhi E-Waste Collection Point',
                'address' => 'Connaught Place, New Delhi, Delhi 110001',
                'phone' => '+91 11 4433 2211',
                'latitude' => 28.6327,
                'longitude' => 77.2197,
                'open_time' => '08:00:00',
                'close_time' => '20:00:00',
                'accepted_items' => 'Mobiles,Tablets,Chargers',
            ],
            [
                'name' => 'Noida E-Waste Hub',
                'address' => 'Sector 62, Noida, Uttar Pradesh 201301',
                'phone' => '+91 120 5566 7788',
                'latitude' => 28.6273,
                'longitude' => 77.3725,
                'open_time' => '09:00:00',
                'close_time' => '17:00:00',
                'accepted_items' => 'Televisions,Refrigerators,Appliances',
            ],
            [
                'name' => 'South Delhi Recycling Center',
                'address' => 'Saket, New Delhi, Delhi 110017',
                'phone' => '+91 11 6677 8899',
                'latitude' => 28.5244,
                'longitude' => 77.2167,
                'open_time' => '09:00:00',
                'close_time' => '18:00:00',
                'accepted_items' => 'Mobiles,Laptops,Batteries',
            ],

            // --- Jalandhar/Phagwara (LPU Area) Centers ---
            [
                'name' => 'LPU Campus E-Waste Collection',
                'address' => 'Main Gate, Lovely Professional University, Phagwara, Punjab 144411',
                'phone' => '+91 182 444 5555',
                'latitude' => 31.2555,
                'longitude' => 75.7048,
                'open_time' => '08:00:00',
                'close_time' => '17:00:00',
                'accepted_items' => 'Laptops,Mobiles,Batteries,Chargers',
            ],
            [
                'name' => 'Phagwara Digital Recycling',
                'address' => 'GT Road, Near Railway Station, Phagwara, Punjab 144401',
                'phone' => '+91 98765 43210',
                'latitude' => 31.2240,
                'longitude' => 75.7708,
                'open_time' => '10:00:00',
                'close_time' => '19:00:00',
                'accepted_items' => 'Mobiles,Televisions,Appliances',
            ],
            [
                'name' => 'Jalandhar Smart Recovery',
                'address' => 'Model Town, Jalandhar, Punjab 144003',
                'phone' => '+91 98123 45678',
                'latitude' => 31.3090,
                'longitude' => 75.5786,
                'open_time' => '09:00:00',
                'close_time' => '20:00:00',
                'accepted_items' => 'Laptops,Televisions,Appliances,Batteries',
            ],
            [
                'name' => 'Rama Mandi E-Waste Solutions',
                'address' => 'Hoshiarpur Road, Rama Mandi, Jalandhar, Punjab 144005',
                'phone' => '+91 99887 76655',
                'latitude' => 31.3180,
                'longitude' => 75.6150,
                'open_time' => '09:00:00',
                'close_time' => '18:00:00',
                'accepted_items' => 'Appliances,Batteries,Mobiles',
            ],
            [
                'name' => 'Chiheru Green Recycling',
                'address' => 'Near Law Gate, LPU, Phagwara, Punjab 144411',
                'phone' => '+91 94123 00000',
                'latitude' => 31.2485,
                'longitude' => 75.6980,
                'open_time' => '08:30:00',
                'close_time' => '18:30:00',
                'accepted_items' => 'Mobiles,Laptops,Batteries,Televisions',
            ],
            [
                'name' => 'Phagwara Industrial E-Center',
                'address' => 'Industrial Area Phase 1, Phagwara, Punjab 144401',
                'phone' => '+91 182 450 6070',
                'latitude' => 31.2150,
                'longitude' => 75.7600,
                'open_time' => '09:00:00',
                'close_time' => '17:30:00',
                'accepted_items' => 'Appliances,Laptops,Televisions',
            ],
        ];

        foreach ($centers as $center) {
            EwasteCenter::updateOrCreate(
                ['name' => $center['name']],
                $center
            );
        }
    }
}
