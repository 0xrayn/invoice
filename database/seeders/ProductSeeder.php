<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        Stock::truncate();
        ProductPrice::truncate();
        Product::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $products = [
            [
                'sku'               => 'RRK-001',
                'name'              => 'Rokok Filter Premium',
                'description'       => 'Rokok filter dengan tembakau pilihan kelas premium, rasa smooth dan ringan.',
                'pieces_per_carton' => 10,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 25000,
                'harga_grosir'      => 22000,
                'min_grosir'        => 10,
                'stok_pcs'          => 200,
            ],
            [
                'sku'               => 'RRK-002',
                'name'              => 'Rokok Kretek Nusantara',
                'description'       => 'Rokok kretek cengkeh asli Nusantara, aroma khas dan tahan lama.',
                'pieces_per_carton' => 12,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 22000,
                'harga_grosir'      => 18500,
                'min_grosir'        => 12,
                'stok_pcs'          => 144,
            ],
            [
                'sku'               => 'RRK-003',
                'name'              => 'Rokok Mild Silver',
                'description'       => 'Rokok mild dengan kandungan tar rendah, cocok untuk perokok modern.',
                'pieces_per_carton' => 10,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 28000,
                'harga_grosir'      => 24500,
                'min_grosir'        => 10,
                'stok_pcs'          => 180,
            ],
            [
                'sku'               => 'RRK-004',
                'name'              => 'Rokok Menthol Fresh',
                'description'       => 'Rokok menthol dengan sensasi dingin segar, produksi terbatas.',
                'pieces_per_carton' => 10,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 27000,
                'harga_grosir'      => 23000,
                'min_grosir'        => 10,
                'stok_pcs'          => 150,
            ],
            [
                'sku'               => 'RRK-005',
                'name'              => 'Rokok Kretek Strong',
                'description'       => 'Rokok kretek full flavor dengan cita rasa kuat dan bold.',
                'pieces_per_carton' => 12,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 20000,
                'harga_grosir'      => 17000,
                'min_grosir'        => 12,
                'stok_pcs'          => 120,
            ],
            [
                'sku'               => 'RRK-006',
                'name'              => 'Rokok Slim Elegance',
                'description'       => 'Rokok slim format ramping dengan filter panjang, elegan dan ringan.',
                'pieces_per_carton' => 10,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 30000,
                'harga_grosir'      => 26000,
                'min_grosir'        => 10,
                'stok_pcs'          => 100,
            ],
            [
                'sku'               => 'RRK-007',
                'name'              => 'Rokok Clove Special',
                'description'       => 'Kretek spesial dengan tambahan cengkeh pilihan, aroma khas Jawa.',
                'pieces_per_carton' => 12,
                'unit_default'      => 'pcs',
                'harga_eceran'      => 23000,
                'harga_grosir'      => 19500,
                'min_grosir'        => 12,
                'stok_pcs'          => 96,
            ],
        ];

        foreach ($products as $data) {
            $product = Product::create([
                'sku'               => $data['sku'],
                'name'              => $data['name'],
                'description'       => $data['description'],
                'pieces_per_carton' => $data['pieces_per_carton'],
                'unit_default'      => $data['unit_default'],
            ]);

            ProductPrice::create([
                'product_id' => $product->id,
                'label'      => 'Eceran',
                'unit'       => 'pcs',
                'price'      => $data['harga_eceran'],
                'min_qty'    => 1,
            ]);

            ProductPrice::create([
                'product_id' => $product->id,
                'label'      => 'Grosir',
                'unit'       => 'pcs',
                'price'      => $data['harga_grosir'],
                'min_qty'    => $data['min_grosir'],
            ]);

            Stock::create([
                'product_id'   => $product->id,
                'quantity_pcs' => $data['stok_pcs'],
            ]);
        }
    }
}
