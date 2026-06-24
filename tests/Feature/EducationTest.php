<?php

namespace Tests\Feature;

use App\Models\Device;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EducationTest extends TestCase
{
    use RefreshDatabase;

    public function test_anyone_can_fetch_devices(): void
    {
        Device::create([
            'name' => 'Test Mobile Phone',
            'icon' => 'Smartphone',
            'harmful_materials' => ['Lead', 'Mercury'],
            'environmental_impact' => 'Test impact',
            'health_effects' => 'Test health',
            'recycling_benefits' => 'Test benefits',
            'risk_level' => 'High',
        ]);

        $response = $this->getJson('/api/devices');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['name' => 'Test Mobile Phone']);
    }

    public function test_admin_can_create_device(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->postJson('/api/devices', [
            'name' => 'New Laptop',
            'icon' => 'Laptop',
            'harmful_materials' => ['Lead', 'Lithium'],
            'environmental_impact' => 'Bad impact',
            'health_effects' => 'Breathing problems',
            'recycling_benefits' => 'Save materials',
            'risk_level' => 'High',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('devices', ['name' => 'New Laptop']);
    }

    public function test_non_admin_cannot_create_device(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->postJson('/api/devices', [
            'name' => 'New Laptop',
            'icon' => 'Laptop',
            'harmful_materials' => ['Lead', 'Lithium'],
            'environmental_impact' => 'Bad impact',
            'health_effects' => 'Breathing problems',
            'recycling_benefits' => 'Save materials',
            'risk_level' => 'High',
        ]);

        $response->assertStatus(403);
        $this->assertDatabaseMissing('devices', ['name' => 'New Laptop']);
    }

    public function test_admin_can_update_device(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $device = Device::create([
            'name' => 'Old Name',
            'icon' => 'Smartphone',
            'harmful_materials' => ['Lead'],
            'environmental_impact' => 'Old impact',
            'health_effects' => 'Old health',
            'recycling_benefits' => 'Old benefits',
            'risk_level' => 'Medium',
        ]);

        $response = $this->actingAs($admin)->putJson("/api/devices/{$device->id}", [
            'name' => 'Updated Name',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('devices', ['id' => $device->id, 'name' => 'Updated Name']);
    }

    public function test_admin_can_delete_device(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $device = Device::create([
            'name' => 'To Delete',
            'icon' => 'Smartphone',
            'harmful_materials' => ['Lead'],
            'environmental_impact' => 'Old impact',
            'health_effects' => 'Old health',
            'recycling_benefits' => 'Old benefits',
            'risk_level' => 'Medium',
        ]);

        $response = $this->actingAs($admin)->deleteJson("/api/devices/{$device->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('devices', ['id' => $device->id]);
    }
}
