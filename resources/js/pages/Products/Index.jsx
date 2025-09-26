import React from "react";
import { Link, router, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

export default function Index({ products }) {
    const handleDelete = (id) => {
        if (confirm("Yakin ingin menghapus produk ini?")) {
            router.delete(route("products.destroy", id));
        }
    };

    const formatRupiah = (value) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(value);

    return (
        <ModernDashboardLayout>
            <Head title="Dashboard" />
            <div className="p-3 mx-auto max-w-7xl">
                <div className="p-6 space-y-4 border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300">
                    {/* Header */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-wrap items-center justify-between gap-4 mb-8"
                    >
                        <h1 className="text-3xl font-bold text-transparent sm:text-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text">
                            <span className="text-2xl sm:hidden">✨ Daftar Produk</span>
                            <span className="hidden sm:inline">✨ Daftar Produk</span>
                        </h1>

                        <Link
                            href={route("products.create")}
                            className="flex items-center justify-center gap-2 p-2 shadow-md btn btn-primary sm:p-3"
                        >
                            {/* Icon lebih kecil di mobile */}
                            <Plus className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Tambah Produk</span>
                        </Link>
                    </motion.div>

                    {/* Wrapper Card */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="p-2 space-y-4 overflow-x-auto transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50"
                    >
                        <div className="p-0 card-body">
                            <table className="table w-full min-w-[600px]">
                                <thead>
                                    <tr>
                                        <th>Nama Produk</th>
                                        <th>SKU</th>
                                        <th>Stok</th>
                                        <th>Harga</th>
                                        <th className="text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.data.map((product) => (
                                        <tr
                                            key={product.id}
                                            className="transition-colors duration-200 hover:bg-primary/10"
                                        >
                                            <td className="font-bold text-emerald-400">
                                                {product.name}
                                            </td>
                                            <td className="font-mono text-sm text-gray-500">
                                                {product.sku}
                                            </td>
                                            <td>{product.stock?.quantity_pcs || 0} pcs</td>
                                            <td>
                                                <div className="flex flex-col gap-1">
                                                    {product.prices.map((p, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block px-2 py-1 text-xs rounded-md bg-base-300/40"
                                                        >
                                                            {p.label} ({p.unit}, min {p.min_qty}):{" "}
                                                            <span className="font-bold text-emerald-500">
                                                                {formatRupiah(p.price)}
                                                            </span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                {/* Tombol aksi */}
                                                <div className="flex justify-end gap-1">
                                                    {/* Show */}
                                                    <Link
                                                        href={route("products.show", product.id)}
                                                        className="flex items-center justify-center p-2 btn btn-xs btn-ghost"
                                                    >
                                                        <Eye className="w-4 h-4 sm:w-4 sm:h-4" />
                                                        <span className="hidden ml-1 sm:inline">Show</span>
                                                    </Link>

                                                    {/* Edit */}
                                                    <Link
                                                        href={route("products.edit", product.id)}
                                                        className="flex items-center justify-center p-2 btn btn-xs btn-accent"
                                                    >
                                                        <Pencil className="w-4 h-4 sm:w-4 sm:h-4" />
                                                        <span className="hidden ml-1 sm:inline">Edit</span>
                                                    </Link>

                                                    {/* Delete */}
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="flex items-center justify-center p-2 btn btn-xs btn-error"
                                                    >
                                                        <Trash2 className="w-4 h-4 sm:w-4 sm:h-4" />
                                                        <span className="hidden ml-1 sm:inline">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>

                    {/* Pagination */}
                    <div className="flex flex-wrap justify-center gap-2 mt-10">
                        {products.links &&
                            products.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`btn btn-sm ${
                                        link.active
                                            ? "btn-primary"
                                            : "btn-outline btn-secondary"
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </ModernDashboardLayout>
    );
}
