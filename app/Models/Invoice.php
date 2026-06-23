<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'company_id',
        'user_id',
        'customer_id',
        'invoice_no',
        'ref_no',
        'invoice_date',
        'due_date',
        'currency',
        'subtotal',
        'discount_total',
        'extra_discount',
        'shipping_cost',
        'tax_total',
        'keterangan',
        'terms',
        'grand_total',
        'custom_labels',
        'signature_path',
        'status',
        'pdf_path', // ✅ Fix: pdf_path tersimpan ke DB
    ];

    protected $casts = [
        'custom_labels' => 'array',
        'invoice_date' => 'date',
        'due_date' => 'date',
    ];


    protected $appends = ['signature_url'];

    // public function getSignatureUrlAttribute()
    // {
    //     if (!$this->signature_path) {
    //         return null;
    //     }
    //     return asset('storage/' . $this->signature_path);
    // }

    public function getSignatureUrlAttribute()
    {
        return $this->signature_path
            ? Storage::url($this->signature_path)
            : null;
    }




    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
