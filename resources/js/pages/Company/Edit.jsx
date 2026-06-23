"use client";
import React, { useState } from "react";
import { useForm, usePage, Head, Link, router } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import EntityForm from "@/components/DataTable/EntityForm";

export default function Edit() {
  const { company } = usePage().props;

  const { data, setData, errors } = useForm({
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

    // ✅ Fix: Build FormData manual — logo hanya ikut kalau memang ada file baru
    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append("name", data.name);
    formData.append("address", data.address || "");
    formData.append("city", data.city || "");
    formData.append("province", data.province || "");
    formData.append("postal_code", data.postal_code || "");
    formData.append("country", data.country || "Indonesia");
    formData.append("phone", data.phone || "");
    formData.append("email", data.email || "");

    // ✅ Logo hanya append kalau user pilih file baru — kalau null, tidak dikirim sama sekali
    if (data.logo_path instanceof File) {
      formData.append("logo_path", data.logo_path);
    }

    router.post(route("companies.update", company.id), formData, {
      onSuccess: () => router.visit(route("companies.index")),
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
