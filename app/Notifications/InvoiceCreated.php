<?php

namespace App\Notifications;
use Illuminate\Support\Facades\Auth;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;

class InvoiceCreated extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public $invoice, public $createdBy = null)
    {
        $this->createdBy ??= Auth::id();
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Invoice Created',
            'message' => 'Invoice #' . $this->invoice->invoice_no . ' has been created.',
            'invoice_id' => $this->invoice->id,
            'type' => 'invoice_created',
            'created_by' => $this->createdBy, // pakai properti yang sudah diset
            'url' => route('invoices.show', $this->invoice->id), // untuk klik notifikasi
        ];
    }
}
