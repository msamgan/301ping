<?php

namespace App\Http\Controllers;

use App\Models\Hyperlink;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Welcome', [
            'activeLinkCount' => Hyperlink::query()->count() + 10000,
        ]);
    }
}
