import React from "react";
import { useForm, Head } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import ProductForm from "@/components/DataTable/ProductForm";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        sku: "",
        name: "",
        description: "",
        pieces_per_carton: 1,
        prices: [{ label: "", unit: "pcs", price: 0, min_qty: 1 }],
        stocks: [{ unit: "carton", quantity: 0 }, { unit: "pcs", quantity: 0 }],
        stock_quantity: 0,
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

        post(route("products.store"));
    };


    return (
        <ModernDashboardLayout>
            <Head title="Tambah Produk" />
            <ProductForm
                data={data}
                setData={setData}
                errors={errors}
                processing={processing}
                onSubmit={handleSubmit}
            />
        </ModernDashboardLayout>
    );
}
