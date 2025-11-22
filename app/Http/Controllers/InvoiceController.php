<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\User;
use App\Notifications\InvoiceCreated;
use App\Notifications\InvoiceUpdated;
use App\Notifications\InvoicePrintedNotification;
use App\Notifications\InvoiceSentNotification;
use App\Notifications\InvoiceCancelled;
use App\Models\InvoiceItem;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Customer;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InvoiceController extends Controller
{
    public function index()
    {
        /** @var \App\Models\User $user */

        $user = Auth::user();

        if ($user->isFinance()) {
            $invoices = Invoice::with('customer', 'user', 'company')
                ->where('user_id', $user->id)
                ->latest()
                ->paginate(15);
        } elseif ($user->isAdmin()) {
            $invoices = Invoice::with('customer', 'user', 'company')
                ->latest()
                ->paginate(15);
        } else {
            abort(403, 'Anda tidak punya akses ke Invoice.');
        }

        return inertia('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create()
    {
        $this->authorizeFinance();

        return inertia('Invoices/Create', [
            'company'   => Company::first(),
            'customers' => Customer::all(),
            'products'  => Product::with('prices', 'stock')->get(),
        ]);
    }

    public function preview(Request $request)
    {
        $this->authorizeFinance();

        return response()->json([
            'success' => true,
            'preview' => $request->all(),
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeFinance();

        $validated = $this->validateInvoice($request);

        // ✅ Simpan file tanda tangan ke storage/public/signatures
        if ($request->hasFile('signature_path')) {
            $validated['signature_path'] = $request->file('signature_path')
                ->store('signatures', 'public');
        }

        return DB::transaction(function () use ($validated) {
            $invoice = $this->saveInvoiceData($validated);

            // kurangi stok hanya kalau status printed/sent
            if (in_array($invoice->status, ['printed', 'sent'])) {
                $this->adjustStockOnStatus($invoice);
            }

            /** @var \App\Models\User $creator */
            $creator = Auth::user();

            $admins = User::where('role', 'admin')->get();

            $creator->notify(new InvoiceCreated($invoice));

            foreach ($admins as $admin) {
                $admin->notify(new InvoiceCreated($invoice));
            }

            return redirect()->route('invoices.show', $invoice->id)
                ->with('success', 'Invoice berhasil dibuat!');
        });
    }


    public function show(Invoice $invoice)
    {
        $invoice->load('items.product', 'customer', 'user', 'company',);

        return inertia('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $this->authorizeFinance();

        return inertia('Invoices/Edit', [
            'invoice'   => $invoice->load('items.product'),
            'company'   => Company::first(),
            'customers' => Customer::all(),
            'products' => Product::with('prices', 'stock')->get(),
        ]);
    }


    public function update(Request $request, Invoice $invoice)
    {
        $this->authorizeFinance();

        // 🚫 Tidak boleh edit kalau sudah printed atau sent
        if (in_array($invoice->status, ['printed', 'sent'])) {
            return back()->with('error', "Invoice {$invoice->invoice_no} tidak bisa diubah karena sudah {$invoice->status}!");
        }

        // 🛠 decode dulu kalau items masih string
        if ($request->has('items') && is_string($request->items)) {
            $request->merge([
                'items' => json_decode($request->items, true)
            ]);
        }

        $validated = $this->validateInvoice($request, $invoice->id);

        if ($request->hasFile('signature_path')) {
            $validated['signature_path'] = $request->file('signature_path')
                ->store('signatures', 'public');
        } else {
            $validated['signature_path'] = $invoice->signature_path;
        }

        return DB::transaction(function () use ($validated, $invoice) {
            $this->updateInvoiceData($invoice, $validated);

            /** @var \App\Models\User $creator */
            $creator  = Auth::user();
            $admins = User::where('role', 'admin')->get();

            $creator->notify(new InvoiceUpdated($invoice));

            foreach ($admins as $admin) {
                $admin->notify(new InvoiceUpdated($invoice));
            }

            return redirect()
                ->route('invoices.show', $invoice->id)
                ->with('success', 'Invoice berhasil diperbarui!');
        });
    }


    public function destroy(Invoice $invoice)
    {
        if (in_array($invoice->status, ['printed', 'sent'])) {
            return redirect()
                ->back()
                ->with('error', 'Invoice dengan status Printed/Sent tidak bisa dihapus.');
        }

        $data = [
            'id'       => $invoice->id,
            'number'   => $invoice->invoice_no,    // FIX: pakai invoice_no yang benar
            'customer' => $invoice->customer->name,
            'amount'   => $invoice->grand_total,   // FIX: sesuai schema
            'url'      => route('invoices.index'),
        ];

        /** @var \App\Models\User $creator */
        $creator = Auth::user();
        $admins  = User::where('role', 'admin')->get();

        $creator->notify(new InvoiceCancelled($data));

        foreach ($admins as $admin) {
            $admin->notify(new InvoiceCancelled($data));
        }

        $invoice->delete();

        return redirect()
            ->route('invoices.index')
            ->with('success', 'Invoice berhasil dihapus.');
    }



    public function print(Invoice $invoice)
    {
        $invoice->load('items.product', 'customer', 'user', 'company');

        return inertia('Invoices/Print', [
            'invoice' => $invoice,
        ]);
    }

    private function adjustStockOnStatus(Invoice $invoice)
    {
        foreach ($invoice->items as $item) {
            if (!empty($item->product_id)) {
                $product = $item->product;
                if ($product && $product->stock) {
                    // quantity disimpan sesuai input frontend (pcs)
                    $decrementQty = max(0, (int) round($item->quantity));
                    if ($decrementQty > 0) {
                        $product->stock()->decrement('quantity_pcs', $decrementQty);
                    }
                }
            }
        }
    }


    private function authorizeFinance()
    {
        /** @var \App\Models\User $user */

        $user = Auth::user();

        if (!$user || !$user->isFinance()) {
            abort(403, 'Hanya Finance (sales) yang boleh melakukan aksi ini.');
        }
    }

    private function authorizeAdmin()
    {
        /** @var \App\Models\User $user */

        $user = Auth::user();

        if (!$user || !$user->isAdmin()) {
            abort(403, 'Hanya Admin yang boleh melakukan aksi ini.');
        }
    }

    private function validateInvoice(Request $request, $ignoreId = null)
    {
        return $request->validate([
            'company_id'    => 'required|exists:companies,id',
            'customer_id'   => 'required|exists:customers,id',
            'invoice_no'    => 'required|string|unique:invoices,invoice_no,' . $ignoreId,
            'invoice_date'  => 'required|date',
            'due_date'      => 'nullable|date',
            'currency'      => 'required|string|max:10',
            'keterangan'    => 'nullable|string',
            'terms'         => 'nullable|string',
            'extra_discount' => 'nullable|numeric',
            'shipping_cost' => 'nullable|numeric',
            // items
            'items'             => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.price_id'  => 'nullable|exists:product_prices,id',
            'items.*.price'     => 'required|numeric|min:0',
            'items.*.quantity'  => 'required|numeric|min:0',
            'items.*.unit'      => 'nullable|string',
            'items.*.discount_type' => 'nullable|in:percent,amount',
            'items.*.discount'  => 'nullable|numeric|min:0',
            'items.*.tax'       => 'nullable|numeric|min:0',
            'custom_labels'     => 'nullable|array',
            'logo_path'         => 'nullable|string',
            'signature_path'    => 'nullable|file|mimes:jpg,jpeg,png|max:2048',
            'status'            => 'nullable|in:draft,printed,sent,paid,cancelled',
        ]);
    }

    private function saveInvoiceData($validated)
    {
        $subtotal = 0.0;
        $discountTotal = 0.0;
        $taxTotal = 0.0;
        $itemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::with('prices')->find($item['product_id']);

            $price = 0.0;       // harga pack/carton
            $multiplier = 1;    // isi per pack

            if (!empty($item['price_id'])) {
                $priceRow = ProductPrice::find($item['price_id']);
                if ($priceRow && $priceRow->product_id == $product->id) {
                    $price = (float) $priceRow->price;       // harga grosir (pack)
                    $multiplier = $priceRow->min_qty ?? 1;   // isi pcs per pack
                } else {
                    $price = (float) ($item['price'] ?? 0);
                }
            } else {
                $price = (float) ($item['price'] ?? ($product?->prices()->first()?->price ?? 0));
            }

            // Normalisasi harga ke unit terkecil
            $unitPrice = $multiplier > 0 ? $price / $multiplier : $price;

            $qty = (float) ($item['quantity'] ?? 0);
            $lineBase = $qty * $unitPrice;

            // Diskon
            $discType = $item['discount_type'] ?? 'percent';
            $discount = ($discType === 'percent')
                ? $lineBase * ((float)($item['discount'] ?? 0) / 100)
                : (float)($item['discount'] ?? 0);

            $afterDiscount = $lineBase - $discount;

            // Pajak
            $taxPercent = (float)($item['tax'] ?? 0);
            $tax = ($afterDiscount * $taxPercent) / 100;

            $lineTotal = $afterDiscount + $tax;

            // Akumulasi
            $subtotal += $lineBase;
            $discountTotal += $discount;
            $taxTotal += $tax;

            $itemsData[] = [
                'product_id'      => $item['product_id'],
                'price_id'        => $item['price_id'] ?? null,
                'description'     => $item['description'] ?? ($product->name ?? '-'),
                'quantity'        => $qty,
                'unit'            => $item['unit'] ?? ($product->prices()->first()?->unit ?? '-'),
                'price'           => $unitPrice, // harga per pcs
                'discount'        => (float)($item['discount'] ?? 0),
                'discount_type'   => $discType,
                'tax'             => $taxPercent,
                'total'           => $lineTotal,
                'unit_multiplier' => $multiplier, // dipakai adjust stok
            ];
        }

        $extraDiscount = (float)($validated['extra_discount'] ?? 0);
        $shippingCost  = (float)($validated['shipping_cost'] ?? 0);

        $grandTotal = $subtotal - $discountTotal - $extraDiscount + $shippingCost + $taxTotal;

        $invoice = Invoice::create(
            $this->extractInvoiceFields($validated, $subtotal, $discountTotal, $taxTotal, $grandTotal)
        );

        foreach ($itemsData as $data) {
            InvoiceItem::create(array_merge($data, ['invoice_id' => $invoice->id]));
        }

        return $invoice;
    }

    private function extractInvoiceFields($validated, $subtotal, $discountTotal, $taxTotal, $grandTotal)
    {
        return [
            'company_id'     => $validated['company_id'],
            'user_id'        => Auth::id(),
            'customer_id'    => $validated['customer_id'],
            'invoice_no'     => $validated['invoice_no'],
            'ref_no'         => $validated['ref_no'] ?? null,
            'invoice_date'   => $validated['invoice_date'],
            'due_date'       => $validated['due_date'] ?? null,
            'currency'       => $validated['currency'],
            'subtotal'       => $subtotal,
            'discount_total' => $discountTotal,
            'extra_discount' => (float)($validated['extra_discount'] ?? 0),
            'shipping_cost'  => (float)($validated['shipping_cost'] ?? 0),
            'tax_total'      => $taxTotal,
            'grand_total'    => $grandTotal,
            'keterangan'     => $validated['keterangan'] ?? null,
            'terms'          => $validated['terms'] ?? null,
            'custom_labels'  => $validated['custom_labels'] ?? null,
            'logo_path'      => $validated['logo_path'] ?? null,
            'signature_path' => $validated['signature_path'] ?? null,
            'status'         => $validated['status'] ?? 'draft',
        ];
    }
    private function updateInvoiceData(Invoice $invoice, $validated)
    {
        $subtotal = 0.0;
        $discountTotal = 0.0;
        $taxTotal = 0.0;
        $itemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::with('prices')->find($item['product_id']);

            $price = 0.0;
            $multiplier = 1;

            if (!empty($item['price_id'])) {
                $priceRow = ProductPrice::find($item['price_id']);
                if ($priceRow && $priceRow->product_id == $product->id) {
                    $price = (float) $priceRow->price;
                    $multiplier = $priceRow->min_qty ?? 1;
                } else {
                    $price = (float) ($item['price'] ?? 0);
                }
            } else {
                $price = (float) ($item['price'] ?? ($product?->prices()->first()?->price ?? 0));
            }

            $unitPrice = $multiplier > 0 ? $price / $multiplier : $price;

            $qty = (float) ($item['quantity'] ?? 0);
            $lineBase = $qty * $unitPrice;

            $discType = $item['discount_type'] ?? 'percent';
            $discount = ($discType === 'percent')
                ? $lineBase * ((float)($item['discount'] ?? 0) / 100)
                : (float)($item['discount'] ?? 0);

            $afterDiscount = $lineBase - $discount;

            $taxPercent = (float)($item['tax'] ?? 0);
            $tax = ($afterDiscount * $taxPercent) / 100;
            $lineTotal = $afterDiscount + $tax;

            $subtotal += $lineBase;
            $discountTotal += $discount;
            $taxTotal += $tax;

            $itemsData[] = [
                'product_id'      => $item['product_id'],
                'price_id'        => $item['price_id'] ?? null,
                'description'     => $item['description'] ?? ($product->name ?? '-'),
                'quantity'        => $qty,
                'unit'            => $item['unit'] ?? ($product->prices()->first()?->unit ?? '-'),
                'price'           => $unitPrice,
                'discount'        => (float)($item['discount'] ?? 0),
                'discount_type'   => $discType,
                'tax'             => $taxPercent,
                'total'           => $lineTotal,
                'unit_multiplier' => $multiplier,
            ];
        }

        $extraDiscount = (float)($validated['extra_discount'] ?? 0);
        $shippingCost  = (float)($validated['shipping_cost'] ?? 0);

        $grandTotal = $subtotal - $discountTotal - $extraDiscount + $shippingCost + $taxTotal;

        $invoice->update(
            $this->extractInvoiceFields($validated, $subtotal, $discountTotal, $taxTotal, $grandTotal)
        );

        $invoice->items()->delete();
        foreach ($itemsData as $data) {
            InvoiceItem::create(array_merge($data, ['invoice_id' => $invoice->id]));
        }

        return $invoice;
    }

    public function markPrinted(Invoice $invoice)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return DB::transaction(function () use ($invoice, $user) {

            if ($user->isFinance()) {
                if ($invoice->status === 'draft') {
                    $this->adjustStockOnStatus($invoice);
                }

                $invoice->update(['status' => 'printed']);
            } elseif ($user->isAdmin()) {

                if ($invoice->status === 'draft') {
                    return back()->with('error', "Admin tidak bisa mencetak sebelum Finance melakukan cetak!");
                }

                $invoice->update(['status' => 'printed']);
            } else {
                abort(403, 'Anda tidak punya akses untuk aksi ini.');
            }

            // Notifikasi
            $creator  = $user;
            $admins = User::where('role', 'admin')->get();

            $creator->notify(new InvoicePrintedNotification($invoice));

            foreach ($admins as $admin) {
                $admin->notify(new InvoicePrintedNotification($invoice));
            }

            return back()->with('success', "Invoice {$invoice->invoice_no} ditandai sebagai Printed!");
        });
    }



    public function markSent(Invoice $invoice)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        return DB::transaction(function () use ($invoice, $user) {

            if ($user->isFinance()) {
                if ($invoice->status === 'draft') {
                    $this->adjustStockOnStatus($invoice);
                }
                $invoice->update(['status' => 'sent']);
            } elseif ($user->isAdmin()) {

                if (! in_array($invoice->status, ['printed', 'sent'])) {
                    return back()->with('error', "Admin tidak bisa mengirim sebelum Finance melakukan kirim/cetak!");
                }

                $invoice->update(['status' => 'sent']);
            } else {
                abort(403, 'Anda tidak punya akses untuk aksi ini.');
            }

            // Notifikasi
            $creator  = $user;
            $admins = User::where('role', 'admin')->get();

            $creator->notify(new InvoiceSentNotification($invoice));

            foreach ($admins as $admin) {
                $admin->notify(new InvoiceSentNotification($invoice));
            }

            return back()->with('success', "Invoice {$invoice->invoice_no} ditandai sebagai Sent!");
        });
    }
}
