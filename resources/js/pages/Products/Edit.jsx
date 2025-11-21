import React from "react";
import { useForm, Head } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import ProductForm from "@/components/DataTable/ProductForm";

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
            { unit: "carton", quantity: Math.floor(product.stock.quantity_pcs / product.pieces_per_carton) },
            { unit: "pcs", quantity: product.stock.quantity_pcs % product.pieces_per_carton },
        ],
        stock_quantity: product.stock.quantity_pcs,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const hasEceran = data.prices.some(
            (p) => p.unit === "pcs" && Number(p.min_qty) === 1
        );

        if (!hasEceran) {
            alert("Produk wajib punya harga eceran (pcs, min_qty = 1).");
            return;
        }

        put(route("products.update", product.id));
    };


    return (
        <ModernDashboardLayout>
            <Head title="Edit Produk" />
            <ProductForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
                isEdit={true}
            />
        </ModernDashboardLayout>
    );
}
