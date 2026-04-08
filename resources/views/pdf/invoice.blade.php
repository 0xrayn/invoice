<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 12px;
            color: #333;
        }

        .header {
            text-align: right;
        }

        .title {
            font-size: 22px;
            font-weight: bold;
        }

        .section {
            margin-top: 20px;
        }

        .box {
            width: 48%;
            display: inline-block;
            vertical-align: top;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th {
            background: #f3f4f6;
            padding: 8px;
            border: 1px solid #ddd;
        }

        td {
            padding: 8px;
            border: 1px solid #ddd;
        }

        .text-right {
            text-align: right;
        }

        .summary {
            margin-top: 20px;
            width: 40%;
            float: right;
        }

        .summary td {
            border: none;
            padding: 4px;
        }

        .grand {
            font-weight: bold;
            font-size: 14px;
        }

        .footer {
            margin-top: 80px;
        }

        .signature {
            margin-top: 40px;
            text-align: right;
        }

        .signature img {
            height: 60px;
        }
    </style>
</head>
<body>

    <!-- HEADER -->
    <div class="header">
        <div class="title">INVOICE</div>
        <div>No: {{ $invoice->invoice_no }}</div>
        <div>Tanggal: {{ $invoice->invoice_date }}</div>
        <div>Jatuh Tempo: {{ $invoice->due_date ?? '-' }}</div>
        <div>Status: {{ strtoupper($invoice->status) }}</div>
    </div>

    <!-- COMPANY & CUSTOMER -->
    <div class="section">
        <div class="box">
            <strong>Dari:</strong><br>
            {{ $invoice->company->name }}<br>
            {{ $invoice->company->address }}<br>
            {{ $invoice->company->city }}<br>
            {{ $invoice->company->phone }}<br>
            {{ $invoice->company->email }}
        </div>

        <div class="box">
            <strong>Untuk:</strong><br>
            {{ $invoice->customer->name }}<br>
            {{ $invoice->customer->address }}<br>
            {{ $invoice->customer->city }}<br>
            {{ $invoice->customer->phone }}<br>
            {{ $invoice->customer->email }}
        </div>
    </div>

    <!-- ITEMS -->
    <table>
        <thead>
            <tr>
                <th>Produk</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Diskon</th>
                <th>Pajak</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
            <tr>
                <td>{{ $item->product->name ?? $item->description }}</td>
                <td>{{ $item->unit }}</td>
                <td class="text-right">{{ number_format($item->quantity) }}</td>
                <td class="text-right">{{ number_format($item->price) }}</td>
                <td class="text-right">
                    @if($item->discount_type === 'percent')
                        {{ $item->discount }}%
                    @else
                        {{ number_format($item->discount) }}
                    @endif
                </td>
                <td class="text-right">{{ $item->tax }}%</td>
                <td class="text-right">{{ number_format($item->total) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- SUMMARY -->
    <table class="summary">
        <tr>
            <td>Subtotal</td>
            <td class="text-right">{{ number_format($invoice->subtotal) }}</td>
        </tr>
        <tr>
            <td>Total Diskon</td>
            <td class="text-right">{{ number_format($invoice->discount_total) }}</td>
        </tr>
        <tr>
            <td>Pajak</td>
            <td class="text-right">{{ number_format($invoice->tax_total) }}</td>
        </tr>
        <tr>
            <td>Biaya Kirim</td>
            <td class="text-right">{{ number_format($invoice->shipping_cost) }}</td>
        </tr>
        <tr>
            <td>Extra Diskon</td>
            <td class="text-right">{{ number_format($invoice->extra_discount) }}</td>
        </tr>
        <tr class="grand">
            <td>Grand Total</td>
            <td class="text-right">{{ number_format($invoice->grand_total) }}</td>
        </tr>
    </table>

    <!-- NOTES -->
    <div class="footer">
        <strong>Keterangan:</strong><br>
        {{ $invoice->keterangan ?? '-' }}

        <br><br>

        <strong>Syarat & Ketentuan:</strong><br>
        {{ $invoice->terms ?? '-' }}
    </div>

    <!-- SIGNATURE -->
    @if($invoice->signature_path)
    <div class="signature">
        <p>Hormat Kami,</p>
        <img src="{{ public_path('storage/' . $invoice->signature_path) }}">
    </div>
    @endif

</body>
</html>