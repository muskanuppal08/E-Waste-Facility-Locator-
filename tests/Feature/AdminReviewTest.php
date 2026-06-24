<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\EwasteCenter;
use App\Models\Review;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class AdminReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Create standard layout elements if necessary, but standard BREEZE auth is fine.
    }

    public function test_non_admin_cannot_access_reviews_moderation(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/admin/reviews');
        $response->assertRedirect('/');
    }

    public function test_admin_can_access_reviews_moderation_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
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
            'user_id' => $admin->id,
            'rating' => 4,
            'comment' => 'Very good recycling service!',
            'approved' => false
        ]);

        $response = $this->actingAs($admin)->get('/admin/reviews');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Reviews')
            ->has('reviews', 1)
            ->where('reviews.0.id', $review->id)
        );
    }

    public function test_admin_can_approve_review_and_rating_recalculates(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);
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
            'rating' => 5,
            'comment' => 'Excellent service',
            'approved' => false
        ]);

        // Prior to approval, the facility rating and count should be 0 because only approved reviews count.
        $this->assertEquals(0, $facility->fresh()->rating);
        $this->assertEquals(0, $facility->fresh()->total_reviews);

        $response = $this->actingAs($admin)->post("/admin/reviews/{$review->id}/approve");

        $response->assertRedirect();
        $this->assertTrue((bool)$review->fresh()->approved);
        $this->assertEquals(5.0, $facility->fresh()->rating);
        $this->assertEquals(1, $facility->fresh()->total_reviews);
    }

    public function test_admin_can_delete_review_and_rating_recalculates(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user1 = User::factory()->create(['role' => 'user']);
        $user2 = User::factory()->create(['role' => 'user']);
        $facility = EwasteCenter::create([
            'name' => 'Delhi Recycling Hub',
            'address' => 'Okhla Phase 3',
            'city' => 'Delhi',
            'state' => 'Delhi',
            'pincode' => '110020',
            'latitude' => 28.5355,
            'longitude' => 77.2639
        ]);

        $review1 = Review::create([
            'ewaste_center_id' => $facility->id,
            'user_id' => $user1->id,
            'rating' => 5,
            'comment' => 'Super',
            'approved' => true
        ]);

        $review2 = Review::create([
            'ewaste_center_id' => $facility->id,
            'user_id' => $user2->id,
            'rating' => 3,
            'comment' => 'Average',
            'approved' => true
        ]);

        $facility->recalculateRating();
        $this->assertEquals(4.0, $facility->fresh()->rating);
        $this->assertEquals(2, $facility->fresh()->total_reviews);

        // Delete review1
        $response = $this->actingAs($admin)->delete("/admin/reviews/{$review1->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('reviews', ['id' => $review1->id]);
        $this->assertEquals(3.0, $facility->fresh()->rating);
        $this->assertEquals(1, $facility->fresh()->total_reviews);
    }
}
