<?php

it('renders search and social metadata in the homepage response', function () {
    $html = $this->get('/')->assertOk()->getContent();

    expect($html)
        ->toContain('name="description" content="Shorten long URLs into trackable 301p.ing links with tags, QR codes and a link library. Free to start, $5/mo for detailed analytics."')
        ->toContain('rel="canonical"')
        ->toContain('property="og:title"')
        ->toContain('name="twitter:card"')
        ->toContain('"@type":"Organization"')
        ->toContain('https://addons.mozilla.org/en-US/firefox/addon/301ping-url-shortener/');
});

it('renders product offers in the pricing response', function () {
    $html = $this->get('/pricing')->assertOk()->getContent();

    expect($html)
        ->toContain('property="og:description"')
        ->toContain('"@type":"Product"')
        ->toContain('"price":"0"')
        ->toContain('"price":"5"')
        ->toContain('"price":"10"');
});

it('renders post-specific metadata for blog articles', function () {
    $html = $this->get('/blog/best-url-shorteners-2026')->assertOk()->getContent();

    expect($html)
        ->toContain('property="og:type" content="article"')
        ->toContain('name="description" content="Compare Bitly, 301 Ping, and TinyURL')
        ->toContain('/blog/best-url-shorteners-2026');
});
