"use client";
import React, { useState } from "react";
import { useForm, usePage, Head, Link } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import EntityForm from "@/components/DataTable/EntityForm";

export default function Edit() {
  const { customer } = usePage().props;

  const { data, setData, post, errors } = useForm({
    _method: "PUT",
    name: customer?.name || "",
    address: customer?.address || "",
    city: customer?.city || "",
    province: customer?.province || "",
    postal_code: customer?.postal_code || "",
    country: customer?.country || "Indonesia",
    phone: customer?.phone || "",
    email: customer?.email || "",
  });

  const [preview, setPreview] = useState(null);
  const [liveErrors, setLiveErrors] = useState({ phone: null, email: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("customers.update", customer.id));
  };

  return (
    <ModernDashboardLayout>
      <Head title="Edit Client" />
      <EntityForm
        mode="customer"
        data={data}
        setData={setData}
        errors={errors}
        liveErrors={liveErrors}
        setLiveErrors={setLiveErrors}
        preview={preview}
        setPreview={setPreview}
        onSubmit={handleSubmit}
        backRoute={route("customers.index")}
        title="Edit Client"
      />
    </ModernDashboardLayout>
  );
}
