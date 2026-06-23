<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Company;
use App\Models\User;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductPrice;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        InvoiceItem::truncate();
        Invoice::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $company   = Company::first();
        $finance   = User::where('role', 'finance')->first();
        $customers = Customer::all();
        $products  = Product::with('prices')->get();

        if (!$company || !$finance || $customers->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Pastikan CompanySeeder, UserSeeder, ProductSeeder, CustomerSeeder sudah dijalankan dulu!');
            return;
        }

        $invoiceData = [
            [
                'no'             => 'NVC-001',
                'date'           => now()->subDays(30),
                'due'            => now()->subDays(23),
                'status'         => 'sent',
                'keterangan'     => 'Pembayaran dapat dilakukan via transfer BCA 1234567890 a/n PT Mata Timur Nusantara.',
                'terms'          => 'Pembayaran jatuh tempo 7 hari setelah invoice diterima. Keterlambatan dikenakan denda 2% per bulan.',
                'currency'       => 'IDR',
                'items'          => [
                    ['sku' => 'RRK-001', 'label' => 'Eceran', 'qty' => 50,  'disc' => 0, 'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-003', 'label' => 'Grosir', 'qty' => 120, 'disc' => 5, 'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-005', 'label' => 'Grosir', 'qty' => 60,  'disc' => 3, 'disc_type' => 'percent', 'tax' => 11],
                ],
                'shipping'       => 25000,
                'extra_discount' => 0,
            ],
            [
                'no'             => 'NVC-002',
                'date'           => now()->subDays(20),
                'due'            => now()->subDays(13),
                'status'         => 'printed',
                'keterangan'     => 'Barang dikirim via JNE Reguler. No. Resi akan dikirim via WhatsApp.',
                'terms'          => 'Harga belum termasuk ongkos kirim. Retur barang dalam 3 hari setelah terima.',
                'currency'       => 'IDR',
                'items'          => [
                    ['sku' => 'RRK-002', 'label' => 'Grosir', 'qty' => 24, 'disc' => 0,     'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-004', 'label' => 'Eceran', 'qty' => 10, 'disc' => 10000, 'disc_type' => 'nominal', 'tax' => 11],
                ],
                'shipping'       => 15000,
                'extra_discount' => 50000,
            ],
            [
                'no'             => 'NVC-003',
                'date'           => now()->subDays(10),
                'due'            => now()->addDays(4),
                'status'         => 'draft',
                'keterangan'     => 'Invoice ini adalah pembelian perdana, berlaku diskon onboarding 5%.',
                'terms'          => 'Pembayaran lunas sebelum barang dikirim.',
                'currency'       => 'IDR',
                'items'          => [
                    ['sku' => 'RRK-006', 'label' => 'Eceran', 'qty' => 20, 'disc' => 5, 'disc_type' => 'percent', 'tax' => 0],
                    ['sku' => 'RRK-007', 'label' => 'Grosir', 'qty' => 36, 'disc' => 0, 'disc_type' => 'percent', 'tax' => 0],
                ],
                'shipping'       => 20000,
                'extra_discount' => 0,
            ],
            [
                'no'             => 'NVC-004',
                'date'           => now()->subDays(5),
                'due'            => now()->addDays(9),
                'status'         => 'draft',
                'keterangan'     => null,
                'terms'          => 'Pembayaran jatuh tempo 14 hari setelah invoice diterima.',
                'currency'       => 'IDR',
                'items'          => [
                    ['sku' => 'RRK-001', 'label' => 'Grosir', 'qty' => 100, 'disc' => 8, 'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-002', 'label' => 'Grosir', 'qty' => 60,  'disc' => 5, 'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-003', 'label' => 'Grosir', 'qty' => 48,  'disc' => 3, 'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-004', 'label' => 'Grosir', 'qty' => 24,  'disc' => 0, 'disc_type' => 'percent', 'tax' => 11],
                ],
                'shipping'       => 50000,
                'extra_discount' => 100000,
            ],
            [
                'no'             => 'NVC-005',
                'date'           => now(),
                'due'            => now()->addDays(7),
                'status'         => 'draft',
                'keterangan'     => 'Pemesanan reguler bulanan.',
                'terms'          => null,
                'currency'       => 'IDR',
                'items'          => [
                    ['sku' => 'RRK-005', 'label' => 'Grosir', 'qty' => 48, 'disc' => 0, 'disc_type' => 'percent', 'tax' => 11],
                    ['sku' => 'RRK-007', 'label' => 'Grosir', 'qty' => 24, 'disc' => 5, 'disc_type' => 'percent', 'tax' => 11],
                ],
                'shipping'       => 0,
                'extra_discount' => 0,
            ],
        ];

        $customerList = $customers->values();
        $custIndex    = 0;

        foreach ($invoiceData as $inv) {
            $customer = $customerList[$custIndex % $customerList->count()];
            $custIndex++;

            $subtotal      = 0;
            $discountTotal = 0;
            $taxTotal      = 0;
            $itemsToCreate = [];

            foreach ($inv['items'] as $itemData) {
                $product  = $products->firstWhere('sku', $itemData['sku']);
                $priceRow = $product->prices->firstWhere('label', $itemData['label'])
                          ?? $product->prices->first();

                $qty       = $itemData['qty'];
                $unitPrice = $priceRow->price;
                $baseTotal = $qty * $unitPrice;

                if ($itemData['disc_type'] === 'percent') {
                    $discAmt = $baseTotal * ($itemData['disc'] / 100);
                } else {
                    $discAmt = $itemData['disc'];
                }

                $afterDisc = $baseTotal - $discAmt;
                $taxAmt    = $afterDisc * ($itemData['tax'] / 100);
                $lineTotal = $afterDisc + $taxAmt;

                $subtotal      += $baseTotal;
                $discountTotal += $discAmt;
                $taxTotal      += $taxAmt;

                $itemsToCreate[] = [
                    'product_id'    => $product->id,
                    'price_id'      => $priceRow->id,
                    'description'   => $product->name,
                    'quantity'      => $qty,
                    'unit'          => $priceRow->unit,
                    'price'         => $unitPrice,
                    'discount'      => $itemData['disc_type'] === 'percent' ? $itemData['disc'] : $discAmt,
                    'discount_type' => $itemData['disc_type'],
                    'tax'           => $itemData['tax'],
                    'total'         => round($lineTotal, 2),
                ];
            }

            $grandTotal = $subtotal
                        - $discountTotal
                        + $taxTotal
                        + $inv['shipping']
                        - $inv['extra_discount'];

            $invoice = Invoice::create([
                'company_id'     => $company->id,
                'user_id'        => $finance->id,
                'customer_id'    => $customer->id,
                'invoice_no'     => $inv['no'],
                'invoice_date'   => $inv['date']->toDateString(),
                'due_date'       => $inv['due']->toDateString(),
                'currency'       => $inv['currency'],
                'status'         => $inv['status'],
                'keterangan'     => $inv['keterangan'],
                'terms'          => $inv['terms'],
                'subtotal'       => round($subtotal, 2),
                'discount_total' => round($discountTotal, 2),
                'tax_total'      => round($taxTotal, 2),
                'shipping_cost'  => $inv['shipping'],
                'extra_discount' => $inv['extra_discount'],
                'grand_total'    => round($grandTotal, 2),
            ]);

            foreach ($itemsToCreate as $item) {
                $invoice->items()->create($item);
            }

            if (in_array($inv['status'], ['printed', 'sent'])) {
                $this->generatePdf($invoice);
            }

            $this->command->info("✅ Invoice {$inv['no']} ({$inv['status']}) - Grand Total: Rp " . number_format($grandTotal, 0, ',', '.'));
        }

        $this->command->newLine();
        $this->command->info('🎉 Seeding selesai! Login dengan:');
        $this->command->line('   Admin   → admin@example.com   / password');
        $this->command->line('   Finance → finance@example.com / password');
    }

    private function generatePdf(Invoice $invoice): void
    {
        try {
            $invoice->load('items.product', 'customer', 'company');

            // ✅ Fix: embed logo sebagai base64 agar DomPDF tidak perlu baca file dari disk
            $logoBase64 = null;
            if ($invoice->company?->logo_path) {
                $logoFile = Storage::disk('public')->path($invoice->company->logo_path);
                if (file_exists($logoFile)) {
                    $mime = mime_content_type($logoFile);
                    $logoBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($logoFile));
                }
            }

            // ✅ Fix: embed signature sebagai base64 juga
            $signatureBase64 = null;
            if ($invoice->signature_path) {
                $signatureFile = Storage::disk('public')->path($invoice->signature_path);
                if (file_exists($signatureFile)) {
                    $mime = mime_content_type($signatureFile);
                    $signatureBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($signatureFile));
                }
            }

            $pdf = Pdf::loadView('pdf.invoice', [
                'invoice'         => $invoice,
                'logoBase64'      => $logoBase64,
                'signatureBase64' => $signatureBase64,
            ])
                ->setPaper('a4', 'portrait')
                ->setOption([
                    'defaultFont'          => 'DejaVu Sans',
                    'dpi'                  => 150,
                    'isHtml5ParserEnabled' => true,
                    'isRemoteEnabled'      => false,
                ]);

            $fileName = 'invoices/' . $invoice->invoice_no . '.pdf';
            Storage::disk('public')->put($fileName, $pdf->output());
            $invoice->update(['pdf_path' => $fileName]);

            $this->command->line("   📄 PDF tersimpan: storage/app/public/{$fileName}");
        } catch (\Exception $e) {
            $this->command->warn("   ⚠️  Gagal generate PDF {$invoice->invoice_no}: " . $e->getMessage());
        }
    }
}
