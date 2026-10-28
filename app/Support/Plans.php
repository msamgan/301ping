<?php

namespace App\Support;

class Plans
{
    public const string REDIRECT_MONTHLY = 'pri_01m5jg0yac8xnjkw6assdmxgga';

    public const string REDIRECT_ANNUAL = 'pri_01m5jg2fkxbnc0a7dzhb1gzp8z';

    public const string REDIRECT_PLUS_MONTHLY = 'pri_01m5jg4h9xgxbb3549cttxpws1';

    public const string REDIRECT_PLUS_ANNUAL = 'pri_01m5jg5fbpp64p31r1ze1t9dt2';

    /**
     * Get all configured plan definitions.
     *
     * @return array<string, array{name: string, tier: string, interval: string, price_id: string, price: string}>
     */
    public static function all(): array
    {
        return [
            'redirect_monthly' => [
                'name' => 'Redirect Monthly',
                'tier' => 'Redirect',
                'interval' => 'monthly',
                'price_id' => config('cashier.plans.redirect_monthly')
                    ?: config('services.paddle.plans.redirect_monthly')
                    ?: self::REDIRECT_MONTHLY,
                'price' => '$5 / month',
            ],
            'redirect_annual' => [
                'name' => 'Redirect Annual',
                'tier' => 'Redirect',
                'interval' => 'annual',
                'price_id' => config('cashier.plans.redirect_annual')
                    ?: config('services.paddle.plans.redirect_annual')
                    ?: self::REDIRECT_ANNUAL,
                'price' => '$50 / year',
            ],
            'redirect_plus_monthly' => [
                'name' => 'Redirect Plus Monthly',
                'tier' => 'Redirect Plus',
                'interval' => 'monthly',
                'price_id' => config('cashier.plans.redirect_plus_monthly')
                    ?: config('services.paddle.plans.redirect_plus_monthly')
                    ?: self::REDIRECT_PLUS_MONTHLY,
                'price' => '$10 / month',
            ],
            'redirect_plus_annual' => [
                'name' => 'Redirect Plus Annual',
                'tier' => 'Redirect Plus',
                'interval' => 'annual',
                'price_id' => config('cashier.plans.redirect_plus_annual')
                    ?: config('services.paddle.plans.redirect_plus_annual')
                    ?: self::REDIRECT_PLUS_ANNUAL,
                'price' => '$100 / year',
            ],
        ];
    }

    /**
     * Get list of all valid price IDs.
     *
     * @return array<int, string>
     */
    public static function priceIds(): array
    {
        return array_values(array_map(fn ($p) => $p['price_id'], self::all()));
    }

    /**
     * Determine if a given price ID is valid.
     */
    public static function isValidPriceId(?string $priceId): bool
    {
        if (empty($priceId)) {
            return false;
        }

        return in_array($priceId, self::priceIds(), true);
    }

    /**
     * Resolve a price ID from either a plan key or direct price ID.
     */
    public static function resolvePriceId(string $keyOrPriceId): ?string
    {
        $all = self::all();

        if (isset($all[$keyOrPriceId])) {
            return $all[$keyOrPriceId]['price_id'];
        }

        if (self::isValidPriceId($keyOrPriceId)) {
            return $keyOrPriceId;
        }

        return null;
    }

    /**
     * Find plan info by price ID.
     *
     * @return array{name: string, tier: string, interval: string, price_id: string, price: string}|null
     */
    public static function findByPriceId(?string $priceId): ?array
    {
        if (! $priceId) {
            return null;
        }

        foreach (self::all() as $plan) {
            if ($plan['price_id'] === $priceId) {
                return $plan;
            }
        }

        return null;
    }

    /**
     * Determine if price ID is in the Redirect tier.
     */
    public static function isRedirect(string $priceId): bool
    {
        $plan = self::findByPriceId($priceId);

        return $plan && $plan['tier'] === 'Redirect';
    }

    /**
     * Determine if price ID is in the Redirect Plus tier.
     */
    public static function isRedirectPlus(string $priceId): bool
    {
        $plan = self::findByPriceId($priceId);

        return $plan && $plan['tier'] === 'Redirect Plus';
    }
}
