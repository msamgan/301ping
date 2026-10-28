<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('logos', function (Blueprint $table) {
            $table->boolean('can_delete')->default(true)->after('size');
        });

        DB::table('logos')
            ->whereIn('id', DB::table('hyperlinks')->whereNotNull('logo_id')->select('logo_id'))
            ->update(['can_delete' => false]);
    }

    public function down(): void
    {
        Schema::table('logos', function (Blueprint $table) {
            $table->dropColumn('can_delete');
        });
    }
};
