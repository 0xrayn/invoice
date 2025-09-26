import React, { useEffect } from "react";
import { useForm, Link, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Hash, Tag, FileText, Package, Layers, Plus, X, Save, ArrowLeft } from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";

export default function Edit({ product }) {
    const { data, setData, put, processing, errors } = useForm({
        sku: product.sku,
        name: product.name,
        description: product.description || "",
        pieces_per_carton: product.pieces_per_carton,
        prices: product.prices.map((p) => ({
            label: p.label,
            unit: p.unit,
            price: p.price,
            min_qty: p.min_qty || 1,
        })),
        stocks: [
            {
                unit: "carton",
                quantity: Math.floor(product.stock.quantity_pcs / product.pieces_per_carton),
            },
            {
                unit: "pcs",
                quantity: product.stock.quantity_pcs % product.pieces_per_carton,
            },
        ],
        stock_quantity: product.stock.quantity_pcs,
    });

    const totalPcs = (data.stocks || []).reduce((sum, s) => {
        if (s.unit === "carton") {
            return sum + Number(s.quantity || 0) * Number(data.pieces_per_carton);
        }
        return sum + Number(s.quantity || 0);
    }, 0);

    useEffect(() => {
        setData("stock_quantity", totalPcs);
    }, [data.stocks, data.pieces_per_carton]);

    const addPrice = () => {
        setData("prices", [...data.prices, { label: "", unit: "pcs", price: 0, min_qty: 1 }]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("products.update", product.id));
    };

    return (
        <ModernDashboardLayout>
            <Head title="Edit Produk" />
            <div className="max-w-6xl p-3 mx-auto">
                <div className="p-4 space-y-4 border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300 sm:p-6">

                    {/* Header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex items-center justify-between mb-6"
                    >
                        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
                            <Package className="w-6 h-6 text-emerald-500 sm:w-7 sm:h-7" />
                            <span className="text-lg text-transparent bg-gradient-to-r from-emerald-500 via-blue-500 to-cyan-500 bg-clip-text sm:text-2xl">
                                Edit Produk
                            </span>
                        </h1>

                        <Link
                            href={route("products.index")}
                            className="p-2 btn btn-square btn-primary sm:p-3"
                        >
                            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                        </Link>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* Informasi Produk */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="p-4 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50 sm:p-6"
                        >
                            <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl text-emerald-400">
                                <FileText className="w-4 h-4 sm:w-5 sm:h-5" /> Informasi Produk
                            </h2>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {/* SKU (readonly) */}
                                <div className="form-control">
                                    <label className="gap-2 label">
                                        <Hash className="w-4 h-4" />
                                        <span className="text-sm label-text sm:text-base">SKU Produk</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.sku}
                                        readOnly
                                        className="w-full bg-gray-100 cursor-not-allowed input input-bordered"
                                    />
                                </div>

                                {/* Nama */}
                                <div className="form-control">
                                    <label className="gap-2 label">
                                        <Tag className="w-4 h-4" />
                                        <span className="text-sm label-text sm:text-base">Nama Produk</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData("name", e.target.value)}
                                        className="w-full input input-bordered"
                                    />
                                    {errors.name && (
                                        <span className="text-xs text-error sm:text-sm">
                                            {errors.name}
                                        </span>
                                    )}
                                </div>

                                {/* Deskripsi */}
                                <div className="sm:col-span-2 form-control">
                                    <label className="gap-2 label">
                                        <FileText className="w-4 h-4" />
                                        <span className="text-sm label-text sm:text-base">Deskripsi</span>
                                    </label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                        className="w-full textarea textarea-bordered"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Stok */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="p-4 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50 sm:p-6"
                        >
                            <h2 className="flex items-center gap-2 text-lg font-semibold sm:text-xl text-cyan-400">
                                <Layers className="w-4 h-4 sm:w-5 sm:h-5" /> Stok Produk
                            </h2>

                            <div className="form-control">
                                <label className="text-sm label sm:text-base">Isi per Karton</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.pieces_per_carton}
                                    onChange={(e) => setData("pieces_per_carton", e.target.value)}
                                    className="w-full input input-bordered"
                                />
                            </div>

                            <div className="space-y-2 overflow-x-auto">
                                {data.stocks.map((s, i) => (
                                    <div key={i} className="flex items-center gap-2 mb-2">
                                        <select
                                            value={s.unit}
                                            onChange={(e) => {
                                                const newStocks = [...data.stocks];
                                                newStocks[i].unit = e.target.value;
                                                setData("stocks", newStocks);
                                            }}
                                            className="select select-bordered w-28"
                                        >
                                            <option value="carton">Karton</option>
                                            <option value="pcs">Pcs</option>
                                        </select>
                                        <input
                                            type="number"
                                            min="0"
                                            value={s.quantity}
                                            onChange={(e) => {
                                                const newStocks = [...data.stocks];
                                                newStocks[i].quantity = e.target.value;
                                                setData("stocks", newStocks);
                                            }}
                                            className="flex-1 input input-bordered"
                                            placeholder={`Jumlah ${s.unit}`}
                                        />
                                        {data.stocks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newStocks = data.stocks.filter((_, idx) => idx !== i);
                                                    setData("stocks", newStocks);
                                                }}
                                                className="btn btn-error btn-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <p className="text-xs sm:text-sm opacity-70">
                                Total stok: <span className="font-semibold text-purple-400">{totalPcs}</span> pcs
                            </p>
                        </motion.div>

                        {/* Harga */}
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="p-4 space-y-4 overflow-x-auto transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50 sm:p-6"
                        >
                            <h2 className="flex items-center gap-2 text-lg font-semibold text-pink-400 sm:text-xl">
                                <Tag className="w-4 h-4 sm:w-5 sm:h-5" /> Harga Produk
                            </h2>

                            <div className="grid grid-cols-4 gap-2 mb-2 text-xs font-semibold sm:text-sm">
                                <span>Label</span>
                                <span>Unit</span>
                                <span>Min Qty</span>
                                <span>Harga</span>
                            </div>

                            {data.prices.map((price, i) => (
                                <div key={i} className="grid items-center grid-cols-4 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Grosir, Eceran"
                                        value={price.label}
                                        onChange={(e) => {
                                            const newPrices = [...data.prices];
                                            newPrices[i].label = e.target.value;
                                            setData("prices", newPrices);
                                        }}
                                        className="input input-bordered"
                                    />
                                    <select
                                        value={price.unit}
                                        onChange={(e) => {
                                            const newPrices = [...data.prices];
                                            newPrices[i].unit = e.target.value;
                                            setData("prices", newPrices);
                                        }}
                                        className="select select-bordered"
                                    >
                                        <option value="pcs">Per Pcs</option>
                                        <option value="carton">Per Karton</option>
                                    </select>
                                    <input
                                        type="number"
                                        min="1"
                                        value={price.min_qty}
                                        onChange={(e) => {
                                            const newPrices = [...data.prices];
                                            newPrices[i].min_qty = e.target.value;
                                            setData("prices", newPrices);
                                        }}
                                        className="input input-bordered"
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={price.price}
                                            onChange={(e) => {
                                                const newPrices = [...data.prices];
                                                newPrices[i].price = e.target.value;
                                                setData("prices", newPrices);
                                            }}
                                            className="flex-1 input input-bordered"
                                        />
                                        {data.prices.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newPrices = data.prices.filter((_, idx) => idx !== i);
                                                    setData("prices", newPrices);
                                                }}
                                                className="btn btn-error btn-sm"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addPrice}
                                className="flex items-center gap-1 mt-2 btn btn-warning btn-sm"
                            >
                                <Plus className="w-4 h-4" /> Tambah Harga
                            </button>
                        </motion.div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-3 mt-6">
                            <Link href={route("products.index")} className="btn btn-ghost">
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex gap-1 shadow-lg btn btn-primary shadow-primary/40"
                            >
                                <Save className="w-4 h-4" /> Simpan Perubahan
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </ModernDashboardLayout>
    );
}
