<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CustomerDeletedNotification extends Notification
{
    use Queueable;

    protected $customerId;
    protected $customerName;
    protected $deletedBy;

    public function __construct($customer, $deletedBy)
    {
        // Simpan data penting saja, bukan instance model
        $this->customerId = $customer->id;
        $this->customerName = $customer->name;
        $this->deletedBy = $deletedBy->name ?? $deletedBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Customer Deleted',
            'message' => "Customer '{$this->customerName}' telah dihapus.",
            'customer_id' => $this->customerId,
            'type' => 'customer_deleted',
            'deleted_by' => $this->deletedBy,
            // URL arahkan ke index / list, supaya tidak 404
            'url' => route('customers.index'),
        ];
    }
}
