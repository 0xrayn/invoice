import React from "react";
import { Head, router, usePage } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import AnimatedCard from "@/Components/DataTable/AnimatedCard";
import { Bell } from "lucide-react";

export default function Index() {
    const { notifications } = usePage().props;

    return (
        <ModernDashboardLayout>
            <Head title="Notifikasi" />

            {/* SAMA dengan halaman Produk */}
            <div className="p-4 mx-auto max-w-7xl">

                {/* Header */}
                <AnimatedCard className="flex items-center justify-between mb-6">
                    <h1 className="flex items-center gap-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500">
                        <Bell className="w-8 h-8 text-purple-400" /> Semua Notifikasi
                    </h1>
                </AnimatedCard>

                {/* List Notifikasi */}
                <AnimatedCard className="p-4 overflow-x-auto border shadow-xl bg-base-100/50 backdrop-blur-lg border-base-300">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-gray-500">Tidak ada notifikasi.</p>
                    ) : (
                        <ul className="space-y-3">
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className="p-4 transition border shadow-sm rounded-xl border-base-300 bg-base-200/50 hover:bg-base-200 cursor-pointer"
                                    onClick={() => {
                                        // langsung arahkan ke URL notifikasi
                                        if (n.data.url) {
                                            // tandai sebagai sudah dibaca di server via GET route
                                            window.location.href = route("notifications.read", n.id);
                                        }
                                    }}
                                >
                                    <p className="text-sm leading-relaxed">{n.data.message}</p>
                                    <span className="block mt-2 text-xs text-gray-500">
                                        {new Date(n.created_at).toLocaleString("id-ID")}
                                    </span>
                                </li>
                            ))}
                        </ul>


                    )}
                </AnimatedCard>
            </div>
        </ModernDashboardLayout>
    );
}
