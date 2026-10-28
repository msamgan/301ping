<?php

use App\Jobs\RecordAnalyticsJob;
use App\Models\Analytic;
use App\Models\Hyperlink;
use App\Services\AnalyticsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

test('visiting a shortened url captures analytics record in the database', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/target-page',
        'shot_slug' => 'testslug',
        'visits' => 0,
    ]);

    $response = $this->withHeaders([
        'User-Agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer' => 'https://news.ycombinator.com/item?id=12345',
        'Accept-Language' => 'en-US,en;q=0.9,es;q=0.8',
        'CF-IPCountry' => 'US',
        'CF-IPCity' => 'San Francisco',
        'CF-Region' => 'California',
        'CF-Region-Code' => 'CA',
        'CF-Postal-Code' => '94107',
        'CF-Latitude' => '37.7749',
        'CF-Longitude' => '-122.4194',
        'CF-Timezone' => 'America/Los_Angeles',
    ])->get('/testslug?utm_source=twitter&utm_medium=social&utm_campaign=spring_promo&custom_ref=123');

    $response->assertRedirect('https://example.com/target-page');

    $this->assertDatabaseHas('analytics', [
        'hyperlink_id' => $hyperlink->id,
        'country_code' => 'US',
        'country' => 'United States',
        'city' => 'San Francisco',
        'region' => 'California',
        'region_code' => 'CA',
        'postal_code' => '94107',
        'timezone' => 'America/Los_Angeles',
        'browser' => 'Chrome',
        'os' => 'macOS',
        'device' => 'desktop',
        'device_brand' => 'Apple',
        'device_model' => 'Mac',
        'is_robot' => false,
        'referer' => 'https://news.ycombinator.com/item?id=12345',
        'referer_host' => 'news.ycombinator.com',
        'utm_source' => 'twitter',
        'utm_medium' => 'social',
        'utm_campaign' => 'spring_promo',
        'http_method' => 'GET',
    ]);

    $analytic = Analytic::where('hyperlink_id', $hyperlink->id)->first();
    expect($analytic)->not->toBeNull()
        ->and($analytic->latitude)->toBe(37.7749)
        ->and($analytic->longitude)->toBe(-122.4194)
        ->and(in_array($analytic->language, ['en-US', 'en_US'], true))->toBeTrue()
        ->and($analytic->languages)->toBeArray()
        ->and($analytic->query_params)->toBeArray()
        ->and($analytic->query_params['custom_ref'])->toBe('123')
        ->and($analytic->hyperlink->id)->toBe($hyperlink->id);

    expect($hyperlink->analytics()->count())->toBe(1);
});

test('visiting with mobile bot user agent correctly detects robot and bot device', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com',
        'shot_slug' => 'botslug',
    ]);

    $response = $this->withHeaders([
        'User-Agent' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'CF-IPCountry' => 'US',
        'CF-IPCity' => 'Mountain View',
    ])->get('/botslug');

    $response->assertRedirect('https://example.com');

    $this->assertDatabaseHas('analytics', [
        'hyperlink_id' => $hyperlink->id,
        'is_robot' => true,
        'robot_name' => 'Googlebot',
        'device' => 'bot',
        'country_code' => 'US',
        'city' => 'Mountain View',
    ]);
});

test('visiting with iphone user agent correctly detects mobile device and iOS', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/mobile-target',
        'shot_slug' => 'iphoneslug',
    ]);

    $response = $this->withHeaders([
        'User-Agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
        'CloudFront-Viewer-Country' => 'GB',
        'CloudFront-Viewer-Country-Name' => 'United Kingdom',
        'CloudFront-Viewer-City' => 'London',
    ])->get('/iphoneslug');

    $response->assertRedirect('https://example.com/mobile-target');

    $this->assertDatabaseHas('analytics', [
        'hyperlink_id' => $hyperlink->id,
        'country_code' => 'GB',
        'country' => 'United Kingdom',
        'city' => 'London',
        'os' => 'iOS',
        'os_version' => '17.1',
        'device' => 'mobile',
        'device_brand' => 'Apple',
        'device_model' => 'iPhone',
        'browser' => 'Safari',
        'browser_version' => '17.1',
        'is_robot' => false,
    ]);
});

test('visiting with android user agent detects mobile device and android os', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/android',
        'shot_slug' => 'androidslug',
    ]);

    $response = $this->withHeaders([
        'User-Agent' => 'Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.144 Mobile Safari/537.36',
    ])->get('/androidslug');

    $response->assertRedirect('https://example.com/android');

    $this->assertDatabaseHas('analytics', [
        'hyperlink_id' => $hyperlink->id,
        'os' => 'Android',
        'os_version' => '14',
        'device' => 'mobile',
        'device_brand' => 'Google',
        'device_model' => 'Pixel 8 Pro',
        'browser' => 'Chrome',
    ]);
});

test('non-existent slug returns 404 and does not create analytics record', function () {
    $response = $this->get('/nonexistentslug123');

    $response->assertStatus(404);
    $this->assertDatabaseCount('analytics', 0);
});

test('multiple visits generate multiple analytics records for the hyperlink', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/multi',
        'shot_slug' => 'multislug',
        'visits' => 0,
    ]);

    $this->withHeaders(['CF-IPCountry' => 'US', 'CF-IPCity' => 'New York'])->get('/multislug');
    $this->withHeaders(['CF-IPCountry' => 'FR', 'CF-IPCity' => 'Paris'])->get('/multislug');
    $this->withHeaders(['CF-IPCountry' => 'JP', 'CF-IPCity' => 'Tokyo'])->get('/multislug');

    expect($hyperlink->fresh()->visits)->toBe(3);
    expect($hyperlink->analytics()->count())->toBe(3);

    $cities = $hyperlink->analytics()->pluck('city')->all();
    expect($cities)->toContain('New York', 'Paris', 'Tokyo');
});

test('analytics service sanitizes sensitive headers', function () {
    $request = Request::create('https://301ping.com/myslug', 'GET', [], [], [], [
        'HTTP_AUTHORIZATION' => 'Bearer secret-token',
        'HTTP_COOKIE' => 'session_id=12345; auth=secret',
        'HTTP_USER_AGENT' => 'TestAgent/1.0',
        'HTTP_X_CUSTOM_HEADER' => 'custom-value',
    ]);

    $extracted = AnalyticsService::extractData($request);

    expect($extracted['headers'])->toBeArray()
        ->and(array_key_exists('authorization', $extracted['headers']))->toBeFalse()
        ->and(array_key_exists('Authorization', $extracted['headers']))->toBeFalse()
        ->and(array_key_exists('cookie', $extracted['headers']))->toBeFalse()
        ->and(array_key_exists('Cookie', $extracted['headers']))->toBeFalse()
        ->and($extracted['headers']['x-custom-header'] ?? $extracted['headers']['X-Custom-Header'] ?? null)->toBe('custom-value');
});

test('record analytics job extracts and updates analytics in database', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/dest',
        'shot_slug' => 'jobslug',
    ]);

    $requestData = [
        'ip' => '1.2.3.4',
        'headers' => [
            'User-Agent' => ['Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'],
            'CF-IPCountry' => ['CA'],
            'CF-IPCity' => ['Toronto'],
            'CF-Region' => ['Ontario'],
            'CF-Postal-Code' => ['M5V 2T6'],
        ],
        'query' => [
            'utm_source' => 'newsletter',
            'utm_medium' => 'email',
            'utm_campaign' => 'launch',
        ],
        'url' => 'https://301ping.com/jobslug?utm_source=newsletter',
        'method' => 'GET',
    ];

    $job = new RecordAnalyticsJob($hyperlink, $requestData);
    $result = app()->call([$job, 'handle']);

    expect($result)->toBeInstanceOf(Analytic::class);
    $this->assertDatabaseHas('analytics', [
        'hyperlink_id' => $hyperlink->id,
        'country_code' => 'CA',
        'country' => 'Canada',
        'city' => 'Toronto',
        'region' => 'Ontario',
        'postal_code' => 'M5V 2T6',
        'browser' => 'Chrome',
        'os' => 'macOS',
        'device' => 'desktop',
        'utm_source' => 'newsletter',
        'utm_medium' => 'email',
        'utm_campaign' => 'launch',
    ]);
});

test('record analytics job can update existing analytic record', function () {
    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/dest',
        'shot_slug' => 'updateslug',
    ]);

    $analytic = Analytic::factory()->create([
        'hyperlink_id' => $hyperlink->id,
        'city' => 'OldCity',
        'country_code' => 'US',
    ]);

    $updatePayload = [
        'headers' => [
            'CF-IPCountry' => ['DE'],
            'CF-IPCity' => ['Berlin'],
            'User-Agent' => ['Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0'],
        ],
    ];

    $job = new RecordAnalyticsJob($hyperlink, $updatePayload, $analytic);
    app()->call([$job, 'handle']);

    $analytic->refresh();
    expect($analytic->city)->toBe('Berlin')
        ->and($analytic->country_code)->toBe('DE')
        ->and($analytic->country)->toBe('Germany')
        ->and($analytic->browser)->toBe('Firefox')
        ->and($analytic->os)->toBe('Windows');
});

test('analytics service recordAsync dispatches job', function () {
    Queue::fake();

    $hyperlink = Hyperlink::factory()->create([
        'url' => 'https://example.com/dest',
        'shot_slug' => 'asyncslug',
    ]);

    $request = Request::create('https://301ping.com/asyncslug', 'GET', [], [], [], [
        'HTTP_USER_AGENT' => 'Mozilla/5.0',
        'HTTP_CF_IPCOUNTRY' => 'IT',
    ]);

    AnalyticsService::recordAsync($hyperlink, $request);

    Queue::assertPushed(RecordAnalyticsJob::class, function ($job) use ($hyperlink) {
        return $job->hyperlink->id === $hyperlink->id;
    });
});
