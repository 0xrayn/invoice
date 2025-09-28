import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import ModernDashboardLayout from "@/layouts/DashboardLayout";
import EntityForm from "@/components/DataTable/EntityForm";

export default function Create() {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Indonesia",
    phone: "",
    email: "",
    logo_path: null,
  });

  const [preview, setPreview] = useState(null);
  const [liveErrors, setLiveErrors] = useState({ phone: null, email: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("companies.store"), {
      onSuccess: () => {
        reset();
        setPreview(null);
      },
    });
  };

  return (
    <ModernDashboardLayout>
      <Head title="Tambah Perusahaan" />
      <div className="max-w-6xl p-3 mx-auto">
        <EntityForm
          mode="company"
          title="Tambah Perusahaan"
          data={data}
          setData={setData}
          errors={errors}
          liveErrors={liveErrors}
          setLiveErrors={setLiveErrors}
          preview={preview}
          setPreview={setPreview}
          onSubmit={handleSubmit}
          backRoute={route("companies.index")}
        />
      </div>
    </ModernDashboardLayout>
  );
}
