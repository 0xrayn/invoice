import React, { useState } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Eye, Pencil, Trash2, Plus, FileText, Send } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

export default function Index() {
    const { invoices, flash, auth } = usePage().props; // ⬅️ ambil role user
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const role = auth?.user?.role || "guest"; // role user

    const formatCurrency = (
        value,
        currency = invoices?.data?.[0]?.currency || "IDR"
    ) => {
        if (value == null) return "-";
        return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus invoice ini?")) {
            router.delete(route("invoices.destroy", id));
        }
    };

    const markPrinted = (id) => {
        if (confirm("Tandai invoice ini sebagai Printed?")) {
            router.patch(route("invoices.markPrinted", id));
        }
    };

    const markSent = (id) => {
        if (confirm("Tandai invoice ini sebagai Sent?")) {
            router.patch(route("invoices.markSent", id));
        }
    };

    return (
        <ModernDashboardLayout>
            <Head title="Daftar Invoice" />
            <div className="p-4 mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-wrap items-center justify-between gap-3 mb-6"
                >
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-transparent sm:text-3xl bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-600 bg-clip-text">
                        📑 Daftar Invoice
                    </h1>

                    {/* Tombol create hanya untuk finance */}
                    {role === "finance" && (
                        <Link
                            href={route("invoices.create")}
                            className="flex items-center w-auto gap-2 shadow-md btn btn-primary"
                        >
                            <Plus className="w-3 h-3" />
                        </Link>
                    )}
                </motion.div>

                {/* Flash message */}
                {flash?.success && (
                    <div className="mb-4 alert alert-success">{flash.success}</div>
                )}
                {flash?.error && (
                    <div className="mb-4 alert alert-error">{flash.error}</div>
                )}

                {/* Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 overflow-x-auto border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300"
                >
                    <table className="table w-full min-w-[900px]">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>No Invoice</th>
                                <th>Customer</th>
                                <th>Tanggal</th>
                                <th className="text-right">Total</th>
                                <th>Status</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.data && invoices.data.length ? (
                                invoices.data.map((inv, idx) => (
                                    <tr
                                        key={inv.id}
                                        className="transition-colors duration-200 hover:bg-primary/10"
                                    >
                                        <td>{invoices.from + idx}</td>
                                        <td className="font-semibold text-cyan-400">
                                            {inv.invoice_no}
                                        </td>
                                        <td>{inv.customer?.name ?? "-"}</td>
                                        <td>{formatDate(inv.invoice_date)}</td>
                                        <td className="font-semibold text-right text-emerald-400">
                                            {formatCurrency(inv.grand_total, inv.currency)}
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${
                                                    inv.status === "draft"
                                                        ? "badge-outline"
                                                        : inv.status === "printed"
                                                        ? "badge-success"
                                                        : "badge-info"
                                                }`}
                                            >
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="flex justify-end gap-2">
                                            {/* Desktop: tombol full */}
                                            <div className="hidden gap-2 sm:flex">
                                                <Link
                                                    href={route("invoices.show", inv.id)}
                                                    className="flex items-center gap-1 btn btn-xs btn-info"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>

                                                {/* Finance only: edit, print, send, delete */}
                                                {role === "finance" && (
                                                    <>
                                                        {inv.status === "draft" && (
                                                            <Link
                                                                href={route("invoices.edit", inv.id)}
                                                                className="flex items-center gap-1 btn btn-xs btn-accent"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>
                                                        )}

                                                        <button
                                                            onClick={() => markPrinted(inv.id)}
                                                            className="flex items-center gap-1 btn btn-xs btn-primary"
                                                        >
                                                            <FileText className="w-4 h-4" /> PDF
                                                        </button>
                                                        <button
                                                            onClick={() => markSent(inv.id)}
                                                            className="flex items-center gap-1 btn btn-xs btn-success"
                                                        >
                                                            <Send className="w-4 h-4" /> WA
                                                        </button>

                                                        {inv.status === "draft" && (
                                                            <button
                                                                onClick={() => handleDelete(inv.id)}
                                                                className="flex items-center gap-1 btn btn-xs btn-error"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>

                                            {/* Mobile: ikon saja */}
                                            <div className="flex gap-1 sm:hidden">
                                                <Link
                                                    href={route("invoices.show", inv.id)}
                                                    className="btn btn-xs btn-info"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>

                                                {role === "finance" && (
                                                    <>
                                                        {inv.status === "draft" && (
                                                            <Link
                                                                href={route("invoices.edit", inv.id)}
                                                                className="btn btn-xs btn-accent"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </Link>
                                                        )}
                                                        <button
                                                            onClick={() => markPrinted(inv.id)}
                                                            className="btn btn-xs btn-primary"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => markSent(inv.id)}
                                                            className="btn btn-xs btn-success"
                                                        >
                                                            <Send className="w-4 h-4" />
                                                        </button>
                                                        {inv.status === "draft" && (
                                                            <button
                                                                onClick={() => handleDelete(inv.id)}
                                                                className="btn btn-xs btn-error"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-6 text-center text-gray-400">
                                        Belum ada invoice.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </motion.div>

                {/* Pagination */}
                {invoices.links && (
                    <div className="flex justify-center gap-2 mt-6">
                        {invoices.links.map((link, idx) => (
                            <button
                                key={idx}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`btn btn-sm ${
                                    link.active ? "btn-primary" : "btn-outline btn-secondary"
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </ModernDashboardLayout>
    );
}
