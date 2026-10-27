<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('path')->nullable();
            $table->string('mime_type');
            $table->unsignedInteger('width');
            $table->unsignedInteger('height');
            $table->unsignedInteger('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logos');
    }
};
