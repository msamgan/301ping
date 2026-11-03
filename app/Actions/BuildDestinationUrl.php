<?php

namespace App\Actions;

use Illuminate\Http\Request;

class BuildDestinationUrl
{
    /**
     * Build the destination URL preserving and merging incoming query parameters.
     */
    public function handle(string $destinationUrl, Request $request): string
    {
        $incomingQuery = $request->query();

        if (empty($incomingQuery)) {
            return $destinationUrl;
        }

        $parsedUrl = parse_url($destinationUrl);

        if ($parsedUrl === false) {
            return $destinationUrl;
        }

        $destinationQuery = [];
        if (! empty($parsedUrl['query'])) {
            parse_str($parsedUrl['query'], $destinationQuery);
        }

        $mergedQuery = array_merge($destinationQuery, $incomingQuery);
        $queryString = http_build_query($mergedQuery);

        $scheme = isset($parsedUrl['scheme']) ? $parsedUrl['scheme'] . '://' : '';
        $user = $parsedUrl['user'] ?? '';
        $pass = isset($parsedUrl['pass']) ? ':' . $parsedUrl['pass'] : '';
        $auth = ($user !== '' || $pass !== '') ? "{$user}{$pass}@" : '';
        $host = $parsedUrl['host'] ?? '';
        $port = isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '';
        $path = $parsedUrl['path'] ?? '';
        $query = $queryString !== '' ? '?' . $queryString : '';
        $fragment = isset($parsedUrl['fragment']) ? '#' . $parsedUrl['fragment'] : '';

        return "{$scheme}{$auth}{$host}{$port}{$path}{$query}{$fragment}";
    }

    /**
     * Invoke the action.
     */
    public function __invoke(string $destinationUrl, Request $request): string
    {
        return $this->handle($destinationUrl, $request);
    }
}
