<?php

use Inertia\Testing\AssertableInertia;

it('renders search and social metadata in the homepage response', function () {
    $html = $this->get('/')->assertOk()->getContent();

    expect($html)
        ->toContain('name="description" content="Shorten long URLs into trackable 301p.ing links with tags, QR codes and a link library. Free to start, $5/mo for detailed analytics."')
        ->toContain('rel="canonical"')
        ->toContain('property="og:title"')
        ->toContain('name="twitter:card"')
        ->toContain('"@type":"Organization"')
        ->toContain('"@type":"AggregateOffer"')
        ->toContain('"price":"5"')
        ->toContain('"price":"10"')
        ->toContain('https://addons.mozilla.org/en-US/firefox/addon/301ping-url-shortener/');
});

it('renders product offers in the pricing response', function () {
    $html = $this->get('/pricing')->assertOk()->getContent();

    expect($html)
        ->toContain('property="og:description"')
        ->toContain('"@type":"Product"')
        ->toContain('"price":"0"')
        ->toContain('"price":"5"')
        ->toContain('"price":"10"')
        ->toContain('"@type":"FAQPage"')
        ->toContain('Do 301 Ping short links expire?');
});

it('renders dedicated comparison pages with FAQ structured data', function (string $path, string $competitor, string $title) {
    $html = $this->get($path)
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Comparisons/Show')
            ->where('competitor', $competitor))
        ->getContent();

    expect($html)
        ->toContain($title)
        ->toContain('"@type":"FAQPage"');
})->with([
    ['/vs/bitly', 'Bitly', '301 Ping vs Bitly'],
    ['/vs/tinyurl', 'TinyURL', '301 Ping vs TinyURL'],
]);

it('renders a public link safety page', function () {
    $this->get('/safety')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Safety')
            ->where('seo.title', 'Link Safety'));
});

it('renders post-specific metadata for blog articles', function () {
    $html = $this->get('/blog/best-url-shorteners-2026')->assertOk()->getContent();

    expect($html)
        ->toContain('property="og:type" content="article"')
        ->toContain('name="description" content="Compare Bitly, 301 Ping, and TinyURL')
        ->toContain('/blog/best-url-shorteners-2026');
});
