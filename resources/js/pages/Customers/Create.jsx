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
  });

  const [liveErrors, setLiveErrors] = useState({ phone: null, email: null });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route("customers.store"), {
      onSuccess: () => reset(),
    });
  };

  return (
    <ModernDashboardLayout>
      <Head title="Tambah Client" />
      <div className="max-w-6xl p-3 mx-auto">
        <EntityForm
          mode="customer"
          title="Tambah Client"
          data={data}
          setData={setData}
          errors={errors}
          liveErrors={liveErrors}
          setLiveErrors={setLiveErrors}
          onSubmit={handleSubmit}
          backRoute={route("customers.index")}
        />
      </div>
    </ModernDashboardLayout>
  );
}
