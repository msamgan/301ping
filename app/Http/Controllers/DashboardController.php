<?php

namespace App\Http\Controllers;

use App\Enums\Health;
use App\Models\Analytic;
use App\Models\Hyperlink;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request): JsonResponse
    {
        return response()->json($this->payload($request->user()));
    }

    public function token(): JsonResponse
    {
        return response()->json(['token' => auth()->user()->access_token]);
    }

    private function payload(User $user): array
    {
        $hyperlinks = $user->hyperlinks();
        $healthCounts = (clone $hyperlinks)
            ->selectRaw('health, COUNT(*) as total')
            ->groupBy('health')
            ->pluck('total', 'health');

        return [
            'linkCount' => (clone $hyperlinks)->count(),
            'visits' => (int) (clone $hyperlinks)->sum('visits'),
            'last24Hours' => Analytic::query()
                ->whereHas('hyperlink', fn ($query) => $query->where('user_id', $user->id))
                ->where('visited_at', '>=', now()->subDay())
                ->count(),
            'healthSummary' => collect(Health::cases())
                ->mapWithKeys(fn (Health $health) => [$health->value => (int) $healthCounts->get($health->value, 0)])
                ->all(),
            'recentLinks' => (clone $hyperlinks)
                ->with('tags')
                ->latest()
                ->limit(5)
                ->get(['id', 'url', 'shot_slug', 'visits', 'health', 'created_at'])
                ->map(fn (Hyperlink $link) => [
                    'id' => $link->id,
                    'url' => $link->url,
                    'shot_slug' => $link->shot_slug,
                    'shortened_url' => url('/' . $link->shot_slug),
                    'visits' => $link->visits,
                    'health' => $link->health->value,
                    'created_at' => $link->created_at->toIso8601String(),
                    'tags' => $link->tags->map(fn ($tag) => [
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                    ])->values(),
                ])
                ->values(),
        ];
    }
}
