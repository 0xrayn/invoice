<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Customer::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $customers = [
            [
                'name'        => 'CV Maju Bersama',
                'address'     => 'Jl. Pahlawan No. 12',
                'city'        => 'Surabaya',
                'province'    => 'Jawa Timur',
                'postal_code' => '60111',
                'country'     => 'Indonesia',
                'phone'       => '081234567890',
                'email'       => 'majubersama@gmail.com',
            ],
            [
                'name'        => 'Toko Sumber Rezeki',
                'address'     => 'Jl. Veteran No. 45',
                'city'        => 'Malang',
                'province'    => 'Jawa Timur',
                'postal_code' => '65112',
                'country'     => 'Indonesia',
                'phone'       => '082345678901',
                'email'       => 'sumberrezeki@yahoo.com',
            ],
            [
                'name'        => 'UD Jaya Abadi',
                'address'     => 'Jl. Diponegoro No. 7',
                'city'        => 'Sidoarjo',
                'province'    => 'Jawa Timur',
                'postal_code' => '61218',
                'country'     => 'Indonesia',
                'phone'       => '083456789012',
                'email'       => 'jayaabadi@gmail.com',
            ],
            [
                'name'        => 'PT Berkah Niaga Mandiri',
                'address'     => 'Jl. Ahmad Yani No. 100, Ruko Blok C',
                'city'        => 'Gresik',
                'province'    => 'Jawa Timur',
                'postal_code' => '61122',
                'country'     => 'Indonesia',
                'phone'       => '085678901234',
                'email'       => 'berkahniaga@gmail.com',
            ],
            [
                'name'        => 'Toko Barokah Jaya',
                'address'     => 'Jl. Raya Porong No. 22',
                'city'        => 'Pasuruan',
                'province'    => 'Jawa Timur',
                'postal_code' => '67151',
                'country'     => 'Indonesia',
                'phone'       => '087890123456',
                'email'       => 'barokahjaya@gmail.com',
            ],
            [
                'name'        => 'CV Sejahtera Mandiri',
                'address'     => 'Jl. Raya Mojokerto No. 55',
                'city'        => 'Mojokerto',
                'province'    => 'Jawa Timur',
                'postal_code' => '61321',
                'country'     => 'Indonesia',
                'phone'       => '081398765432',
                'email'       => 'sejahteramandiri@gmail.com',
            ],
            [
                'name'        => 'UD Harapan Bangsa',
                'address'     => 'Jl. Kenjeran No. 78',
                'city'        => 'Surabaya',
                'province'    => 'Jawa Timur',
                'postal_code' => '60133',
                'country'     => 'Indonesia',
                'phone'       => '082298765432',
                'email'       => 'harapanbangsa@gmail.com',
            ],
            [
                'name'        => 'Toko Makmur Sentosa',
                'address'     => 'Jl. Raya Waru No. 9',
                'city'        => 'Sidoarjo',
                'province'    => 'Jawa Timur',
                'postal_code' => '61256',
                'country'     => 'Indonesia',
                'phone'       => '083398765432',
                'email'       => 'makmursentosa@gmail.com',
            ],
        ];

        foreach ($customers as $c) {
            Customer::create($c);
        }
    }
}
