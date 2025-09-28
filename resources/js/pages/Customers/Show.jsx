import React from "react";
import { Head } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import DetailCard from "@/components/DataTable/DetailCard";

export default function Show({ customer }) {
    return (
        <ModernDashboardLayout>
            <Head title="Detail Customer" />
            <div className="max-w-6xl p-3 mx-auto">
                <DetailCard
                    title="Detail Customer"
                    data={customer}
                    backRoute={route("customers.index")}
                    editRoute={route("customers.edit", customer.id)}
                    showLogo={false}
                    fields={[
                        { label: "Alamat", key: "address", badgeClass: "", full: true },
                        { label: "Kota", key: "city", badgeClass: "badge-info badge-outline" },
                        { label: "Provinsi", key: "province", badgeClass: "badge-secondary badge-outline" },
                        { label: "Kode Pos", key: "postal_code", badgeClass: "badge-accent badge-outline" },
                        { label: "Negara", key: "country", badgeClass: "badge-success badge-outline" },
                        { label: "Telepon", key: "phone", badgeClass: "badge-info badge-outline" },
                        { label: "Email", key: "email", badgeClass: "badge-warning badge-outline", full: true },
                    ]}
                />
            </div>
        </ModernDashboardLayout>
    );
}
