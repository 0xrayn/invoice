<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 11px;
            color: #1a1a2e;
            background: #fff;
            padding: 30px 40px;
            line-height: 1.5;
        }

        /* ===== HEADER ===== */
        .header-wrap {
            width: 100%;
            margin-bottom: 24px;
            border-bottom: 3px solid #1a56db;
            padding-bottom: 18px;
        }

        .header-left {
            float: left;
            width: 55%;
        }

        .header-right {
            float: right;
            width: 40%;
            text-align: right;
        }

        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #1a56db;
            margin-bottom: 4px;
        }

        .company-detail {
            font-size: 10px;
            color: #555;
            line-height: 1.6;
        }

        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #1a56db;
            letter-spacing: 2px;
            margin-bottom: 6px;
        }

        .invoice-meta {
            font-size: 10px;
            color: #444;
            line-height: 1.8;
        }

        .invoice-meta .label {
            display: inline-block;
            width: 80px;
            color: #888;
        }

        .invoice-meta .value {
            font-weight: bold;
            color: #1a1a2e;
        }

        .clearfix::after {
            content: '';
            display: table;
            clear: both;
        }

        /* ===== STATUS BADGE ===== */
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-top: 6px;
        }
        .status-draft    { background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; }
        .status-printed  { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
        .status-sent     { background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7; }
        .status-cancelled{ background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5; }

        /* ===== LOGO ===== */
        .company-logo {
            max-height: 55px;
            max-width: 180px;
            margin-bottom: 8px;
        }

        /* ===== FROM / TO ===== */
        .parties-wrap {
            width: 100%;
            margin-bottom: 20px;
        }

        .party-box {
            float: left;
            width: 47%;
            background: #f8faff;
            border: 1px solid #e0e7ff;
            border-radius: 6px;
            padding: 12px 14px;
        }

        .party-box.right {
            float: right;
        }

        .party-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1a56db;
            font-weight: bold;
            margin-bottom: 6px;
            border-bottom: 1px solid #c7d2fe;
            padding-bottom: 4px;
        }

        .party-name {
            font-size: 12px;
            font-weight: bold;
            color: #1a1a2e;
            margin-bottom: 3px;
        }

        .party-detail {
            font-size: 10px;
            color: #555;
            line-height: 1.7;
        }

        /* ===== ITEMS TABLE ===== */
        table.items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0;
            font-size: 10px;
        }

        table.items thead tr {
            background: #1a56db;
            color: #fff;
        }

        table.items thead th {
            padding: 8px 10px;
            text-align: left;
            font-weight: bold;
            font-size: 10px;
            border: none;
        }

        table.items thead th.text-right {
            text-align: right;
        }

        table.items tbody tr:nth-child(even) {
            background: #f0f4ff;
        }

        table.items tbody tr:nth-child(odd) {
            background: #fff;
        }

        table.items tbody td {
            padding: 7px 10px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: top;
            font-size: 10px;
        }

        table.items tbody td.text-right {
            text-align: right;
        }

        table.items tfoot tr {
            background: #fff;
        }

        table.items tfoot td {
            padding: 5px 10px;
            border: none;
            font-size: 10px;
        }

        /* ===== SUMMARY ===== */
        .summary-wrap {
            width: 100%;
            margin-top: 6px;
        }

        .summary-right {
            float: right;
            width: 42%;
        }

        .summary-table {
            width: 100%;
            border-collapse: collapse;
        }

        .summary-table td {
            padding: 5px 10px;
            font-size: 10px;
            border: none;
        }

        .summary-table td.label {
            color: #555;
        }

        .summary-table td.value {
            text-align: right;
            font-weight: bold;
        }

        .summary-table tr.divider td {
            border-top: 1px solid #e5e7eb;
        }

        .summary-table tr.grand-total {
            background: #1a56db;
        }

        .summary-table tr.grand-total td {
            color: #fff;
            font-size: 12px;
            font-weight: bold;
            padding: 8px 10px;
            border-radius: 0;
        }

        /* ===== NOTES & FOOTER ===== */
        .notes-wrap {
            margin-top: 30px;
            clear: both;
        }

        .notes-box {
            float: left;
            width: 55%;
        }

        .notes-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #1a56db;
            font-weight: bold;
            margin-bottom: 5px;
        }

        .notes-text {
            font-size: 10px;
            color: #444;
            background: #f8faff;
            border: 1px solid #e0e7ff;
            border-radius: 4px;
            padding: 8px 10px;
            min-height: 40px;
            line-height: 1.6;
        }

        /* ===== SIGNATURE ===== */
        .signature-wrap {
            float: right;
            width: 35%;
            text-align: center;
            margin-top: 10px;
        }

        .signature-label {
            font-size: 10px;
            color: #555;
            margin-bottom: 8px;
        }

        .signature-wrap img {
            max-height: 70px;
            max-width: 160px;
            margin-bottom: 4px;
        }

        .signature-line {
            border-top: 1px solid #1a56db;
            margin: 6px auto;
            width: 80%;
        }

        .signature-name {
            font-size: 10px;
            font-weight: bold;
            color: #1a1a2e;
        }

        /* ===== FOOTER BAR ===== */
        .footer-bar {
            margin-top: 40px;
            clear: both;
            border-top: 2px solid #1a56db;
            padding-top: 8px;
            text-align: center;
            font-size: 9px;
            color: #888;
        }
    </style>
</head>
<body>

    <!-- ===== HEADER ===== -->
    <div class="header-wrap clearfix">
        <div class="header-left">
            @if($invoice->company->logo_path)
                <img class="company-logo" src="{{ public_path('storage/' . $invoice->company->logo_path) }}">
                <br>
            @endif
            <div class="company-name">{{ $invoice->company->name }}</div>
            <div class="company-detail">
                {{ $invoice->company->address }}<br>
                {{ $invoice->company->city }}<br>
                {{ $invoice->company->phone }}&nbsp;&nbsp;|&nbsp;&nbsp;{{ $invoice->company->email }}
            </div>
        </div>

        <div class="header-right">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-meta">
                <div>
                    <span class="label">No. Invoice</span>
                    <span class="value">{{ $invoice->invoice_no }}</span>
                </div>
                <div>
                    <span class="label">Tanggal</span>
                    <span class="value">{{ \Carbon\Carbon::parse($invoice->invoice_date)->translatedFormat('d F Y') }}</span>
                </div>
                <div>
                    <span class="label">Jatuh Tempo</span>
                    <span class="value">
                        @if($invoice->due_date)
                            {{ \Carbon\Carbon::parse($invoice->due_date)->translatedFormat('d F Y') }}
                        @else
                            -
                        @endif
                    </span>
                </div>
            </div>
            @php
                $statusMap = [
                    'draft'     => 'status-draft',
                    'printed'   => 'status-printed',
                    'sent'      => 'status-sent',
                    'cancelled' => 'status-cancelled',
                ];
                $statusClass = $statusMap[$invoice->status] ?? 'status-draft';
            @endphp
            <span class="status-badge {{ $statusClass }}">{{ strtoupper($invoice->status) }}</span>
        </div>
    </div>

    <!-- ===== DARI / UNTUK ===== -->
    <div class="parties-wrap clearfix" style="margin-bottom: 20px;">
        <div class="party-box">
            <div class="party-label">Dari</div>
            <div class="party-name">{{ $invoice->company->name }}</div>
            <div class="party-detail">
                {{ $invoice->company->address }}<br>
                {{ $invoice->company->city }}<br>
                Telp: {{ $invoice->company->phone }}<br>
                Email: {{ $invoice->company->email }}
            </div>
        </div>

        <div class="party-box right">
            <div class="party-label">Tagihan Kepada</div>
            <div class="party-name">{{ $invoice->customer->name }}</div>
            <div class="party-detail">
                {{ $invoice->customer->address }}<br>
                {{ $invoice->customer->city }}<br>
                Telp: {{ $invoice->customer->phone }}<br>
                Email: {{ $invoice->customer->email }}
            </div>
        </div>
    </div>

    <!-- ===== ITEMS TABLE ===== -->
    <table class="items">
        <thead>
            <tr>
                <th style="width:4%">#</th>
                <th style="width:28%">Produk / Deskripsi</th>
                <th style="width:8%">Unit</th>
                <th style="width:8%" class="text-right">Qty</th>
                <th style="width:14%" class="text-right">Harga Satuan</th>
                <th style="width:12%" class="text-right">Diskon</th>
                <th style="width:8%" class="text-right">Pajak</th>
                <th style="width:18%" class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $i => $item)
            <tr>
                <td>{{ $i + 1 }}</td>
                <td>{{ $item->product->name ?? $item->description }}</td>
                <td>{{ $item->unit }}</td>
                <td class="text-right">{{ number_format($item->quantity, 0, ',', '.') }}</td>
                <td class="text-right">{{ $invoice->currency }} {{ number_format($item->price, 0, ',', '.') }}</td>
                <td class="text-right">
                    @if($item->discount_type === 'percent')
                        {{ $item->discount }}%
                    @else
                        {{ $invoice->currency }} {{ number_format($item->discount, 0, ',', '.') }}
                    @endif
                </td>
                <td class="text-right">{{ $item->tax }}%</td>
                <td class="text-right">{{ $invoice->currency }} {{ number_format($item->total, 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <!-- ===== SUMMARY ===== -->
    <div class="summary-wrap clearfix">
        <div class="summary-right">
            <table class="summary-table">
                <tr>
                    <td class="label">Subtotal</td>
                    <td class="value">{{ $invoice->currency }} {{ number_format($invoice->subtotal, 0, ',', '.') }}</td>
                </tr>
                @if($invoice->discount_total > 0)
                <tr>
                    <td class="label">Total Diskon</td>
                    <td class="value" style="color:#e53e3e;">- {{ $invoice->currency }} {{ number_format($invoice->discount_total, 0, ',', '.') }}</td>
                </tr>
                @endif
                @if($invoice->tax_total > 0)
                <tr>
                    <td class="label">Pajak</td>
                    <td class="value">{{ $invoice->currency }} {{ number_format($invoice->tax_total, 0, ',', '.') }}</td>
                </tr>
                @endif
                @if($invoice->shipping_cost > 0)
                <tr>
                    <td class="label">Biaya Kirim</td>
                    <td class="value">{{ $invoice->currency }} {{ number_format($invoice->shipping_cost, 0, ',', '.') }}</td>
                </tr>
                @endif
                @if($invoice->extra_discount > 0)
                <tr>
                    <td class="label">Extra Diskon</td>
                    <td class="value" style="color:#e53e3e;">- {{ $invoice->currency }} {{ number_format($invoice->extra_discount, 0, ',', '.') }}</td>
                </tr>
                @endif
                <tr class="divider">
                    <td colspan="2"></td>
                </tr>
                <tr class="grand-total">
                    <td class="label" style="color:#fff; border-radius: 6px 0 0 6px;">GRAND TOTAL</td>
                    <td class="value" style="color:#fff; border-radius: 0 6px 6px 0;">
                        {{ $invoice->currency }} {{ number_format($invoice->grand_total, 0, ',', '.') }}
                    </td>
                </tr>
            </table>
        </div>
    </div>

    <!-- ===== NOTES & SIGNATURE ===== -->
    <div class="notes-wrap clearfix">
        <div class="notes-box">
            @if($invoice->keterangan)
            <div class="notes-label">Keterangan</div>
            <div class="notes-text">{{ $invoice->keterangan }}</div>
            <br>
            @endif

            @if($invoice->terms)
            <div class="notes-label">Syarat &amp; Ketentuan</div>
            <div class="notes-text">{{ $invoice->terms }}</div>
            @endif
        </div>

        @if($invoice->signature_path)
        <div class="signature-wrap">
            <div class="signature-label">Hormat Kami,</div>
            <img src="{{ public_path('storage/' . $invoice->signature_path) }}">
            <div class="signature-line"></div>
            <div class="signature-name">{{ $invoice->company->name }}</div>
        </div>
        @endif
    </div>

    <!-- ===== FOOTER BAR ===== -->
    <div class="footer-bar">
        Dokumen ini digenerate secara otomatis oleh sistem &bull; {{ $invoice->company->name }} &bull; {{ $invoice->company->email }}
    </div>

</body>
</html>
