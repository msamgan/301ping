<?php

use App\Models\User;

test('dashboard statistics do not expose the api access token', function () {
    $user = User::factory()->create(['access_token' => 'private-token']);

    $response = $this->actingAs($user)->getJson(route('service.dashboard'));

    $response->assertOk()
        ->assertExactJson([
            'linkCount' => 0,
            'visits' => 0,
        ]);
});

test('authenticated users can fetch their api access token', function () {
    $user = User::factory()->create(['access_token' => 'private-token']);

    $response = $this->actingAs($user)->getJson(route('service.api-token'));

    $response->assertOk()
        ->assertExactJson(['token' => 'private-token']);
});

test('api access token endpoint requires authentication', function () {
    $this->getJson(route('service.api-token'))->assertUnauthorized();
});
