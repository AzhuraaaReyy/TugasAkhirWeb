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
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->string('session_id')->unique();  // UUID dari frontend
            $table->foreignId('deteksi_id')->nullable()->constrained('deteksis');
            $table->string('current_topic')->nullable();      
            $table->string('current_intent')->nullable();     
            $table->json('context')->nullable();              
            $table->json('history')->nullable();              
            $table->integer('fail_count')->default(0);        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
