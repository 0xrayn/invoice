<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Product;

class ProductCreatedNotification extends Notification
{
    use Queueable;

    protected $product;
    protected $createdBy;

    public function __construct(Product $product, $createdBy)
    {
        $this->product = $product;
        $this->createdBy = $createdBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Product Created',
            'message' => "Product '{$this->product->name}' telah dibuat.",
            'product_id' => $this->product->id,
            'type' => 'product_created',
            'created_by' => $this->createdBy->name,
            'url' => route('products.show', $this->product->id),
        ];
    }
}
