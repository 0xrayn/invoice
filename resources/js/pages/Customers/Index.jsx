// Pages/Customers/Index.jsx
import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { Eye, Pencil, Trash2, Plus } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import DataTable from "@/Components/DataTable/DataTable";
import Pagination from "@/Components/DataTable/Pagination";
import AddressModal from "@/Components/DataTable/AddressModal";
import AnimatedCard from "@/Components/DataTable/AnimatedCard";

export default function Index() {
  const { customers, flash } = usePage().props;
  const [selectedAddress, setSelectedAddress] = useState(null);

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus client ini?")) {
      router.delete(route("customers.destroy", id));
    }
  };

  const columns = [
    { label: "Nama", key: "name", tdClassName: "font-semibold text-emerald-400" },
    { label: "Alamat", key: "address", clickable: true, tdClassName: "text-blue-500 truncate" },
    { label: "Telepon", key: "phone" },
    { label: "Email", key: "email" },
  ];

  const actions = (customer) => [
    <Link key="detail" href={route("customers.show", customer.id)} className="flex items-center gap-1 btn btn-xs btn-ghost">
      <Eye className="w-4 h-4" /> Detail
    </Link>,
    <Link key="edit" href={route("customers.edit", customer.id)} className="flex items-center gap-1 btn btn-xs btn-accent">
      <Pencil className="w-4 h-4" /> Edit
    </Link>,
    <button key="delete" onClick={() => handleDelete(customer.id)} className="flex items-center gap-1 btn btn-xs btn-error">
      <Trash2 className="w-4 h-4" /> Hapus
    </button>,
  ];

  return (
    <ModernDashboardLayout>
      <Head title="Daftar Client" />
      <div className="p-4 mx-auto max-w-7xl">

        {/* Header */}
        <AnimatedCard className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500">
            ✨ Daftar Client
          </h1>
          <Link href={route("customers.create")} className="flex items-center gap-2 shadow-md btn btn-primary">
            <Plus className="w-4 h-4" /> Tambah Client
          </Link>
        </AnimatedCard>

        {/* Flash */}
        {flash?.success && <div className="mb-4 alert alert-success">{flash.success}</div>}

        {/* DataTable */}
        <AnimatedCard className="p-4 overflow-x-auto border shadow-xl bg-base-100/50 backdrop-blur-lg border-base-300">
          <DataTable
            columns={columns}
            data={customers.data}
            actions={actions}
            onRowClick={(row) => row.address && setSelectedAddress(row.address)}
            emptyMessage="Belum ada data client."
          />
        </AnimatedCard>

        {/* Pagination */}
        <Pagination links={customers.links} />

        {/* Modal */}
        {selectedAddress && <AddressModal address={selectedAddress} onClose={() => setSelectedAddress(null)} />}
      </div>
    </ModernDashboardLayout>
  );
}
