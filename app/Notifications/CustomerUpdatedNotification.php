<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Customer;

class CustomerUpdatedNotification extends Notification
{
    use Queueable;

    protected $customer;
    protected $updatedBy;

    public function __construct(Customer $customer, $updatedBy)
    {
        $this->customer = $customer;
        $this->updatedBy = $updatedBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Customer Updated',
            'message' => "Customer '{$this->customer->name}' telah diupdate.",
            'customer_id' => $this->customer->id,
            'type' => 'customer_updated',
            'updated_by' => $this->updatedBy->name,
            'url' => route('customers.show', $this->customer->id),
        ];
    }
}
