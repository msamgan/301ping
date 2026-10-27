<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HyperlinkController;
use App\Http\Controllers\LogoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;

Route::post('/shorten', [HyperlinkController::class, 'store'])->name('service.shorten');
Route::get('/plans', [SubscriptionController::class, 'plans'])->name('service.plans');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('service.dashboard');

    Route::controller(HyperlinkController::class)->group(function () {
        Route::get('/links', 'links')->name('service.links');
        Route::post('/regenerate-token', 'regenerateToken')->name('service.regenerate-token');
        Route::delete('/links/{hyperlink}', 'destroy')->name('links.destroy');
        Route::patch('/links/{hyperlink}/slug', 'updateSlug')->name('links.slug.update');
        Route::patch('/links/{hyperlink}/logo', 'updateLogo')->name('links.logo.update');
        Route::post('/links/{hyperlink}/tags', 'attachTag')->name('links.tags.attach');
        Route::delete('/links/{hyperlink}/tags/{tag:slug}', 'detachTag')->name('links.tags.detach');
    });

    Route::controller(ProfileController::class)->group(function () {
        Route::patch('/profile', 'update')->name('profile.update');
        Route::delete('/profile', 'destroy')->name('profile.destroy');
    });

    Route::controller(LogoController::class)->group(function () {
        Route::post('/profile/logos', 'store')->name('logos.store');
        Route::delete('/profile/logos/{logo}', 'destroy')->name('logos.destroy');
    });

    Route::controller(SubscriptionController::class)->group(function () {
        Route::get('/subscription/status', 'status')->name('subscription.status');
        Route::post('/subscription/checkout', 'checkout')->name('subscription.checkout');
        Route::post('/subscription/swap', 'swap')->name('subscription.swap');
        Route::post('/subscription/cancel', 'cancel')->name('subscription.cancel');
        Route::post('/subscription/resume', 'resume')->name('subscription.resume');
        Route::get('/subscription/payment-method', 'paymentMethod')->name('subscription.payment-method');
    });

    Route::controller(TagController::class)->group(function () {
        Route::get('/tags', 'tags')->name('service.tags');
        Route::post('/tags', 'store')->name('service.tags.store');
        Route::get('/tags/{tag}', 'show')->name('service.tags.show');
        Route::patch('/tags/{tag}', 'update')->name('service.tags.update');
        Route::delete('/tags/{tag}', 'destroy')->name('service.tags.destroy');
    });
});
