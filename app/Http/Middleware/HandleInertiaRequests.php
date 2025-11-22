<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),

            'name' => config('app.name'),
            'quote' => [
                'message' => trim($message),
                'author' => trim($author)
            ],

            // ==============================
            // FIX: kirim model user langsung
            // supaya relasi, accessor, dll hidup
            // ==============================
            'auth' => [
                'user' => $request->user(),

                // Notifikasi terakhir
                'notifications' => fn() =>
                    $request->user()
                        ? $request->user()->notifications()->latest()->take(10)->get()
                        : [],

                // Unread count
                'unread_count' => fn() =>
                    $request->user()
                        ? $request->user()->unreadNotifications()->count()
                        : 0,
            ],

            // Ziggy routes
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
