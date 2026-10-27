<?php

use App\Enums\Health;
use App\Mail\UnhealthyHyperlinkMail;
use App\Models\Hyperlink;
use App\Models\User;
use App\Support\Plans;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Laravel\Paddle\Subscription;
use Laravel\Paddle\SubscriptionItem;

uses(RefreshDatabase::class);

test('it returns failure when an invalid tier is provided', function () {
    $this->artisan('hyperlinks:ping', ['tier' => 'SuperPremium'])
        ->expectsOutputToContain('Invalid subscription tier [SuperPremium]')
        ->assertFailed();
});

test('it pings destination URLs for free tier users only when Free tier is selected', function () {
    Http::fake([
        'https://free-user.com' => Http::response('OK', 200),
        'https://redirect-user.com' => Http::response('OK', 200),
    ]);

    $freeUser = User::factory()->create([
        'email' => 'free@example.com',
    ]);
    Hyperlink::create([
        'user_id' => $freeUser->id,
        'url' => 'https://free-user.com',
        'shot_slug' => 'free1',
        'last_visit' => now(),
    ]);

    $redirectUser = User::factory()->create([
        'email' => 'redirect@example.com',
    ]);
    $subscription = Subscription::create([
        'billable_id' => $redirectUser->id,
        'billable_type' => $redirectUser->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_redir_1',
        'status' => Subscription::STATUS_ACTIVE,
    ]);
    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect',
        'price_id' => Plans::all()['redirect_monthly']['price_id'],
        'status' => 'active',
        'quantity' => 1,
    ]);
    Hyperlink::create([
        'user_id' => $redirectUser->id,
        'url' => 'https://redirect-user.com',
        'shot_slug' => 'redir1',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['tier' => 'Free'])
        ->expectsOutputToContain('Fetching users and hyperlinks for subscription tier: Free')
        ->expectsOutputToContain('free@example.com')
        ->expectsOutputToContain('Healthy destinations: 1')
        ->doesntExpectOutputToContain('redirect@example.com')
        ->assertSuccessful();

    Http::assertSent(fn ($request) => $request->url() === 'https://free-user.com');
    Http::assertNotSent(fn ($request) => $request->url() === 'https://redirect-user.com');
});

test('it pings destination URLs for Redirect tier users only when Redirect tier is selected', function () {
    Http::fake([
        'https://free-user.com' => Http::response('OK', 200),
        'https://redirect-user.com' => Http::response('OK', 200),
    ]);

    $freeUser = User::factory()->create([
        'email' => 'free@example.com',
    ]);
    Hyperlink::create([
        'user_id' => $freeUser->id,
        'url' => 'https://free-user.com',
        'shot_slug' => 'free1',
        'last_visit' => now(),
    ]);

    $redirectUser = User::factory()->create([
        'email' => 'redirect@example.com',
    ]);
    $subscription = Subscription::create([
        'billable_id' => $redirectUser->id,
        'billable_type' => $redirectUser->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_redir_2',
        'status' => Subscription::STATUS_ACTIVE,
    ]);
    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect',
        'price_id' => Plans::all()['redirect_monthly']['price_id'],
        'status' => 'active',
        'quantity' => 1,
    ]);
    Hyperlink::create([
        'user_id' => $redirectUser->id,
        'url' => 'https://redirect-user.com',
        'shot_slug' => 'redir2',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['tier' => 'Redirect'])
        ->expectsOutputToContain('Fetching users and hyperlinks for subscription tier: Redirect')
        ->expectsOutputToContain('redirect@example.com')
        ->expectsOutputToContain('Healthy destinations: 1')
        ->doesntExpectOutputToContain('free@example.com')
        ->assertSuccessful();

    Http::assertSent(fn ($request) => $request->url() === 'https://redirect-user.com');
    Http::assertNotSent(fn ($request) => $request->url() === 'https://free-user.com');
});

test('it pings destination URLs for Redirect Plus tier users when Redirect Plus tier is selected', function () {
    Http::fake([
        'https://redirect-plus-user.com' => Http::response('OK', 200),
    ]);

    $plusUser = User::factory()->create([
        'email' => 'plus@example.com',
    ]);
    $subscription = Subscription::create([
        'billable_id' => $plusUser->id,
        'billable_type' => $plusUser->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_plus_1',
        'status' => Subscription::STATUS_ACTIVE,
    ]);
    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect_plus',
        'price_id' => Plans::all()['redirect_plus_monthly']['price_id'],
        'status' => 'active',
        'quantity' => 1,
    ]);
    Hyperlink::create([
        'user_id' => $plusUser->id,
        'url' => 'https://redirect-plus-user.com',
        'shot_slug' => 'plus1',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['tier' => 'Redirect Plus'])
        ->expectsOutputToContain('Fetching users and hyperlinks for subscription tier: Redirect Plus')
        ->expectsOutputToContain('plus@example.com')
        ->expectsOutputToContain('Healthy destinations: 1')
        ->assertSuccessful();

    Http::assertSent(fn ($request) => $request->url() === 'https://redirect-plus-user.com');
});

test('it pings all users when All or no tier is specified', function () {
    Http::fake([
        'https://free-user.com' => Http::response('OK', 200),
        'https://plus-user.com' => Http::response('OK', 200),
    ]);

    $freeUser = User::factory()->create([
        'email' => 'free@example.com',
    ]);
    Hyperlink::create([
        'user_id' => $freeUser->id,
        'url' => 'https://free-user.com',
        'shot_slug' => 'free1',
        'last_visit' => now(),
    ]);

    $plusUser = User::factory()->create([
        'email' => 'plus@example.com',
    ]);
    $subscription = Subscription::create([
        'billable_id' => $plusUser->id,
        'billable_type' => $plusUser->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_plus_2',
        'status' => Subscription::STATUS_ACTIVE,
    ]);
    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect_plus',
        'price_id' => Plans::all()['redirect_plus_annual']['price_id'],
        'status' => 'active',
        'quantity' => 1,
    ]);
    Hyperlink::create([
        'user_id' => $plusUser->id,
        'url' => 'https://plus-user.com',
        'shot_slug' => 'plus2',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping')
        ->expectsOutputToContain('Fetching users and hyperlinks for subscription tier: All')
        ->expectsOutputToContain('free@example.com')
        ->expectsOutputToContain('plus@example.com')
        ->expectsOutputToContain('Total hyperlinks pinged: 2')
        ->expectsOutputToContain('Healthy destinations: 2')
        ->assertSuccessful();

    Http::assertSent(fn ($request) => $request->url() === 'https://free-user.com');
    Http::assertSent(fn ($request) => $request->url() === 'https://plus-user.com');
});

test('it correctly reports healthy, unreachable, and unhealthy destinations including errors and timeouts', function () {
    Http::fake([
        'https://healthy-200.com' => Http::response('OK', 200),
        'https://healthy-301.com' => Http::response('Redirected', 301),
        'https://unreachable-401.com' => Http::response('Unauthorized', 401),
        'https://unreachable-404.com' => Http::response('Not Found', 404),
        'https://unhealthy-500.com' => Http::response('Server Error', 500),
        'https://unreachable-network-error.com' => function () {
            throw new ConnectionException('Connection timed out');
        },
    ]);

    $user = User::factory()->create([
        'email' => 'test@example.com',
    ]);

    $urls = [
        'https://healthy-200.com' => 'h200',
        'https://healthy-301.com' => 'h301',
        'https://unreachable-401.com' => 'u401',
        'https://unreachable-404.com' => 'u404',
        'https://unhealthy-500.com' => 'u500',
        'https://unreachable-network-error.com' => 'unet',
    ];

    foreach ($urls as $url => $slug) {
        Hyperlink::create([
            'user_id' => $user->id,
            'url' => $url,
            'shot_slug' => $slug,
            'last_visit' => now(),
        ]);
    }

    $this->artisan('hyperlinks:ping', ['tier' => 'Free'])
        ->expectsOutputToContain('Total hyperlinks pinged: 6')
        ->expectsOutputToContain('Healthy destinations: 2')
        ->expectsOutputToContain('Unreachable destinations: 3')
        ->expectsOutputToContain('Unhealthy destinations: 1')
        ->assertSuccessful();
});

test('it handles tier with no users gracefully', function () {
    $this->artisan('hyperlinks:ping', ['tier' => 'Redirect Plus'])
        ->expectsOutputToContain('No users found for subscription tier: Redirect Plus')
        ->assertSuccessful();
});

test('it accepts tier via --tier option', function () {
    Http::fake([
        'https://free-option.com' => Http::response('OK', 200),
    ]);

    $freeUser = User::factory()->create([
        'email' => 'free-opt@example.com',
    ]);
    Hyperlink::create([
        'user_id' => $freeUser->id,
        'url' => 'https://free-option.com',
        'shot_slug' => 'opt1',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['--tier' => 'Free'])
        ->expectsOutputToContain('Fetching users and hyperlinks for subscription tier: Free')
        ->expectsOutputToContain('free-opt@example.com')
        ->assertSuccessful();
});

test('it updates the health column of hyperlinks based on ping results', function () {
    Http::fake([
        'https://healthy-link.com' => Http::response('OK', 200),
        'https://unreachable-link.com' => Http::response('Not Found', 404),
        'https://unhealthy-link.com' => Http::response('Server Error', 500),
    ]);

    $user = User::factory()->create();

    $healthy = Hyperlink::create([
        'user_id' => $user->id,
        'url' => 'https://healthy-link.com',
        'shot_slug' => 'hlth',
        'health' => Health::Unhealthy,
        'last_visit' => now(),
    ]);

    $unreachable = Hyperlink::create([
        'user_id' => $user->id,
        'url' => 'https://unreachable-link.com',
        'shot_slug' => 'unrc',
        'health' => Health::Healthy,
        'last_visit' => now(),
    ]);

    $unhealthy = Hyperlink::create([
        'user_id' => $user->id,
        'url' => 'https://unhealthy-link.com',
        'shot_slug' => 'unhl',
        'health' => Health::Healthy,
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['tier' => 'Free'])
        ->assertSuccessful();

    expect($healthy->fresh()->health)->toBe(Health::Healthy)
        ->and($unreachable->fresh()->health)->toBe(Health::Unreachable)
        ->and($unhealthy->fresh()->health)->toBe(Health::Unhealthy);
});

test('it fires a queued email to the user when a hyperlink is unhealthy', function () {
    Mail::fake();

    Http::fake([
        'https://unhealthy-link.com' => Http::response('Server Error', 500),
    ]);

    $user = User::factory()->create([
        'email' => 'alert-user@example.com',
    ]);

    $hyperlink = Hyperlink::create([
        'user_id' => $user->id,
        'url' => 'https://unhealthy-link.com',
        'shot_slug' => 'unhealthy-slug',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['tier' => 'Free'])
        ->assertSuccessful();

    Mail::assertQueued(UnhealthyHyperlinkMail::class, function ($mail) use ($user, $hyperlink) {
        return $mail->hasTo($user->email)
            && $mail->hyperlink->id === $hyperlink->id;
    });
});

test('it does not fire an email when hyperlinks are healthy or unreachable', function () {
    Mail::fake();

    Http::fake([
        'https://healthy-link.com' => Http::response('OK', 200),
        'https://unreachable-link.com' => Http::response('Not Found', 404),
    ]);

    $user = User::factory()->create([
        'email' => 'healthy-user@example.com',
    ]);

    Hyperlink::create([
        'user_id' => $user->id,
        'url' => 'https://healthy-link.com',
        'shot_slug' => 'healthy-slug',
        'last_visit' => now(),
    ]);

    Hyperlink::create([
        'user_id' => $user->id,
        'url' => 'https://unreachable-link.com',
        'shot_slug' => 'unreachable-slug',
        'last_visit' => now(),
    ]);

    $this->artisan('hyperlinks:ping', ['tier' => 'Free'])
        ->assertSuccessful();

    Mail::assertNotQueued(UnhealthyHyperlinkMail::class);
});
