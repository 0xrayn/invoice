// utils/formatters.js
export const formatDate = (dateString) => {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(d);
};

export const formatRupiah = (number) => {
    const n = Number(number) || 0;
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(n);
};

export const formatNumber = (number) => {
    const n = Number(number) || 0;
    return new Intl.NumberFormat("id-ID").format(n);
};

export const formatInteger = (number) => {
    if (number == null) return 0;
    return Math.round(number).toLocaleString("id-ID");
};

export const formatCurrency = (value, currency = "IDR") => {
    if (value == null) return "-";
    const code = typeof currency === "string" ? currency : currency?.code || "IDR";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: code }).format(value);
};

// create invoice
export const currencyFormat = (v) => {
    const n = Number(v) || 0;
    return n.toLocaleString("id-ID");
};

// export const formatRupiah = (value) => {
//     if (value === null || value === undefined) return "";
//     const number = parseInt(value.toString().replace(/\D/g, "")) || 0;
//     return new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         minimumFractionDigits: 0,
//     }).format(number);
// };

export const parseRupiah = (value) => {
    if (!value) return 0;
    return parseInt(value.toString().replace(/\D/g, "")) || 0;
};
