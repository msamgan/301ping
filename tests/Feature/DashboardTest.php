<?php

use App\Enums\Health;
use App\Models\Analytic;
use App\Models\Hyperlink;
use App\Models\User;

test('dashboard statistics do not expose the api access token', function () {
    $user = User::factory()->create(['access_token' => 'private-token']);

    $response = $this->actingAs($user)->getJson(route('service.dashboard'));

    $response->assertOk()
        ->assertExactJson([
            'linkCount' => 0,
            'visits' => 0,
            'last24Hours' => 0,
            'healthSummary' => [
                'healthy' => 0,
                'unhealthy' => 0,
                'unreachable' => 0,
            ],
            'recentLinks' => [],
        ]);
});

test('dashboard summarizes only the authenticated users links and recent visits', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $healthyLink = Hyperlink::factory()->for($user)->create([
        'url' => 'https://example.com/healthy',
        'shot_slug' => 'healthy',
        'visits' => 8,
        'health' => Health::Healthy,
    ]);
    $unhealthyLink = Hyperlink::factory()->for($user)->create([
        'shot_slug' => 'broken',
        'visits' => 3,
        'health' => Health::Unhealthy,
    ]);
    $otherLink = Hyperlink::factory()->for($otherUser)->create([
        'shot_slug' => 'private',
        'visits' => 100,
    ]);

    Analytic::factory()->create([
        'hyperlink_id' => $healthyLink->id,
        'visited_at' => now()->subHours(2),
    ]);
    Analytic::factory()->create([
        'hyperlink_id' => $healthyLink->id,
        'visited_at' => now()->subDays(2),
    ]);
    Analytic::factory()->create([
        'hyperlink_id' => $otherLink->id,
    ]);

    $this->actingAs($user)
        ->getJson(route('service.dashboard'))
        ->assertOk()
        ->assertJsonPath('linkCount', 2)
        ->assertJsonPath('visits', 11)
        ->assertJsonPath('last24Hours', 1)
        ->assertJsonPath('healthSummary.healthy', 1)
        ->assertJsonPath('healthSummary.unhealthy', 1)
        ->assertJsonPath('healthSummary.unreachable', 0)
        ->assertJsonCount(2, 'recentLinks')
        ->assertJsonFragment([
            'shot_slug' => $unhealthyLink->shot_slug,
            'health' => Health::Unhealthy->value,
        ])
        ->assertJsonMissing(['shot_slug' => $otherLink->shot_slug]);
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
