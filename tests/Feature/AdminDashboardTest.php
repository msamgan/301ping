<?php

use App\Models\Analytic;
use App\Models\Hyperlink;
use App\Models\User;

test('admin dashboard shows redirect counts for the last 30 days', function () {
    $admin = User::factory()->create();
    config(['admin.user_ids' => [$admin->id]]);
    $hyperlink = Hyperlink::factory()->for($admin)->create();
    $today = now()->startOfDay();
    $this->travelTo($today);

    Analytic::factory()->for($hyperlink)->create(['created_at' => $today->copy()->subDays(29)]);
    Analytic::factory()->for($hyperlink)->create(['created_at' => $today->copy()]);
    Analytic::factory()->for($hyperlink)->create(['created_at' => $today->copy(), 'is_robot' => true]);
    Analytic::factory()->for($hyperlink)->create(['created_at' => $today->copy()->subDays(30)]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('Admin/Dashboard')
            ->has('redirectsDaily', 30)
            ->where('redirectsDaily.0.date', $today->copy()->subDays(29)->toDateString())
            ->where('redirectsDaily.0.total', 1)
            ->where('redirectsDaily.29.date', $today->toDateString())
            ->where('redirectsDaily.29.total', 2));
});
