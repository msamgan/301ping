<?php

use App\Models\Hyperlink;
use Inertia\Testing\AssertableInertia as Assert;

it('shows the current short-link count', function () {
    Hyperlink::factory()->count(2)->create();

    $this->get('/')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Welcome')
            ->where('activeLinkCount', 2));
});
