"use client";
import React from "react";
import { Users } from "lucide-react";
import { formatDate, formatRupiah, formatInteger } from "@/lib/formatters";

export default function InvoicePreviewModal({ data, company, customers, products, onClose }) {
    const subtotal = data.items.reduce((sum, i) => (sum + (i.quantity * i.price)), 0);
    const totalDiscount = data.items.reduce(
        (sum, i) =>
            sum + (i.discount_type === "percent" ? (i.quantity * i.price * i.discount) / 100 : i.discount),
        0
    );
    const totalTax = data.items.reduce((sum, i) => {
        const disc = i.discount_type === "percent" ? (i.quantity * i.price * i.discount) / 100 : i.discount;
        return sum + ((i.quantity * i.price - disc) * i.tax) / 100;
    }, 0);
    const grandTotal = subtotal - totalDiscount + totalTax + Number(data.shipping_cost || 0) - Number(data.extra_discount || 0);

    const cust = customers.find((c) => c.id == data.customer_id);

    return (
        <div className="modal modal-open">
            <div className="max-w-6xl modal-box">
                <h3 className="mb-4 text-lg font-bold">Preview Invoice</h3>

                <div className="overflow-x-auto">
                    <div className="min-w-[900px] p-6 space-y-6 transition-all border shadow-xl bg-white rounded-lg">
                        {/* Header */}
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div>
                                {company?.logo_path && (
                                    <img
                                        src={company.logo_url ?? `/storage/${company.logo_path}`}
                                        alt="Company Logo"
                                        className="object-contain h-20"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col items-end">
                                <h1 className="text-3xl font-semibold uppercase">Invoice</h1>
                                <div className="w-full max-w-sm mt-2 text-sm">
                                    <div className="grid grid-cols-[110px_auto] gap-y-1 gap-x-4">
                                        <span className="text-right text-gray-500">No :</span>
                                        <span className="font-semibold">{data.invoice_no}</span>

                                        <span className="text-right text-gray-500">Tanggal :</span>
                                        <span>{formatDate(data.invoice_date)}</span>

                                        <span className="text-right text-gray-500">Jatuh Tempo :</span>
                                        <span>{formatDate(data.due_date)}</span>

                                        <span className="text-right text-gray-500">Status :</span>
                                        <span className="italic text-gray-500">draft</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info Perusahaan & Customer */}
                        <div className="overflow-x-auto">
                            <div className="grid grid-cols-2 gap-6 min-w-[600px]">
                                <div className="p-2">
                                    <div className="flex items-center gap-2 pb-1 mb-2 border-b">
                                        <Users className="w-5 h-5 text-emerald-500" />
                                        <h3 className="text-lg font-semibold text-emerald-500">Info Perusahaan</h3>
                                    </div>
                                    <div className="space-y-1 text-sm">
                                        <p className="font-semibold">{company?.name || "-"}</p>
                                        <p>Alamat : {company?.address || "-"}</p>
                                        <p>{company?.city || "-"},{" "}</p>
                                        <p>{company?.province || ""} {company?.postal_code || ""}</p>
                                        <p>{company?.country || "-"}</p>
                                        <p>Telp: {company?.phone || "-"}</p>
                                        <p>Email: {company?.email || "-"}</p>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <div className="flex items-center gap-2 pb-1 mb-2 border-b">
                                        <Users className="w-5 h-5 text-primary" />
                                        <h3 className="text-lg font-semibold text-primary">Customer</h3>
                                    </div>
                                    {cust ? (
                                        <div className="space-y-1 text-sm">
                                            <p className="font-semibold">{cust.name || "-"}</p>
                                            <p>{cust.address || "-"}</p>
                                            <p>{cust.city || "-"},{" "}</p>
                                            <p>{cust.province || ""} {cust.postal_code || ""}</p>
                                            <p>{cust.country || "-"}</p>
                                            <p>Telp: {cust.phone || "-"}</p>
                                            <p>Email: {cust.email || "-"}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm italic text-gray-500">-</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="overflow-x-auto">
                            <table className="table w-full mt-1">
                                <thead>
                                    <tr className="text-sm bg-base-300">
                                        <th>Produk</th>
                                        <th>Unit</th>
                                        <th className="text-right">Qty</th>
                                        <th className="text-right">Harga</th>
                                        <th className="text-right">Diskon</th>
                                        <th className="text-right">Pajak</th>
                                        <th className="text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.map((i, idx) => {
                                        const product = products.find((p) => p.id == i.product_id);
                                        const price = product?.prices.find((pr) => pr.id == i.price_id);
                                        return (
                                            <tr key={idx}>
                                                <td>{product?.name || "-"}</td>
                                                <td>{price?.unit || i.unit || "-"}</td>
                                                <td className="text-right">{formatInteger(i.quantity)}</td>
                                                <td className="text-right">{formatRupiah(i.price ?? 0)}</td>
                                                <td className="text-right">
                                                    {i.discount_type === "percent"
                                                        ? `${formatInteger(i.discount)}%`
                                                        : formatRupiah(i.discount ?? 0)}
                                                </td>
                                                <td className="text-right">{i.tax ? `${i.tax}%` : "-"}</td>
                                                <td className="text-right">{formatRupiah(i.total ?? 0)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary */}
                        <div className="max-w-md mt-4 ml-auto">
                            <table className="w-full text-sm">
                                <tbody>
                                    <tr>
                                        <td className="w-40 text-gray-600">Subtotal</td>
                                        <td className="text-right">{formatRupiah(subtotal)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600">Total Diskon</td>
                                        <td className="text-right">{formatRupiah(totalDiscount)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600">Total Pajak</td>
                                        <td className="text-right">{formatRupiah(totalTax)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600">Ongkir</td>
                                        <td className="text-right">{formatRupiah(data.shipping_cost ?? 0)}</td>
                                    </tr>
                                    <tr>
                                        <td className="text-gray-600">Diskon Tambahan</td>
                                        <td className="text-right">{formatRupiah(data.extra_discount ?? 0)}</td>
                                    </tr>
                                    <tr className="font-bold border-t">
                                        <td>Grand Total</td>
                                        <td className="text-right">{formatRupiah(grandTotal)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* Notes & Signature */}
                        <div className="mt-4">
                            <h3 className="mb-1 font-semibold">Keterangan</h3>
                            <p>{data.keterangan || "-"}</p>

                            <h3 className="mt-3 mb-1 font-semibold">Syarat & Ketentuan</h3>
                            <p>{data.terms || "-"}</p>

                            {data.signature_path && (
                                <div className="mt-4">
                                    <h4 className="mb-1 font-semibold">Tanda Tangan</h4>
                                    {data.signature_path instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(data.signature_path)}
                                            alt="Signature"
                                            className="object-contain h-16 max-w-xs"
                                        />
                                    ) : (
                                        <img
                                            src={`/storage/${data.signature_path}`}
                                            alt="Existing Signature"
                                            className="object-contain h-16 max-w-xs"
                                        />
                                    )}
                                </div>
                            )}
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
