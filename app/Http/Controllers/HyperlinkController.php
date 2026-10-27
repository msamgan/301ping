<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreHyperlinkRequest;
use App\Http\Requests\UpdateHyperlinkRequest;
use App\Methods;
use App\Models\Hyperlink;
use App\Models\Tag;
use App\Shortener;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Random\RandomException;

class HyperlinkController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function links(Request $request): JsonResponse
    {
        return response()->json($this->linksPayload($request));
    }

    private function linksPayload(Request $request): array
    {
        $query = Hyperlink::query()->where('user_id', auth()->id());
        $search = trim((string) $request->input('search', ''));

        $tag = trim((string) $request->input('tag', ''));

        $listing = (clone $query)->when($tag !== '', function ($q) use ($tag) {
            $q->whereHas('tags', fn ($t) => $t->where('tags.slug', $tag)->where('tags.user_id', auth()->id()));
        })->when($search !== '', function ($q) use ($search) {
            $term = '%' . addcslashes($search, '%_\\') . '%';
            $q->where(fn ($w) => $w->where('url', 'like', $term)->orWhere('shot_slug', 'like', $term));
        });

        return [
            'filters' => ['search' => $search, 'tag' => $tag],
            'stats' => [
                'total' => (clone $query)->count(),
                'visits' => (int) (clone $query)->sum('visits'),
            ],
            'links' => $listing->with(['tags', 'logo'])->orderBy('created_at', 'desc')->orderBy('id', 'desc')->paginate(20)->withQueryString()->through(function ($link) {
                return [
                    'id' => $link->id,
                    'url' => $link->url,
                    'shot_slug' => $link->shot_slug,
                    'visits' => $link->visits,
                    'last_visit' => date('F, d Y', strtotime($link->last_visit)),
                    'shortened_url' => url('/' . $link->shot_slug),
                    'status' => 'Active',
                    'logo_url' => $link->logo?->url(),
                    'tags' => $link->tags->map(fn ($tag) => [
                        'id' => $tag->id,
                        'name' => $tag->name,
                        'slug' => $tag->slug,
                    ])->values(),
                ];
            }),
        ];
    }

    public function details(string $shot_slug)
    {
        $hyperlink = Hyperlink::query()
            ->where('user_id', auth()->id())
            ->where('shot_slug', $shot_slug)
            ->with(['tags', 'logo'])
            ->firstOrFail();

        return Inertia::render('LinkDetails', [
            'link' => [
                'id' => $hyperlink->id,
                'url' => $hyperlink->url,
                'shot_slug' => $hyperlink->shot_slug,
                'shortened_url' => url('/' . $hyperlink->shot_slug),
                'visits' => $hyperlink->visits,
                'is_active' => $hyperlink->is_active,
                'logo_id' => $hyperlink->logo_id,
                'created_at' => $hyperlink->created_at?->format('F, d Y'),
                'last_visit' => $hyperlink->last_visit ? date('F, d Y', strtotime($hyperlink->last_visit)) : null,
                'tags' => $hyperlink->tags->map(fn ($tag) => [
                    'id' => $tag->id,
                    'name' => $tag->name,
                    'slug' => $tag->slug,
                ])->values(),
            ],
            'logos' => auth()->user()->logos()->latest()->get()->map->toFrontend()->values(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHyperlinkRequest $request): JsonResponse
    {
        $hyperlinkExists = Hyperlink::query()->where('url', $request->get('url'))->first();

        if ($hyperlinkExists && $hyperlinkExists->user_id === null && auth()->check()) {
            $hyperlinkExists->user_id = auth()->id();
            $hyperlinkExists->save();
        }

        if ($hyperlinkExists) {
            return response()->json([
                'status' => true,
                'message' => 'Shortened Url Already Exists',
                'short_url' => url('/' . $hyperlinkExists->shot_slug),
            ]);
        }

        $shotSlug = Shortener::shorten();

        $hyperLinkData = [
            'url' => $request->get('url'),
            'shot_slug' => $shotSlug,
            'last_visit' => now(),
        ];

        if (auth()->check()) {
            $hyperLinkData['user_id'] = auth()->id();
        }

        Hyperlink::create($hyperLinkData);

        return response()->json([
            'status' => true,
            'message' => 'Shortened Url created successfully',
            'short_url' => url('/' . $shotSlug),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request)
    {
        $shortSlug = $request->shot_slug;

        $hyperlink = Hyperlink::query()->where('shot_slug', $shortSlug)->first();

        if ($hyperlink) {
            $hyperlink->visits = $hyperlink->visits + 1;
            $hyperlink->last_visit = now();
            $hyperlink->save();

            return redirect($hyperlink->url);
        }

        abort(404);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hyperlink $hyperlink)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHyperlinkRequest $request, Hyperlink $hyperlink)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Hyperlink $hyperlink): JsonResponse|RedirectResponse
    {
        if ($hyperlink->user_id !== auth()->id()) {
            abort(403);
        }

        $hyperlink->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'status' => true,
                'message' => 'Link deleted successfully',
            ]);
        }

        return redirect()->back();
    }

    public function updateSlug(Request $request, Hyperlink $hyperlink): JsonResponse
    {
        if ($hyperlink->user_id !== auth()->id()) {
            abort(403);
        }

        $reserved = collect(Route::getRoutes()->getRoutes())
            ->map(fn ($route) => strtolower(explode('/', trim($route->uri(), '/'))[0]))
            ->reject(fn ($segment) => $segment === '' || str_starts_with($segment, '{'))
            ->unique()
            ->all();

        $validated = $request->validate([
            'shot_slug' => [
                'required', 'string', 'min:3', 'max:8',
                'regex:/^(?=.*[A-Za-z0-9])[A-Za-z0-9\-_.~]+$/',
                Rule::unique('hyperlinks', 'shot_slug')->ignore($hyperlink->id),
                fn ($attribute, $value, $fail) => in_array(strtolower($value), $reserved, true)
                    ? $fail('This short link is reserved.')
                    : null,
            ],
        ], [
            'shot_slug.regex' => 'Use only letters, numbers, and - _ . ~ characters.',
            'shot_slug.unique' => 'This short link is already taken.',
        ]);

        $hyperlink->shot_slug = $validated['shot_slug'];
        $hyperlink->save();

        return response()->json([
            'status' => true,
            'shot_slug' => $hyperlink->shot_slug,
            'shortened_url' => url('/' . $hyperlink->shot_slug),
        ]);
    }

    public function updateLogo(Request $request, Hyperlink $hyperlink): JsonResponse
    {
        if ($hyperlink->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'logo_id' => [
                'nullable', 'integer',
                Rule::exists('logos', 'id')->where('user_id', auth()->id()),
            ],
        ]);

        $hyperlink->logo_id = $validated['logo_id'] ?? null;
        $hyperlink->save();

        return response()->json([
            'status' => true,
            'logo_id' => $hyperlink->logo_id,
            'logo_url' => $hyperlink->logo?->url(),
        ]);
    }

    public function attachTag(Request $request, Hyperlink $hyperlink): JsonResponse
    {
        if ($hyperlink->user_id !== auth()->id()) {
            abort(403);
        }

        $name = trim((string) $request->validate(['name' => ['required', 'string', 'max:255']])['name']);

        $tag = Tag::query()->where('user_id', auth()->id())->where('name', $name)->first()
            ?? Tag::create(['user_id' => auth()->id(), 'name' => $name]);

        $hyperlink->tags()->syncWithoutDetaching([$tag->id]);

        return response()->json([
            'status' => true,
            'tag' => ['id' => $tag->id, 'name' => $tag->name, 'slug' => $tag->slug],
        ]);
    }

    public function detachTag(Hyperlink $hyperlink, Tag $tag): JsonResponse
    {
        if ($hyperlink->user_id !== auth()->id() || $tag->user_id !== auth()->id()) {
            abort(403);
        }

        $hyperlink->tags()->detach($tag->id);

        return response()->json(['status' => true]);
    }

    /**
     * @throws RandomException
     */
    public function regenerateToken(): JsonResponse
    {
        $user = auth()->user();
        $user->access_token = Methods::generateAccessToken();
        $user->save();

        return response()->json([
            'status' => true,
            'message' => 'Token regenerated successfully',
        ]);
    }
}
