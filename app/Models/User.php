<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

/**
 * App\Models\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $password
 * @property string|null $role
 * @property string|null $profile_photo
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @property-read string|null $profile_photo_url
 *
 * @method bool isAdmin()
 * @method bool isFinance()
 */
/**
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection $notifications
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection $readNotifications
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection $unreadNotifications
 */
/**
 * @mixin \Illuminate\Notifications\Notifiable
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_FINANCE = 'finance';
    public const ROLE_ADMIN   = 'admin';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'profile_photo',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // cek user role
    public function isFinance(): bool
    {
        return $this->role === self::ROLE_FINANCE;
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function getProfilePhotoUrlAttribute(): ?string
    {
        return $this->profile_photo
            ? asset('storage/' . $this->profile_photo)
            : asset('images/default-avatar.png');
    }

    protected $appends = ['profile_photo_url'];

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    // public function company()
    // {
    //     return $this->belongsTo(Company::class);
    // }

}
