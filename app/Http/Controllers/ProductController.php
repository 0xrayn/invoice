<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Stock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Notifications\ProductCreatedNotification;
use App\Notifications\ProductLowStockNotification;
use App\Notifications\ProductUpdatedNotification;
use App\Notifications\ProductDeletedNotification;

class ProductController extends Controller
{
    public function index()
    {
        $this->authorizeAdmin();

        $products = Product::with(['prices', 'stock'])->latest()->paginate(20);

        return inertia('Products/Index', [
            'products' => $products,
        ]);
    }

    public function create()
    {
        $this->authorizeAdmin();

        return inertia('Products/Create');
    }

    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'sku'              => 'required|string|unique:products,sku',
            'name'             => 'required|string|max:255',
            'description'      => 'nullable|string',
            'pieces_per_carton' => 'required|integer|min:1',
            'prices'           => 'required|array|min:1',
            'prices.*.label'   => 'required|string',
            'prices.*.unit'    => 'required|string|in:pcs,carton',
            'prices.*.price'   => 'required|numeric|min:0',
            'prices.*.min_qty' => 'nullable|integer|min:1',
            'stock_quantity'   => 'required|integer|min:0',
        ]);

        $hasEceran = collect($validated['prices'])->contains(function ($price) {
            return $price['unit'] === 'pcs' && intval($price['min_qty']) === 1;
        });

        if (!$hasEceran) {
            return back()->withErrors([
                'prices' => 'Produk wajib punya minimal 1 harga eceran (pcs, min qty = 1).'
            ])->withInput();
        }


        $product = Product::create([
            'sku'              => $validated['sku'],
            'name'             => $validated['name'],
            'description'      => $validated['description'] ?? null,
            'pieces_per_carton' => $validated['pieces_per_carton'],
        ]);

        foreach ($validated['prices'] as $price) {
            ProductPrice::create([
                'product_id' => $product->id,
                'label'      => $price['label'],
                'unit'       => $price['unit'],
                'min_qty'    => $price['min_qty'] ?? 1,
                'price'      => $price['price'],
            ]);
        }

        Stock::create([
            'product_id'   => $product->id,
            'quantity_pcs' => $validated['stock_quantity'],
        ]);

        /** @var \App\Models\User $actor */
        $actor = Auth::user();

        // Actor sendiri
        $actor->notify(new ProductCreatedNotification($product, $actor));

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil ditambahkan');
    }

    public function edit(Product $product)
    {
        $this->authorizeAdmin();

        $product->load('prices', 'stock');

        return inertia('Products/Edit', [
            'product' => $product,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'name'              => 'required|string|max:255',
            'description'       => 'nullable|string',
            'pieces_per_carton' => 'required|integer|min:1',
            'prices'            => 'nullable|array',
            'prices.*.label'    => 'required|string',
            'prices.*.unit'     => 'required|string|in:pcs,carton',
            'prices.*.price'    => 'required|numeric|min:0',
            'prices.*.min_qty'  => 'nullable|integer|min:1',
            'stock_quantity'    => 'nullable|integer|min:0',
        ]);

        $hasEceran = collect($validated['prices'])->contains(function ($price) {
            return $price['unit'] === 'pcs' && intval($price['min_qty']) === 1;
        });

        if (!$hasEceran) {
            return back()->withErrors([
                'prices' => 'Produk wajib punya minimal 1 harga eceran (pcs, min qty = 1).'
            ])->withInput();
        }


        $product->update([
            'name'              => $validated['name'],
            'description'       => $validated['description'] ?? null,
            'pieces_per_carton' => $validated['pieces_per_carton'],
        ]);

        // Update harga
        if (!empty($validated['prices'])) {
            // Hapus harga lama
            $product->prices()->delete();

            // Tambahkan harga baru
            foreach ($validated['prices'] as $price) {
                $product->prices()->create([
                    'label'    => $price['label'],
                    'unit'     => $price['unit'],
                    'price'    => $price['price'],
                    'min_qty'  => $price['min_qty'] ?? 1,
                ]);
            }
        }

        // Update stok
        if (!empty($validated['stock_quantity'])) {
            if ($product->stock) {
                $product->stock()->update([
                    'quantity_pcs' => $validated['stock_quantity'],
                ]);
            } else {
                $product->stock()->create([
                    'quantity_pcs' => $validated['stock_quantity'],
                ]);
            }
        }
        /** @var \App\Models\User&\Illuminate\Notifications\Notifiable $actor */
        $actor = Auth::user();

        // Actor sendiri
        $actor->notify(new ProductUpdatedNotification($product, $actor));

        // Low stock
        if (!empty($validated['stock_quantity']) && $validated['stock_quantity'] < 10) {
            $actor->notify(new ProductLowStockNotification($product));
        }

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil diperbarui');
    }


    public function show(Product $product)
    {
        $this->authorizeAdmin();

        $product->load('prices', 'stock');

        return inertia('Products/Show', [
            'product' => $product,
        ]);
    }


    public function destroy(Product $product)
    {
        $this->authorizeAdmin();
        /** @var \App\Models\User&\Illuminate\Notifications\Notifiable $actor */
        $actor = Auth::user();
        $actor->notify(new ProductDeletedNotification($product, $actor));
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'Produk berhasil dihapus');
    }

    private function authorizeAdmin()
    {
        /** @var \App\Models\User $user */

        $user = Auth::user();

        if (!$user || !$user->isAdmin()) {
            abort(403, 'Hanya admin yang boleh mengelola produk.');
        }
    }
}
