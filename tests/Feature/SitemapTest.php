<?php

test('sitemap lists public pages and excludes account pages', function () {
    config(['app.url' => 'https://301p.ing']);

    $response = $this->get('/sitemap.xml');

    $response->assertOk()
        ->assertHeader('content-type', 'application/xml; charset=UTF-8')
        ->assertSee('<loc>https://301p.ing/</loc>', false)
        ->assertSee('<loc>https://301p.ing/pricing</loc>', false)
        ->assertSee('<loc>https://301p.ing/services/custom-links</loc>', false)
        ->assertDontSee('/login', false)
        ->assertDontSee('/dashboard', false);
});
