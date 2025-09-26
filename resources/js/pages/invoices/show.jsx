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
    Eye,
} from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

export default function Show() {
    const { invoice: invoiceFromProps, auth } = usePage().props;
    // company & customer disimpan di dalam invoice oleh controller
    const invoice = invoiceFromProps ?? {};
    const company = invoice.company ?? null;
    const customer = invoice.customer ?? null;

    // ambil role user (pastikan backend share auth via Inertia)
    const role = auth?.user?.role ?? null;

    // === Actions (sama logika dgn Index) ===
    const handleDelete = () => {
        if (!confirm("Yakin ingin menghapus invoice ini?")) return;
        router.delete(route("invoices.destroy", invoice.id), {
            onSuccess: () => {
                // kembali ke daftar setelah sukses hapus
                router.visit(route("invoices.index"));
            },
            onError: () => {
                alert("Gagal menghapus invoice.");
            },
        });
    };

    const markPrinted = (id) => {
        if (!confirm("Tandai invoice ini sebagai Printed?")) return;
        router.patch(route("invoices.markPrinted", id), {}, {
            onSuccess: () => {
                // reload halaman agar status update muncul
                router.reload();
            },
            onError: () => alert("Gagal menandai Printed."),
        });
    };

    const markSent = (id) => {
        if (!confirm("Tandai invoice ini sebagai Sent?")) return;
        router.patch(route("invoices.markSent", id), {}, {
            onSuccess: () => {
                router.reload();
            },
            onError: () => alert("Gagal menandai Sent."),
        });
    };

    const formatRupiah = (number) => {
        const n = Number(number) || 0;
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(n);
    };


    const formatInteger = (number) => {
        if (number == null) return 0;
        return Math.round(number).toLocaleString("id-ID");
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const d = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(d);
    };

    const isDraft = invoice.status === "draft";

    return (
        <ModernDashboardLayout>
            <Head title={`Invoice #${invoice.invoice_no || invoice.id || ""}`} />

            <div className="max-w-6xl p-3 mx-auto">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="p-6 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-purple-400 hover:shadow-purple-400/40"
                >
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            <FileText className="text-purple-500 w-7 h-7" />
                            <div>
                                <h1 className="text-2xl font-bold">
                                    Invoice #{invoice.invoice_no ?? invoice.id}
                                </h1>
                                <p className="text-sm opacity-70">
                                    Tanggal: {formatDate(invoice.invoice_date)}
                                </p>
                            </div>
                        </div>

                        {/* Actions: desktop (full) & mobile (icons) */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={route("invoices.index")}
                                className="btn btn-sm btn-ghost btn-circle"
                                title="Kembali"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Link>

                            {/* Desktop: teks tombol */}
                            <div className="items-center hidden gap-2 sm:flex">

                                {/* Edit only when draft AND role finance */}
                                {isDraft && role === "finance" && (
                                    <Link
                                        href={route("invoices.edit", invoice.id)}
                                        className="flex items-center gap-2 btn btn-xs btn-accent"
                                    >
                                        <Pencil className="w-4 h-4" /> Edit
                                    </Link>
                                )}

                                <button
                                    onClick={() => markPrinted(invoice.id)}
                                    className={`flex items-center gap-2 btn btn-xs btn-primary ${["printed", "sent"].includes(invoice.status) ? "opacity-60" : ""
                                        }`}
                                >
                                    <FileText className="w-4 h-4" /> PDF
                                </button>

                                <button
                                    onClick={() => markSent(invoice.id)}
                                    className={`flex items-center gap-2 btn btn-xs btn-success ${invoice.status === "sent" ? "opacity-60" : ""
                                        }`}
                                >
                                    <Send className="w-4 h-4" /> WA
                                </button>

                                {/* Delete only when draft AND role finance */}
                                {isDraft && role === "finance" && (
                                    <button
                                        onClick={handleDelete}
                                        className="flex items-center gap-2 btn btn-xs btn-error"
                                    >
                                        <Trash2 className="w-4 h-4" /> Hapus
                                    </button>
                                )}
                            </div>

                            {/* Mobile: icon-only buttons */}
                            <div className="flex gap-1 sm:hidden">

                                {isDraft && role === "finance" && (
                                    <Link
                                        href={route("invoices.edit", invoice.id)}
                                        className="btn btn-xs btn-accent btn-circle"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                )}

                                <button
                                    onClick={() => markPrinted(invoice.id)}
                                    className={`btn btn-xs btn-primary btn-circle ${["printed", "sent"].includes(invoice.status)
                                        ? "opacity-60 pointer-events-none"
                                        : ""
                                        }`}
                                    title="PDF"
                                >
                                    <FileText className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => markSent(invoice.id)}
                                    className={`btn btn-xs btn-success btn-circle ${invoice.status === "sent" ? "opacity-60 pointer-events-none" : ""
                                        }`}
                                    title="WA"
                                >
                                    <Send className="w-4 h-4" />
                                </button>

                                {isDraft && role === "finance" && (
                                    <button
                                        onClick={handleDelete}
                                        className="btn btn-xs btn-error btn-circle"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-sm opacity-70">Status</p>
                        <span
                            className={`badge ${invoice.status === "paid"
                                ? "badge-success"
                                : invoice.status === "printed"
                                    ? "badge-info"
                                    : invoice.status === "sent"
                                        ? "badge-warning"
                                        : invoice.status === "draft"
                                            ? "badge-outline"
                                            : "badge-neutral"
                                }`}
                        >
                            {invoice.status}
                        </span>
                    </div>

                    {/* Company & Customer (responsive, full fields) */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Company */}
                        <div className="p-2 rounded-md">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-emerald-500">
                                <Users className="w-5 h-5" /> Info Perusahaan
                            </h3>

                            {company ? (
                                <div className="mt-2 space-y-1 text-sm">
                                    <p className="font-semibold">{company.name || "-"}</p>
                                    <p>Alamat : {company.address || "-"}</p>
                                    <p>
                                        {company.city || "-"} ,
                                        <p>{company.province ? ` ${company.province}` : ""} {company.postal_code ? ` ${company.postal_code}` : ""}</p>
                                    </p>
                                    <p>{company.country || "-"}</p>
                                    <p>Telp: {company.phone || "-"}</p>
                                    <p>Email: {company.email || "-"}</p>

                                    {company.logo_path && (
                                        <img
                                            src={company.logo_url ?? `/storage/${company.logo_path}`}
                                            alt="Company Logo"
                                            className="object-contain h-16 mt-2"
                                        />
                                    )}
                                </div>
                            ) : (
                                <p className="text-sm italic text-gray-500">Belum ada data perusahaan</p>
                            )}
                        </div>

                        {/* Customer */}
                        <div className="p-3">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-primary">
                                <Users className="w-5 h-5" /> Customer
                            </h3>

                            {customer ? (
                                <div className="mt-2 space-y-1 text-sm">
                                    <p className="font-semibold">{customer.name || "-"}</p>
                                    <p>{customer.address || "-"}</p>
                                    <p>
                                        {customer.city || "-"}
                                    </p>
                                    <p>{customer.province ? ` ${customer.province}` : ""} {customer.postal_code ? ` ${customer.postal_code}` : ""}</p>
                                    <p>{customer.country || "-"}</p>
                                    <p>Telp: {customer.phone || "-"}</p>
                                    <p>Email: {customer.email || "-"}</p>
                                </div>
                            ) : (
                                <p className="text-sm italic text-gray-500">Belum ada data customer</p>
                            )}
                        </div>
                    </div>

                    {/* Items table */}
                    <div className="overflow-x-auto">
                        <table className="table w-full mt-4">
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

                    {/* Totals */}
                    <div className="max-w-md mt-4 ml-auto space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatRupiah(invoice.subtotal ?? 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Diskon</span>
                            <span>{formatRupiah(invoice.discount_total ?? 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Pajak</span>
                            <span>{formatRupiah(invoice.tax_total ?? 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Biaya Pengiriman</span>
                            <span>{formatRupiah(invoice.shipping_cost ?? 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Extra Diskon</span>
                            <span>{formatRupiah(invoice.extra_discount ?? 0)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Grand Total</span>
                            <span>{formatRupiah(invoice.grand_total ?? 0)}</span>
                        </div>
                    </div>

                    {/* Notes & Signature */}
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
