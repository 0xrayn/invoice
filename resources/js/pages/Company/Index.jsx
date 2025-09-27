import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Eye, Pencil } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/Components/DataTable/DataTable";
import Pagination from "@/Components/DataTable/Pagination";
import AddressModal from "@/Components/DataTable/AddressModal";
import AnimatedCard from "@/Components/DataTable/AnimatedCard";

export default function Index() {
    const { companies, flash } = usePage().props;
    const [selectedAddress, setSelectedAddress] = useState(null);

    const columns = [
        { label: "Nama", key: "name", tdClassName: "font-semibold text-emerald-400" },
        { label: "Alamat", key: "address", clickable: true, tdClassName: "text-blue-500 truncate" },
        { label: "Telepon", key: "phone" },
        { label: "Email", key: "email" },
    ];

    const actions = (company) => [
        <Link key="detail" href={route("companies.show", company.id)} className="flex items-center gap-1 btn btn-xs btn-ghost">
            <Eye className="w-4 h-4" /> Detail
        </Link>,
        <Link key="edit" href={route("companies.edit", company.id)} className="flex items-center gap-1 btn btn-xs btn-accent">
            <Pencil className="w-4 h-4" /> Edit
        </Link>,
    ];

    return (
        <ModernDashboardLayout>
            <Head title="Perusahaan" />
            <div className="p-4 mx-auto max-w-7xl">
                {/* Header */}
                <AnimatedCard className="flex items-center justify-between mb-6">
                    <h1 className="flex items-center gap-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500">
                        ✨ Perusahaan
                    </h1>
                </AnimatedCard>

                {/* Flash */}
                {flash?.success && <div className="mb-4 alert alert-success">{flash.success}</div>}

                {/* DataTable */}
                <AnimatedCard className="p-4 overflow-x-auto border shadow-xl bg-base-100/50 backdrop-blur-lg border-base-300">
                    <DataTable
                        columns={columns}
                        data={companies.data}
                        actions={actions}
                        onRowClick={(row) => row.address && setSelectedAddress(row.address)}
                        emptyMessage="Belum ada data perusahaan."
                    />
                </AnimatedCard>

                {/* Pagination */}
                <Pagination links={companies.links} />

                {/* Modal */}
                {selectedAddress && <AddressModal address={selectedAddress} onClose={() => setSelectedAddress(null)} />}
            </div>
        </ModernDashboardLayout>
    );
}
