<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHyperlinkRequest;
use App\Http\Resources\HyperlinkResource;
use App\Jobs\CheckHyperlinkHealthJob;
use App\Models\Hyperlink;
use App\Shortener;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\RateLimiter;
use OpenApi\Attributes as OA;

class HyperlinkController extends Controller
{
    /**
     * Shorten a URL
     */
    #[OA\Post(
        path: '/api/shorten',
        operationId: 'shortenUrl',
        description: 'Creates a new shortened URL or returns the existing shortened URL for the provided URL.',
        summary: 'Shorten a URL',
        security: [['bearerAuth' => []]],
        requestBody: new OA\RequestBody(
            description: 'URL data to be shortened',
            required: true,
            content: new OA\JsonContent(
                ref: '#/components/schemas/StoreHyperlinkRequest'
            )
        ),
        tags: ['Hyperlinks'],
        responses: [
            new OA\Response(
                response: 200,
                description: 'URL shortened successfully or existing short URL returned',
                content: new OA\JsonContent(
                    ref: '#/components/schemas/HyperlinkResource'
                )
            ),
            new OA\Response(
                response: 401,
                description: 'Unauthorized - invalid or missing access token',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'Unauthorized'),
                    ]
                )
            ),
            new OA\Response(
                response: 429,
                description: 'Daily limit reached (Free: 40, Redirect: 100, Redirect Plus: 300 new links per day)',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string'),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: 'Validation error - invalid URL or unsafe URL',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'message', type: 'string', example: 'The url field is required.'),
                        new OA\Property(
                            property: 'errors',
                            properties: [
                                new OA\Property(
                                    property: 'url',
                                    type: 'array',
                                    items: new OA\Items(type: 'string', example: 'The url field is required.')
                                ),
                            ],
                            type: 'object'
                        ),
                    ]
                )
            ),
        ]
    )]
    public function shorten(StoreHyperlinkRequest $request): HyperlinkResource|JsonResponse
    {
        $hyperlinkExists = Hyperlink::query()
            ->where('url', $request->string('url'))
            ->where('user_id', $request->user->id)
            ->first();

        if ($hyperlinkExists) {
            return new HyperlinkResource([
                'message' => 'Shortened Url Already Exists',
                'short_url' => url('/' . $hyperlinkExists->shot_slug),
            ]);
        }

        $limitKey = 'api-shorten:' . $request->user->getKey() . ':' . now()->toDateString();
        $limit = $request->user->apiDailyLimit();

        if (RateLimiter::tooManyAttempts($limitKey, $limit)) {
            return response()->json([
                'message' => 'Daily API limit of ' . $limit . ' short links reached. Upgrade your plan or try again tomorrow.',
            ], 429);
        }

        RateLimiter::hit($limitKey, now()->diffInSeconds(now()->endOfDay()) + 1);

        $shotSlug = Shortener::shorten();

        $hyperLinkData = [
            'url' => $request->string('url'),
            'shot_slug' => $shotSlug,
            'last_visit' => now(),
            'user_id' => $request->user->id,
        ];

        $hyperlink = Hyperlink::create($hyperLinkData);

        CheckHyperlinkHealthJob::dispatch($hyperlink);

        return new HyperlinkResource([
            'message' => 'Shortened Url created successfully',
            'short_url' => url('/' . $shotSlug),
        ]);
    }
}
