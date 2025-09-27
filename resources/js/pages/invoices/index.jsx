import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Eye, Pencil, Trash2, Plus, FileText, Send } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/Components/DataTable/DataTable";
import Pagination from "@/Components/DataTable/Pagination";
import AnimatedCard from "@/Components/DataTable/AnimatedCard";
import { formatDate, formatCurrency } from "@/lib/formatters";
import { deleteInvoice, markInvoicePrinted, markInvoiceSent } from "@/lib/Action";

export default function Index() {
    const { invoices, flash, auth } = usePage().props;
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const role = auth?.user?.role || "guest";

    const columns = [
        { label: "No", key: "no", format: (val, row, idx) => String((Number(invoices.from) || 1) + idx) },
        { label: "No Invoice", key: "invoice_no", tdClassName: "font-semibold text-cyan-400" },
        { label: "Customer", key: "customer", format: (val, row) => row.customer?.name ?? "-" },
        { label: "Tanggal", key: "invoice_date", format: formatDate },
        { label: "Total", key: "grand_total", tdClassName: "text-right font-semibold text-emerald-400", format: (val, row) => formatCurrency(val, row.currency) },
        {
            label: "Status", key: "status", format: (val) => {
                let className = "";
                switch (val) {
                    case "draft": className = "badge badge-outline"; break;
                    case "printed": className = "badge badge-success"; break;
                    case "sent": className = "badge badge-info"; break;
                    default: className = "badge badge-secondary";
                }
                return <span className={className}>{val}</span>;
            }
        },

    ];

    const actions = (inv) => (
        <>
            <Link href={route("invoices.show", inv.id)} className="flex items-center gap-1 btn btn-xs btn-info">
                <Eye className="w-4 h-4" />
            </Link>

            {role === "finance" && (
                <>
                    {inv.status === "draft" && (
                        <Link href={route("invoices.edit", inv.id)} className="flex items-center gap-1 btn btn-xs btn-accent">
                            <Pencil className="w-4 h-4" />
                        </Link>
                    )}
                    <button onClick={() => markInvoicePrinted(inv.id)} className="flex items-center gap-1 btn btn-xs btn-primary">
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                    <button onClick={() => markInvoiceSent(inv.id)} className="flex items-center gap-1 btn btn-xs btn-success">
                        <Send className="w-4 h-4" /> WA
                    </button>
                    {inv.status === "draft" && (
                        <button onClick={() => deleteInvoice(inv.id)} className="flex items-center gap-1 btn btn-xs btn-error">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </>
            )}
        </>
    );

    return (
        <ModernDashboardLayout>
            <Head title="Daftar Invoice" />
            <div className="p-4 mx-auto max-w-7xl">

                <AnimatedCard className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h1 className="flex items-center gap-2 text-2xl font-bold text-transparent sm:text-3xl bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-violet-600">
                        📑 Daftar Invoice
                    </h1>

                    {role === "finance" && (
                        <Link href={route("invoices.create")} className="flex items-center gap-2 shadow-md btn btn-primary">
                            <Plus className="w-4 h-4" /> Buat Invoice
                        </Link>
                    )}
                </AnimatedCard>

                {flash?.success && <div className="mb-4 alert alert-success">{flash.success}</div>}
                {flash?.error && <div className="mb-4 alert alert-error">{flash.error}</div>}

                <AnimatedCard className="p-4 overflow-x-auto border shadow-xl bg-base-100/50 backdrop-blur-lg border-base-300">
                    <DataTable columns={columns} data={invoices.data} actions={actions} emptyMessage="Belum ada invoice." />
                </AnimatedCard>

                {invoices.links && <Pagination links={invoices.links} />}
            </div>
        </ModernDashboardLayout>
    );
}
