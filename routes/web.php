<?php

use App\Http\Controllers\AuthDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
})->name('home');

Route::get('/about-us', function () {
    return Inertia::render('landingpage/about-us');
})->name('about-us');

Route::get('/cara-kerja', function () {
    return Inertia::render('landingpage/cara-kerja');
})->name('cara-kerja');

Route::prefix('produk')->group(function () {
    Route::get('/', function () {
        return Inertia::render('landingpage/produk/produk');
    })->name('landing-produk');

    Route::get('/invoice-penjualan', function () {
        return Inertia::render('landingpage/produk/invoice-penjualan');
    })->name('invoice-penjualan');

    Route::get('/kirim-invoice', function () {
        return Inertia::render('landingpage/produk/kirim-invoice');
    })->name('kirim-invoice');
});

Route::prefix('faq')->group(function () {
    Route::get('/', function () {
        return Inertia::render('landingpage/faq/syarat-ketentuan');
    })->name('syarat-ketentuan');

    Route::get('/kebijakan-privasi', function () {
        return Inertia::render('landingpage/faq/kebijakan-privasi');
    })->name('kebijakan-privasi');

    Route::get('/sitemap', function () {
        return Inertia::render('landingpage/faq/sitemap');
    })->name('sitemap');
});


Route::get('/central', function () {
    return Inertia::render('central');
})->name('central');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [AuthDashboardController::class, 'index'])
        ->name('dashboard');
    Route::get('help', function () {
        return Inertia::render('Help/Index');
    })->name('help');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/invoice.php';
