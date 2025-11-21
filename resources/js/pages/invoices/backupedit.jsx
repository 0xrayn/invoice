"use client";
import React, { useEffect, useState } from "react";
import { router, useForm, usePage, Head } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileText,
    User,
    Users,
    Plus,
    Trash2,
    Eye,
    Save,
    X,
    ChevronLeft,
    Grid,
    Percent,
} from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import InvoicePreviewModal from "../../components/landingpage/invoice/preview-invoice";

export default function Edit() {
    const { company, customers, products, invoice } = usePage().props;


    const { data, setData, put, processing, errors } = useForm({
        company_id: invoice.company_id || company?.id || null,
        customer_id: invoice.customer_id || "",
        invoice_no: invoice.invoice_no || "",
        invoice_date: invoice.invoice_date ? invoice.invoice_date.slice(0, 10) : new Date().toISOString().slice(0, 10),
        due_date: invoice.due_date ? invoice.due_date.slice(0, 10) : "",
        currency: invoice.currency || "IDR",
        keterangan: invoice.keterangan || "",
        terms: invoice.terms || "",
        extra_discount: invoice.extra_discount || 0,
        shipping_cost: invoice.shipping_cost || 0,
        discount_total: invoice.discount_total || 0,
        tax_total: invoice.tax_total || 0,
        signature_path: invoice.signature_path || "",
        status: invoice.status || "draft",
        items: (invoice.items || []).map((i) => ({
            product_id: i.product_id,
            // price_id: i.price_id ? Number(i.price_id) : "",
            price_id: i.price_id || (i.price?.id ?? ""),
            description: i.description ?? i.product?.name ?? "",
            unit: i.unit ?? i.product?.unit_default ?? "",
            quantity: Number(i.quantity) || 1,
            price: Number(i.price) || (i.product?.prices?.[0]?.price ?? 0),
            discount: Number(i.discount) || 0,
            discount_type: i.discount_type ?? "percent",
            tax: Number(i.tax) || i.product?.tax || 0,
            total: Number(i.total) || 0,
        })),

    });

    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        // safety: ensure items is an array
        if (!Array.isArray(data.items)) setData("items", []);
    }, []);

    const currencyFormat = (v) => {
        const n = Number(v) || 0;
        try {
            return n.toLocaleString("id-ID");
        } catch {
            return String(n);
        }
    };

    // Tambah item
    const addItem = () => {
        setData("items", [
            ...data.items,
            {
                product_id: "",
                price_id: "",
                unit: "-",
                quantity: 1,
                price: 0,
                discount: 0,
                discount_type: "percent",
                tax: 0,
                total: 0,
            },
        ]);
    };

    // Hapus item
    const removeItem = (index) => {
        setData(
            "items",
            data.items.filter((_, i) => i !== index)
        );
    };

    // Update item
    const updateItem = (index, field, value) => {
        const items = [...data.items];
        let item = { ...items[index] };

        if (["quantity", "price", "discount", "tax"].includes(field)) {
            item[field] = Number(value) || 0;
        } else {
            item[field] = value;
        }
        if (field === "product_id") {
            item.product_id = Number(value);
            const product = products.find((p) => p.id == item.product_id);

            if (item.price_id) {
                const priceObj = product?.prices?.find((pr) => pr.id == item.price_id);
                if (priceObj) {
                    item.price = priceObj.price;
                    item.unit = priceObj.unit || "-";
                }
            } else {
                const priceObj = product?.prices?.[0];
                if (priceObj) {
                    item.price_id = priceObj.id;
                    item.price = priceObj.price;
                    item.unit = priceObj.unit || "-";
                }
            }
        }


        if (field === "price_id") {
            item.price_id = Number(value);
            const product = products.find((p) => p.id == item.product_id);
            const priceObj = product?.prices?.find((pr) => pr.id == item.price_id);
            if (priceObj) {
                item.price = priceObj.price;
                item.unit = priceObj.unit || "-";
            }
        }

        // recalc totals for this item
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        const discountValue = Number(item.discount) || 0;
        const taxRate = Number(item.tax) || 0;

        let discount = 0;
        if (item.discount_type === "percent") {
            discount = (qty * price * discountValue) / 100;
        } else if (item.discount_type === "amount") {
            discount = discountValue;
        }

        const subtotal = qty * price - discount;
        const taxValue = (subtotal * taxRate) / 100;

        item.total = subtotal + taxValue;

        items[index] = item;
        setData("items", items);
    };

    // Hitung subtotal & total
    const subtotal = data.items.reduce((sum, i) => {
        const qty = Number(i.quantity) || 0;
        const price = Number(i.price) || 0;
        return sum + qty * price;
    }, 0);
    const totalDiscount = data.items.reduce((sum, i) => {
        const qty = Number(i.quantity) || 0;
        const price = Number(i.price) || 0;
        return (
            sum +
            (i.discount_type === "percent"
                ? (qty * price * (Number(i.discount) || 0)) / 100
                : Number(i.discount) || 0)
        );
    }, 0);
    const totalTax = data.items.reduce((sum, i) => {
        const qty = Number(i.quantity) || 0;
        const price = Number(i.price) || 0;
        const discount =
            i.discount_type === "percent"
                ? (qty * price * (Number(i.discount) || 0)) / 100
                : Number(i.discount) || 0;
        const sub = qty * price - discount;
        return sum + (sub * (Number(i.tax) || 0)) / 100;
    }, 0);

    const grandTotal =
        subtotal - totalDiscount + totalTax + Number(data.shipping_cost || 0) - Number(data.extra_discount || 0);

    // Submit (gunakan handleSubmit yg ada di Edit.jsx)
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();

        // field utama
        formData.append("company_id", data.company_id);
        formData.append("customer_id", data.customer_id);
        formData.append("currency", data.currency);
        formData.append("invoice_no", data.invoice_no);
        formData.append("invoice_date", data.invoice_date);
        formData.append("due_date", data.due_date);
        formData.append("status", data.status);
        formData.append("keterangan", data.keterangan || "");
        formData.append("terms", data.terms || "");

        // items (pakai JSON stringify biar aman)
        formData.append("items", JSON.stringify(
            data.items.map(i => ({
                ...i,
                price_id: i.price_id ? Number(i.price_id) : null,
            }))
        ));

        // perhitungan
        formData.append("subtotal", subtotal);
        formData.append("discount_total", totalDiscount);
        formData.append("tax_total", totalTax);
        formData.append("shipping_cost", data.shipping_cost);
        formData.append("extra_discount", data.extra_discount);
        formData.append("grand_total", grandTotal);

        // file tanda tangan (opsional)
        if (data.signature_path instanceof File) {
            formData.append("signature_path", data.signature_path);
        } else if (typeof data.signature_path === "string" && data.signature_path !== "") {
            formData.append("old_signature_path", data.signature_path);
        }

        // method override biar tetap PUT
        formData.append("_method", "put");
        // kirim pakai post (bukan put)
        router.post(route("invoices.update", invoice.id), formData, {
            preserveScroll: true,
            onError: (err) => console.error("Validation errors:", err),
            onSuccess: () => alert("Invoice berhasil diperbarui!"),
        });
    };

    // Preview
    const preview = () => {
        setPreviewData({
            ...data,
            subtotal,
            totalDiscount,
            totalTax,
            grandTotal,
        });
    };

    return (
        <ModernDashboardLayout>
            <Head title="Edit Invoice" />

            <div className="max-w-6xl p-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 border shadow-xl card bg-base-100/40 backdrop-blur-md border-base-300 rounded-2xl"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-gradient" />
                            <div>
                                <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                                    Edit Invoice
                                </h1>
                                <p className="text-sm opacity-70">
                                    Ubah invoice dan simpan perubahan
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={preview}
                                className="flex items-center gap-2 btn btn-ghost btn-sm"
                            >
                                <Eye className="w-4 h-4" /> Preview
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center gap-2 btn btn-outline btn-sm"
                                type="button"
                            >
                                <ChevronLeft className="w-4 h-4" /> Kembali
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bagian Atas */}
                        <motion.div
                            layout
                            whileHover={{ scale: 1.01 }}
                            className="grid grid-cols-1 gap-4 md:grid-cols-3"
                        >
                            <div className="col-span-2 space-y-4">
                                {/* Customer */}
                                <div className="form-control">
                                    <label className="flex items-center gap-2 label">
                                        <User className="w-4 h-4" />
                                        <span className="label-text">Pelanggan</span>
                                    </label>
                                    <select
                                        value={data.customer_id}
                                        onChange={(e) => setData("customer_id", Number(e.target.value) || "")}
                                        className="w-full select select-bordered select-primary"
                                    >
                                        <option value="">-- Pilih Customer --</option>
                                        {customers?.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && (
                                        <span className="text-sm text-error">
                                            {errors.customer_id}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <div className="form-control">
                                        <label className="label">Nomor Invoice</label>
                                        <input
                                            type="text"
                                            value={data.invoice_no}
                                            onChange={(e) => setData("invoice_no", e.target.value)}
                                            className="input input-bordered"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">Tanggal</label>
                                        <input
                                            type="date"
                                            value={data.invoice_date}
                                            onChange={(e) => setData("invoice_date", e.target.value)}
                                            className="input input-bordered"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">Jatuh Tempo</label>
                                        <input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData("due_date", e.target.value)}
                                            className="input input-bordered"
                                        />
                                    </div>
                                </div>

                                {/* Notes & Terms */}
                                <motion.div
                                    layout
                                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                >
                                    <div className="form-control">
                                        <label className="label">Keterangan</label>
                                        <textarea
                                            value={data.keterangan}
                                            onChange={(e) => setData("keterangan", e.target.value)}
                                            className="h-24 textarea textarea-bordered"
                                        />
                                    </div>
                                    <div className="form-control">
                                        <label className="label">Syarat & Ketentuan</label>
                                        <textarea
                                            value={data.terms}
                                            onChange={(e) => setData("terms", e.target.value)}
                                            className="h-24 textarea textarea-bordered"
                                        />
                                    </div>
                                </motion.div>
                            </div>

                            {/* Sidebar summary & extras */}
                            <motion.div layout className="space-y-4">
                                <div className="p-4 border card bg-base-200/60 border-base-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Ringkasan</h3>
                                        <div className="badge badge-outline">{data.currency}</div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">
                                                {currencyFormat(subtotal)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Diskon</span>
                                            <span className="font-semibold">
                                                -{currencyFormat(totalDiscount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Pajak</span>
                                            <span className="font-semibold">
                                                {currencyFormat(totalTax)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="label">Ongkir</label>
                                            <input
                                                type="text"
                                                value={currencyFormat(data.shipping_cost)}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, "");
                                                    setData("shipping_cost", Number(raw) || 0);
                                                }}
                                                className="text-right input input-bordered input-sm w-28"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="label">Diskon Tambahan</label>
                                            <input
                                                type="text"
                                                value={currencyFormat(data.extra_discount)}
                                                onChange={(e) => {
                                                    const raw = e.target.value.replace(/\D/g, "");
                                                    setData("extra_discount", Number(raw) || 0);
                                                }}
                                                className="text-right input input-bordered input-sm w-28"
                                            />
                                        </div>

                                        <div className="pt-3 border-t">
                                            <div className="flex justify-between text-lg font-bold">
                                                <span>Grand Total</span>
                                                <span>{currencyFormat(grandTotal)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>

                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Grid className="w-5 h-5" /> Item Barang
                                </h2>
                                <button
                                    type="button"
                                    className="flex items-center gap-2 btn btn-sm btn-outline"
                                    onClick={addItem}
                                >
                                    <Plus className="w-4 h-4" /> Tambah Item
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th>Satuan</th>
                                            <th>Harga</th>
                                            <th>Qty</th>
                                            <th>Diskon</th>
                                            <th>Pajak</th>
                                            <th className="text-right">Total</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item, idx) => (
                                            <motion.tr
                                                key={idx}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                            >
                                                <td className="min-w-[180px]">
                                                    <select
                                                        value={item.product_id}
                                                        onChange={(e) =>
                                                            updateItem(idx, "product_id", e.target.value)
                                                        }
                                                        className="w-full select select-bordered select-sm"
                                                    >
                                                        <option value="">-- Produk --</option>
                                                        {products?.map((p) => (
                                                            <option key={p.id} value={p.id}>
                                                                {p.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td>
                                                    {item.product_id ? (
                                                        <select
                                                            value={item.price_id || ""}
                                                            onChange={(e) => updateItem(idx, "price_id", Number(e.target.value))}
                                                            className="select select-bordered select-sm w-36"
                                                        >
                                                            <option value="">-- Pilih --</option>
                                                            {products.find((p) => p.id == item.product_id)?.prices?.map((pr) => (
                                                                <option key={pr.id} value={pr.id}>
                                                                    {pr.label} ({pr.unit})
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : (
                                                        <span className="text-sm opacity-60">-</span>
                                                    )}
                                                </td>

                                                <td>
                                                    <input
                                                        type="number"
                                                        step="1"
                                                        value={item.price}
                                                        onChange={(e) =>
                                                            updateItem(idx, "price", e.target.value)
                                                        }
                                                        className="text-right input input-bordered input-sm w-28"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="1"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            updateItem(idx, "quantity", e.target.value)
                                                        }
                                                        className="w-20 input input-bordered input-sm"
                                                    />
                                                </td>
                                                <td>
                                                    <div className="flex gap-1">
                                                        <input
                                                            type="number"
                                                            step="1"
                                                            value={item.discount}
                                                            onChange={(e) =>
                                                                updateItem(idx, "discount", e.target.value)
                                                            }
                                                            className="w-20 input input-bordered input-sm"
                                                        />
                                                        <select
                                                            value={item.discount_type}
                                                            onChange={(e) =>
                                                                updateItem(
                                                                    idx,
                                                                    "discount_type",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="w-20 select select-bordered select-sm"
                                                        >
                                                            <option value="percent">%</option>
                                                            <option value="amount">Rp</option>
                                                        </select>
                                                    </div>
                                                </td>
                                                <td>
                                                    <select
                                                        value={String(item.tax)}
                                                        onChange={(e) =>
                                                            updateItem(idx, "tax", e.target.value)
                                                        }
                                                        className="select select-bordered select-sm w-28"
                                                    >
                                                        <option value="0">0%</option>
                                                        <option value="11">11% PPN</option>
                                                        <option value="12">12% PPN</option>
                                                    </select>
                                                </td>
                                                <td className="font-semibold text-right">
                                                    {currencyFormat(item.total)}
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-error btn-sm"
                                                        onClick={() => removeItem(idx)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                        {data.items.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="py-6 text-center opacity-60"
                                                >
                                                    Belum ada item. Klik "Tambah Item" untuk memulai.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Signature (paling bawah) */}
                        <div className="p-4 border card bg-base-200/50 border-base-300">
                            <div className="mt-3 form-control">
                                <label className="label">Tanda Tangan</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData("signature_path", e.target.files[0])}
                                    className="file-input file-input-bordered"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    type="button"
                                    disabled={processing}
                                    onClick={preview}
                                    className="btn btn-ghost btn-sm"
                                >
                                    <Eye className="w-4 h-4" /> Preview
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex items-center gap-2 btn btn-primary btn-sm"
                                >
                                    <Save className="w-4 h-4" />{" "}
                                    {processing ? "Menyimpan..." : "Update Invoice"}
                                </button>
                            </div>
                        </div>
                    </form>
                </motion.div>

                {previewData && (
                    <InvoicePreviewModal
                        data={previewData}
                        company={company}
                        customers={customers}
                        products={products}
                        onClose={() => setPreviewData(null)}
                    />
                )}

            </div>
        </ModernDashboardLayout>
    );
}
