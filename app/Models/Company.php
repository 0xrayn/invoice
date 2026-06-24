<?php

namespace App\Models;

use App\Concerns\NormalizesPhoneNumber;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;

class Company extends Model
{
    use HasFactory;
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
        'logo_path',
    ];


    protected $appends = ['logo_url'];

    public function getLogoUrlAttribute()
    {
        return $this->logo_path
            ? Storage::url($this->logo_path)
            : null;
    }

    // public function users()
    // {
    //     return $this->hasMany(User::class);
    // }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function customers()
    {
        return $this->hasMany(Customer::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
