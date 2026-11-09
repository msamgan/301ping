<?php

it('includes analytics scripts only in production', function (string $environment, string $url, int $status) {
    $this->app->instance('env', $environment);
    $this->withoutVite();

    $response = $this->get($url)->assertStatus($status);

    if ($environment === 'production') {
        $response->assertSee('https://www.googletagmanager.com/gtm.js?id=GTM-TXQRR8MX', false)
            ->assertSee("gtag('js', new Date());", false)
            ->assertSee('https://cloud.umami.is/script.js', false)
            ->assertSee('3c509567-0d86-4a80-bf53-a796c06d390a', false);
    } else {
        $response->assertDontSee('googletagmanager.com', false)
            ->assertDontSee('window.dataLayer', false)
            ->assertDontSee('cloud.umami.is/script.js', false);
    }
})->with([
    ['production', '/', 200],
    ['local', '/', 200],
    ['staging', '/', 200],
    ['testing', '/', 200],
    ['production', '/missing/page', 404],
    ['local', '/missing/page', 404],
    ['staging', '/missing/page', 404],
    ['testing', '/missing/page', 404],
]);
