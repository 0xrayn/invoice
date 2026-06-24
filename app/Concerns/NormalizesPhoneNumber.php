<?php

namespace App\Concerns;

trait NormalizesPhoneNumber
{
    /**
     * Mutator: setiap kali $model->phone = '...' atau create/update ['phone' => '...'],
     * otomatis dirapikan ke format +62xxxxxxxxxx — apapun format inputnya
     * (0812..., 812..., 62812..., +62812..., atau ada spasi/strip/tanda kurung).
     */
    public function setPhoneAttribute($value)
    {
        $this->attributes['phone'] = $this->normalizePhoneNumber($value);
    }

    protected function normalizePhoneNumber(?string $value): ?string
    {
        if (blank($value)) {
            return $value;
        }

        $digits = preg_replace('/\D/', '', $value);

        if ($digits === '') {
            return null;
        }

        if (str_starts_with($digits, '0')) {
            // 0812xxxx -> 62812xxxx
            $digits = '62' . substr($digits, 1);
        } elseif (!str_starts_with($digits, '62')) {
            // 812xxxx -> 62812xxxx
            $digits = '62' . $digits;
        }

        return '+' . $digits;
    }
}
