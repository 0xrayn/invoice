<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Stock;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Company;
use App\Models\User;

class DataProduk extends Seeder
{
    public function run(): void
    {
        // =========================
        // 0. COMPANY (WAJIB ADA)
        // =========================
        $company = Company::first();

        if (!$company) {
            $company = Company::create([
                'name' => 'PT Mata Timur Nusantara',
                'address' => 'Surabaya',
            ]);
        }

        // =========================
        // 0. USER (AMBIL YANG SUDAH ADA)
        // =========================
        $user = User::first();

        // =========================
        // 1. PRODUCTS
        // =========================
        $products = [
            ['sku' => 'RRK001', 'name' => 'Rokok Filter Premium', 'pieces_per_carton' => 10],
            ['sku' => 'RRK002', 'name' => 'Rokok Kretek Nusantara', 'pieces_per_carton' => 12],
            ['sku' => 'RRK003', 'name' => 'Rokok Mild Silver', 'pieces_per_carton' => 10],
            ['sku' => 'RRK004', 'name' => 'Rokok Menthol Fresh', 'pieces_per_carton' => 10],
            ['sku' => 'RRK005', 'name' => 'Rokok Kretek Strong', 'pieces_per_carton' => 12],
        ];

        foreach ($products as $p) {
            Product::create([
                'sku' => $p['sku'],
                'name' => $p['name'],
                'description' => fake()->sentence(),
                'pieces_per_carton' => $p['pieces_per_carton'],
                'unit_default' => 'pcs'
            ]);
        }

        // =========================
        // 2. PRODUCT PRICES
        // =========================
        foreach (Product::all() as $product) {

            ProductPrice::create([
                'product_id' => $product->id,
                'label' => 'Eceran',
                'unit' => 'pcs',
                'price' => rand(12000, 20000),
                'min_qty' => 1
            ]);

            ProductPrice::create([
                'product_id' => $product->id,
                'label' => 'Grosir',
                'unit' => 'pcs',
                'price' => rand(9000, 15000),
                'min_qty' => 10
            ]);
        }

        // =========================
        // 3. STOCK
        // =========================
        foreach (Product::all() as $product) {
            $carton = rand(1, 5);
            $pcs = rand(0, 5);

            $total = ($carton * $product->pieces_per_carton) + $pcs;

            Stock::create([
                'product_id' => $product->id,
                'quantity_pcs' => $total
            ]);
        }

        // =========================
        // 4. CUSTOMERS (NO FACTORY)
        // =========================
        for ($i = 1; $i <= 5; $i++) {
            Customer::create([
                'name' => fake()->name(),
                'address' => fake()->address(),
                'city' => fake()->city(),
                'province' => fake()->state(),
                'postal_code' => fake()->postcode(),
                'country' => 'Indonesia',
                'phone' => fake()->phoneNumber(),
                'email' => fake()->safeEmail(),
            ]);
        }

        // =========================
        // 5. INVOICES (DRAFT)
        // =========================
        foreach (range(1, 5) as $i) {

            $invoice = Invoice::create([
                'company_id' => $company->id,
                'user_id' => $user->id,
                'customer_id' => Customer::inRandomOrder()->first()->id,
                'invoice_no' => 'INV-' . now()->format('Ymd') . '-' . $i,
                'invoice_date' => now(),
                'due_date' => now()->addDays(7),
                'status' => 'draft'
            ]);

            $subtotal = 0;

            foreach (range(1, rand(1,3)) as $j) {
                $product = Product::inRandomOrder()->first();
                $price = ProductPrice::where('product_id', $product->id)->inRandomOrder()->first();

                $qty = rand(1, 10);
                $total = $qty * $price->price;

                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $product->id,
                    'price_id' => $price->id,
                    'quantity' => $qty,
                    'unit' => $price->unit,
                    'price' => $price->price,
                    'total' => $total,
                ]);

                $subtotal += $total;
            }

            $invoice->update([
                'subtotal' => $subtotal,
                'grand_total' => $subtotal
            ]);
        }
    }
}