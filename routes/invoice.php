<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\InvoiceController;
use App\Http\Middleware\CheckRole;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\NotificationController;

// ===========================
// Auth Middleware
// ===========================
Route::middleware(['auth'])->group(function () {

    // ===========================
    // Company (Admin Only)
    // ===========================
    Route::middleware(CheckRole::class . ':admin')->group(function () {
        Route::resource('companies', CompanyController::class);
        Route::resource('products', ProductController::class);
    });

    // ===========================
    // Customers (Finance Only)
    // ===========================
    Route::middleware(CheckRole::class . ':finance')->group(function () {
        Route::resource('customers', CustomerController::class);
    });

    // ===========================
    // Admin & Finance: lihat daftar & detail, cetak/kirim
    // ===========================

    // ===========================
    // Finance Only: create, edit, delete, preview
    // ===========================
    Route::middleware(CheckRole::class . ':finance')->group(function () {
        Route::post('invoices/preview', [InvoiceController::class, 'preview'])->name('invoices.preview');

        // finance routes
        Route::get('invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');

        Route::get('invoices/{invoice}/edit', [InvoiceController::class, 'edit'])->name('invoices.edit');
        Route::patch('invoices/{invoice}', [InvoiceController::class, 'update'])->name('invoices.update');
        Route::delete('invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
    });

    Route::prefix('invoices')->name('invoices.')->middleware(CheckRole::class . ':admin,finance')->group(function () {
        Route::get('/', [InvoiceController::class, 'index'])->name('index');

        // static routes BEFORE {invoice}
        Route::get('{invoice}/print', [InvoiceController::class, 'print'])->name('print');
        Route::patch('{invoice}/printed', [InvoiceController::class, 'markPrinted'])->name('markPrinted');
        Route::patch('{invoice}/sent', [InvoiceController::class, 'markSent'])->name('markSent');

        // route show (parameter) di akhir
        Route::get('{invoice}', [InvoiceController::class, 'show'])->name('show');
    });

    // Route::get('/notifications', function () {
    //     /** @var \App\Models\User $user */
    //     $user = Auth::user();

    //     return Inertia::render('Notifications/Index', [
    //         'notifications' => $user->notifications()->latest()->get(),
    //     ]);
    // })->name('notifications.index');

    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');


    Route::get('/notifications/read/{id}', [NotificationController::class, 'read'])
        ->name('notifications.read');

    Route::post('/notifications/read-all', [NotificationController::class, 'readAll'])
        ->name('notifications.readAll');
});
