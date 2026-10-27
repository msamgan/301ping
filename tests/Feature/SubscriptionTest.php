<?php

use App\Models\User;
use App\Support\Plans;
use Illuminate\Support\Facades\Http;
use Laravel\Paddle\Subscription;
use Laravel\Paddle\SubscriptionItem;

test('unauthenticated user cannot access subscription status', function () {
    $response = $this->getJson('/subscription/status');

    $response->assertUnauthorized();
});

test('public user can fetch available plans from service endpoint', function () {
    $response = $this->getJson('/service/plans');

    $response->assertOk()
        ->assertJsonStructure([
            'plans' => [
                'redirect_monthly' => ['name', 'tier', 'interval', 'price_id', 'price'],
                'redirect_annual' => ['name', 'tier', 'interval', 'price_id', 'price'],
                'redirect_plus_monthly' => ['name', 'tier', 'interval', 'price_id', 'price'],
                'redirect_plus_annual' => ['name', 'tier', 'interval', 'price_id', 'price'],
            ],
        ]);
});

test('pricing page renders with plans passed to inertia view', function () {
    $response = $this->get('/pricing');

    $response->assertOk();
});

test('unauthenticated user cannot initiate checkout', function () {
    $response = $this->postJson('/subscription/checkout', [
        'price_id' => Plans::REDIRECT_MONTHLY,
    ]);

    $response->assertUnauthorized();
});

test('authenticated user can view subscription status and configured plans', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->getJson('/subscription/status');

    $response->assertOk()
        ->assertJsonStructure([
            'subscription' => [
                'is_subscribed',
                'tier',
                'plan_name',
                'price_id',
                'status',
            ],
            'plans' => [
                'redirect_monthly',
                'redirect_annual',
                'redirect_plus_monthly',
                'redirect_plus_annual',
            ],
        ]);

    $data = $response->json();
    expect($data['plans']['redirect_monthly']['price_id'])->toBe('pri_01m5jg0yac8xnjkw6assdmxgga')
        ->and($data['plans']['redirect_annual']['price_id'])->toBe('pri_01m5jg2fkxbnc0a7dzhb1gzp8z')
        ->and($data['plans']['redirect_plus_monthly']['price_id'])->toBe('pri_01m5jg4h9xgxbb3549cttxpws1')
        ->and($data['plans']['redirect_plus_annual']['price_id'])->toBe('pri_01m5jg5fbpp64p31r1ze1t9dt2');
});

test('checkout validates required price id', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/subscription/checkout', []);

    $response->assertUnprocessable()
        ->assertJsonValidationErrors(['price_id']);
});

test('checkout rejects invalid price id', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/subscription/checkout', [
            'price_id' => 'pri_invalid_price_id',
        ]);

    $response->assertUnprocessable()
        ->assertJsonFragment(['message' => 'The selected subscription plan is invalid.']);
});

test('plans helper resolves correct prices and identifies tiers', function () {
    expect(Plans::isValidPriceId('pri_01m5jg0yac8xnjkw6assdmxgga'))->toBeTrue()
        ->and(Plans::isValidPriceId('pri_01m5jg2fkxbnc0a7dzhb1gzp8z'))->toBeTrue()
        ->and(Plans::isValidPriceId('pri_01m5jg4h9xgxbb3549cttxpws1'))->toBeTrue()
        ->and(Plans::isValidPriceId('pri_01m5jg5fbpp64p31r1ze1t9dt2'))->toBeTrue()
        ->and(Plans::isValidPriceId('pri_non_existent'))->toBeFalse();

    expect(Plans::isRedirect('pri_01m5jg0yac8xnjkw6assdmxgga'))->toBeTrue()
        ->and(Plans::isRedirect('pri_01m5jg2fkxbnc0a7dzhb1gzp8z'))->toBeTrue()
        ->and(Plans::isRedirectPlus('pri_01m5jg4h9xgxbb3549cttxpws1'))->toBeTrue()
        ->and(Plans::isRedirectPlus('pri_01m5jg5fbpp64p31r1ze1t9dt2'))->toBeTrue();

    expect(Plans::resolvePriceId('redirect_monthly'))->toBe('pri_01m5jg0yac8xnjkw6assdmxgga')
        ->and(Plans::resolvePriceId('redirect_annual'))->toBe('pri_01m5jg2fkxbnc0a7dzhb1gzp8z')
        ->and(Plans::resolvePriceId('redirect_plus_monthly'))->toBe('pri_01m5jg4h9xgxbb3549cttxpws1')
        ->and(Plans::resolvePriceId('redirect_plus_annual'))->toBe('pri_01m5jg5fbpp64p31r1ze1t9dt2');
});

test('user model subscription helper methods return accurate summaries and tier checks', function () {
    $user = User::factory()->create();

    // Default free user
    expect($user->isSubscribed())->toBeFalse()
        ->and($user->subscribedToRedirect())->toBeFalse()
        ->and($user->subscribedToRedirectPlus())->toBeFalse()
        ->and($user->activeSubscription())->toBeNull()
        ->and($user->logoLimit())->toBe(0);

    $summary = $user->subscriptionSummary();
    expect($summary['is_subscribed'])->toBeFalse()
        ->and($summary['tier'])->toBe('Free')
        ->and($summary['plan_name'])->toBe('Free Plan');

    // Create a subscription record for redirect tier
    $subscription = Subscription::create([
        'billable_id' => $user->id,
        'billable_type' => $user->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_123456',
        'status' => Subscription::STATUS_ACTIVE,
    ]);

    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_123',
        'price_id' => Plans::REDIRECT_MONTHLY,
        'status' => 'active',
        'quantity' => 1,
    ]);

    $user->unsetRelation('subscriptions');

    expect($user->isSubscribed())->toBeTrue()
        ->and($user->subscribedToRedirect())->toBeTrue()
        ->and($user->subscribedToRedirectPlus())->toBeFalse();

    $summary = $user->subscriptionSummary();
    expect($summary['is_subscribed'])->toBeTrue()
        ->and($summary['tier'])->toBe('Redirect')
        ->and($summary['plan_name'])->toBe('Redirect Monthly')
        ->and($summary['price_id'])->toBe(Plans::REDIRECT_MONTHLY)
        ->and($user->logoLimit())->toBe(1);
});

test('user logo limit is unlimited on Redirect Plus', function () {
    $user = User::factory()->create();

    $subscription = Subscription::create([
        'billable_id' => $user->id,
        'billable_type' => $user->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_plus_123',
        'status' => Subscription::STATUS_ACTIVE,
    ]);

    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_plus_123',
        'price_id' => Plans::REDIRECT_PLUS_MONTHLY,
        'status' => 'active',
        'quantity' => 1,
    ]);

    expect($user->logoLimit())->toBeNull();
});

test('unauthenticated user cannot resume subscription', function () {
    $response = $this->postJson('/subscription/resume');

    $response->assertUnauthorized();
});

test('resume rejects when user has no subscription or is not on grace period', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->postJson('/subscription/resume');

    $response->assertUnprocessable()
        ->assertJsonFragment(['message' => 'Subscription cannot be resumed because it is not on grace period.']);
});

test('user can resume subscription when on grace period', function () {
    config()->set('cashier.api_key', 'test_api_key');

    Http::fake([
        '*/subscriptions/sub_123456' => Http::response([
            'data' => [
                'id' => 'sub_123456',
                'status' => 'active',
                'items' => [
                    [
                        'price' => [
                            'id' => Plans::REDIRECT_MONTHLY,
                        ],
                        'quantity' => 1,
                    ],
                ],
            ],
        ], 200),
    ]);

    $user = User::factory()->create();

    $subscription = Subscription::create([
        'billable_id' => $user->id,
        'billable_type' => $user->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_123456',
        'status' => Subscription::STATUS_ACTIVE,
        'ends_at' => now()->addDays(14),
    ]);

    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_123',
        'price_id' => Plans::REDIRECT_MONTHLY,
        'status' => 'active',
        'quantity' => 1,
    ]);

    $response = $this
        ->actingAs($user)
        ->postJson('/subscription/resume');

    $response->assertOk()
        ->assertJsonFragment(['message' => 'Subscription has been resumed successfully.']);

    expect($subscription->fresh()->ends_at)->toBeNull();
});
