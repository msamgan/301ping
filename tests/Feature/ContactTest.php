<?php

use App\Mail\ContactMessageMail;
use Illuminate\Support\Facades\Mail;

test('contact form sends email to configured recipient', function () {
    Mail::fake();
    config(['services.contact.recipient' => 'to@example.com']);

    $this->postJson('/contact', [
        'name' => 'Jane',
        'country_code' => '+91',
        'phone' => '9876543210',
        'email' => 'jane@example.com',
        'message' => 'Hello',
    ])->assertOk();

    Mail::assertSent(ContactMessageMail::class, fn ($m) => $m->hasTo('to@example.com'));
});

test('contact form validates input', function () {
    $this->postJson('/contact', [])->assertUnprocessable();
});
