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
        Schema::create('deteksis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('balita_id')->constrained('balitas')->cascadeOnDelete();
            $table->date('tgl_deteksi');
            $table->decimal('zscore_tb_u');
            $table->float('zscore_bb_u');
            $table->float('zscore_tb_bb');
            $table->string('status_tb_u');
            $table->string('status_bb_u');
            $table->string('status_tb_bb');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('deteksis');
    }
};
