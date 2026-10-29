<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HyperlinkController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SitemapController;
use App\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('/dashboard', 'Dashboard')->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/branding', [LogoController::class, 'index'])->name('branding');
    Route::get('/billing', [BillingController::class, 'index'])->name('billing');
    Route::get('/billing/invoices/{transaction}/download', [BillingController::class, 'downloadInvoice'])
        ->name('billing.invoices.download');

    Route::inertia('/links', 'Links')->name('links');
    Route::get('/links/{shot_slug}', [HyperlinkController::class, 'details'])->name('links.show');
    Route::inertia('/tags', 'Tags')->name('tags');
});

require __DIR__ . '/auth.php';

Route::inertia('/documentation/api', 'ApiDocumentation')->name('documentation.api');
Route::get('/pricing', [SubscriptionController::class, 'pricing'])->name('pricing');
Route::post('/contact', [ContactController::class, 'store'])->middleware('throttle:5,1')->name('contact.store');
Route::inertia('/services/qr-code-logo', 'Services/QrCodeLogo')->name('services.qr-code-logo');
Route::inertia('/services/link-tags', 'Services/LinkTags')->name('services.link-tags');
Route::inertia('/services/custom-links', 'Services/CustomLinks')->name('services.custom-links');
Route::inertia('/services/broken-destinations', 'Services/BrokenDestinations')->name('services.broken-destinations');
Route::inertia('/services/edit-destination', 'Services/EditDestination')->name('services.edit-destination');
Route::inertia('/privacy', 'Privacy')->name('privacy');
Route::inertia('/terms', 'Terms')->name('terms');
Route::inertia('/refund-policy', 'RefundPolicy')->name('refund-policy');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

// this is the route that redirects the user to the original URL; this has to be the last route
Route::get('/{shot_slug}', [HyperlinkController::class, 'show'])->name('show');
