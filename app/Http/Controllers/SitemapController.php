<?php

namespace App\Http\Controllers;

use App\Services\BlogService;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __construct(private readonly BlogService $blog) {}

    public function __invoke(): Response
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $pageRoutes = [
            'home',
            'pricing',
            'blog.index',
            'documentation.api',
            'services.qr-code-logo',
            'services.link-tags',
            'services.custom-links',
            'services.broken-destinations',
            'services.edit-destination',
            'privacy',
            'terms',
            'refund-policy',
        ];

        $urls = array_map(
            fn (string $routeName): string => $baseUrl . route($routeName, absolute: false),
            $pageRoutes,
        );

        $urls = array_merge($urls, $this->blog->all()
            ->map(fn (array $post): string => $baseUrl . route('blog.show', $post['slug'], false))
            ->all());

        return response()->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
