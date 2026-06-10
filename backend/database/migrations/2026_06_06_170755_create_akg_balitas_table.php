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
        Schema::create('akg_balitas', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('umur_awal');  // bulan (inklusif)
            $table->unsignedSmallInteger('umur_akhir'); // bulan (inklusif)
            $table->string('label_kelompok');           // mis. "6 - 11 bulan"

            // ---------- ENERGI & ZAT GIZI MAKRO (Tabel 1) ----------
            $table->unsignedSmallInteger('energi_kkal');
            $table->decimal('protein_g', 5, 1);
            $table->decimal('lemak_g', 5, 1);
            $table->decimal('karbohidrat_g', 6, 1);
            $table->decimal('serat_g', 5, 1);
            $table->unsignedSmallInteger('air_ml');

            // ---------- VITAMIN (Tabel 2) ----------
            $table->unsignedSmallInteger('vit_a_re');           // Vit A (RE)
            $table->decimal('vit_d_mcg', 6, 1)->nullable();     // Vit D (mcg)
            $table->decimal('vit_e_mcg', 6, 1)->nullable();     // Vit E (mcg)
            $table->decimal('vit_k_mcg', 6, 1)->nullable();     // Vit K (mcg)
            $table->decimal('vit_b1_mg', 5, 2)->nullable();     // Tiamin
            $table->decimal('vit_b2_mg', 5, 2)->nullable();     // Riboflavin
            $table->decimal('vit_b3_mg', 5, 1)->nullable();     // Niasin
            $table->decimal('vit_b5_mg', 5, 1)->nullable();     // Pantotenat
            $table->decimal('vit_b6_mg', 5, 2)->nullable();
            $table->decimal('folat_mcg', 6, 1)->nullable();
            $table->decimal('vit_b12_mcg', 5, 2)->nullable();
            $table->decimal('biotin_mcg', 6, 1)->nullable();
            $table->decimal('kolin_mg', 6, 1)->nullable();
            $table->decimal('vit_c_mg', 6, 1)->nullable();

            // ---------- MINERAL (Tabel 3) ----------
            $table->unsignedSmallInteger('kalsium_mg');
            $table->decimal('fosfor_mg', 7, 1)->nullable();
            $table->decimal('magnesium_mg', 6, 1)->nullable();
            $table->decimal('besi_mg', 4, 1);
            $table->decimal('iodium_mcg', 6, 1)->nullable();
            $table->decimal('seng_mg', 4, 1);
            $table->decimal('selenium_mcg', 6, 1)->nullable();
            $table->decimal('mangan_mg', 6, 3)->nullable();     // 0.003 mg utk 0-5 bln
            $table->decimal('fluor_mg', 5, 2)->nullable();
            $table->decimal('kromium_mcg', 6, 1)->nullable();
            $table->decimal('kalium_mg', 7, 1)->nullable();
            $table->decimal('natrium_mg', 7, 1)->nullable();
            $table->decimal('klor_mg', 7, 1)->nullable();
            $table->decimal('tembaga_mcg', 7, 1)->nullable();

            $table->json('padanan')->nullable();        // padanan makanan per zat gizi
            $table->text('catatan')->nullable();        // pesan khusus kelompok
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('akg_balitas');
    }
};
