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

export function removeDecimal(value) {
  if (value === null || value === undefined) return '';

  // Jika tidak punya desimal, return integer tanpa .00
  if (Number.isInteger(Number(value))) {
    return Number(value).toLocaleString('id-ID');
  }

  // Jika punya desimal, bisa tetap ditampilkan atau dihilangkan
  return Number(value).toLocaleString('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}


// Format mata uang global (USD/EUR/SGD dll)
export const formatCurrency = (value, currency = "IDR") => {
    const num = Number(value) || 0;

    // Untuk IDR tetap tanpa koma
    if (currency === "IDR") {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num);
    }

    // Untuk mata uang asing → pakai 2 desimal
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

// Input parser
export const parseRupiah = (value) => {
    if (!value) return 0;
    return Number(value.toString().replace(/\D/g, "")) || 0;
};

export const formatRupiahNoPrefix = (value) => {
    const n = Math.round(Number(value) || 0);
    return new Intl.NumberFormat("id-ID", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(n);
}


// export const formatRupiah = (value) => {
//     if (value === null || value === undefined) return "";
//     const number = parseInt(value.toString().replace(/\D/g, "")) || 0;
//     return new Intl.NumberFormat("id-ID", {
//         style: "currency",
//         currency: "IDR",
//         minimumFractionDigits: 0,
//     }).format(number);
// };

// export const parseRupiah = (value) => {
//     if (!value) return 0;
//     return parseInt(value.toString().replace(/\D/g, "")) || 0;
// };
