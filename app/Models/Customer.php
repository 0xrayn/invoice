<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'province',
        'postal_code',
        'country',
        'phone',
        'email',
    ];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
