<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Facility;
use App\Models\DeviceYield;

class PlatformDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Real Indian E-Waste Hubs with actual coordinates
        Facility::create([
            'name' => 'Attero Recycling Plant',
            'address' => 'Roorkee Industrial Estate, Uttarakhand',
            'pincode' => '247667',
            'lat' => 29.8688,
            'lng' => 77.8920,
            'contact' => '+91 120 4055222',
            'accepted_devices' => ['Mobiles', 'Laptops', 'Batteries', 'TVs'],
            'status' => 'Active'
        ]);

        Facility::create([
            'name' => 'Namo E-Waste Management',
            'address' => 'Sector 68, IMT Faridabad, Haryana',
            'pincode' => '121004',
            'lat' => 28.3587,
            'lng' => 77.3060,
            'contact' => '+91 98188 88888',
            'accepted_devices' => ['Mobiles', 'Laptops', 'Printers'],
            'status' => 'Active'
        ]);

        Facility::create([
            'name' => 'EcoReco Facility',
            'address' => 'Andheri East, Mumbai, Maharashtra',
            'pincode' => '400093',
            'lat' => 19.1136,
            'lng' => 72.8697,
            'contact' => '+91 22 4005 2951',
            'accepted_devices' => ['Laptops', 'Servers', 'Large Appliances'],
            'status' => 'Active'
        ]);

        // 2. Scientifically Accurate Average Device Yields (Grams)
        // A typical smartphone has about 0.034g of gold.
        DeviceYield::create([
            'category' => 'mobile',
            'brand' => 'Generic',
            'model' => 'Smartphone',
            'gold_g' => 0.0340,
            'silver_g' => 0.3500,
            'copper_g' => 16.00,
            'palladium_g' => 0.0150,
            'base_points' => 150
        ]);

        // Laptops have significantly more copper and gold
        DeviceYield::create([
            'category' => 'laptop',
            'brand' => 'Generic',
            'model' => 'Standard PC',
            'gold_g' => 0.2200,
            'silver_g' => 1.1000,
            'copper_g' => 95.00,
            'palladium_g' => 0.0800,
            'base_points' => 500
        ]);
        
        DeviceYield::create([
            'category' => 'tv',
            'brand' => 'Generic',
            'model' => 'LCD Monitor',
            'gold_g' => 0.0500,
            'silver_g' => 0.4000,
            'copper_g' => 450.00, // Lots of copper wiring
            'palladium_g' => 0.0100,
            'base_points' => 300
        ]);
    }
}