<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Auth;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoicePrintedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $invoice, public $printedBy = null)
    {
        $this->printedBy ??= Auth::id();
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title'       => 'Invoice Printed',
            'message'     => 'Invoice #' . $this->invoice->invoice_no . ' telah dicetak.',
            'invoice_id'  => $this->invoice->id,
            'type'        => 'invoice_printed',
            'created_by'  => $this->printedBy,
            'url'         => route('invoices.show', $this->invoice->id),
        ];
    }
}
