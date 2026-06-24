<?php

namespace Tests\Feature;

use App\Models\PickupRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PickupRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_pickups_page(): void
    {
        $response = $this->get('/pickups');
        $response->assertRedirect('/login');
    }

    public function test_user_can_access_pickups_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/pickups');

        $response->assertStatus(200);
    }

    public function test_user_can_schedule_valid_pickup_request(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->post('/pickups', [
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone 13',
            'pickup_date' => now()->addDays(2)->format('Y-m-d'),
            'pickup_time' => 'Afternoon (12 PM - 3 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
            'notes' => 'Ring doorbell 3'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('status', 'E-waste home pickup request submitted successfully!');

        $this->assertDatabaseHas('pickup_requests', [
            'user_id' => $user->id,
            'device_type' => 'Mobile',
            'brand' => 'Apple',
            'model' => 'iPhone 13',
            'pickup_time' => 'Afternoon (12 PM - 3 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
            'status' => 'Pending'
        ]);
    }

    public function test_pickup_scheduling_validation_checks(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        // Missing required fields
        $response = $this->actingAs($user)->post('/pickups', []);
        $response->assertSessionHasErrors(['device_type', 'pickup_date', 'pickup_time', 'address', 'contact_phone']);

        // Past date validation
        $response = $this->actingAs($user)->post('/pickups', [
            'device_type' => 'Mobile',
            'pickup_date' => now()->subDay()->format('Y-m-d'), // Yesterday
            'pickup_time' => 'Morning (9 AM - 12 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
        ]);
        $response->assertSessionHasErrors(['pickup_date']);

        // Invalid device type and time slot validation
        $response = $this->actingAs($user)->post('/pickups', [
            'device_type' => 'InvalidDevice',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => 'InvalidTimeSlot',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
        ]);
        $response->assertSessionHasErrors(['device_type', 'pickup_time']);

        // Address too short (less than 10 characters)
        $response = $this->actingAs($user)->post('/pickups', [
            'device_type' => 'Mobile',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => 'Morning (9 AM - 12 PM)',
            'address' => 'Short',
            'contact_phone' => '9876543210',
        ]);
        $response->assertSessionHasErrors(['address']);

        // Contact phone too short (less than 8 characters)
        $response = $this->actingAs($user)->post('/pickups', [
            'device_type' => 'Mobile',
            'pickup_date' => now()->format('Y-m-d'),
            'pickup_time' => 'Morning (9 AM - 12 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '12345',
        ]);
        $response->assertSessionHasErrors(['contact_phone']);
    }

    public function test_user_can_cancel_pending_pickup_request(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $pickup = PickupRequest::create([
            'user_id' => $user->id,
            'device_type' => 'Laptop',
            'pickup_date' => now()->addDays(3)->format('Y-m-d'),
            'pickup_time' => 'Evening (3 PM - 6 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
            'status' => 'Pending'
        ]);

        $response = $this->actingAs($user)->post("/pickups/{$pickup->id}/cancel");

        $response->assertRedirect();
        $response->assertSessionHas('status', 'Pickup request cancelled successfully.');

        $this->assertDatabaseHas('pickup_requests', [
            'id' => $pickup->id,
            'status' => 'Cancelled'
        ]);
    }

    public function test_user_cannot_cancel_scheduled_or_completed_pickup_request(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        // Scheduled request
        $scheduledPickup = PickupRequest::create([
            'user_id' => $user->id,
            'device_type' => 'Laptop',
            'pickup_date' => now()->addDays(3)->format('Y-m-d'),
            'pickup_time' => 'Evening (3 PM - 6 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
            'status' => 'Scheduled'
        ]);

        $response = $this->actingAs($user)->post("/pickups/{$scheduledPickup->id}/cancel");
        $response->assertRedirect();
        $response->assertSessionHas('error', 'Only pending requests can be cancelled.');

        $this->assertDatabaseHas('pickup_requests', [
            'id' => $scheduledPickup->id,
            'status' => 'Scheduled'
        ]);

        // Completed request
        $completedPickup = PickupRequest::create([
            'user_id' => $user->id,
            'device_type' => 'Laptop',
            'pickup_date' => now()->addDays(3)->format('Y-m-d'),
            'pickup_time' => 'Evening (3 PM - 6 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
            'status' => 'Completed'
        ]);

        $response = $this->actingAs($user)->post("/pickups/{$completedPickup->id}/cancel");
        $response->assertRedirect();
        $response->assertSessionHas('error', 'Only pending requests can be cancelled.');

        $this->assertDatabaseHas('pickup_requests', [
            'id' => $completedPickup->id,
            'status' => 'Completed'
        ]);
    }

    public function test_user_cannot_cancel_another_users_pickup_request(): void
    {
        $user1 = User::factory()->create(['role' => 'user']);
        $user2 = User::factory()->create(['role' => 'user']);

        $pickup = PickupRequest::create([
            'user_id' => $user1->id,
            'device_type' => 'Laptop',
            'pickup_date' => now()->addDays(3)->format('Y-m-d'),
            'pickup_time' => 'Evening (3 PM - 6 PM)',
            'address' => '123 green avenue, eco city, pin 110001',
            'contact_phone' => '9876543210',
            'status' => 'Pending'
        ]);

        $response = $this->actingAs($user2)->post("/pickups/{$pickup->id}/cancel");

        $response->assertStatus(404);
        $this->assertDatabaseHas('pickup_requests', [
            'id' => $pickup->id,
            'status' => 'Pending'
        ]);
    }
}
