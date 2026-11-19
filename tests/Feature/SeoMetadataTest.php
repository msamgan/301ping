<?php

use Inertia\Testing\AssertableInertia;

it('renders search and social metadata in the homepage response', function () {
    $html = $this->get('/')->assertOk()->getContent();

    expect($html)
        ->toContain('name="description" content="Shorten URLs for free with 301 Ping. Create custom short links and QR codes, track visits, and organize links in one place."')
        ->toContain('rel="canonical"')
        ->toContain('property="og:title"')
        ->toContain('name="twitter:card"')
        ->toContain('"@type":"Organization"')
        ->toContain('"@type":"AggregateOffer"')
        ->toContain('"price":"5"')
        ->toContain('"price":"10"')
        ->toContain('https://addons.mozilla.org/en-US/firefox/addon/301ping-url-shortener/');
});

it('renders search metadata for the core service pages', function (string $path, string $title, string $description) {
    $html = $this->get($path)->assertOk()->getContent();

    expect($html)
        ->toContain('<title inertia>' . $title . ' - 301 ping</title>')
        ->toContain('name="description" content="' . $description . '"')
        ->toContain('rel="canonical"');
})->with([
    ['/services/custom-links', 'Custom URL Shortener', 'Create custom short links with memorable words instead of random characters. Start free and organize, track and share your links.'],
    ['/services/link-analytics', 'URL Shortener with Tracking', 'Track short link visits with 301 Ping. See visit counts for free and explore detailed link analytics on paid plans.'],
    ['/services/qr-code-logo', 'URL Shortener with QR Codes', 'Create a short link and download its QR code for print or digital use. Add your own logo to QR codes on paid plans.'],
]);

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
