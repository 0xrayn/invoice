"use client";
import React, { useEffect, useState } from "react";
import { useForm, usePage, Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import {
    FileText,
    User,
    Plus,
    Trash2,
    Eye,
    Save,
    ChevronLeft,
    Grid,
} from "lucide-react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import InvoicePreviewModal from "../../components/landingpage/invoice/preview-invoice";

export default function Create() {
    const { company, customers, products } = usePage().props;
    const [qtyAlertTimeout, setQtyAlertTimeout] = useState(null);
    const { data, setData, post, processing, errors } = useForm({
        company_id: company?.id || null,
        customer_id: "",
        invoice_no: "",
        invoice_date: new Date().toISOString().slice(0, 10),
        due_date: "",
        items: [],
        extra_discount: 0,
        shipping_cost: 0,
        discount_total: 0,
        tax_total: 0,
        terms: "",
        keterangan: "",
        currency: "IDR",
        signature_path: null,
        status: "draft",
    });

    const [previewData, setPreviewData] = useState(null);

    useEffect(() => {
        if (!Array.isArray(data.items)) setData("items", []);
        // ensure numeric fields
        setData((prev) => ({ ...prev }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const currencyFormat = (v) => {
        const n = Number(v) || 0;
        return n.toLocaleString("id-ID");
    };

    const addItem = () => {
        setData("items", [
            ...data.items,
            {
                product_id: "",
                price_id: "",
                unit: "",
                quantity: 1,
                price: 0,
                discount: 0,
                discount_type: "percent",
                tax: 0,
                total: 0,
            },
        ]);
    };

    const removeItem = (index) => {
        setData("items", data.items.filter((_, i) => i !== index));
    };

    const updateItem = (index, field, value) => {
        const items = [...data.items];
        const item = { ...items[index] };

        if (["quantity", "discount", "tax"].includes(field)) value = Number(value) || 0;

        const product = products?.find(p => p.id == item.product_id);
        const availableStock = product?.stock?.quantity_pcs ?? 0;

        if (field === "quantity") {
            const priceObj = product?.prices?.find(pr => pr.id == item.price_id);
            const minQty = priceObj?.min_qty ?? 1;

            // Jika user isi qty < minQty, otomatis set ke minQty
            if (value < minQty) {
                value = minQty;
            }

            // Validasi kelipatan
            if (qtyAlertTimeout) clearTimeout(qtyAlertTimeout);
            setQtyAlertTimeout(setTimeout(() => {
                if (minQty > 1 && value % minQty !== 0) {
                    alert(`Qty harus kelipatan ${minQty}`);
                }
            }, 800));

            // Cek stok
            const totalQtyForProduct =
                data.items
                    .filter((i, iIdx) => i.product_id === item.product_id && iIdx !== index)
                    .reduce((sum, i) => sum + Number(i.quantity), 0) + value;

            if (totalQtyForProduct > availableStock) {
                alert(`Qty total untuk produk ini tidak boleh lebih dari stok: ${availableStock}`);
                value = Math.max(minQty, availableStock - (totalQtyForProduct - value));
            }

            if (value <= 0) {
                items.splice(index, 1);
                setData("items", items);
                return;
            }
        }

        item[field] = value;

        if (field === "product_id") {
            item.price_id = "";
            item.price = 0;
            item.unit = "";
            item.quantity = 1;
        }

        if (field === "price_id") {
            const priceObj = product?.prices?.find(pr => pr.id == value);
            if (priceObj) {
                item.price = Number(priceObj.price) || 0;
                item.unit = priceObj.unit || "";
                if (item.quantity < priceObj.min_qty) item.quantity = priceObj.min_qty;
            }
        }

        // --- hitung total per item (harga per pcs) ---
        const priceObj = product?.prices?.find(pr => pr.id == item.price_id);
        const minQty = priceObj?.min_qty ?? 1;
        const unitPrice = priceObj ? priceObj.price / minQty : 0;

        const qty = Number(item.quantity) || 0;
        const discount =
            item.discount_type === "percent"
                ? (qty * unitPrice * (Number(item.discount) || 0)) / 100
                : Number(item.discount) || 0;

        const subtotal = qty * unitPrice - discount;
        const taxValue = (subtotal * (Number(item.tax) || 0)) / 100;

        if (subtotal + taxValue < 0) {
            alert("Total per item tidak boleh minus!");
            return;
        }

        item.total = subtotal + taxValue;

        items[index] = item;
        setData("items", items);
    };
    const subtotal = data.items.reduce((s, i) => {
        const product = products.find(p => p.id == i.product_id);
        const priceObj = product?.prices?.find(pr => pr.id == i.price_id);
        const unitPrice = priceObj ? priceObj.price / (priceObj.min_qty || 1) : 0;
        return s + (Number(i.quantity) || 0) * unitPrice;
    }, 0);

    const totalDiscount = data.items.reduce((s, i) => {
        const product = products.find(p => p.id == i.product_id);
        const priceObj = product?.prices?.find(pr => pr.id == i.price_id);
        const unitPrice = priceObj ? priceObj.price / (priceObj.min_qty || 1) : 0;
        const qty = Number(i.quantity) || 0;
        const discount = i.discount_type === "percent"
            ? (qty * unitPrice * (Number(i.discount) || 0)) / 100
            : Number(i.discount) || 0;
        return s + discount;
    }, 0);

    const totalTax = data.items.reduce((s, i) => {
        const product = products.find(p => p.id == i.product_id);
        const priceObj = product?.prices?.find(pr => pr.id == i.price_id);
        const unitPrice = priceObj ? priceObj.price / (priceObj.min_qty || 1) : 0;
        const qty = Number(i.quantity) || 0;
        const discount = i.discount_type === "percent"
            ? (qty * unitPrice * (Number(i.discount) || 0)) / 100
            : Number(i.discount) || 0;
        const subtotal = qty * unitPrice - discount;
        return s + (subtotal * (Number(i.tax) || 0)) / 100;
    }, 0);

    const grandTotal = Math.max(
        0,
        subtotal - totalDiscount + totalTax + Number(data.shipping_cost || 0) - Number(data.extra_discount || 0)
    );


    const submit = (e) => {
        e.preventDefault();

        post(route("invoices.store"), {
            data: {
                ...data,
                discount_total: Number(totalDiscount) || 0,
                tax_total: Number(totalTax) || 0,
                shipping_cost: Number(data.shipping_cost) || 0,
                extra_discount: Number(data.extra_discount) || 0,
                grand_total: grandTotal,
            },
            forceFormData: true,
            onError: (err) => {
                console.error("Validation errors:", err);
                alert("Ada error input, cek console (F12)");
            },
            onSuccess: () => {
                alert("Invoice berhasil disimpan!");
            },
        });
    };

    const preview = () => {
        setPreviewData({ ...data, subtotal, totalDiscount, totalTax, grandTotal });
    };

    // Responsive helpers: render items as table on md+ and as stacked cards on mobile
    const ItemsTable = () => (
        <div className="overflow-x-auto">
            <table className="table w-full text-sm md:table-auto">
                <thead>
                    <tr>
                        <th className="min-w-[140px]">Produk</th>
                        <th className="hidden sm:table-cell">Satuan</th>
                        <th className="hidden sm:table-cell">Harga</th>
                        <th>Qty</th>
                        <th className="hidden sm:table-cell">Diskon</th>
                        <th className="hidden md:table-cell">Pajak</th>
                        <th className="text-right">Total</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {data.items.map((item, idx) => (
                        <tr key={idx} className="align-top">
                            <td className="min-w-[140px]">
                                <select
                                    value={item.product_id}
                                    onChange={(e) => updateItem(idx, "product_id", e.target.value)}
                                    className="w-full select select-bordered select-sm"
                                >
                                    <option value="">-- Produk --</option>
                                    {products?.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                {/* small helper text on mobile */}
                                <div className="mt-1 text-xs opacity-60 sm:hidden">
                                    Stok: {products.find((p) => p.id == item.product_id)?.stock?.quantity_pcs ?? 0} pcs
                                </div>
                            </td>

                            <td className="hidden sm:table-cell">
                                {item.product_id ? (
                                    <div className="flex flex-col gap-1">
                                        <select
                                            value={String(item.price_id || "")}
                                            onChange={(e) => updateItem(idx, "price_id", Number(e.target.value))}
                                            className="select select-bordered select-sm w-full max-w-[11rem]"
                                        >
                                            <option value="">-- Pilih --</option>
                                            {products
                                                .find((p) => p.id == item.product_id)
                                                ?.prices?.map((pr) => (
                                                    <option key={pr.id} value={pr.id}>
                                                        {pr.label} ({pr.unit})
                                                    </option>
                                                ))}
                                        </select>
                                        <span className="text-xs opacity-60">
                                            Stok: {products.find((p) => p.id == item.product_id)?.stock?.quantity_pcs ?? 0} pcs
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-sm opacity-60">-</span>
                                )}
                            </td>

                            <td className="hidden sm:table-cell">
                                <input
                                    type="text"
                                    value={currencyFormat(item.price)}
                                    readOnly
                                    onChange={(e) => updateItem(idx, "price", e.target.value)}
                                    className="text-right input input-bordered input-sm w-full max-w-[8rem]"
                                />
                            </td>

                            <td>
                                <div className="flex flex-col">
                                    <input
                                        type="number"
                                        min="0"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                                        className="w-20 input input-bordered input-sm"
                                    />
                                    {(() => {
                                        const product = products.find((p) => p.id == item.product_id);
                                        const priceRow = product?.prices?.find((pr) => pr.id == item.price_id);

                                        if (priceRow) {
                                            return (
                                                <span className="mt-1 text-[11px]  opacity-60">
                                                    Minimal beli : {priceRow.min_qty}
                                                </span>
                                            );
                                        }
                                        return null;
                                    })()}
                                </div>
                            </td>

                            <td className="hidden sm:table-cell">
                                <div className="flex items-center gap-1">
                                    <input
                                        type="number"
                                        value={item.discount}
                                        onChange={(e) => updateItem(idx, "discount", e.target.value)}
                                        className="w-20 input input-bordered input-sm"
                                    />
                                    <select
                                        value={item.discount_type}
                                        onChange={(e) => updateItem(idx, "discount_type", e.target.value)}
                                        className="w-20 select select-bordered select-sm"
                                    >
                                        <option value="percent">%</option>
                                        <option value="amount">Rp</option>
                                    </select>
                                </div>
                            </td>

                            <td className="hidden md:table-cell">
                                <select
                                    value={item.tax}
                                    onChange={(e) => updateItem(idx, "tax", e.target.value)}
                                    className="select select-bordered select-sm w-full max-w-[7rem]"
                                >
                                    <option value="0">0%</option>
                                    <option value="11">11% PPN</option>
                                    <option value="12">12% PPN</option>
                                </select>
                            </td>

                            <td className="font-semibold text-right">{currencyFormat(item.total)}</td>

                            <td>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-error btn-xs sm:btn-sm"
                                        onClick={() => removeItem(idx)}
                                        aria-label={`Hapus item ${idx + 1}`}
                                    >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}

                    {data.items.length === 0 && (
                        <tr>
                            <td colSpan={8} className="py-6 text-center opacity-60">
                                Belum ada item. Klik "Tambah Item" untuk memulai.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );

    const ItemsCardMobile = () => (
        <div className="flex flex-col gap-3 md:hidden">
            {data.items.map((item, idx) => {
                const product = products.find((p) => p.id == item.product_id);
                const priceObj = product?.prices?.find((pr) => pr.id == item.price_id);
                return (
                    <div key={idx} className="p-3 border rounded bg-base-100">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <div className="font-semibold truncate">{product?.name || "-"}</div>
                                <div className="text-xs opacity-70">{priceObj?.unit || "-"} • Stok: {product?.stock?.quantity_pcs ?? 0} pcs</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{currencyFormat(item.total)}</div>
                                <div className="text-xs opacity-60">{item.quantity} x {currencyFormat(item.price)}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-3">
                            <select
                                value={String(item.price_id || "")}
                                onChange={(e) => updateItem(idx, "price_id", Number(e.target.value))}
                                className="w-full select select-bordered select-sm"
                            >
                                <option value="">-- Pilih Harga --</option>
                                {product?.prices?.map((pr) => (
                                    <option key={pr.id} value={pr.id}>{pr.label} ({pr.unit})</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                min="0"
                                value={item.quantity}
                                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                                className="w-full input input-bordered input-sm"
                            />

                            <input
                                type="number"
                                value={item.discount}
                                onChange={(e) => updateItem(idx, "discount", e.target.value)}
                                className="w-full input input-bordered input-sm"
                            />

                            <select
                                value={item.discount_type}
                                onChange={(e) => updateItem(idx, "discount_type", e.target.value)}
                                className="w-full select select-bordered select-sm"
                            >
                                <option value="percent">%</option>
                                <option value="amount">Rp</option>
                            </select>

                            <select
                                value={item.tax}
                                onChange={(e) => updateItem(idx, "tax", e.target.value)}
                                className="w-full select select-bordered select-sm"
                            >
                                <option value="0">0%</option>
                                <option value="11">11% PPN</option>
                                <option value="12">12% PPN</option>
                            </select>

                            <div className="flex items-center justify-end">
                                <button type="button" className="btn btn-error btn-xs" onClick={() => removeItem(idx)}>
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <ModernDashboardLayout>
            <Head title="Buat Invoice Baru" />

            <div className="max-w-6xl p-4 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="p-4 border shadow-xl md:p-6 card bg-base-100/40 backdrop-blur-md border-base-300 rounded-2xl"
                >
                    <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-gradient" />
                            <div>
                                <h1 className="text-lg font-extrabold text-transparent md:text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                                    Buat Invoice Baru
                                </h1>
                                <p className="text-sm opacity-70">Buat dan simpan invoice dengan cepat</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button type="button" onClick={preview} className="flex items-center gap-2 btn btn-ghost btn-sm">
                                <Eye className="w-4 h-4" /> Preview
                            </button>
                            <button onClick={() => window.history.back()} className="flex items-center gap-2 btn btn-outline btn-sm" type="button">
                                <ChevronLeft className="w-4 h-4" /> Kembali
                            </button>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Top grid */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="col-span-2 space-y-4">
                                {/* Customer */}
                                <div className="form-control">
                                    <label className="flex items-center gap-2 label">
                                        <User className="w-4 h-4" />
                                        <span className="label-text">Pelanggan</span>
                                    </label>
                                    <select
                                        value={data.customer_id}
                                        onChange={(e) => setData("customer_id", e.target.value)}
                                        className="w-full select select-bordered"
                                    >
                                        <option value="">-- Pilih Customer --</option>
                                        {customers?.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <span className="text-sm text-error">{errors.customer_id}</span>}
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="form-control">
                                        <label className="label">Nomor Invoice</label>
                                        <input type="text" value={data.invoice_no} onChange={(e) => setData("invoice_no", e.target.value)} className="w-full input input-bordered" />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">Tanggal</label>
                                        <input type="date" value={data.invoice_date} onChange={(e) => setData("invoice_date", e.target.value)} className="w-full input input-bordered" />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">Jatuh Tempo</label>
                                        <input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => {
                                                const selectedDate = e.target.value;
                                                const invoiceDate = data.invoice_date;
                                                if (selectedDate < invoiceDate) {
                                                    alert("Tanggal jatuh tempo tidak boleh lebih kecil dari tanggal invoice!");
                                                    setData("due_date", invoiceDate);
                                                    return;
                                                }
                                                setData("due_date", selectedDate);
                                            }}
                                            className="w-full input input-bordered"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="form-control">
                                        <label className="label">Keterangan</label>
                                        <textarea value={data.keterangan} onChange={(e) => setData("keterangan", e.target.value)} className="w-full h-24 textarea textarea-bordered" />
                                    </div>

                                    <div className="form-control">
                                        <label className="label">Syarat & Ketentuan</label>
                                        <textarea value={data.terms} onChange={(e) => setData("terms", e.target.value)} className="w-full h-24 textarea textarea-bordered" />
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar summary & extras */}
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg card bg-base-200/60 border-base-300">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold">Ringkasan</h3>
                                        <div className="badge badge-outline">{data.currency}</div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Subtotal</span>
                                            <span className="font-semibold">{currencyFormat(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Diskon</span>
                                            <span className="font-semibold">-{currencyFormat(totalDiscount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Total Pajak</span>
                                            <span className="font-semibold">{currencyFormat(totalTax)}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="label">Ongkir</label>
                                            <input
                                                type="text"
                                                value={currencyFormat(data.shipping_cost)}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                                                    const newGrandTotal = subtotal - totalDiscount + totalTax + val - Number(data.extra_discount || 0);
                                                    if (newGrandTotal < 0) {
                                                        alert("Grand total tidak boleh minus!");
                                                        return;
                                                    }
                                                    setData("shipping_cost", val);
                                                }}
                                                className="text-right input input-bordered input-sm w-full max-w-[9rem]"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <label className="label">Diskon Tambahan</label>
                                            <input
                                                type="text"
                                                value={currencyFormat(data.extra_discount)}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                                                    const newGrandTotal = subtotal - totalDiscount + totalTax + Number(data.shipping_cost || 0) - val;
                                                    if (newGrandTotal < 0) {
                                                        alert("Grand total tidak boleh minus!");
                                                        return;
                                                    }
                                                    setData("extra_discount", val);
                                                }}
                                                className="text-right input input-bordered input-sm w-full max-w-[9rem]"
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
                            </div>
                        </div>

                        {/* Items section */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="flex items-center gap-2 text-lg font-semibold">
                                    <Grid className="w-5 h-5" /> Item Barang
                                </h2>
                                <div className="flex items-center gap-2">
                                    <button type="button" className="flex items-center gap-2 btn btn-sm btn-outline" onClick={addItem}>
                                        <Plus className="w-4 h-4" /> Tambah Item
                                    </button>
                                </div>
                            </div>

                            {/* Desktop table */}
                            <div className="hidden md:block">
                                <ItemsTable />
                            </div>

                            {/* Mobile stacked cards */}
                            <div className="md:hidden">
                                <ItemsCardMobile />
                            </div>
                        </div>

                        {/* Signature & actions */}
                        <div className="p-4 border rounded-lg card bg-base-200/50 border-base-300">
                            <div className="grid items-center grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="form-control">
                                    <label className="label">Tanda Tangan</label>
                                    <input type="file" accept="image/*" onChange={(e) => setData("signature_path", e.target.files[0])} className="w-full file-input file-input-bordered" />
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button type="button" disabled={processing} onClick={preview} className="btn btn-ghost btn-sm">
                                        <Eye className="w-4 h-4" /> Preview
                                    </button>
                                    <button type="submit" disabled={processing} className="flex items-center gap-2 btn btn-primary btn-sm">
                                        <Save className="w-4 h-4" /> {processing ? "Menyimpan..." : "Simpan Invoice"}
                                    </button>
                                </div>
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
