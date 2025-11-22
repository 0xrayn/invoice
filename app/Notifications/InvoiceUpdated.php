<?php

namespace App\Notifications;

use Illuminate\Support\Facades\Auth;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoiceUpdated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $invoice, public $updatedBy = null)
    {
        $this->updatedBy ??= Auth::id();
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title'       => 'Invoice Updated',
            'message'     => 'Invoice #' . $this->invoice->invoice_no . ' telah diperbarui.',
            'invoice_id'  => $this->invoice->id,
            'type'        => 'invoice_updated',
            'created_by'  => $this->updatedBy,
            'url'         => route('invoices.show', $this->invoice->id),
        ];
    }
}
