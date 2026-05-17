<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('facilities', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->text('address');
        $table->string('pincode', 10)->index(); // Indexed for blazing fast search!
        $table->decimal('lat', 10, 7);
        $table->decimal('lng', 10, 7);
        $table->string('contact');
        $table->json('accepted_devices'); // Store array of devices
        $table->string('status')->default('Active');
        $table->timestamps();
    });
}
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facilities');
    }
};
