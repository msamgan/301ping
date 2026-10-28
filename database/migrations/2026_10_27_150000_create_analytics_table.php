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
        Schema::create('analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('hyperlink_id')->constrained('hyperlinks')->cascadeOnDelete();
            $table->string('ip', 45)->nullable();
            $table->string('country')->nullable();
            $table->string('country_code', 10)->nullable();
            $table->string('city')->nullable();
            $table->string('region')->nullable();
            $table->string('region_code', 20)->nullable();
            $table->string('postal_code', 20)->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->string('timezone')->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device')->nullable();
            $table->string('device_brand')->nullable();
            $table->string('device_model')->nullable();
            $table->string('browser')->nullable();
            $table->string('browser_version', 50)->nullable();
            $table->string('os')->nullable();
            $table->string('os_version', 50)->nullable();
            $table->boolean('is_robot')->default(false);
            $table->string('robot_name')->nullable();
            $table->text('referer')->nullable();
            $table->string('referer_host')->nullable();
            $table->string('language', 20)->nullable();
            $table->json('languages')->nullable();
            $table->json('query_params')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_campaign')->nullable();
            $table->string('utm_term')->nullable();
            $table->string('utm_content')->nullable();
            $table->json('headers')->nullable();
            $table->string('http_method', 10)->nullable();
            $table->string('scheme', 10)->nullable();
            $table->string('host')->nullable();
            $table->text('url')->nullable();
            $table->timestamp('visited_at')->nullable();
            $table->timestamps();

            $table->index('country_code');
            $table->index('city');
            $table->index('device');
            $table->index('browser');
            $table->index('os');
            $table->index('referer_host');
            $table->index('utm_source');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analytics');
    }
};
