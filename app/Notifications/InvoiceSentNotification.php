<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Auth;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoiceSentNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $invoice, public $sentBy = null)
    {
        $this->sentBy ??= Auth::id();
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title'       => 'Invoice Sent',
            'message'     => 'Invoice #' . $this->invoice->invoice_no . ' telah dikirim.',
            'invoice_id'  => $this->invoice->id,
            'type'        => 'invoice_sent',
            'created_by'  => $this->sentBy,
            'url'         => route('invoices.show', $this->invoice->id),
        ];
    }
}
