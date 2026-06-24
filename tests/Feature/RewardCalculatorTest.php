<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\EwasteCenter;
use App\Models\Review;
use App\Models\RewardCalculation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RewardCalculatorTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test access control for calculator page.
     */
    public function test_guest_and_admin_cannot_access_calculator_page(): void
    {
        // Guests redirected to login
        $response = $this->get('/calculator');
        $response->assertRedirect('/login');

        // Admins redirected to home / (because role:user fails)
        $admin = User::factory()->create(['role' => 'admin']);
        $response = $this->actingAs($admin)->get('/calculator');
        $response->assertRedirect('/');
    }

    public function test_authenticated_user_can_access_calculator_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/calculator');
        $response->assertStatus(200);
    }

    /**
     * Test Reward Calculation formulas and multipliers.
     */
    public function test_user_can_calculate_mobile_rewards_excellent_condition(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'eco_points' => 10,
        ]);

        $response = $this->actingAs($user)->postJson('/calculator', [
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone 13',
            'condition' => 'Excellent',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('calculation.eco_points', 100)
            ->assertJsonPath('calculation.carbon_saved', 2.5)
            ->assertJsonPath('user_eco_points', 110); // 10 + 100

        $this->assertDatabaseHas('reward_calculations', [
            'user_id' => $user->id,
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone 13',
            'condition' => 'Excellent',
            'eco_points' => 100,
            'carbon_saved' => 2.5,
        ]);

        $this->assertEquals(110, $user->fresh()->eco_points);
    }

    public function test_user_can_calculate_laptop_rewards_poor_condition(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'eco_points' => 50,
        ]);

        // Laptop base: 250 points, 15.0 carbon. Poor condition: 40% (0.4) multiplier.
        // Expected points: 250 * 0.4 = 100. Carbon: 15.0 * 0.4 = 6.0
        $response = $this->actingAs($user)->postJson('/calculator', [
            'device_type' => 'Laptop',
            'brand' => 'Dell',
            'model' => 'XPS 15',
            'condition' => 'Poor',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('calculation.eco_points', 100)
            ->assertJsonPath('user_eco_points', 150); // 50 + 100

        $this->assertEquals(6.0, $response->json('calculation.carbon_saved'));

        $this->assertDatabaseHas('reward_calculations', [
            'user_id' => $user->id,
            'device_type' => 'Laptop',
            'condition' => 'Poor',
            'eco_points' => 100,
            'carbon_saved' => 6.0,
        ]);
    }

    public function test_device_calculations_adjust_recovered_metal_amounts(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        // Mobile base gold is 15 mg. Good condition (0.8) multiplier makes it 15 * 0.8 = 12 mg.
        $response = $this->actingAs($user)->postJson('/calculator', [
            'device_type' => 'Mobile',
            'brand' => 'Samsung',
            'model' => 'S21',
            'condition' => 'Good',
        ]);

        $response->assertStatus(200);
        $calc = RewardCalculation::first();
        
        $metals = $calc->metals_data;
        $goldData = collect($metals)->firstWhere('name', 'Gold');
        
        $this->assertEquals('12 mg', $goldData['amount']);
    }

    /**
     * Test review moderation and rating recalculation flow.
     */
    public function test_review_moderation_and_rating_recalculation(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);
        
        $center = EwasteCenter::create([
            'name' => 'Test Center',
            'address' => '123 Test St',
            'city' => 'Testville',
            'state' => 'Test State',
            'pincode' => '12345',
            'phone' => '123-456-7890',
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'open_time' => '09:00:00',
            'close_time' => '17:00:00',
            'accepted_items' => 'Mobiles,Laptops',
        ]);

        // Submit review - should start as approved => false
        $response = $this->actingAs($user)->postJson("/api/facilities/{$center->id}/review", [
            'rating' => 5,
            'comment' => 'Excellent facility!',
        ]);

        $response->assertStatus(200);

        // Verify review is pending in DB
        $this->assertDatabaseHas('reviews', [
            'ewaste_center_id' => $center->id,
            'rating' => 5,
            'approved' => false,
        ]);

        // Verify public details do NOT show pending review, and rating average remains 0
        $this->getJson("/api/facilities/{$center->id}")
            ->assertStatus(200)
            ->assertJsonCount(0, 'reviews')
            ->assertJsonPath('rating', 0);

        $review = Review::first();

        // Guest/User cannot approve
        $this->post("/admin/reviews/{$review->id}/approve")
            ->assertRedirect('/');
        
        $this->actingAs($user)->post("/admin/reviews/{$review->id}/approve")
            ->assertRedirect('/');

        // Admin can approve
        $this->actingAs($admin)->post("/admin/reviews/{$review->id}/approve")
            ->assertRedirect(); // redirects back

        // Verify approved is true
        $this->assertTrue($review->fresh()->approved);

        // Verify public details now show review and center rating is updated to 5
        $this->getJson("/api/facilities/{$center->id}")
            ->assertStatus(200)
            ->assertJsonCount(1, 'reviews')
            ->assertJsonPath('rating', 5)
            ->assertJsonPath('total_reviews', 1);

        // Admin can delete review
        $this->actingAs($admin)->delete("/admin/reviews/{$review->id}")
            ->assertRedirect();

        // Verify review is deleted
        $this->assertDatabaseMissing('reviews', ['id' => $review->id]);

        // Verify public details show 0 rating again
        $this->getJson("/api/facilities/{$center->id}")
            ->assertStatus(200)
            ->assertJsonCount(0, 'reviews')
            ->assertJsonPath('rating', 0)
            ->assertJsonPath('total_reviews', 0);
    }
}
