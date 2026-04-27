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
        Schema::create('knowledge_base', function (Blueprint $table) {
            $table->id();
            $table->string('kategori');
            $table->text('pertanyaan');
            $table->text('jawaban');
            $table->json('tags');                      // identitas node
            $table->json('aliases')->nullable();       // sinonim
            $table->enum('kondisi', ['normal', 'stunting', 'semua']);
            $table->json('relations')->nullable();     // graph edges
            $table->json('related_questions')->nullable();
            $table->integer('weight')->default(1);
            $table->integer('view_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('knowledge_base');
    }
};
