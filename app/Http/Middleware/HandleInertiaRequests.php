<?php

namespace App\Http\Middleware;

use App\Services\BlogService;
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
            'seo' => $this->seoFor($request),
            'auth' => [
                'user' => $user ? array_merge($user->toArray(), [
                    'subscription' => $user->subscriptionSummary(),
                    'is_admin' => $user->isAdmin(),
                ]) : null,
            ],
            'paddle' => [
                'client_side_token' => config('cashier.client_side_token'),
                'seller_id' => config('cashier.seller_id'),
                'sandbox' => (bool) config('cashier.sandbox'),
            ],
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function seoFor(Request $request): ?array
    {
        $route = $request->route();
        $routeName = $route?->getName();
        $seo = $routeName === 'blog.show'
            ? $this->blogPostSeo($request)
            : (config('seo.routes')[$routeName] ?? null);

        if ($seo === null || $routeName === null) {
            return null;
        }

        $baseUrl = rtrim(config('app.url'), '/');
        $canonicalUrl = $baseUrl . route($routeName, $route->parameters(), absolute: false);
        $image = $seo['image'] ?? $baseUrl . config('seo.image');

        return [
            ...$seo,
            'canonicalUrl' => $canonicalUrl,
            'image' => $image,
            'imageAlt' => $seo['imageAlt'] ?? '301 Ping logo',
            'type' => $seo['type'] ?? 'website',
            'structuredData' => $this->structuredData($routeName, $seo, $baseUrl, $canonicalUrl, $image),
        ];
    }

    /**
     * @return array<string, mixed>|null
     */
    private function blogPostSeo(Request $request): ?array
    {
        $slug = $request->route('slug');
        $post = is_string($slug) ? app(BlogService::class)->find($slug) : null;

        if ($post === null) {
            return null;
        }

        return [
            'title' => $post['title'],
            'description' => $post['description'],
            'image' => $post['image'],
            'imageAlt' => $post['image_alt'],
            'type' => 'article',
        ];
    }

    /**
     * @param  array<string, mixed>  $seo
     * @return array<string, mixed>|null
     */
    private function structuredData(string $routeName, array $seo, string $baseUrl, string $canonicalUrl, string $image): ?array
    {
        if ($routeName === 'home') {
            return [
                '@context' => 'https://schema.org',
                '@graph' => [
                    [
                        '@type' => 'Organization',
                        '@id' => $baseUrl . '/#organization',
                        'name' => '301 Ping',
                        'url' => $baseUrl . '/',
                        'logo' => $image,
                        'sameAs' => [
                            'https://github.com/msamgan',
                            'https://chromewebstore.google.com/detail/ms0org-url-shortener/goaddbeloaeledjpkaankdiglhnmpdld',
                            'https://addons.mozilla.org/en-US/firefox/addon/301ping-url-shortener/',
                        ],
                    ],
                    [
                        '@type' => 'SoftwareApplication',
                        'name' => '301 Ping',
                        'applicationCategory' => 'BusinessApplication',
                        'operatingSystem' => 'Web',
                        'description' => 'A URL shortener for creating and managing short links, custom URLs, click analytics, and branded QR codes.',
                        'offers' => [
                            '@type' => 'Offer',
                            'price' => '0',
                            'priceCurrency' => 'USD',
                        ],
                    ],
                ],
            ];
        }

        if ($routeName === 'pricing') {
            return [
                '@context' => 'https://schema.org',
                '@type' => 'Product',
                'name' => '301 Ping',
                'description' => $seo['description'],
                'image' => $image,
                'brand' => [
                    '@type' => 'Brand',
                    'name' => '301 Ping',
                ],
                'offers' => array_map(
                    fn (string $name, string $price): array => [
                        '@type' => 'Offer',
                        'name' => $name,
                        'price' => $price,
                        'priceCurrency' => 'USD',
                        'url' => $canonicalUrl,
                    ],
                    ['Free', 'Redirect', 'Redirect Plus'],
                    ['0', '5', '10'],
                ),
            ];
        }

        return null;
    }
}
