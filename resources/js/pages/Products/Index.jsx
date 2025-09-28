import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import AnimatedCard from "@/Components/DataTable/AnimatedCard";
import DataTable from "@/Components/DataTable/DataTable";
import Pagination from "@/Components/DataTable/Pagination";
import { formatRupiah} from "@/lib/formatters";


export default function Index() {
  const { products, flash } = usePage().props;

  const handleDelete = (id) => {
    if (confirm("Yakin ingin menghapus produk ini?")) {
      router.delete(route("products.destroy", id));
    }
  };

//   const formatRupiah = (value) =>
//     new Intl.NumberFormat("id-ID", {
//       style: "currency",
//       currency: "IDR",
//       minimumFractionDigits: 0,
//     }).format(value);

  const columns = [
    { label: "Nama Produk", key: "name", tdClassName: "font-bold text-emerald-400" },
    { label: "SKU", key: "sku", tdClassName: "font-mono text-sm text-gray-500" },
    { label: "Stok", key: "stock.quantity_pcs", format: (v, row) => `${row.stock?.quantity_pcs || 0} pcs` },
    {
      label: "Harga",
      key: "prices",
      render: (row) => (
        <div className="flex flex-col gap-1">
          {row.prices.map((p, idx) => (
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
      ),
    },
  ];

  const actions = (product) => [
    <Link
      key="show"
      href={route("products.show", product.id)}
      className="flex items-center gap-1 btn btn-xs btn-ghost"
    >
      <Eye className="w-4 h-4" /> Show
    </Link>,
    <Link
      key="edit"
      href={route("products.edit", product.id)}
      className="flex items-center gap-1 btn btn-xs btn-accent"
    >
      <Pencil className="w-4 h-4" /> Edit
    </Link>,
    <button
      key="delete"
      onClick={() => handleDelete(product.id)}
      className="flex items-center gap-1 btn btn-xs btn-error"
    >
      <Trash2 className="w-4 h-4" /> Delete
    </button>,
  ];

  return (
    <ModernDashboardLayout>
      <Head title="Daftar Produk" />
      <div className="p-4 mx-auto max-w-7xl">
        {/* Header */}
        <AnimatedCard className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500">
            ✨ Daftar Produk
          </h1>
          <Link
            href={route("products.create")}
            className="flex items-center gap-2 shadow-md btn btn-primary"
          >
            <Plus className="w-4 h-4" /> Tambah Produk
          </Link>
        </AnimatedCard>

        {/* Flash message */}
        {flash?.success && <div className="mb-4 alert alert-success">{flash.success}</div>}

        {/* Tabel Produk */}
        <AnimatedCard className="p-4 overflow-x-auto border shadow-xl bg-base-100/50 backdrop-blur-lg border-base-300">
          <DataTable
            columns={columns}
            data={products.data}
            actions={actions}
            emptyMessage="Belum ada produk."
          />
        </AnimatedCard>

        {/* Pagination */}
        <Pagination links={products.links} />
      </div>
    </ModernDashboardLayout>
  );
}
