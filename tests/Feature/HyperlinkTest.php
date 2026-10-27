<?php

use App\Enums\Health;
use App\Models\Hyperlink;
use App\Models\Tag;
use App\Models\User;
use App\Support\Plans;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Laravel\Paddle\Subscription;
use Laravel\Paddle\SubscriptionItem;

uses(RefreshDatabase::class);

test('it can redirect to original URL from shortened URL', function () {
    $url = 'https://example.com';
    $hyperlink = Hyperlink::factory()->create([
        'url' => $url,
        'shot_slug' => 'abcd',
        'visits' => 0,
    ]);

    $response = $this->get('/abcd');

    $response->assertRedirect($url);
    $hyperlink->refresh();
    expect($hyperlink->visits)->toBe(1)
        ->and($hyperlink->last_visit)->not->toBeNull();
});

test('it returns 404 for non-existent shortened URL', function () {
    $response = $this->get('/nonexistent');
    $response->assertStatus(404);
});

test('it can shorten a URL as a guest', function () {
    $url = 'https://example.com';

    $response = $this->postJson('/service/shorten', [
        'url' => $url,
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url created successfully',
        ]);

    $this->assertDatabaseHas('hyperlinks', [
        'url' => $url,
        'user_id' => null,
    ]);
});

test('it can shorten a URL as an authenticated user', function () {
    $user = User::factory()->create();
    $url = 'https://example.com';

    $response = $this->actingAs($user)
        ->postJson('/service/shorten', [
            'url' => $url,
        ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url created successfully',
        ]);

    $this->assertDatabaseHas('hyperlinks', [
        'url' => $url,
        'user_id' => $user->id,
    ]);
});

test('it associates guest link with user if they shorten it after logging in', function () {
    $url = 'https://example.com';
    $hyperlink = Hyperlink::create([
        'url' => $url,
        'shot_slug' => 'abcd',
        'last_visit' => now(),
        'user_id' => null,
    ]);

    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson('/service/shorten', [
            'url' => $url,
        ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url Already Exists',
        ]);

    $this->assertDatabaseHas('hyperlinks', [
        'url' => $url,
        'user_id' => $user->id,
    ]);
});

test('it rejects a URL with an unsafe scheme', function () {
    $response = $this->postJson('/service/shorten', [
        'url' => 'javascript:alert(1)',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('it rejects a URL pointing to a private or loopback address', function () {
    $response = $this->postJson('/service/shorten', [
        'url' => 'http://127.0.0.1/admin',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('it rejects a URL on the blocked domain list', function () {
    $response = $this->postJson('/service/shorten', [
        'url' => 'https://malware.testing.google.test/path',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('it accepts a URL linking to a standard file extension', function () {
    $response = $this->postJson('/service/shorten', [
        'url' => 'https://example.com/files/report.pdf',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Shortened Url created successfully',
        ]);
});

test('it rejects a URL linking to a dangerous file extension', function () {
    $response = $this->postJson('/service/shorten', [
        'url' => 'https://example.com/files/virus.exe',
    ]);

    $response->assertStatus(422)
        ->assertJsonValidationErrors(['url']);
});

test('authenticated user can view their links ordered by created_at descending', function () {
    $user = User::factory()->create();
    $firstLink = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'created_at' => now()->subDay(),
    ]);
    $secondLink = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'created_at' => now(),
        'health' => Health::Unhealthy,
    ]);
    Hyperlink::factory()->create(['user_id' => null]); // Guest link
    Hyperlink::factory()->create(['user_id' => User::factory()->create()->id]); // Other user's link

    $response = $this->actingAs($user)->get('/links');

    $response->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('Links')
        );

    $serviceResponse = $this->actingAs($user)
        ->getJson('/service/links');

    $serviceResponse->assertStatus(200)
        ->assertJsonCount(2, 'links.data')
        ->assertJsonPath('links.data.0.id', $secondLink->id)
        ->assertJsonPath('links.data.0.health', Health::Unhealthy->value)
        ->assertJsonPath('links.data.1.id', $firstLink->id)
        ->assertJsonPath('links.data.1.health', Health::Healthy->value);
});

test('authenticated user can view link details using its short slug', function () {
    $user = User::factory()->create();
    $link = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'shot_slug' => 'detail-slug',
        'visits' => 12,
    ]);
    $tag = Tag::factory()->create(['user_id' => $user->id]);
    $link->tags()->attach($tag);

    $response = $this->actingAs($user)->get('/links/detail-slug');

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('LinkDetails')
            ->where('link.shot_slug', 'detail-slug')
            ->where('link.url', $link->url)
            ->where('link.visits', 12)
            ->where('link.health', $link->health->value)
            ->where('link.is_slug_edited', false)
            ->where('link.is_destination_edited', false)
            ->where('destinationEditsRemaining', 1)
            ->has('link.tags', 1)
        );
});

test('free user can edit one link destination and re-edit that same destination', function () {
    $user = User::factory()->create();
    $firstLink = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'url' => 'https://example.com/first',
    ]);
    $secondLink = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'url' => 'https://example.com/second',
    ]);

    $this->actingAs($user)
        ->patchJson("/service/links/{$firstLink->id}/destination", [
            'url' => 'https://example.com/updated-first',
        ])
        ->assertOk()
        ->assertJson([
            'status' => true,
            'url' => 'https://example.com/updated-first',
            'destination_edits_remaining' => 0,
        ]);

    $this->assertDatabaseHas('hyperlinks', [
        'id' => $firstLink->id,
        'url' => 'https://example.com/updated-first',
        'is_destination_edited' => true,
    ]);

    $this->patchJson("/service/links/{$firstLink->id}/destination", [
        'url' => 'https://example.com/updated-first-again',
    ])->assertOk();

    $this->patchJson("/service/links/{$secondLink->id}/destination", [
        'url' => 'https://example.com/updated-second',
    ])->assertForbidden()
        ->assertJsonPath('destination_edits_remaining', 0);

    $this->assertDatabaseHas('hyperlinks', [
        'id' => $secondLink->id,
        'url' => 'https://example.com/second',
        'is_destination_edited' => false,
    ]);
});

test('paid user can edit multiple link destinations', function () {
    $user = User::factory()->create();
    $subscription = Subscription::create([
        'billable_id' => $user->id,
        'billable_type' => $user->getMorphClass(),
        'type' => 'default',
        'paddle_id' => 'sub_destination_edits',
        'status' => Subscription::STATUS_ACTIVE,
    ]);
    SubscriptionItem::create([
        'subscription_id' => $subscription->id,
        'product_id' => 'pro_redirect',
        'price_id' => Plans::all()['redirect_monthly']['price_id'],
        'status' => 'active',
        'quantity' => 1,
    ]);
    $firstLink = Hyperlink::factory()->create(['user_id' => $user->id]);
    $secondLink = Hyperlink::factory()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->patchJson("/service/links/{$firstLink->id}/destination", [
            'url' => 'https://example.com/paid-first',
        ])
        ->assertOk()
        ->assertJsonPath('destination_edits_remaining', null);

    $this->patchJson("/service/links/{$secondLink->id}/destination", [
        'url' => 'https://example.com/paid-second',
    ])->assertOk();
});

test('destination edits validate URLs and enforce link ownership', function () {
    $user = User::factory()->create();
    $usersLink = Hyperlink::factory()->create(['user_id' => $user->id]);
    $otherUsersLink = Hyperlink::factory()->create([
        'user_id' => User::factory()->create()->id,
    ]);

    $this->actingAs($user)
        ->patchJson("/service/links/{$usersLink->id}/destination", [
            'url' => 'javascript:alert(1)',
        ])
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['url']);

    $this->patchJson("/service/links/{$otherUsersLink->id}/destination", [
        'url' => 'https://example.com/unauthorized',
    ])->assertForbidden();
});

test('authenticated user cannot view another users link details', function () {
    $user = User::factory()->create();
    $link = Hyperlink::factory()->create([
        'user_id' => User::factory()->create()->id,
        'shot_slug' => 'private-slug',
    ]);

    $this->actingAs($user)->get('/links/' . $link->shot_slug)->assertNotFound();
});

test('authenticated user can search and filter their links via service endpoint', function () {
    $user = User::factory()->create();
    $targetLink = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'url' => 'https://example.com/target-page',
        'shot_slug' => 'target-slug',
    ]);
    $otherLink = Hyperlink::factory()->create([
        'user_id' => $user->id,
        'url' => 'https://other.com/different-page',
        'shot_slug' => 'other-slug',
    ]);

    $response = $this->actingAs($user)
        ->getJson('/service/links?search=target');

    $response->assertStatus(200)
        ->assertJsonCount(1, 'links.data')
        ->assertJsonPath('links.data.0.id', $targetLink->id);
});

test('authenticated user can regenerate their token', function () {
    $user = User::factory()->create(['access_token' => 'old-token']);

    $response = $this->actingAs($user)
        ->postJson('/service/regenerate-token');

    $response->assertStatus(200)
        ->assertJson([
            'status' => true,
            'message' => 'Token regenerated successfully',
        ]);

    $user->refresh();
    expect($user->access_token)->not->toBe('old-token');
});

test('authenticated user can delete their own link', function () {
    $user = User::factory()->create();
    $link = Hyperlink::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->actingAs($user)
        ->from('/links')
        ->delete('/links/' . $link->id);

    $response->assertRedirect('/links');
    $this->assertDatabaseMissing('hyperlinks', [
        'id' => $link->id,
    ]);
});

test('authenticated user cannot delete another users link', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();
    $link = Hyperlink::factory()->create([
        'user_id' => $otherUser->id,
    ]);

    $response = $this->actingAs($user)
        ->delete('/links/' . $link->id);

    $response->assertStatus(403);
    $this->assertDatabaseHas('hyperlinks', [
        'id' => $link->id,
    ]);
});

test('guest cannot delete a link', function () {
    $user = User::factory()->create();
    $link = Hyperlink::factory()->create([
        'user_id' => $user->id,
    ]);

    $response = $this->delete('/links/' . $link->id);

    $response->assertRedirect('/login');
    $this->assertDatabaseHas('hyperlinks', [
        'id' => $link->id,
    ]);
});

test('authenticated user can detach a tag from a link using its slug', function () {
    $user = User::factory()->create();
    $link = Hyperlink::factory()->create(['user_id' => $user->id]);
    $tag = Tag::factory()->create([
        'user_id' => $user->id,
        'name' => 'Project Alpha',
    ]);
    $link->tags()->attach($tag);

    $response = $this->actingAs($user)
        ->deleteJson("/service/links/{$link->id}/tags/{$tag->slug}");

    $response->assertOk()
        ->assertJson(['status' => true]);

    $this->assertDatabaseMissing('hyperlink_tag', [
        'hyperlink_id' => $link->id,
        'tag_id' => $tag->id,
    ]);
});

test('hyperlink defaults to healthy health status', function () {
    $link = Hyperlink::create([
        'url' => 'https://example.com/test-health-default',
        'shot_slug' => 'hlth',
        'last_visit' => now(),
    ]);

    expect($link->health)->toBe(Health::Healthy);

    $this->assertDatabaseHas('hyperlinks', [
        'id' => $link->id,
        'health' => 'healthy',
    ]);
});

test('hyperlink supports unhealthy and unreachable health statuses', function () {
    $unhealthyLink = Hyperlink::factory()->create([
        'health' => Health::Unhealthy,
    ]);
    expect($unhealthyLink->health)->toBe(Health::Unhealthy);
    $this->assertDatabaseHas('hyperlinks', [
        'id' => $unhealthyLink->id,
        'health' => 'unhealthy',
    ]);

    $unreachableLink = Hyperlink::factory()->create([
        'health' => Health::Unreachable,
    ]);
    expect($unreachableLink->health)->toBe(Health::Unreachable);
    $this->assertDatabaseHas('hyperlinks', [
        'id' => $unreachableLink->id,
        'health' => 'unreachable',
    ]);
});
