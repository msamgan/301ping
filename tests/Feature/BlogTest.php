<?php

test('blog index lists posts newest first', function () {
    $this->get('/blog')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Blog/Index')
        ->where('posts.0.slug', 'what-is-a-url-shortener'));
});

test('blog post renders markdown with metadata', function () {
    $this->get('/blog/what-is-a-url-shortener')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Blog/Show')
        ->where('post.title', 'What Is a URL Shortener? How It Works and When to Use One')
        ->where('post.tags', ['url-shortener', 'short-links', 'link-management'])
        ->where('post.html', fn ($html) => str_contains($html, '<strong>URL shortener</strong>'))
        ->where('post.html', fn ($html) => str_contains($html, 'How 301 Ping can help')));
});

test('unknown blog post returns 404', function () {
    $this->get('/blog/nope')->assertNotFound();
});

test('sitemap includes blog pages', function () {
    config(['app.url' => 'https://301p.ing']);

    $this->get('/sitemap.xml')
        ->assertSee('<loc>https://301p.ing/blog</loc>', false)
        ->assertSee('<loc>https://301p.ing/blog/what-is-a-url-shortener</loc>', false);
});
