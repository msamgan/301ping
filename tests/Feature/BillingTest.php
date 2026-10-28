<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('billing page lists only the signed-in users invoices', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $user->transactions()->create([
        'paddle_id' => 'txn_user_invoice',
        'invoice_number' => 'INV-1001',
        'status' => 'completed',
        'total' => '1200',
        'tax' => '200',
        'currency' => 'USD',
        'billed_at' => now(),
    ]);
    $user->transactions()->create([
        'paddle_id' => 'txn_without_invoice',
        'invoice_number' => null,
        'status' => 'completed',
        'total' => '500',
        'tax' => '0',
        'currency' => 'USD',
        'billed_at' => now(),
    ]);
    $otherUser->transactions()->create([
        'paddle_id' => 'txn_other_invoice',
        'invoice_number' => 'INV-2001',
        'status' => 'completed',
        'total' => '2400',
        'tax' => '400',
        'currency' => 'USD',
        'billed_at' => now(),
    ]);

    $this->actingAs($user)
        ->get('/billing')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Billing')
            ->has('invoices', 1)
            ->where('invoices.0.number', 'INV-1001'));
});

test('billing page requires authentication', function () {
    $this->get('/billing')->assertRedirect('/login');
});

test('invoice download cannot access another users transaction', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $transaction = $owner->transactions()->create([
        'paddle_id' => 'txn_private_invoice',
        'invoice_number' => 'INV-3001',
        'status' => 'completed',
        'total' => '1200',
        'tax' => '200',
        'currency' => 'USD',
        'billed_at' => now(),
    ]);

    $this->actingAs($otherUser)
        ->get(route('billing.invoices.download', $transaction))
        ->assertNotFound();
});
