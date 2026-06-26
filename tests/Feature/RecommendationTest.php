<?php

namespace Tests\Feature;

use App\Models\Device;
use App\Models\EwasteCenter;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecommendationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_recommendation_routes(): void
    {
        $this->get('/recommendations')->assertRedirect('/login');
        $this->post('/recommendations/suggest', ['query' => 'laptop'])->assertRedirect('/login');
    }

    public function test_user_can_access_recommendations_index_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $response = $this->actingAs($user)->get('/recommendations');
        $response->assertStatus(200);
    }

    public function test_query_parsing_for_laptop_with_poor_condition(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        
        // Seed Device
        Device::create([
            'name' => 'Laptop',
            'icon' => 'Laptop',
            'harmful_materials' => ['Mercury', 'Lead'],
            'environmental_impact' => 'Laptops pollute soil.',
            'health_effects' => 'Heavy metals damage organs.',
            'recycling_benefits' => 'Save valuable metals.',
            'risk_level' => 'High'
        ]);

        $response = $this->actingAs($user)->postJson('/recommendations/suggest', [
            'query' => 'I have a broken Dell laptop.',
            'lat' => 28.6139,
            'lng' => 77.2090
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'device_type' => 'Laptop',
            'brand' => 'Dell',
            'condition' => 'Poor'
        ]);

        // Points calculation check: 250 base * 0.4 condition = 100
        $response->assertJsonPath('rewards.eco_points', 100);
        $response->assertJsonPath('rewards.carbon_offset', 6); // 15.0 base * 0.4 = 6.0
        
        // Check instructions
        $response->assertJsonPath('instructions.risk_level', 'High');
        $response->assertJson(['instructions' => [
            'risk_level' => 'High',
            'harmful_materials' => ['Mercury', 'Lead']
        ]]);
    }

    public function test_query_parsing_for_mobile_with_good_condition(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        
        Device::create([
            'name' => 'Mobile',
            'icon' => 'Smartphone',
            'harmful_materials' => ['Lead', 'Cadmium'],
            'environmental_impact' => 'Mobiles release chemicals.',
            'health_effects' => 'Heavy metals toxic to breath.',
            'recycling_benefits' => 'Save copper.',
            'risk_level' => 'Medium'
        ]);

        $response = $this->actingAs($user)->postJson('/recommendations/suggest', [
            'query' => 'Recycle my working Apple iphone.',
            'lat' => 28.6139,
            'lng' => 77.2090
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'condition' => 'Good'
        ]);

        // Points calculation check: 100 base * 0.8 condition = 80
        $response->assertJsonPath('rewards.eco_points', 80);
        $response->assertJsonPath('rewards.carbon_offset', 2); // 2.5 base * 0.8 = 2.0
    }

    public function test_suggests_closest_certified_recycling_center(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        // Create two centers:
        // Center A accepts only Mobiles, 5km away
        EwasteCenter::create([
            'name' => 'Mobile Only Recycler',
            'address' => '5km street',
            'city' => 'Delhi',
            'state' => 'Delhi',
            'pincode' => '110001',
            'phone' => '1234567890',
            'latitude' => 28.6500, // ~4-5km from 28.6139
            'longitude' => 77.2000,
            'open_time' => '09:00:00',
            'close_time' => '18:00:00',
            'accepted_items' => 'Mobile'
        ]);

        // Center B accepts Laptops, 10km away
        EwasteCenter::create([
            'name' => 'Laptop Recycler Center',
            'address' => '10km road',
            'city' => 'Delhi',
            'state' => 'Delhi',
            'pincode' => '110002',
            'phone' => '9876543210',
            'latitude' => 28.7000, // ~10km from 28.6139
            'longitude' => 77.2000,
            'open_time' => '09:00:00',
            'close_time' => '18:00:00',
            'accepted_items' => 'Laptop,Mobile'
        ]);

        // Query Laptop suggestion from Delhi coords (28.6139, 77.2090)
        // Must choose Center B (Laptop Recycler Center) even though Center A is closer, because Center A doesn't accept Laptops!
        $response = $this->actingAs($user)->postJson('/recommendations/suggest', [
            'query' => 'I have a broken Dell laptop.',
            'lat' => 28.6139,
            'lng' => 77.2090
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('closest_recycler.name', 'Laptop Recycler Center');
    }

    public function test_suggest_validation_error_on_unknown_device(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->postJson('/recommendations/suggest', [
            'query' => 'I want to recycle a refrigerator.'
        ]);

        $response->assertStatus(422);
        $response->assertJsonFragment([
            'error' => "We couldn't determine the device type. Please mention whether it is a Mobile, Laptop, Battery, TV, or Printer in your query."
        ]);
    }
}
