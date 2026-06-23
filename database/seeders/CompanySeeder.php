<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use Illuminate\Support\Facades\DB;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Company::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        Company::create([
            'name'        => 'PT Mata Timur Nusantara',
            'address'     => 'Jl. Raya Industri No. 88, Kawasan Industri Surabaya Timur',
            'city'        => 'Surabaya',
            'province'    => 'Jawa Timur',
            'postal_code' => '60293',
            'country'     => 'Indonesia',
            'phone'       => '031-8765432',
            'email'       => 'info@matatimur.co.id',
            'logo_path'   => null,
        ]);
    }
}
