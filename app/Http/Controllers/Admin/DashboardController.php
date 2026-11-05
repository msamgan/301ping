<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Analytic;
use App\Models\Hyperlink;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $since = now()->subDays(29)->startOfDay();
        $redirectsPerDay = Analytic::query()
            ->where('created_at', '>=', $since)
            ->selectRaw('date(created_at) as day, count(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => User::count(),
                'verifiedUsers' => User::whereNotNull('email_verified_at')->count(),
                'newUsers7Days' => User::where('created_at', '>=', now()->subDays(7))->count(),
                'links' => Hyperlink::count(),
                'visits' => (int) Hyperlink::sum('visits'),
            ],
            'redirectsDaily' => collect(range(0, 29))->map(function ($day) use ($since, $redirectsPerDay) {
                $date = $since->copy()->addDays($day)->toDateString();

                return ['date' => $date, 'total' => (int) ($redirectsPerDay[$date] ?? 0)];
            })->values(),
            'recentUsers' => User::latest()->limit(5)->get(['id', 'name', 'email', 'created_at']),
        ]);
    }
}
