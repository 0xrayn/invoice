<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'resend' => [
        'key' => env('RESEND_KEY'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'n8n' => [
        // URL webhook n8n yang menerima trigger "invoice sent" (kirim PDF ke WA/Email)
        'invoice_webhook_url' => env('N8N_INVOICE_WEBHOOK_URL', 'http://localhost:5678/webhook/send-invoice'),

        // Base URL Laravel SEPERTI YANG DILIHAT n8n, bukan seperti yang dilihat browser kamu.
        // Kalau n8n jalan langsung di host (npx n8n) -> samakan dengan APP_URL (http://localhost:8000)
        // Kalau n8n jalan di Docker (docker-compose)  -> WAJIB http://host.docker.internal:8000
        'laravel_base_url' => env('N8N_LARAVEL_BASE_URL', env('APP_URL', 'http://localhost:8000')),
    ],

];
