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
    Schema::create('pickup_requests', function (Blueprint $table) {
        $table->id();
        $table->string('request_id')->unique(); // E.g., PK-8911
        $table->string('user_name'); // Simulating Clerk user connection
        $table->string('user_email');
        $table->string('device_type');
        $table->string('condition');
        $table->text('address');
        $table->string('pincode', 10);
        $table->date('scheduled_date');
        $table->string('time_slot');
        $table->string('status')->default('Pending');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pickup_requests');
    }
};
