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
        schema::create('posyandus', function (Blueprint $table) {
            $table->id();
            $table->string('nama_posyandu');
            $table->string('kota');
            $table->text('alamat');
            $table->string('jadwal')->nullable();      // contoh: "Senin, 08.00 - 11.00"
            $table->string('telepon')->nullable();     // string, bukan integer
            $table->string('gambar')->nullable();       // path / URL foto posyandu
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        schema::dropIfExists('posyandus');
    }
};
