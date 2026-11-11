<?php

test('www requests permanently redirect to the apex domain', function () {
    $this->app['env'] = 'production';
    config(['app.url' => 'https://301p.ing']);

    $this->get('https://www.301p.ing/pricing?source=campaign')
        ->assertStatus(308)
        ->assertRedirect('https://301p.ing/pricing?source=campaign');
});

test('www redirects preserve the request method', function () {
    $this->app['env'] = 'production';
    config(['app.url' => 'https://301p.ing']);

    $this->post('https://www.301p.ing/contact', ['message' => 'hello'])
        ->assertStatus(308)
        ->assertRedirect('https://301p.ing/contact');
});

test('www redirects use the configured application URL', function () {
    $this->app['env'] = 'production';
    config(['app.url' => 'https://canonical.example']);

    $this->get('https://www.canonical.example/pricing')
        ->assertStatus(308)
        ->assertRedirect('https://canonical.example/pricing');
});

test('apex domain requests are not redirected', function () {
    $this->app['env'] = 'production';
    config(['app.url' => 'https://301p.ing']);

    $this->get('https://301p.ing/pricing')
        ->assertOk();
});

test('www requests are not redirected outside production', function () {
    $this->app['env'] = 'testing';
    config(['app.url' => 'https://301p.ing']);

    $this->get('https://www.301p.ing/pricing')
        ->assertOk();
});
