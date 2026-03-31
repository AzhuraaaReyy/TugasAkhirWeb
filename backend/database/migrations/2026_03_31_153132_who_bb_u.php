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
        Schema::create('who_bb_u', function (Blueprint $table) {
            $table->id();
            $table->integer('month');
            $table->decimal('l', 8, 4);
            $table->decimal('m', 8, 4);
            $table->decimal('s', 8, 5);
            $table->decimal('sd_minus_3', 5, 2);
            $table->decimal('sd_minus_2', 5, 2);
            $table->decimal('sd_minus_1', 5, 2);
            $table->decimal('sd_0', 5, 2);
            $table->decimal('sd_1', 5, 2);
            $table->decimal('sd_2', 5, 2);
            $table->decimal('sd_3', 5, 2);
            $table->enum('gender', ['L', 'P']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('who_bb_u');
    }
};
