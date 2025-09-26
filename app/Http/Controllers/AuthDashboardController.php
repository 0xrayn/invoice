<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class AuthDashboardController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $adminStats = [];
        $salesStats = [];

        // Ambil awal dan akhir hari ini untuk perhitungan yang akurat
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd   = Carbon::today()->endOfDay();

        if ($user->isAdmin()) {
            $adminStats = [
                'total_sales'     => Invoice::whereMonth('invoice_date', now()->month)
                    ->whereYear('invoice_date', now()->year)
                    ->sum('grand_total'),

                'invoices_count'  => Invoice::whereMonth('invoice_date', now()->month)
                    ->whereYear('invoice_date', now()->year)
                    ->count(),

                'customers_count' => Customer::count(),
                'products_count'  => Product::count(),
                'low_stock'       => Stock::where('quantity_pcs', '<', 10)->count(),
                'draft_invoices'  => (int) Invoice::where('status', 'draft')->count(),
            ];
        }

        if ($user->isFinance() || $user->role === 'sales') {
            $salesStats = [
                'my_invoices_today' => Invoice::whereBetween('invoice_date', [$todayStart, $todayEnd])->count(),
                'my_total_sales'    => Invoice::whereMonth('invoice_date', now()->month)->sum('grand_total'),
                'customers_count'   => Customer::count(),
                'sales_draft_invoices' => (int) Invoice::where('status', 'draft')->count(),
            ];
        }

        $recentInvoices = Invoice::with('customer')
            ->latest()
            ->take(5)
            ->get(['id', 'invoice_no', 'customer_id', 'status', 'grand_total']);

        $salesPerMonth = Invoice::select(
            DB::raw('DATE_FORMAT(invoice_date, "%b") as month'),
            DB::raw('SUM(grand_total) as total')
        )
            ->whereYear('invoice_date', now()->year)
            ->groupBy('month')
            ->orderByRaw('MIN(invoice_date)')
            ->get();

        return Inertia::render('dashboard', [
            'auth'           => ['user' => $user],
            'adminStats'     => $adminStats,
            'salesStats'     => $salesStats,
            'recentInvoices' => $recentInvoices,
            'salesChart'     => $salesPerMonth,
        ]);
    }
}
