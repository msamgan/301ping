<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectWwwToApex
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! app()->environment('production')) {
            return $next($request);
        }

        $canonicalUrl = rtrim((string) config('app.url'), '/');
        $canonicalHost = parse_url($canonicalUrl, PHP_URL_HOST);

        if (is_string($canonicalHost) && strcasecmp($request->getHost(), 'www.' . $canonicalHost) === 0) {
            return redirect()->to($canonicalUrl . $request->getRequestUri(), 308);
        }

        return $next($request);
    }
}
