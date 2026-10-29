<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $pageRoutes = [
            'home',
            'pricing',
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

        return response()->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }
}
