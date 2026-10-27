<?php

namespace Database\Factories;

use App\Models\Analytic;
use App\Models\Hyperlink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Analytic>
 */
class AnalyticFactory extends Factory
{
    protected $model = Analytic::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'hyperlink_id' => Hyperlink::factory(),
            'ip' => $this->faker->ipv4,
            'country' => $this->faker->country,
            'country_code' => $this->faker->countryCode,
            'city' => $this->faker->city,
            'region' => $this->faker->state,
            'region_code' => $this->faker->stateAbbr,
            'postal_code' => $this->faker->postcode,
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'timezone' => $this->faker->timezone,
            'user_agent' => $this->faker->userAgent,
            'device' => 'desktop',
            'device_brand' => 'Apple',
            'device_model' => 'Mac',
            'browser' => 'Chrome',
            'browser_version' => '120.0',
            'os' => 'macOS',
            'os_version' => '14.0',
            'is_robot' => false,
            'robot_name' => null,
            'referer' => $this->faker->url,
            'referer_host' => 'example.com',
            'language' => 'en',
            'languages' => ['en', 'en-US'],
            'query_params' => null,
            'utm_source' => 'twitter',
            'utm_medium' => 'social',
            'utm_campaign' => 'launch',
            'utm_term' => null,
            'utm_content' => null,
            'headers' => ['user-agent' => 'Mozilla/5.0'],
            'http_method' => 'GET',
            'scheme' => 'https',
            'host' => '301ping.com',
            'url' => 'https://301ping.com/abcd',
            'visited_at' => now(),
        ];
    }
}
