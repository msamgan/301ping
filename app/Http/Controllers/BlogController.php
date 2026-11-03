<?php

namespace App\Http\Controllers;

use App\Services\BlogService;
use Illuminate\Support\Arr;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function __construct(private readonly BlogService $blog) {}

    public function index(): Response
    {
        return Inertia::render('Blog/Index', [
            'posts' => $this->blog->all()
                ->map(fn (array $post) => Arr::except($post, ['file', 'timestamp', 'draft']))
                ->all(),
        ]);
    }

    public function show(string $slug): Response
    {
        $post = $this->blog->find($slug);

        abort_if($post === null, 404);

        return Inertia::render('Blog/Show', [
            'post' => Arr::except($post, ['file', 'timestamp', 'draft']),
        ]);
    }
}
