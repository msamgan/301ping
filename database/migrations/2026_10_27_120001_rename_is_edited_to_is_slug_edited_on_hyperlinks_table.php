<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->renameColumn('is_edited', 'is_slug_edited');
        });
    }

    public function down(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->renameColumn('is_slug_edited', 'is_edited');
        });
    }
};
