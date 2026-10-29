<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'siteUrl' => config('app.url'),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'subscription' => $user->subscriptionSummary(),
                ]) : null,
            ],
            'paddle' => [
                'client_side_token' => config('cashier.client_side_token'),
                'seller_id' => config('cashier.seller_id'),
                'sandbox' => (bool) config('cashier.sandbox'),
            ],
        ];
    }
}
