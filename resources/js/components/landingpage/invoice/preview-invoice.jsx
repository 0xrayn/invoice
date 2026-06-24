"use client";
import React from "react";
import { formatDate, formatRupiah, formatInteger } from "@/lib/formatters";

// Warna brand yang sama dengan template PDF (resources/views/pdf/invoice.blade.php)
const BRAND = "#1a56db";

const STATUS_STYLES = {
    draft: "bg-amber-100 text-amber-700 border border-amber-300",
    printed: "bg-blue-100 text-blue-700 border border-blue-300",
    sent: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    cancelled: "bg-red-100 text-red-700 border border-red-300",
};

export default function InvoicePreviewModal({ data, company, customers, products, onClose }) {
    const subtotal = data.items.reduce((s, i) => {
        const product = products.find((p) => p.id == i.product_id);
        const priceObj = product?.prices?.find((pr) => pr.id == i.price_id);
        const unitPrice = priceObj ? priceObj.price / (priceObj.min_qty || 1) : 0;
        return s + (Number(i.quantity) || 0) * unitPrice;
    }, 0);

    const totalDiscount = data.items.reduce((s, i) => {
        const product = products.find((p) => p.id == i.product_id);
        const priceObj = product?.prices?.find((pr) => pr.id == i.price_id);
        const unitPrice = priceObj ? priceObj.price / (priceObj.min_qty || 1) : 0;
        const qty = Number(i.quantity) || 0;
        const discount = i.discount_type === "percent"
            ? (qty * unitPrice * (Number(i.discount) || 0)) / 100
            : Number(i.discount) || 0;
        return s + discount;
    }, 0);

    const totalTax = data.items.reduce((s, i) => {
        const product = products.find((p) => p.id == i.product_id);
        const priceObj = product?.prices?.find((pr) => pr.id == i.price_id);
        const unitPrice = priceObj ? priceObj.price / (priceObj.min_qty || 1) : 0;
        const qty = Number(i.quantity) || 0;
        const discount = i.discount_type === "percent"
            ? (qty * unitPrice * (Number(i.discount) || 0)) / 100
            : Number(i.discount) || 0;
        const lineSubtotal = qty * unitPrice - discount;
        return s + (lineSubtotal * (Number(i.tax) || 0)) / 100;
    }, 0);

    const grandTotal = subtotal - totalDiscount + totalTax + Number(data.shipping_cost || 0) - Number(data.extra_discount || 0);

    const cust = customers.find((c) => c.id == data.customer_id);
    const status = data.status || "draft";
    const statusClass = STATUS_STYLES[status] || STATUS_STYLES.draft;

    return (
        <div className="modal modal-open">
            <div className="max-w-5xl modal-box">
                <h3 className="mb-4 text-lg font-bold">Preview Invoice</h3>

                <div className="overflow-x-auto">
                    {/* ===== Kertas invoice — meniru desain views/pdf/invoice.blade.php ===== */}
                    <div className="min-w-[820px] bg-white text-[#1a1a2e] rounded-lg shadow-xl p-8 text-[13px] leading-relaxed">

                        {/* ===== HEADER ===== */}
                        <div
                            className="flex items-start justify-between pb-4 mb-5 border-b-[3px]"
                            style={{ borderColor: BRAND }}
                        >
                            <div className="w-[55%]">
                                {company?.logo_path && (
                                    <img
                                        src={company.logo_url ?? `/storage/${company.logo_path}`}
                                        alt="Logo Perusahaan"
                                        className="object-contain h-16 mb-2 max-w-[220px]"
                                    />
                                )}
                                <div className="text-lg font-bold" style={{ color: BRAND }}>
                                    {company?.name || "-"}
                                </div>
                                <div className="mt-1 text-xs leading-relaxed text-gray-600">
                                    <div>{company?.address || "-"}</div>
                                    <div>{company?.city || "-"}</div>
                                    <div>
                                        {company?.phone || "-"}&nbsp;&nbsp;|&nbsp;&nbsp;{company?.email || "-"}
                                    </div>
                                </div>
                            </div>

                            <div className="w-[40%] text-right">
                                <div
                                    className="text-3xl font-bold tracking-widest"
                                    style={{ color: BRAND }}
                                >
                                    INVOICE
                                </div>
                                <div className="mt-1 text-xs leading-loose text-gray-700">
                                    <div>
                                        <span className="inline-block w-24 text-gray-400">No. Invoice</span>
                                        <span className="font-bold text-[#1a1a2e]">{data.invoice_no || "-"}</span>
                                    </div>
                                    <div>
                                        <span className="inline-block w-24 text-gray-400">Tanggal</span>
                                        <span className="font-bold text-[#1a1a2e]">{formatDate(data.invoice_date)}</span>
                                    </div>
                                    <div>
                                        <span className="inline-block w-24 text-gray-400">Jatuh Tempo</span>
                                        <span className="font-bold text-[#1a1a2e]">
                                            {data.due_date ? formatDate(data.due_date) : "-"}
                                        </span>
                                    </div>
                                </div>
                                <span
                                    className={`inline-block mt-2 px-3 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${statusClass}`}
                                >
                                    {status}
                                </span>
                            </div>
                        </div>

                        {/* ===== DARI / TAGIHAN KEPADA ===== */}
                        <div className="flex gap-4 mb-5">
                            <div className="w-1/2 p-3 rounded-md bg-[#f8faff] border border-[#e0e7ff]">
                                <div
                                    className="pb-1 mb-2 text-[9px] font-bold tracking-wider uppercase border-b border-[#c7d2fe]"
                                    style={{ color: BRAND }}
                                >
                                    Dari
                                </div>
                                <div className="text-sm font-bold">{company?.name || "-"}</div>
                                <div className="mt-1 text-xs leading-relaxed text-gray-600">
                                    <div>{company?.address || "-"}</div>
                                    <div>{company?.city || "-"}</div>
                                    <div>Telp: {company?.phone || "-"}</div>
                                    <div>Email: {company?.email || "-"}</div>
                                </div>
                            </div>

                            <div className="w-1/2 p-3 rounded-md bg-[#f8faff] border border-[#e0e7ff]">
                                <div
                                    className="pb-1 mb-2 text-[9px] font-bold tracking-wider uppercase border-b border-[#c7d2fe]"
                                    style={{ color: BRAND }}
                                >
                                    Tagihan Kepada
                                </div>
                                {cust ? (
                                    <>
                                        <div className="text-sm font-bold">{cust.name || "-"}</div>
                                        <div className="mt-1 text-xs leading-relaxed text-gray-600">
                                            <div>{cust.address || "-"}</div>
                                            <div>{cust.city || "-"}</div>
                                            <div>Telp: {cust.phone || "-"}</div>
                                            <div>Email: {cust.email || "-"}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-xs italic text-gray-400">Belum dipilih</div>
                                )}
                            </div>
                        </div>

                        {/* ===== ITEMS TABLE ===== */}
                        <table className="w-full text-xs border-collapse">
                            <thead>
                                <tr style={{ backgroundColor: BRAND }} className="text-white">
                                    <th className="px-2 py-2 font-bold text-left rounded-tl">#</th>
                                    <th className="px-2 py-2 font-bold text-left">Produk / Deskripsi</th>
                                    <th className="px-2 py-2 font-bold text-left">Unit</th>
                                    <th className="px-2 py-2 font-bold text-right">Qty</th>
                                    <th className="px-2 py-2 font-bold text-right">Harga Satuan</th>
                                    <th className="px-2 py-2 font-bold text-right">Diskon</th>
                                    <th className="px-2 py-2 font-bold text-right">Pajak</th>
                                    <th className="px-2 py-2 font-bold text-right rounded-tr">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.items.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="px-2 py-4 text-center text-gray-400 italic">
                                            Belum ada item
                                        </td>
                                    </tr>
                                )}
                                {data.items.map((i, idx) => {
                                    const product = products.find((p) => p.id == i.product_id);
                                    const price = product?.prices?.find((pr) => pr.id == i.price_id);
                                    return (
                                        <tr
                                            key={idx}
                                            className={idx % 2 === 0 ? "bg-white" : "bg-[#f0f4ff]"}
                                        >
                                            <td className="px-2 py-2 border-b border-gray-200">{idx + 1}</td>
                                            <td className="px-2 py-2 border-b border-gray-200">{product?.name || "-"}</td>
                                            <td className="px-2 py-2 border-b border-gray-200">{price?.unit || i.unit || "-"}</td>
                                            <td className="px-2 py-2 text-right border-b border-gray-200">{formatInteger(i.quantity)}</td>
                                            <td className="px-2 py-2 text-right border-b border-gray-200">{formatRupiah(i.price ?? 0)}</td>
                                            <td className="px-2 py-2 text-right border-b border-gray-200">
                                                {i.discount_type === "percent"
                                                    ? `${formatInteger(i.discount)}%`
                                                    : formatRupiah(i.discount ?? 0)}
                                            </td>
                                            <td className="px-2 py-2 text-right border-b border-gray-200">{i.tax ? `${i.tax}%` : "-"}</td>
                                            <td className="px-2 py-2 text-right border-b border-gray-200">{formatRupiah(i.total ?? 0)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        {/* ===== SUMMARY ===== */}
                        <div className="flex justify-end mt-2">
                            <table className="w-full text-xs max-w-[320px]">
                                <tbody>
                                    <tr>
                                        <td className="py-1 text-gray-500">Subtotal</td>
                                        <td className="py-1 font-bold text-right">{formatRupiah(subtotal)}</td>
                                    </tr>
                                    {totalDiscount > 0 && (
                                        <tr>
                                            <td className="py-1 text-gray-500">Total Diskon</td>
                                            <td className="py-1 font-bold text-right text-red-500">- {formatRupiah(totalDiscount)}</td>
                                        </tr>
                                    )}
                                    {totalTax > 0 && (
                                        <tr>
                                            <td className="py-1 text-gray-500">Pajak</td>
                                            <td className="py-1 font-bold text-right">{formatRupiah(totalTax)}</td>
                                        </tr>
                                    )}
                                    {Number(data.shipping_cost) > 0 && (
                                        <tr>
                                            <td className="py-1 text-gray-500">Biaya Kirim</td>
                                            <td className="py-1 font-bold text-right">{formatRupiah(data.shipping_cost)}</td>
                                        </tr>
                                    )}
                                    {Number(data.extra_discount) > 0 && (
                                        <tr>
                                            <td className="py-1 text-gray-500">Extra Diskon</td>
                                            <td className="py-1 font-bold text-right text-red-500">- {formatRupiah(data.extra_discount)}</td>
                                        </tr>
                                    )}
                                    <tr>
                                        <td colSpan={2} className="pt-1 border-t border-gray-200" />
                                    </tr>
                                    <tr style={{ backgroundColor: BRAND }}>
                                        <td className="py-2 pl-3 font-bold text-white rounded-l-md">GRAND TOTAL</td>
                                        <td className="py-2 pr-3 font-bold text-right text-white rounded-r-md">
                                            {formatRupiah(grandTotal)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* ===== NOTES & SIGNATURE ===== */}
                        <div className="flex justify-between mt-8 gap-6">
                            <div className="w-[55%]">
                                {data.keterangan && (
                                    <>
                                        <div
                                            className="mb-1 text-[9px] font-bold tracking-wider uppercase"
                                            style={{ color: BRAND }}
                                        >
                                            Keterangan
                                        </div>
                                        <div className="p-2 mb-3 text-xs text-gray-700 border rounded bg-[#f8faff] border-[#e0e7ff]">
                                            {data.keterangan}
                                        </div>
                                    </>
                                )}
                                {data.terms && (
                                    <>
                                        <div
                                            className="mb-1 text-[9px] font-bold tracking-wider uppercase"
                                            style={{ color: BRAND }}
                                        >
                                            Syarat &amp; Ketentuan
                                        </div>
                                        <div className="p-2 text-xs text-gray-700 border rounded bg-[#f8faff] border-[#e0e7ff]">
                                            {data.terms}
                                        </div>
                                    </>
                                )}
                            </div>

                            {data.signature_path && (
                                <div className="w-[35%] text-center">
                                    <div className="mb-2 text-xs text-gray-500">Hormat Kami,</div>
                                    {data.signature_path instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(data.signature_path)}
                                            alt="Tanda Tangan"
                                            className="h-16 max-w-[160px] object-contain mx-auto"
                                        />
                                    ) : (
                                        <img
                                            src={`/storage/${data.signature_path}`}
                                            alt="Tanda Tangan"
                                            className="h-16 max-w-[160px] object-contain mx-auto"
                                        />
                                    )}
                                    <div
                                        className="w-4/5 mx-auto mt-1 border-t"
                                        style={{ borderColor: BRAND }}
                                    />
                                    <div className="mt-1 text-xs font-bold">{company?.name || "-"}</div>
                                </div>
                            )}
                        </div>

                        {/* ===== FOOTER BAR ===== */}
                        <div
                            className="pt-2 mt-8 text-[9px] text-center text-gray-400 border-t-2"
                            style={{ borderColor: BRAND }}
                        >
                            Dokumen ini digenerate secara otomatis oleh sistem &bull; {company?.name || "-"} &bull; {company?.email || "-"}
                        </div>
                    </div>
                </div>

                <div className="modal-action">
                    <button onClick={onClose} className="btn">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
