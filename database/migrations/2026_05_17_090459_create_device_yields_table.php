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
    Schema::create('device_yields', function (Blueprint $table) {
        $table->id();
        $table->string('category'); // e.g., mobile, laptop
        $table->string('brand')->nullable();
        $table->string('model')->nullable();
        // Scientific material yields in grams (g)
        $table->decimal('gold_g', 8, 4);
        $table->decimal('silver_g', 8, 4);
        $table->decimal('copper_g', 8, 2);
        $table->decimal('palladium_g', 8, 4);
        $table->integer('base_points'); // Base Eco Points
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('device_yields');
    }
};
