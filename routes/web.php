<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\HyperlinkController;
use App\Support\Plans;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome', [
    'isAuthenticated' => auth()->check(),
    'user' => auth()->user() ?? null,
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'Dashboard')->name('dashboard');
    Route::inertia('/profile', 'Profile/Edit', [
        'mustVerifyEmail' => true,
        'status' => session('status'),
    ])->name('profile.edit');
    Route::inertia('/branding', 'Branding', [
        'logos' => fn () => auth()->user()->logos()->latest()->get()->map->toFrontend()->values(),
        'logoLimit' => fn () => auth()->user()->logoLimit(),
    ])->name('branding');
    Route::get('/billing', [BillingController::class, 'index'])->name('billing');
    Route::get('/billing/invoices/{transaction}/download', [BillingController::class, 'downloadInvoice'])
        ->name('billing.invoices.download');

    Route::inertia('/links', 'Links')->name('links');
    Route::get('/links/{shot_slug}', [HyperlinkController::class, 'details'])->name('links.show');
    Route::inertia('/tags', 'Tags')->name('tags');
});

require __DIR__ . '/auth.php';

Route::inertia('/documentation/api', 'ApiDocumentation')->name('documentation.api');
Route::inertia('/pricing', 'Pricing', [
    'plans' => fn () => Plans::all(),
])->name('pricing');
Route::inertia('/services/qr-code-logo', 'Services/QrCodeLogo')->name('services.qr-code-logo');
Route::inertia('/services/link-tags', 'Services/LinkTags')->name('services.link-tags');
Route::inertia('/services/custom-links', 'Services/CustomLinks')->name('services.custom-links');
Route::inertia('/privacy', 'Privacy')->name('privacy');

// this is the route that redirects the user to the original URL; this has to be the last route
Route::get('/{shot_slug}', [HyperlinkController::class, 'show'])->name('show');
