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
        Schema::create('standar_kpt', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->integer('interval_bulan');
            $table->integer('umur_awal');
            $table->integer('umur_akhir');
            $table->enum('gender', ['laki-laki', 'perempuan']);
            $table->decimal('kpt_cm', 5, 3);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('standar_kpt');
    }
};
