<?php

use App\Models\Hyperlink;
use App\Models\User;
use App\Support\Plans;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Laravel\Paddle\Subscription;
use Laravel\Paddle\SubscriptionItem;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create([
        'access_token' => 'test-token',
    ]);
});

test('it can shorten a new URL', function () {
    $url = 'https://example.com';

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => $url,
        ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url created successfully',
        ])
        ->assertJsonStructure([
            'status',
            'message',
            'short_url',
        ]);

    $this->assertDatabaseHas('hyperlinks', [
        'url' => $url,
        'user_id' => $this->user->id,
    ]);
});

test('it returns an existing shortened URL if the same URL is provided', function () {
    $url = 'https://example.com';

    $hyperlink = Hyperlink::create([
        'url' => $url,
        'shot_slug' => 'abcd',
        'last_visit' => now(),
        'user_id' => $this->user->id,
    ]);

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => $url,
        ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url Already Exists',
            'short_url' => url('/' . $hyperlink->shot_slug),
        ]);

    $this->assertEquals(1, Hyperlink::count());
});

test('it returns validation error if URL is missing', function () {
    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', []);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('it returns validation error if URL is invalid', function () {
    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'not-a-url',
        ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('it returns 401 if no access token is provided', function () {
    $response = $this->postJson('/api/shorten', [
        'url' => 'https://example.com',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Unauthorized',
        ]);
});

test('it returns 401 if an invalid access token is provided', function () {
    $response = $this->withHeader('Authorization', 'Bearer invalid-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com',
        ]);

    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Unauthorized',
        ]);
});

test('it increments rate limiter attempts upon successful URL shortening', function () {
    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();
    expect(RateLimiter::attempts($limitKey))->toBe(0);

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/unique-url-1',
        ]);

    $response->assertStatus(200);
    expect(RateLimiter::attempts($limitKey))->toBe(1);
});

test('it does not increment rate limiter when URL already exists', function () {
    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();

    Hyperlink::create([
        'url' => 'https://example.com/existing',
        'shot_slug' => 'abcd',
        'last_visit' => now(),
        'user_id' => $this->user->id,
    ]);

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/existing',
        ]);

    $response->assertStatus(200);
    expect(RateLimiter::attempts($limitKey))->toBe(0);
});

test('it enforces daily rate limit of 40 short links for free plan users', function () {
    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();

    for ($i = 0; $i < 40; $i++) {
        RateLimiter::hit($limitKey);
    }

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/free-limit-exceeded',
        ]);

    $response->assertStatus(429)
        ->assertJson([
            'message' => 'Daily API limit of 40 short links reached. Upgrade your plan or try again tomorrow.',
        ]);
});

test('it enforces daily rate limit of 100 short links for redirect plan users', function () {
    $subscription = Subscription::create([
        'billable_id' => $this->user->id,
        'billable_type' => $this->user->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_redirect_100',
        'status' => Subscription::STATUS_ACTIVE,
    ]);

    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect',
        'price_id' => Plans::REDIRECT_MONTHLY,
        'status' => 'active',
        'quantity' => 1,
    ]);

    $this->user->unsetRelation('subscriptions');

    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();

    for ($i = 0; $i < 100; $i++) {
        RateLimiter::hit($limitKey);
    }

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/redirect-plan-exceeded',
        ]);

    $response->assertStatus(429)
        ->assertJson([
            'message' => 'Daily API limit of 100 short links reached. Upgrade your plan or try again tomorrow.',
        ]);
});

test('it enforces daily rate limit of 300 short links for redirect plus plan users', function () {
    $subscription = Subscription::create([
        'billable_id' => $this->user->id,
        'billable_type' => $this->user->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_redirect_plus_300',
        'status' => Subscription::STATUS_ACTIVE,
    ]);

    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect_plus',
        'price_id' => Plans::REDIRECT_PLUS_MONTHLY,
        'status' => 'active',
        'quantity' => 1,
    ]);

    $this->user->unsetRelation('subscriptions');

    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();

    for ($i = 0; $i < 300; $i++) {
        RateLimiter::hit($limitKey);
    }

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/redirect-plus-plan-exceeded',
        ]);

    $response->assertStatus(429)
        ->assertJson([
            'message' => 'Daily API limit of 300 short links reached. Upgrade your plan or try again tomorrow.',
        ]);
});

test('daily rate limit is scoped to individual users', function () {
    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();

    for ($i = 0; $i < 40; $i++) {
        RateLimiter::hit($limitKey);
    }

    User::factory()->create([
        'access_token' => 'other-user-token',
    ]);

    $response = $this->withHeader('Authorization', 'Bearer other-user-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/other-user-url',
        ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url created successfully',
        ]);
});

test('daily rate limit resets on the following day', function () {
    $limitKey = 'api-shorten:' . $this->user->getKey() . ':' . now()->toDateString();

    for ($i = 0; $i < 40; $i++) {
        RateLimiter::hit($limitKey);
    }

    $response = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/today-blocked',
        ]);

    $response->assertStatus(429);

    $this->travel(1)->days();

    $responseTomorrow = $this->withHeader('Authorization', 'Bearer test-token')
        ->postJson('/api/shorten', [
            'url' => 'https://example.com/tomorrow-allowed',
        ]);

    $responseTomorrow->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url created successfully',
        ]);

    $this->travelBack();
});
