import React from "react";
import { Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Pencil } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

export default function Show({ customer }) {
    return (
        <ModernDashboardLayout>
            <Head title="Detail Perusahaan" />
            <div className="max-w-6xl p-3 mx-auto">
                <div className="p-6 space-y-6 border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300">

                    {/* Header */}
                    <motion.div
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <h1 className="flex items-center gap-2 text-3xl font-bold">
                            <Building2 className="text-purple-500 w-7 h-7" />
                            <span className="text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text">
                                Detail Perusahaan
                            </span>
                        </h1>

                        <Link
                            href={route("customers.index")}
                            className="flex items-center gap-2 shadow-md btn btn-primary"
                        >
                            <ArrowLeft className="w-4 h-4" /> Kembali
                        </Link>
                    </motion.div>

                    {/* Informasi Perusahaan */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="p-6 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-purple-400 hover:shadow-purple-400/40"
                    >
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-semibold">{customer.name}</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <p className="text-sm opacity-70">Alamat</p>
                                <p className="font-medium">{customer.address}</p>
                            </div>

                            <div>
                                <p className="text-sm opacity-70">Kota</p>
                                <span className="badge badge-info badge-outline">
                                    {customer.city}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm opacity-70">Provinsi</p>
                                <span className="badge badge-secondary badge-outline">
                                    {customer.province}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm opacity-70">Kode Pos</p>
                                <span className="badge badge-accent badge-outline">
                                    {customer.postal_code}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm opacity-70">Negara</p>
                                <span className="badge badge-success badge-outline">
                                    {customer.country}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm opacity-70">Telepon</p>
                                <span className="badge badge-info badge-outline">
                                    {customer.phone}
                                </span>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm opacity-70">Email</p>
                                <span className="badge badge-warning badge-outline">
                                    {customer.email}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tombol Aksi */}
                    <div className="flex justify-end gap-3">
                        <Link
                            href={route("customers.index")}
                            className="btn btn-ghost"
                        >
                            Kembali
                        </Link>
                        <Link
                            href={route("customers.edit", customer.id)}
                            className="flex items-center gap-2 shadow-lg btn btn-primary shadow-primary/40"
                        >
                            <Pencil className="w-4 h-4" /> Edit Perusahaan
                        </Link>
                    </div>
                </div>
            </div>
        </ModernDashboardLayout>
    );
}
