// resources/js/Data/locationData.js
// Daftar provinsi, kota/kabupaten, dan kode pos utama (contoh sebagian)

// Struktur data: provinsi -> daftar kota/kabupaten (dengan kode pos utama)
export const locations = {
  "DKI Jakarta": [
    { city: "Jakarta Pusat", postal: "10110" },
    { city: "Jakarta Utara", postal: "14110" },
    { city: "Jakarta Barat", postal: "11220" },
    { city: "Jakarta Selatan", postal: "12110" },
    { city: "Jakarta Timur", postal: "13110" },
  ],
  "Jawa Barat": [
    { city: "Bandung", postal: "40111" },
    { city: "Bekasi", postal: "17121" },
    { city: "Depok", postal: "16416" },
    { city: "Bogor", postal: "16119" },
    { city: "Cimahi", postal: "40512" },
  ],
  "Jawa Tengah": [
    { city: "Semarang", postal: "50135" },
    { city: "Surakarta", postal: "57111" },
    { city: "Magelang", postal: "56117" },
    { city: "Tegal", postal: "52114" },
    { city: "Pekalongan", postal: "51122" },
  ],
  "Jawa Timur": [
    { city: "Surabaya", postal: "60119" },
    { city: "Malang", postal: "65111" },
    { city: "Kediri", postal: "64121" },
    { city: "Blitar", postal: "66137" },
    { city: "Madiun", postal: "63122" },
  ],
  "DI Yogyakarta": [
    { city: "Yogyakarta", postal: "55111" },
    { city: "Sleman", postal: "55511" },
    { city: "Bantul", postal: "55711" },
    { city: "Gunung Kidul", postal: "55812" },
    { city: "Kulon Progo", postal: "55611" },
  ],
  Bali: [
    { city: "Denpasar", postal: "80111" },
    { city: "Badung", postal: "80351" },
    { city: "Gianyar", postal: "80511" },
    { city: "Tabanan", postal: "82111" },
  ],
  "Sumatera Utara": [
    { city: "Medan", postal: "20111" },
    { city: "Binjai", postal: "20711" },
    { city: "Tebing Tinggi", postal: "20611" },
    { city: "Pematang Siantar", postal: "21111" },
  ],
  "Sulawesi Selatan": [
    { city: "Makassar", postal: "90111" },
    { city: "Parepare", postal: "91111" },
    { city: "Palopo", postal: "91911" },
  ],
  "Kalimantan Timur": [
    { city: "Balikpapan", postal: "76111" },
    { city: "Samarinda", postal: "75111" },
    { city: "Bontang", postal: "75311" },
  ],
};

// 🔹 List provinsi
export const provinceOptions = Object.keys(locations);

// 🔹 List kota (flatten semua)
export const cityOptions = Object.values(locations).flatMap((cities) =>
  cities.map((c) => c.city)
);

// 🔹 List kode pos (flatten semua)
export const postalCodeOptions = Object.values(locations).flatMap((cities) =>
  cities.map((c) => c.postal)
);
