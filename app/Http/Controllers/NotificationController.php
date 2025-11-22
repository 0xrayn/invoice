<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use App\Models\User;

use Illuminate\Http\Request;

class NotificationController extends Controller
{

    /**
     * @param Request $request
     * @param string $id
     * @return \Illuminate\Http\RedirectResponse
     */
    // public function read(Request $request, $id)
    // {
    //     /** @var User $user */
    //     $user = $request->user();

    //     $notification = $user->notifications()->where('id', $id)->first();
    //     dd($notification->data);

    //     if ($notification) {
    //         $notification->markAsRead();

    //         // ambil URL dari notifikasi (sudah kita simpan di InvoiceCreated)
    //         $url = $notification->data['url'] ?? route('dashboard');

    //         return redirect($url);
    //     }

    //     return redirect()->route('dashboard');
    // }

    public function read(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            return redirect($notification->data['url'] ?? route('dashboard'));
        }

        return redirect()->route('dashboard');
    }



    public function readAll(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return back();
    }
}
