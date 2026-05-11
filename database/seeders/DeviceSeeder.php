<?php

namespace Database\Seeders;

use App\Models\Device;
use Illuminate\Database\Seeder;

class DeviceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $devices = [
            [
                'name' => 'Mobile Phone',
                'icon' => 'Smartphone',
                'harmful_materials' => ['Lead', 'Mercury', 'Cadmium'],
                'environmental_impact' => 'Soil pollution, Water contamination, Air toxicity from open burning.',
                'health_effects' => 'Kidney damage, Nervous system disorders, Respiratory issues.',
                'recycling_benefits' => 'Recovery of precious metals like Gold/Silver, Reduced landfill waste, Environmental protection.',
                'risk_level' => 'High',
            ],
            [
                'name' => 'Laptop',
                'icon' => 'Laptop',
                'harmful_materials' => ['Brominated flame retardants', 'Lead', 'Beryllium'],
                'environmental_impact' => 'Persistent organic pollutants that accumulate in the food chain.',
                'health_effects' => 'Hormone disruption, Brain development issues, Skin disorders.',
                'recycling_benefits' => 'Plastic recovery, Aluminum recycling, Prevention of hazardous leaks.',
                'risk_level' => 'High',
            ],
            [
                'name' => 'Battery',
                'icon' => 'Battery',
                'harmful_materials' => ['Lithium', 'Cobalt', 'Sulfuric Acid'],
                'environmental_impact' => 'Highly flammable in landfills, Heavy metal leaching into groundwater.',
                'health_effects' => 'Chemical burns, Lung damage, Chronic poisoning.',
                'recycling_benefits' => 'Safe disposal of acids, Rare metal reclamation, Fire hazard reduction.',
                'risk_level' => 'High',
            ],
            [
                'name' => 'TV',
                'icon' => 'Tv',
                'harmful_materials' => ['Lead in glass', 'Phosphor', 'Mercury in backlights'],
                'environmental_impact' => 'Glass tubes release lead into the environment for centuries if broken.',
                'health_effects' => 'Blood system disorders, Developmental delays in children.',
                'recycling_benefits' => 'Glass cullet recovery, CRT safe handling, Copper reclamation.',
                'risk_level' => 'Medium',
            ],
            [
                'name' => 'Printer',
                'icon' => 'Printer',
                'harmful_materials' => ['Toner dust', 'Carbon black', 'Micro-plastics'],
                'environmental_impact' => 'Inhalation hazards during disposal, Micro-plastic contamination.',
                'health_effects' => 'Respiratory irritation, Lung fibrosis (from toner inhalation).',
                'recycling_benefits' => 'Toner cartridge refilling, Plastic recycling, Circuit board recovery.',
                'risk_level' => 'Low',
            ],
        ];

        foreach ($devices as $device) {
            Device::create($device);
        }
    }
}
