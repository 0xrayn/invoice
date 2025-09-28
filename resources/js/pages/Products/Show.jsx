import React from "react";
import { Link, Head } from "@inertiajs/react";
import { Package, FileText, Tag, ArrowLeft, Pencil } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import AnimatedCard from "@/components/DataTable/AnimatedCard";

export default function Show({ product }) {
  return (
    <ModernDashboardLayout>
      <Head title="Detail Produk" />
      <div className="max-w-6xl p-3 mx-auto">
        <div className="p-4 space-y-6 border shadow-xl sm:p-6 card bg-base-100/50 backdrop-blur-lg border-base-300">

          {/* Header */}
          <AnimatedCard className="flex items-center justify-between mb-6">
            <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Package className="w-6 h-6 text-purple-500 sm:w-7 sm:h-7" />
              <span className="text-lg text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text sm:text-2xl">
                Detail Produk
              </span>
            </h1>
            <Link
              href={route("products.index")}
              className="p-2 btn btn-square btn-primary sm:p-3"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </AnimatedCard>

          {/* Informasi Produk */}
          <AnimatedCard
            className="p-4 space-y-4 transition-all border shadow-xl sm:p-6 card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-purple-400 hover:shadow-purple-400/40"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl text-emerald-400">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Informasi Produk
            </h2>

            {/* Stok */}
            {product.stock.quantity_pcs > 0 ? (
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm sm:text-base">
                <span className="opacity-70">Stok</span>

                {product.stock.quantity_pcs > 0 && (
                  <span className="badge badge-primary">
                    {product.stock.quantity_pcs} {product.unit ?? "pcs"}
                  </span>
                )}

                {Math.floor(product.stock.quantity_pcs / product.pieces_per_carton) > 0 && (
                  <span className="badge badge-outline badge-info">
                    {Math.floor(product.stock.quantity_pcs / product.pieces_per_carton)} karton
                  </span>
                )}

                {product.stock.quantity_pcs % product.pieces_per_carton > 0 && (
                  <span className="badge badge-outline badge-accent">
                    {product.stock.quantity_pcs % product.pieces_per_carton} pcs
                  </span>
                )}

                <span className="text-xs opacity-70">
                  (Isi per Karton: {product.pieces_per_carton} pcs)
                </span>
              </div>
            ) : (
              <p className="mt-1 italic opacity-70">Stok kosong</p>
            )}

            {/* Info tambahan */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs sm:text-sm opacity-70">SKU Produk</p>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm opacity-70">Nama Produk</p>
                <p className="font-medium">{product.name}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm opacity-70">Deskripsi</p>
                <p>{product.description || "-"}</p>
              </div>
            </div>
          </AnimatedCard>

          {/* Harga Produk */}
          <AnimatedCard
            className="p-4 space-y-4 transition-all border shadow-xl sm:p-6 card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl text-primary">
              <Tag className="w-4 h-4 sm:w-5 sm:h-5" /> Harga Produk
            </h2>

            {product.prices.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="table w-full text-sm sm:text-base">
                  <thead>
                    <tr className="bg-base-300">
                      <th>Label</th>
                      <th>Unit</th>
                      <th>Min Qty</th>
                      <th>Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.prices.map((p, i) => (
                      <tr key={i} className="transition hover:bg-base-100/50">
                        <td>{p.label}</td>
                        <td>
                          <span className="badge badge-outline badge-info">
                            {p.unit}
                          </span>
                        </td>
                        <td>{p.min_qty}</td>
                        <td className="font-semibold text-primary">
                          Rp {Number(p.price).toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="opacity-70">Belum ada harga</p>
            )}
          </AnimatedCard>

          {/* Tombol Edit */}
          <div className="flex justify-end">
            <Link
              href={route("products.edit", product.id)}
              className="flex items-center gap-2 shadow-lg btn btn-primary shadow-primary/40"
            >
              <Pencil className="w-4 h-4 sm:w-5 sm:h-5" /> Edit Produk
            </Link>
          </div>
        </div>
      </div>
    </ModernDashboardLayout>
  );
}
