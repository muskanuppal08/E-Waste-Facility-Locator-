<?php

namespace Tests\Feature;

use App\Models\Badge;
use App\Models\EwasteCenter;
use App\Models\PickupRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPanelTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_admin_panel_routes(): void
    {
        $this->get('/admin/users')->assertRedirect();
        $this->get('/admin/education')->assertRedirect();
        $this->get('/admin/reports')->assertRedirect();
        $this->get('/admin/reports/download/users')->assertRedirect();
    }

    public function test_standard_user_cannot_access_admin_panel_routes(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $this->actingAs($user)->get('/admin/users')->assertRedirect('/');
        $this->actingAs($user)->get('/admin/education')->assertRedirect('/');
        $this->actingAs($user)->get('/admin/reports')->assertRedirect('/');
        $this->actingAs($user)->get('/admin/reports/download/users')->assertRedirect('/');
    }

    public function test_admin_can_access_admin_panel_pages(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin/users')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/education')->assertStatus(200);
        $this->actingAs($admin)->get('/admin/reports')->assertStatus(200);
    }

    public function test_admin_can_toggle_user_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($admin)->post("/admin/users/{$user->id}/role", [
            'role' => 'admin'
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => 'admin'
        ]);
    }

    public function test_admin_cannot_toggle_own_role(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post("/admin/users/{$admin->id}/role", [
            'role' => 'user'
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot change your own role.');
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
            'role' => 'admin'
        ]);
    }

    public function test_admin_can_adjust_user_points_and_award_badges(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user', 'eco_points' => 0]);
        
        // Seed Badge
        Badge::create([
            'name' => 'Green Warrior Badge',
            'description' => 'Awarded for reaching Green Warrior level',
            'icon' => 'Flame',
            'rule_type' => 'points',
            'rule_value' => 500
        ]);

        $response = $this->actingAs($admin)->post("/admin/users/{$user->id}/points", [
            'points' => 600
        ]);

        $response->assertRedirect();
        $user->refresh();

        $this->assertEquals(600, $user->eco_points);
        $this->assertEquals('Green Warrior', $user->green_level);
        
        // Assert badge was dynamically unlocked
        $this->assertTrue($user->badges()->where('name', 'Green Warrior Badge')->exists());
    }

    public function test_admin_can_delete_user(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($admin)->delete("/admin/users/{$user->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->delete("/admin/users/{$admin->id}");

        $response->assertRedirect();
        $response->assertSessionHas('error', 'You cannot delete your own account.');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_download_csv_reports(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        
        // Create user, center, and pickup to populate report data
        User::factory()->create(['role' => 'user']);
        EwasteCenter::create([
            'name' => 'Center 1',
            'address' => '123 street',
            'city' => 'Delhi',
            'state' => 'Delhi',
            'pincode' => '110001',
            'phone' => '1234567890',
            'latitude' => 28.6139,
            'longitude' => 77.2090,
            'open_time' => '09:00:00',
            'close_time' => '18:00:00',
            'accepted_items' => 'Mobile,Laptop',
            'rating' => 4.5
        ]);
        PickupRequest::create([
            'user_id' => $admin->id,
            'device_type' => 'Mobile',
            'pickup_date' => now()->addDays(2)->format('Y-m-d'),
            'pickup_time' => 'Morning (9 AM - 12 PM)',
            'address' => '123 green road, eco city',
            'contact_phone' => '9876543210',
            'status' => 'Pending'
        ]);

        // Download users report
        $response = $this->actingAs($admin)->get('/admin/reports/download/users');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $response->assertHeader('Content-Disposition', 'attachment; filename="users_report.csv"');

        // Download facilities report
        $response = $this->actingAs($admin)->get('/admin/reports/download/facilities');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $response->assertHeader('Content-Disposition', 'attachment; filename="facilities_report.csv"');

        // Download pickups report
        $response = $this->actingAs($admin)->get('/admin/reports/download/pickups');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/csv; charset=UTF-8');
        $response->assertHeader('Content-Disposition', 'attachment; filename="pickups_report.csv"');
    }
}
