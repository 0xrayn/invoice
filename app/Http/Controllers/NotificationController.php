<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use App\Models\User;

use Illuminate\Http\Request;

class NotificationController extends Controller
{

    // /**
    //  * @param Request $request
    //  * @param string $id
    //  * @return \Illuminate\Http\RedirectResponse
    //  */

    /**
     * Display a listing of notifications.
     *
     * @return \Inertia\Response|\Inertia\ResponseFactory
     */

    public function index()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $notifications = $user->notifications()->latest()->paginate(10);

        return inertia('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    public function read(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();

        if (! $notification) {
            return redirect()->route('dashboard');
        }

        $notification->markAsRead();

        $data = $notification->data;

        switch ($data['type'] ?? null) {
            case 'invoice_created':
                $invoiceExists = \App\Models\Invoice::find($data['invoice_id']);
                if ($invoiceExists) {
                    return redirect()->route('invoices.show', $data['invoice_id']);
                } else {
                    return redirect()->route('invoices.index')
                        ->with('error', 'Invoice sudah dihapus.');
                }

            case 'product_created':
                $productExists = \App\Models\Product::find($data['product_id']);
                if ($productExists) {
                    return redirect()->route('products.show', $data['product_id']);
                } else {
                    return redirect()->route('products.index')
                        ->with('error', 'Produk sudah dihapus.');
                }

            case 'customer_created':
                $customerExists = \App\Models\Customer::find($data['customer_id']);
                if ($customerExists) {
                    return redirect()->route('customers.show', $data['customer_id']);
                } else {
                    return redirect()->route('customers.index')
                        ->with('error', 'Customer sudah dihapus.');
                }

            default:
                return redirect()->route('dashboard');
        }
    }




    public function readAll(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }
}
