"use client";
import React from "react";
import { usePage, Link, router, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    FileText,
    Users,
    Pencil,
    ArrowLeft,
    Send,
    Trash2,
} from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import { formatDate, formatInteger, formatRupiahNoPrefix, formatRupiah } from "@/lib/formatters";
import { deleteInvoice, markInvoicePrinted, markInvoiceSent } from "@/lib/Action";

export default function Show() {
    const { invoice: invoiceFromProps, auth } = usePage().props;
    const invoice = invoiceFromProps ?? {};
    const company = invoice.company ?? null;
    const customer = invoice.customer ?? null;

    const role = auth?.user?.role ?? null;
    const isDraft = invoice.status === "draft";

    return (
        <ModernDashboardLayout>
            <Head title={`Invoice #${invoice.invoice_no || invoice.id || ""}`} />

            <div className="max-w-6xl p-3 mx-auto">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="p-6 space-y-6 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-purple-400 hover:shadow-purple-400/40"
                >
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex flex-col gap-3">
                            <Link
                                href={route("invoices.index")}
                                className="flex items-center justify-center mb-3 btn btn-sm btn-ghost w-fit"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>

                            {company?.logo_path && (
                                <img
                                    src={company.logo_url ?? `/storage/${company.logo_path}`}
                                    alt="Company Logo"
                                    className="object-contain h-20 pl-1"
                                />
                            )}
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex flex-wrap justify-end gap-2 pb-3 mb-3">
                                {isDraft && role === "finance" && (
                                    <Link
                                        href={route("invoices.edit", invoice.id)}
                                        className="flex items-center gap-1 btn btn-xs btn-accent"
                                    >
                                        <Pencil className="w-4 h-4" /> Edit
                                    </Link>
                                )}

                                {/* === Tombol PDF === */}
                                <button
                                    onClick={() => {
                                        if (role === "admin" && invoice.status === "draft") {
                                            alert("Admin tidak bisa cetak sebelum Finance melakukan cetak.");
                                            return;
                                        }
                                        markInvoicePrinted(invoice.id);
                                    }}
                                    disabled={role === "admin" && invoice.status === "draft"}
                                    className={`flex items-center gap-1 btn btn-xs btn-primary ${["printed", "sent"].includes(invoice.status) ? "opacity-60" : ""
                                        }`}
                                >
                                    <FileText className="w-4 h-4" /> PDF
                                </button>

                                {/* === Tombol WA === */}
                                <button
                                    onClick={() => {
                                        if (role === "admin" && invoice.status === "draft") {
                                            alert("Admin tidak bisa kirim sebelum Finance melakukan kirim/cetak.");
                                            return;
                                        }
                                        markInvoiceSent(invoice.id);
                                    }}
                                    disabled={role === "admin" && invoice.status === "draft"}
                                    className={`flex items-center gap-1 btn btn-xs btn-success ${invoice.status === "sent" ? "opacity-60" : ""
                                        }`}
                                >
                                    <Send className="w-4 h-4" /> WA
                                </button>

                                {isDraft && role === "finance" && (
                                    <button
                                        onClick={deleteInvoice}
                                        className="flex items-center gap-1 btn btn-xs btn-error"
                                    >
                                        <Trash2 className="w-4 h-4" /> Hapus
                                    </button>
                                )}
                            </div>

                            <h1 className="text-3xl font-semibold uppercase">Invoice</h1>

                            <div className="w-full max-w-sm mt-2 text-sm">
                                <div className="grid grid-cols-[110px_auto] gap-y-1 gap-x-4">
                                    <span className="text-right text-gray-500">Referensi :</span>
                                    <span className="font-semibold">{invoice.invoice_no ?? invoice.id}</span>

                                    <span className="text-right text-gray-500">Tanggal :</span>
                                    <span>{formatDate(invoice.invoice_date) ?? "-"}</span>

                                    <span className="text-right text-gray-500">Jatuh Tempo :</span>
                                    <span>{formatDate(invoice.due_date) ?? "-"}</span>

                                    <span className="text-right text-gray-500">Status :</span>
                                    <span
                                        className={
                                            invoice.status === "paid"
                                                ? "text-green-600 font-semibold"
                                                : invoice.status === "printed"
                                                    ? "text-blue-600 font-semibold"
                                                    : invoice.status === "sent"
                                                        ? "text-yellow-600 font-semibold"
                                                        : invoice.status === "draft"
                                                            ? "text-gray-500 italic"
                                                            : "text-gray-700"
                                        }
                                    >
                                        {invoice.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="p-2">
                            <div className="flex items-center gap-2 pb-1 mb-2 border-b">
                                <Users className="w-5 h-5 text-emerald-500" />
                                <h3 className="text-lg font-semibold text-emerald-500">Info Perusahaan</h3>
                            </div>
                            {company ? (
                                <div className="space-y-1 text-sm">
                                    <p className="font-semibold">{company.name || "-"}</p>
                                    <p>Alamat : {company.address || "-"}</p>
                                    <p>{company.city || "-"},{" "}</p>
                                    <p>{company.province || ""} {company.postal_code || ""}</p>
                                    <p>{company.country || "-"}</p>
                                    <p>Telp: {company.phone || "-"}</p>
                                    <p>Email: {company.email || "-"}</p>
                                </div>
                            ) : (
                                <p className="text-sm italic text-gray-500">Belum ada data perusahaan</p>
                            )}
                        </div>

                        {/* Customer */}
                        <div className="p-2">
                            <div className="flex items-center gap-2 pb-1 mb-2 border-b">
                                <Users className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-primary">Customer</h3>
                            </div>
                            {customer ? (
                                <div className="space-y-1 text-sm">
                                    <p className="font-semibold">{customer.name || "-"}</p>
                                    <p>{customer.address || "-"}</p>
                                    <p>{customer.city || "-"},{" "}</p>
                                    <p>{customer.province || ""} {customer.postal_code || ""}</p>
                                    <p>{customer.country || "-"}</p>
                                    <p>Telp: {customer.phone || "-"}</p>
                                    <p>Email: {customer.email || "-"}</p>
                                </div>
                            ) : (
                                <p className="text-sm italic text-gray-500">Belum ada data customer</p>
                            )}
                        </div>
                    </div>

                    {/* === ITEMS TABLE === */}
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
                                {Array.isArray(invoice.items) && invoice.items.length ? (
                                    invoice.items.map((i, idx) => (
                                        <tr key={i.id ?? idx} className="transition hover:bg-base-100/50">
                                            <td>{i.product?.name ?? i.description ?? "-"}</td>
                                            <td>{i.unit ?? i.price?.label ?? "-"}</td>
                                            <td className="text-right">{formatInteger(i.quantity)}</td>
                                            <td className="text-right">{formatRupiah(i.price ?? 0)}</td>
                                            <td className="text-right">
                                                {i.discount_type === "percent"
                                                    ? `${formatInteger(i.discount)}%`
                                                    : formatRupiah(i.discount ?? 0)}
                                            </td>
                                            <td className="text-right">{formatInteger(i.tax)}%</td>
                                            <td className="text-right">{formatRupiah(i.total ?? 0)}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-6 text-center text-gray-400">
                                            Belum ada item.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="max-w-md mt-4 ml-auto">
                        <table className="w-full text-sm">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600">Subtotal</td>
                                    <td className="w-10 pr-1 text-right">Rp</td>
                                    <td className="text-right tabular-nums">{formatRupiahNoPrefix(invoice.subtotal ?? 0)}</td>
                                </tr>

                                <tr>
                                    <td className="text-gray-600">Total Diskon</td>
                                    <td className="w-10 pr-1 text-right">Rp</td>
                                    <td className="text-right tabular-nums">{formatRupiahNoPrefix(invoice.discount_total ?? 0)}</td>
                                </tr>

                                <tr>
                                    <td className="text-gray-600">Total Pajak</td>
                                    <td className="w-10 pr-1 text-right">Rp</td>
                                    <td className="text-right tabular-nums">{formatRupiahNoPrefix(invoice.tax_total ?? 0)}</td>
                                </tr>

                                <tr>
                                    <td className="text-gray-600">Biaya Pengiriman</td>
                                    <td className="w-10 pr-1 text-right">Rp</td>
                                    <td className="text-right tabular-nums">{formatRupiahNoPrefix(invoice.shipping_cost ?? 0)}</td>
                                </tr>

                                <tr>
                                    <td className="text-gray-600">Extra Diskon</td>
                                    <td className="w-10 pr-1 text-right">Rp</td>
                                    <td className="text-right tabular-nums">{formatRupiahNoPrefix(invoice.extra_discount ?? 0)}</td>
                                </tr>

                                <tr className="font-bold border-t">
                                    <td>Grand Total</td>
                                    <td className="w-10 pr-1 text-right">Rp</td>
                                    <td className="text-right tabular-nums">{formatRupiahNoPrefix(invoice.grand_total ?? 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                    <div className="mt-4">
                        <h3 className="mb-1 font-semibold">Keterangan</h3>
                        <p>{invoice.keterangan || "-"}</p>

                        <h3 className="mt-3 mb-1 font-semibold">Syarat & Ketentuan</h3>
                        <p>{invoice.terms || "-"}</p>

                        {(invoice.signature_url || invoice.signature_path) && (
                            <div className="mt-4">
                                <h4 className="mb-1 font-semibold">Tanda Tangan</h4>
                                <img
                                    src={invoice.signature_url ?? `/storage/${invoice.signature_path}`}
                                    alt="Signature"
                                    className="object-contain h-16 max-w-xs"
                                />
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </ModernDashboardLayout>
    );
}
