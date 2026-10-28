<?php

namespace Database\Factories;

use App\Enums\Health;
use App\Models\Hyperlink;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Hyperlink>
 */
class HyperlinkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'url' => $this->faker->url,
            'shot_slug' => $this->faker->unique()->lexify('????'),
            'visits' => 0,
            'health' => Health::Healthy,
            'last_visit' => now(),
        ];
    }
}
