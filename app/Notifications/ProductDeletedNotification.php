<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ProductDeletedNotification extends Notification
{
    use Queueable;

    protected $productId;
    protected $productName;
    protected $deletedBy;

    public function __construct($product, $deletedBy)
    {
        $this->productId = $product->id;
        $this->productName = $product->name;
        $this->deletedBy = $deletedBy->name ?? $deletedBy;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Product Deleted',
            'message' => "Product '{$this->productName}' telah dihapus.",
            'product_id' => $this->productId,
            'type' => 'product_deleted',
            'deleted_by' => $this->deletedBy,
            'url' => route('products.index'),
        ];
    }
}
