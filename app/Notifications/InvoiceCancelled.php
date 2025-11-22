<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Auth;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Invoice;

class InvoiceCancelled extends Notification
{
    use Queueable;

    public $invoiceId;
    public $cancelledBy;

    public function __construct($invoice, $cancelledBy = null)
    {
        $this->invoiceId = is_array($invoice) ? $invoice['id'] : $invoice->id;
        $this->cancelledBy = $cancelledBy ?? Auth::id();
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        $invoice = Invoice::find($this->invoiceId);

        return [
            'title'       => 'Invoice Cancelled',
            'message'     => 'Invoice #' . ($invoice->invoice_no ?? '-') . ' telah dibatalkan.',
            'invoice_id'  => $this->invoiceId,
            'type'        => 'invoice_cancelled',
            'created_by'  => $this->cancelledBy,
            'url'         => route('invoices.index'),
        ];
    }
}
