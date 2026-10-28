<?php

namespace App\Http\Controllers;

use App\Models\Hyperlink;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return response()->json($this->payload());
    }

    public function token(): JsonResponse
    {
        return response()->json(['token' => auth()->user()->access_token]);
    }

    private function payload(): array
    {
        return [
            'linkCount' => Hyperlink::query()->where('user_id', auth()->id())->count(),
            'visits' => Hyperlink::query()->where('user_id', auth()->id())->sum('visits'),
        ];
    }
}
