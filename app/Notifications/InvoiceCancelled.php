<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Auth;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoiceCancelled extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $invoice, public $cancelledBy = null)
    {
        $this->cancelledBy ??= Auth::id();
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title'       => 'Invoice Cancelled',
            'message'     => 'Invoice #' . $this->invoice->invoice_no . ' telah dibatalkan.',
            'invoice_id'  => $this->invoice->id,
            'type'        => 'invoice_cancelled',
            'created_by'  => $this->cancelledBy,
            'url'         => route('invoices.index'),
        ];
    }
}
