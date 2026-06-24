<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Badge;
use App\Models\Review;
use App\Models\RewardCalculation;
use App\Models\EwasteCenter;
use Database\Seeders\BadgeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class GamificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed default badges
        $this->seed(BadgeSeeder::class);
    }

    public function test_leaderboard_page_requires_authentication(): void
    {
        $response = $this->get('/leaderboard');
        $response->assertRedirect('/login');
    }

    public function test_leaderboard_page_renders_rankings_and_badges(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'eco_points' => 100
        ]);

        $response = $this->actingAs($user)->get('/leaderboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Gamification/Leaderboard')
            ->has('rankings')
            ->has('allBadges', 6)
            ->has('earnedBadgeIds')
        );
    }

    public function test_dynamic_level_computations(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'eco_points' => 100
        ]);

        // 100 points -> Eco Beginner
        $this->assertEquals('Eco Beginner', $user->green_level);
        $this->assertEquals(500, $user->next_level_progress['target']);
        $this->assertEquals(20, $user->next_level_progress['percent']); // 100/500 = 20%

        // 600 points -> Green Warrior
        $user->eco_points = 600;
        $user->save();
        $this->assertEquals('Green Warrior', $user->green_level);
        $this->assertEquals(1500, $user->next_level_progress['target']);
        $this->assertEquals(10, $user->next_level_progress['percent']); // (600-500)/(1500-500) = 100/1000 = 10%

        // 1600 points -> Earth Saver
        $user->eco_points = 1600;
        $user->save();
        $this->assertEquals('Earth Saver', $user->green_level);
        $this->assertEquals(100, $user->next_level_progress['percent']);
    }

    public function test_badge_awarded_on_calculation_count(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'eco_points' => 0
        ]);

        // Initially no badges except Eco Beginner (which unlocks with 0 points)
        $user->checkAndAwardBadges();
        $this->assertCount(1, $user->badges);
        $this->assertEquals('Eco Beginner', $user->badges->first()->name);

        // Perform first calculation
        RewardCalculation::create([
            'user_id' => $user->id,
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone',
            'condition' => 'Excellent',
            'eco_points' => 100,
            'carbon_saved' => 2.5,
            'metals_data' => []
        ]);

        $user->checkAndAwardBadges();
        // Should unlock 'First Carbon Cut' (calculations >= 1)
        $this->assertTrue($user->badges()->where('name', 'First Carbon Cut')->exists());

        // Perform 4 more calculations (total 5)
        for ($i = 0; $i < 4; $i++) {
            RewardCalculation::create([
                'user_id' => $user->id,
                'device_type' => 'Mobile',
                'brand' => 'Apple',
                'model' => 'iPhone',
                'condition' => 'Excellent',
                'eco_points' => 100,
                'carbon_saved' => 2.5,
                'metals_data' => []
            ]);
        }

        $user->checkAndAwardBadges();
        // Should unlock 'Eco Champion' (calculations >= 5)
        $this->assertTrue($user->badges()->where('name', 'Eco Champion')->exists());
    }

    public function test_badge_awarded_on_approved_review(): void
    {
        $user = User::factory()->create([
            'role' => 'user',
            'eco_points' => 0
        ]);

        $facility = EwasteCenter::create([
            'name' => 'Delhi Recycling Hub',
            'address' => 'Okhla Phase 3',
            'city' => 'Delhi',
            'state' => 'Delhi',
            'pincode' => '110020',
            'latitude' => 28.5355,
            'longitude' => 77.2639
        ]);

        $review = Review::create([
            'ewaste_center_id' => $facility->id,
            'user_id' => $user->id,
            'rating' => 4,
            'comment' => 'Very good recycling service!',
            'approved' => false
        ]);

        // Check badges while review is unapproved -> 'Community Advocate' should NOT be awarded
        $user->checkAndAwardBadges();
        $this->assertFalse($user->badges()->where('name', 'Community Advocate')->exists());

        // Approve the review
        $review->update(['approved' => true]);

        // Check badges -> 'Community Advocate' should be awarded
        $user->checkAndAwardBadges();
        $this->assertTrue($user->badges()->where('name', 'Community Advocate')->exists());
    }
}
