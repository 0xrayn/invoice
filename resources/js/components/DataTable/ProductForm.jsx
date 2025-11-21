import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Hash, Tag, FileText, Layers, Plus, X, Save, ArrowLeft, Package } from "lucide-react";
import { Link } from "@inertiajs/react";
import { formatRupiah, parseRupiah } from "@/lib/formatters";

export default function ProductForm({ data, setData, errors, processing, onSubmit, mode = "create" }) {
    // Hitung total pcs
    const totalPcs = (data.stocks || []).reduce((sum, s) => {
        if (s.unit === "carton") {
            return sum + Number(s.quantity || 0) * Number(data.pieces_per_carton);
        }
        return sum + Number(s.quantity || 0);
    }, 0);

    useEffect(() => {
        setData("stock_quantity", totalPcs);
    }, [data.stocks, data.pieces_per_carton]);

    // ✅ cek otomatis sekali aja waktu awal render
    useEffect(() => {
        const hasEceran = data.prices.some(
            (p) => p.unit === "pcs" && Number(p.min_qty) === 1
        );

        if (!hasEceran) {
            alert("Produk wajib punya harga eceran (pcs, min_qty = 1).");
        }
    }, []); // 👈 kosong = cuma sekali di awal


    const addStock = () => {
        if (data.stocks.length < 2) {
            setData("stocks", [...data.stocks, { unit: "pcs", quantity: 0 }]);
        }
    };

    const addPrice = () => {
        setData("prices", [
            ...data.prices,
            { label: "", unit: "pcs", price: 0, min_qty: 1 },
        ]);
    };

    return (
        <div className="max-w-6xl p-3 mx-auto">
            <div className="p-6 space-y-4 border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300">
                {/* Header */}
                <motion.div
                    initial={{ y: -30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-wrap items-center justify-between gap-4 mb-8"
                >
                    <h1 className="flex items-center gap-2 font-bold">
                        <Package className="w-5 h-5 text-purple-500 sm:w-7 sm:h-7" />
                        <span className="text-2xl font-semibold text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text sm:text-3xl">
                            {mode === "create" ? "Tambah Produk" : "Edit Produk"}
                        </span>
                    </h1>
                    <Link
                        href={route("products.index")}
                        className="flex items-center justify-center gap-2 p-2 shadow-md btn btn-primary sm:p-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>
                </motion.div>

                {/* Form */}
                <form onSubmit={onSubmit} className="space-y-10">
                    {/* Informasi Produk */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="p-4 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50 sm:p-6"
                    >
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-emerald-400">
                            <FileText className="w-5 h-5" /> Informasi Produk
                        </h2>

                        <div className="form-control">
                            <label className="gap-2 label">
                                <Hash className="w-4 h-4" />
                                <span className="label-text">SKU Produk</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: PPK001"
                                value={data.sku}
                                onChange={(e) => setData("sku", e.target.value)}
                                className="w-full input input-bordered"
                            />
                            {errors.sku && <span className="text-sm text-error">{errors.sku}</span>}
                        </div>

                        <div className="form-control">
                            <label className="gap-2 label">
                                <Tag className="w-4 h-4" />
                                <span className="label-text">Nama Produk</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Contoh: Pupuk Ambition"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className="w-full input input-bordered"
                            />
                            {errors.name && <span className="text-sm text-error">{errors.name}</span>}
                        </div>

                        <div className="form-control">
                            <label className="gap-2 label">
                                <FileText className="w-4 h-4" />
                                <span className="label-text">Deskripsi</span>
                            </label>
                            <textarea
                                placeholder="Keterangan tambahan produk"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className="w-full textarea textarea-bordered"
                            />
                        </div>
                    </motion.div>

                    {/* Stok */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="p-6 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50"
                    >
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-cyan-400">
                            <Layers className="w-5 h-5" /> Stok Awal
                        </h2>

                        {/* Isi per karton */}
                        <div className="form-control">
                            <label className="label">Isi per Karton</label>
                            <input
                                type="number"
                                min="1"
                                value={data.pieces_per_carton}
                                onChange={(e) => setData("pieces_per_carton", e.target.value)}
                                className="w-full input input-bordered"
                            />
                        </div>

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
                                {data.stocks.length < 2 && (
                                    <button
                                        type="button"
                                        onClick={addStock}
                                        className="mt-2 btn btn-outline btn-sm"
                                    >
                                        <Plus className="w-4 h-4" /> Tambah Stok
                                    </button>
                                )}
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

                        <p className="text-xs opacity-70">
                            Total stok awal:{" "}
                            <span className="font-semibold text-purple-400">{totalPcs}</span> pcs
                        </p>
                    </motion.div>

                    {/* Harga */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="p-4 space-y-4 transition-all border shadow-xl card bg-base-200/50 backdrop-blur-lg border-base-300 hover:border-primary hover:shadow-primary/50 sm:p-6"
                    >
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-pink-400">
                            <Tag className="w-5 h-5" /> Harga Produk
                        </h2>

                        <div className="overflow-x-auto sm:overflow-x-visible">
                            <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-semibold min-w-[500px] sm:min-w-0">
                                <span>Label</span>
                                <span>Unit</span>
                                <span>Min Qty</span>
                                <span>Harga</span>
                            </div>

                            {data.prices.map((price, i) => (
                                <div
                                    key={i}
                                    className="grid items-center grid-cols-4 gap-2 mb-2 min-w-[500px] sm:min-w-0"
                                >
                                    <input
                                        type="text"
                                        placeholder="Contoh: Grosir, Eceran"
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
                                        placeholder="Min"
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
                                            type="text"
                                            placeholder="Harga"
                                            value={formatRupiah(price.price)}
                                            onChange={(e) => {
                                                const newPrices = [...data.prices];
                                                newPrices[i].price = parseRupiah(e.target.value);
                                                setData("prices", newPrices);
                                            }}
                                            className="flex-1 input input-bordered"
                                        />
                                        {data.prices.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const target = data.prices[i];
                                                    const isEceran = target.unit === "pcs" && Number(target.min_qty) === 1;

                                                    const eceranCount = data.prices.filter(
                                                        (p) => p.unit === "pcs" && Number(p.min_qty) === 1
                                                    ).length;

                                                    if (isEceran && eceranCount === 1) {
                                                        alert("Produk harus punya minimal 1 harga eceran (pcs, min_qty = 1).");
                                                        return;
                                                    }

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

                            {!data.prices.some((p) => p.unit === "pcs" && Number(p.min_qty) === 1) && (
                                <div className="p-2 mt-2 text-sm text-red-600 bg-red-100 border border-red-300 rounded">
                                    ⚠️ Harus ada minimal <b>1 harga eceran</b> (unit = pcs dan Min Qty = 1).
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={addPrice}
                            className="flex items-center gap-1 mt-2 btn btn-outline btn-sm"
                        >
                            <Plus className="w-4 h-4 sm:w-4 sm:h-4" />
                            <span className="hidden sm:inline">Tambah Harga</span>
                        </button>
                    </motion.div>

                    {/* Tombol Aksi */}
                    <div className="flex flex-wrap justify-end gap-3 mt-6 sm:flex-nowrap">
                        <Link href={route("products.index")} className="flex items-center gap-1 btn btn-ghost">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Batal</span>
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex gap-1 shadow-lg btn btn-primary shadow-primary/40"
                        >
                            <Save className="w-4 h-4" />
                            <span className="hidden sm:inline">Simpan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
