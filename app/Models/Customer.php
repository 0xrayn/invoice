<?php

namespace App\Models;

use App\Concerns\NormalizesPhoneNumber;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use NormalizesPhoneNumber;

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
