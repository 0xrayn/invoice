<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailChanged extends Notification
{
    public function __construct(public $newEmail) {}

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Email Changed',
            'message' => 'Your email is now: ' . $this->newEmail,
            'type' => 'email_changed',
        ];
    }
}
