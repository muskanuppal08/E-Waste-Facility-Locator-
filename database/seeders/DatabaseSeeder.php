<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed Standard User
        User::factory()->create([
            'name' => 'Standard User',
            'email' => 'user@ewaste.com',
            'role' => 'user',
        ]);

        // Seed Admin User
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@ewaste.com',
            'role' => 'admin',
        ]);

        $this->call([
            EwasteCenterSeeder::class,
            DeviceSeeder::class,
            BadgeSeeder::class,
        ]);
    }
}
