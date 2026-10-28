<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('branding page displays the signed-in users logos and plan limit', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get('/branding')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Branding')
            ->has('logos', 0)
            ->where('logoLimit', 0));
});

test('branding page requires authentication', function () {
    $this->get('/branding')->assertRedirect('/login');
});
