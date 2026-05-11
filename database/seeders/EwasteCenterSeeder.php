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
        ];

        foreach ($centers as $center) {
            EwasteCenter::create($center);
        }
    }
}
