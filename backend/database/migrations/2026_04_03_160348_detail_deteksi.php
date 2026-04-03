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
        Schema::create('detaildeteksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deteksi_id')->constrained('deteksis')->cascadeOnDelete();
            $table->string('keterangan');
            $table->string('rekomendasi');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detaildeteksis');
    }
};
