<?php

use App\Enums\Health;
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
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->string('health')->default(Health::Healthy->value)->after('is_slug_edited');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('hyperlinks', function (Blueprint $table) {
            $table->dropColumn('health');
        });
    }
};
