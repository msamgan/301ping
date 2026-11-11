<?php

it('returns a successful response', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
});

it('renders the public founder page', function () {
    $this->get('/founder')
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('Founder'));
});
