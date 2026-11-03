<?php

test('blog index lists posts newest first', function () {
    $this->get('/blog')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Blog/Index')
        ->has('posts', 1)
        ->where('posts.0.slug', 'what-is-a-301-redirect'));
});

test('blog post renders markdown with metadata', function () {
    $this->get('/blog/what-is-a-301-redirect')->assertOk()->assertInertia(fn ($page) => $page
        ->component('Blog/Show')
        ->where('post.title', 'What Is a 301 Redirect and Why Does It Matter?')
        ->where('post.tags', ['redirects', 'seo'])
        ->where('post.html', fn ($html) => str_contains($html, '<strong>301 redirect</strong>')));
});

test('unknown blog post returns 404', function () {
    $this->get('/blog/nope')->assertNotFound();
});

test('sitemap includes blog pages', function () {
    config(['app.url' => 'https://301p.ing']);

    $this->get('/sitemap.xml')
        ->assertSee('<loc>https://301p.ing/blog</loc>', false)
        ->assertSee('<loc>https://301p.ing/blog/what-is-a-301-redirect</loc>', false);
});
