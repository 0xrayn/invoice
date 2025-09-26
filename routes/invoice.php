<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\InvoiceController;
use App\Http\Middleware\CheckRole;

// ===========================
// Auth Middleware
// ===========================
Route::middleware(['auth'])->group(function () {

    // ===========================
    // Company (Admin Only)
    // ===========================
    Route::middleware(CheckRole::class . ':admin')->group(function () {
        Route::resource('companies', CompanyController::class);
    });

    // ===========================
    // Products (Admin Only)
    // ===========================
    Route::middleware(CheckRole::class . ':admin')->group(function () {
        Route::resource('products', ProductController::class);
    });

    // ===========================
    // Customers (Finance / Sales)
    // ===========================
    Route::middleware(CheckRole::class . ':finance')->group(function () {
        Route::resource('customers', CustomerController::class);
    });

    // Semua aksi lain → khusus finance
    Route::middleware(CheckRole::class . ':finance')->group(function () {
        Route::get('invoices/{invoice}/print', [InvoiceController::class, 'print'])
            ->name('invoices.print');

        Route::post('invoices/preview', [InvoiceController::class, 'preview'])
            ->name('invoices.preview');

        Route::patch('invoices/{invoice}/printed', [InvoiceController::class, 'markPrinted'])
            ->name('invoices.markPrinted');

        Route::patch('invoices/{invoice}/sent', [InvoiceController::class, 'markSent'])
            ->name('invoices.markSent');

        Route::resource('invoices', InvoiceController::class)->except(['index', 'show']);
    });

    Route::middleware(CheckRole::class . ':admin,finance')->group(function () {
        Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    });
});
