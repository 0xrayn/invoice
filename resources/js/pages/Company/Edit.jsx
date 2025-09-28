"use client";
import React, { useState } from "react";
import { useForm, usePage, Head, Link } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import EntityForm from "@/components/DataTable/EntityForm";

export default function Edit() {
  const { company } = usePage().props;

  const { data, setData, post, errors } = useForm({
    _method: "PUT",
    name: company?.name || "",
    address: company?.address || "",
    city: company?.city || "",
    province: company?.province || "",
    postal_code: company?.postal_code || "",
    country: company?.country || "Indonesia",
    phone: company?.phone || "",
    email: company?.email || "",
    logo_path: null,
  });

  const [preview, setPreview] = useState(
    company?.logo_path ? `/storage/${company.logo_path}` : null
  );
  const [liveErrors, setLiveErrors] = useState({ phone: null, email: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("companies.update", company.id), {
      forceFormData: true,
    });
  };

  return (
    <ModernDashboardLayout>
      <Head title="Edit Perusahaan" />
      <EntityForm
        mode="company"
        data={data}
        setData={setData}
        errors={errors}
        liveErrors={liveErrors}
        setLiveErrors={setLiveErrors}
        preview={preview}
        setPreview={setPreview}
        onSubmit={handleSubmit}
        backRoute={route("companies.index")}
        title="Edit Perusahaan"
      />
    </ModernDashboardLayout>
  );
}
