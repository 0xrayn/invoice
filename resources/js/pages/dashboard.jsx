"use client";
import React, { useMemo } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import Chart from "react-apexcharts";
import {
    Activity,
    DollarSign,
    FileText,
    Users,
    Box,
    Clock,
} from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

function StatCard({ icon, title, subtitle, value, accent = "bg-gradient-to-r from-indigo-500 to-purple-500" }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className={`card shadow-lg bg-opacity-60 backdrop-blur-md border border-white/6 ${accent} text-white overflow-hidden`}
        >
            <div className="p-4 card-body">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <h4 className="text-sm font-medium opacity-90">{title}</h4>
                        <p className="text-xs opacity-80">{subtitle}</p>
                        <div className="mt-3 textarea-lg font-extrabold tracking-tight">{value}</div>
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-white/12">
                        {icon}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default function Dashboard() {
    const { auth, adminStats = {}, salesStats = {}, recentInvoices = [], salesChart = [] } = usePage().props;
    const user = auth?.user || {};

    const currency = useMemo(
        () => (v) => (typeof v === "number" ? `Rp ${Math.floor(v).toLocaleString("id-ID")}` : v ?? "Rp 0"),
        []
    );


    const gradients = {
        indigo: "bg-gradient-to-r from-indigo-600 to-violet-600",
        green: "bg-gradient-to-r from-emerald-500 to-green-600",
        red: "bg-gradient-to-r from-rose-500 to-pink-500",
        blue: "bg-gradient-to-r from-sky-500 to-indigo-500",
    };

    const chartOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: "inherit",
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: "45%",
                endingShape: "rounded",
                horizontal: false,
            },
        },
        dataLabels: { enabled: false },
        xaxis: {
            categories: salesChart.map((d) => d.month),
            labels: { style: { colors: "currentColor", fontSize: "12px" } },
        },
        yaxis: {
            labels: {
                style: { colors: "currentColor", fontSize: "11px" },
                formatter: (v) => `Rp ${Math.round(v).toLocaleString("id-ID")}`
            },
        },
        colors: ["#6366F1"],
        tooltip: {
            theme: "light",
            y: {
                formatter: (v) => `Rp ${Math.round(v).toLocaleString("id-ID")}`
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const value = series[seriesIndex][dataPointIndex];
                const label = w.globals.labels[dataPointIndex];
                return `
      <div class="rounded-lg shadow-md px-3 py-2 bg-base-100 text-base-content border border-base-200">
        <div class="text-xs font-medium">${label}</div>
        <div class="text-sm font-bold">Rp ${Math.round(value).toLocaleString("id-ID")}</div>
      </div>
    `;
            },
        },
        grid: {
            borderColor: "#e5e7eb",
            strokeDashArray: 4,
            yaxis: { lines: { show: true } },
        },
    };

    const chartSeries = [
        {
            name: "Total Penjualan",
            data: salesChart.map((d) => d.total),
        },
    ];

    return (
        <ModernDashboardLayout>
            <Head title="Dashboard — Modern" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                    className="flex items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-2xl font-bold">Halo, {user?.name ?? "User"} ✨</h1>
                        <p className="text-sm text-muted-foreground">Ringkasan singkat aktivitas dan performa</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="btn btn-ghost btn-sm">Last 30 days</button>
                    </div>
                </motion.div>

                {/* Stat Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {user?.role === "admin" ? (
                        <>
                            <StatCard
                                icon={<DollarSign size={18} />}
                                title="Total Penjualan"
                                subtitle="Bulan ini"
                                value={currency(Number(adminStats.total_sales ?? 0))}
                                accent={gradients.indigo}
                            />
                            <StatCard
                                icon={<FileText size={18} />}
                                title="Invoices"
                                subtitle="Bulan ini"
                                value={adminStats.invoices_count ?? 0}
                                accent={gradients.blue}
                            />
                            <StatCard
                                icon={<Users size={18} />}
                                title="Customers"
                                subtitle="Total pelanggan"
                                value={adminStats.customers_count ?? 0}
                                accent={gradients.green}
                            />
                            <StatCard
                                icon={<Box size={18} />}
                                title="Products"
                                subtitle="Total produk"
                                value={adminStats.products_count ?? 0}
                                accent={gradients.red}
                            />
                        </>
                    ) : (
                        <>
                            <StatCard
                                icon={<FileText size={18} />}
                                title="Invoices Hari Ini"
                                subtitle="Dibuat oleh Anda"
                                value={salesStats.my_invoices_today ?? 0}
                                accent={gradients.indigo}
                            />
                            <StatCard
                                icon={<Activity size={18} />}
                                title="Total Penjualan"
                                subtitle="Bulan ini"
                                value={currency(Number(salesStats.my_total_sales ?? 0))}
                                accent={gradients.green}
                            />
                            <StatCard
                                icon={<Users size={18} />}
                                title="Customers"
                                subtitle="Total pelanggan"
                                value={salesStats.customers_count ?? 0}
                                accent={gradients.blue}
                            />
                            <StatCard
                                icon={<Clock size={18} />}
                                title="Pending Drafts"
                                subtitle="Belum dicetak / kirim"
                                value={salesStats?.sales_draft_invoices ?? 0}
                                accent={gradients.red}
                            />
                        </>
                    )}
                </div>

                {/* Grafik + Invoices */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Sales Overview pakai ApexCharts */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 shadow-lg card bg-base-100 lg:col-span-2 text-base-content"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-semibold">Sales Overview</h3>
                                <p className="text-xs text-muted-foreground">Penjualan per bulan</p>
                            </div>
                            <div className="text-sm text-muted-foreground">Compare with last period</div>
                        </div>

                        <Chart options={chartOptions} series={chartSeries} type="bar" height={300} />

                        {/* Admin only extra stats */}
                        {user?.role === "admin" && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                <div className="p-3 rounded-lg bg-base-200">
                                    <h4 className="text-sm font-medium">Low Stock</h4>
                                    <p className="text-xs text-muted-foreground">Stok &lt; 10 pcs</p>
                                    <div className="mt-2 text-2xl font-bold text-red-500">
                                        {adminStats.low_stock ?? 0}
                                    </div>
                                </div>
                                <div className="p-3 rounded-lg bg-base-200">
                                    <h4 className="text-sm font-medium">Draft Invoices</h4>
                                    <p className="text-xs text-muted-foreground">Belum lunas</p>
                                    <div className="mt-2 text-2xl font-bold text-orange-500">
                                        {adminStats.draft_invoices ?? 0}
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Recent Invoices */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="p-4 shadow-lg card bg-base-100 text-base-content"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <h3 className="text-lg font-semibold">Recent Invoices</h3>
                                <p className="text-xs text-muted-foreground">5 terbaru</p>
                            </div>
                            <Link href={route('invoices.index')} className="btn btn-ghost btn-xs">
                                View all
                            </Link>
                        </div>
                        <ul className="mt-2 divide-y divide-base-200">
                            {recentInvoices.length === 0 ? (
                                <li className="py-6 text-sm text-muted-foreground">Belum ada invoice terbaru</li>
                            ) : (
                                recentInvoices.slice(0, 5).map((inv) => (
                                    <li key={inv.id} className="flex items-center justify-between py-3">
                                        <div className="flex-1">
                                            <div className="text-sm font-medium">{inv.invoice_no}</div>
                                            <div className="text-xs text-muted-foreground">{inv.customer?.name ?? "-"}</div>
                                        </div>
                                        <div className="text-sm font-semibold">{currency(Number(inv.grand_total))}</div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </motion.div>
                </div>

                {!user?.role && (
                    <div className="alert alert-warning">
                        <span>Belum ada role</span>
                    </div>
                )}
            </div>
        </ModernDashboardLayout>
    );
}
