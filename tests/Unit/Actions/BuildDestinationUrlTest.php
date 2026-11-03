<?php

use App\Actions\BuildDestinationUrl;
use Illuminate\Http\Request;

test('it returns original destination URL when incoming request has no query parameters', function () {
    $action = new BuildDestinationUrl();
    $request = Request::create('https://short.ly/abc');

    $result = $action->handle('https://example.com/target', $request);

    expect($result)->toBe('https://example.com/target');
});

test('it appends incoming query parameters to destination URL without existing query', function () {
    $action = new BuildDestinationUrl();
    $request = Request::create('https://short.ly/abc?utm_source=twitter&ref=123');

    $result = $action->handle('https://example.com/target', $request);

    expect($result)->toBe('https://example.com/target?utm_source=twitter&ref=123');
});

test('it merges incoming query parameters with existing destination query parameters', function () {
    $action = new BuildDestinationUrl();
    $request = Request::create('https://short.ly/abc?utm_source=newsletter&tag=laravel');

    $result = $action->handle('https://example.com/target?existing=1&tag=php', $request);

    expect($result)->toBe('https://example.com/target?existing=1&tag=laravel&utm_source=newsletter');
});

test('it preserves URL fragment when appending query parameters', function () {
    $action = new BuildDestinationUrl();
    $request = Request::create('https://short.ly/abc?v=2');

    $result = $action->handle('https://example.com/docs#installation', $request);

    expect($result)->toBe('https://example.com/docs?v=2#installation');
});

test('it preserves both query and fragment when merging query parameters', function () {
    $action = new BuildDestinationUrl();
    $request = Request::create('https://short.ly/abc?page=2');

    $result = $action->handle('https://example.com/search?q=test#results', $request);

    expect($result)->toBe('https://example.com/search?q=test&page=2#results');
});

test('it is invokable', function () {
    $action = new BuildDestinationUrl();
    $request = Request::create('https://short.ly/abc?foo=bar');

    $result = $action('https://example.com/page', $request);

    expect($result)->toBe('https://example.com/page?foo=bar');
});
