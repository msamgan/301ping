<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->foreignId('logo_id')->after('user_id')->nullable()->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->dropConstrainedForeignId('logo_id');
        });
    }
};
