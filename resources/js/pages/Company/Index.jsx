import React, { useState } from "react";
import { Link, usePage, Head, router } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Pencil} from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

export default function Index({ companies }) {
    const { flash } = usePage().props;
    const [selectedAddress, setSelectedAddress] = useState(null);

    return (
        <ModernDashboardLayout>
            <Head title="Perusahaan" />
            <div className="p-4 mx-auto max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center justify-between mb-6"
                >
                    <h1 className="flex items-center gap-2 text-3xl font-bold text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text">
                        ✨ Perusahaan
                    </h1>
                </motion.div>

                {flash?.success && (
                    <div className="mb-4 alert alert-success">
                        {flash.success}
                    </div>
                )}

                {/* Tabel Perusahaan */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 overflow-x-auto border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300"
                >
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Alamat</th>
                                <th>Telepon</th>
                                <th>Email</th>
                                <th className="text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {companies.data.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-6 text-center text-gray-400">
                                        Belum ada data perusahaan.
                                    </td>
                                </tr>
                            ) : (
                                companies.data.map((company) => (
                                    <tr
                                        key={company.id}
                                        className="transition-colors duration-200 hover:bg-primary/10"
                                    >
                                        <td className="font-semibold text-emerald-400">{company.name}</td>
                                        <td
                                            className="max-w-xs text-blue-500 truncate cursor-pointer"
                                            onClick={() => setSelectedAddress(company.address)}
                                            title="Klik untuk melihat lengkap"
                                        >
                                            {company.address || "-"}
                                        </td>
                                        <td>{company.phone || "-"}</td>
                                        <td>{company.email || "-"}</td>
                                        <td className="flex justify-end gap-2">
                                            <Link
                                                href={route("companies.show", company.id)}
                                                className="flex items-center gap-1 btn btn-xs btn-ghost"
                                            >
                                                <Eye className="w-4 h-4" /> Detail
                                            </Link>
                                            <Link
                                                href={route("companies.edit", company.id)}
                                                className="flex items-center gap-1 btn btn-xs btn-accent"
                                            >
                                                <Pencil className="w-4 h-4" /> Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-6">
                    {companies.links.map((link, idx) => (
                        <button
                            key={idx}
                            disabled={!link.url}
                            onClick={() => link.url && router.get(link.url)}
                            className={`btn btn-sm ${link.active ? "btn-primary" : "btn-outline btn-secondary"}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedAddress && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md p-6 rounded-lg shadow-lg bg-base-100"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            <h2 className="mb-4 text-lg font-bold">Alamat Lengkap</h2>
                            <p className="break-words">{selectedAddress}</p>
                            <button
                                className="mt-4 btn btn-sm btn-primary"
                                onClick={() => setSelectedAddress(null)}
                            >
                                Tutup
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </ModernDashboardLayout>
    );
}
