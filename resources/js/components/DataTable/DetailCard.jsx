import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Building2, ArrowLeft, Pencil } from "lucide-react";

export default function DetailCard({
    title,
    data,
    fields,
    backRoute,
    editRoute,
    showLogo = false,
}) {
    return (
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
                        {title}
                    </span>
                </h1>

                <Link
                    href={backRoute}
                    className="flex items-center gap-2 shadow-md btn btn-primary"
                >
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>
            </motion.div>

            {/* Informasi */}
            <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="p-6 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-purple-400 hover:shadow-purple-400/40"
            >
                <div className="flex items-center gap-4">
                    {showLogo && data.logo_path ? (
                        <img
                            src={`/storage/${data.logo_path}`}
                            alt="logo"
                            className="w-24 h-24 border rounded-lg border-base-300"
                        />
                    ) : showLogo ? (
                        <div className="flex items-center justify-center w-24 h-24 bg-gray-200 border rounded-lg border-base-300">
                            <span className="text-sm text-gray-500">No Logo</span>
                        </div>
                    ) : null}

                    <h2 className="text-2xl font-semibold">{data.name}</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
                    {fields.map(({ label, key, badgeClass, full }) => (
                        <div key={key} className={full ? "sm:col-span-2" : ""}>
                            <p className="text-sm opacity-70">{label}</p>
                            <span className={`badge ${badgeClass}`}>
                                {data[key] || "-"}
                            </span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Tombol Aksi */}
            <div className="flex justify-end gap-3">
                <Link href={backRoute} className="btn btn-ghost">
                    Kembali
                </Link>
                <Link
                    href={editRoute}
                    className="flex items-center gap-2 shadow-lg btn btn-primary shadow-primary/40"
                >
                    <Pencil className="w-4 h-4" /> Edit
                </Link>
            </div>
        </div>
    );
}
