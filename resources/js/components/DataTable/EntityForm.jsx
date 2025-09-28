import React from "react";
import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Combobox } from "@headlessui/react";
import {
    Building2,
    MapPin,
    LocateFixed,
    Map,
    Mail,
    Phone,
    Image as ImageIcon,
    ArrowLeft,
    Save,
} from "lucide-react";
import {
    cityOptions,
    provinceOptions,
    postalCodeOptions,
} from "@/components/Data/locationData";

const ComboboxInput = ({ label, icon: Icon, value, onChange, options, placeholder, error }) => {
    const [query, setQuery] = React.useState(value || "");
    const filtered =
        !query
            ? options
            : options.filter((item) =>
                (item ?? "")
                    .toString()
                    .toLowerCase()
                    .includes((query ?? "").toString().toLowerCase())
            );

    return (
        <div className="form-control">
            <label className="gap-2 text-sm font-semibold label">
                <Icon className="w-4 h-4 text-cyan-400" /> {label}
            </label>
            <Combobox
                value={value}
                onChange={(val) => {
                    setQuery(val);
                    onChange(val);
                }}
            >
                <div className="relative">
                    <Combobox.Input
                        className="w-full input input-bordered"
                        placeholder={placeholder}
                        displayValue={() => query}
                        onChange={(e) => setQuery(e.target.value)}
                        onBlur={() => onChange(query)}
                    />
                    {filtered.length > 0 && (
                        <Combobox.Options className="absolute z-10 w-full mt-1 overflow-auto rounded-lg shadow-lg bg-base-200 max-h-60">
                            {filtered.map((item, idx) => (
                                <Combobox.Option
                                    key={idx}
                                    value={item}
                                    className={({ active }) =>
                                        `cursor-pointer select-none p-2 ${active ? "bg-primary text-white" : ""
                                        }`
                                    }
                                >
                                    {item}
                                </Combobox.Option>
                            ))}
                        </Combobox.Options>
                    )}
                </div>
            </Combobox>
            {error && <span className="text-sm text-error">{error}</span>}
        </div>
    );
};

export default function EntityForm({
    mode = "customer",
    data,
    setData,
    errors,
    liveErrors,
    setLiveErrors,
    preview,
    setPreview,
    onSubmit,
    backRoute,
    title,
}) {
    const isCompany = mode === "company";

    return (
        <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="p-6 border shadow-xl card bg-base-100/50 backdrop-blur-lg border-base-300"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="flex items-center gap-2 text-3xl font-bold">
                    <Building2 className="text-purple-500 w-7 h-7" />
                    <span className="text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 bg-clip-text">
                        {title}
                    </span>
                </h1>
                <Link href={backRoute} className="gap-2 btn btn-primary">
                    <ArrowLeft className="w-4 h-4" /> Kembali
                </Link>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Nama */}
                <div className="form-control">
                    <label className="gap-2 text-sm font-semibold label">
                        <Building2 className="w-4 h-4 text-purple-400" />{" "}
                        {isCompany ? "Nama Perusahaan" : "Nama Client"}
                    </label>
                    <input
                        type="text"
                        className="w-full input input-bordered"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder={`Contoh: ${isCompany ? "PT. Ambition" : "CV. Pelanggan Jaya"}`}
                    />
                    {errors.name && <span className="text-sm text-error">{errors.name}</span>}
                </div>

                {/* Alamat */}
                <div className="form-control">
                    <label className="gap-2 text-sm font-semibold label">
                        <MapPin className="w-4 h-4 text-pink-400" /> Alamat
                    </label>
                    <textarea
                        className="w-full textarea textarea-bordered"
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        placeholder="Alamat jalan lengkap (tanpa kota, provinsi, kode pos)"
                    />
                    {errors.address && <span className="text-sm text-error">{errors.address}</span>}
                </div>

                {/* Kota, Provinsi, Kode Pos */}
                <ComboboxInput
                    label="Kota"
                    icon={LocateFixed}
                    value={data.city}
                    onChange={(val) => setData("city", val)}
                    options={cityOptions}
                    placeholder="Ketik atau pilih kota"
                    error={errors.city}
                />
                <ComboboxInput
                    label="Provinsi"
                    icon={Map}
                    value={data.province}
                    onChange={(val) => setData("province", val)}
                    options={provinceOptions}
                    placeholder="Ketik atau pilih provinsi"
                    error={errors.province}
                />
                <ComboboxInput
                    label="Kode Pos"
                    icon={MapPin}
                    value={data.postal_code}
                    onChange={(val) => setData("postal_code", val)}
                    options={postalCodeOptions}
                    placeholder="Masukkan kode pos"
                    error={errors.postal_code}
                />

                {/* Hidden country */}
                <input type="hidden" name="country" value={data.country} />

                {/* Telepon */}
                <div className="form-control">
                    <label className="gap-2 text-sm font-semibold label">
                        <Phone className="w-4 h-4 text-cyan-400" /> Nomor Telepon
                    </label>
                    <input
                        type="text"
                        className="w-full input input-bordered"
                        placeholder="081234567890"
                        value={data.phone}
                        onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, "");
                            let warning = null;
                            if (val && !/^(0|62)/.test(val)) warning = "Nomor HP harus diawali 0 atau 62.";
                            else if (val.length > 15) {
                                warning = "Nomor HP maksimal 15 digit.";
                                val = val.slice(0, 15);
                            } else if (val && val.length < 9) warning = "Nomor HP minimal 9 digit.";
                            setLiveErrors((prev) => ({ ...prev, phone: warning }));
                            setData("phone", val);
                        }}
                    />
                    {(errors.phone || liveErrors.phone) && (
                        <span className="text-sm text-error">{errors.phone || liveErrors.phone}</span>
                    )}
                </div>

                {/* Email */}
                <div className="form-control">
                    <label className="gap-2 text-sm font-semibold label">
                        <Mail className="w-4 h-4 text-emerald-400" /> Email
                    </label>
                    <input
                        type="email"
                        className="w-full input input-bordered"
                        placeholder="info@email.com"
                        value={data.email}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                                setLiveErrors((prev) => ({ ...prev, email: "Format email tidak valid." }));
                            } else {
                                setLiveErrors((prev) => ({ ...prev, email: null }));
                            }
                            setData("email", val);
                        }}
                    />
                    {(errors.email || liveErrors.email) && (
                        <span className="text-sm text-error">{errors.email || liveErrors.email}</span>
                    )}
                </div>

                {/* Logo khusus company */}
                {isCompany && (
                    <div className="form-control">
                        <label className="gap-2 text-sm font-semibold label">
                            <ImageIcon className="w-4 h-4 text-yellow-400" /> Logo Perusahaan
                        </label>
                        <input
                            type="file"
                            className="w-full file-input file-input-bordered"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                    setData("logo_path", file);
                                    setPreview(URL.createObjectURL(file));
                                }
                            }}
                        />
                        {preview && (
                            <img src={preview} alt="Preview" className="w-24 h-24 mt-2 rounded-lg" />
                        )}
                        {errors.logo_path && (
                            <span className="text-sm text-error">{errors.logo_path}</span>
                        )}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <Link href={backRoute} className="gap-2 btn btn-ghost">
                        <ArrowLeft className="w-4 h-4" /> Batal
                    </Link>
                    <button type="submit" className="gap-2 shadow-lg btn btn-primary shadow-primary/40">
                        <Save className="w-4 h-4" /> Simpan
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
