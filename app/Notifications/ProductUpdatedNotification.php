<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use App\Models\Product;

class ProductUpdatedNotification extends Notification
{
    use Queueable;

    protected $product;
    protected $updatedBy;

    public function __construct(Product $product, $updatedBy)
    {
        $this->product = $product;
        $this->updatedBy = $updatedBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Product Updated',
            'message' => "Product '{$this->product->name}' telah diupdate.",
            'product_id' => $this->product->id,
            'type' => 'product_updated',
            'updated_by' => $this->updatedBy->name,
            'url' => route('products.show', $this->product->id),
        ];
    }
}
