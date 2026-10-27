<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->unique('shot_slug');
        });
    }

    public function down(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->dropUnique(['shot_slug']);
        });
    }
};
