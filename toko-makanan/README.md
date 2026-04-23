# Manajemen Penjualan Toko Makanan

Website input dan tampil data penjualan yang terhubung ke Google Spreadsheet.

## Struktur File

```
toko-makanan/
├── index.html   → tampilan utama (form + tabel)
├── config.js    → URL API (edit di sini)
├── sales.js     → semua logic JavaScript
└── gas.js       → kode Google Apps Script (backend)
```

---

## Cara Setup

### 1. Buat Google Spreadsheet

Buat spreadsheet baru, isi header di baris pertama:

| No | Nama Pembeli | Jenis Makanan | Jumlah | Harga Satuan | Total Harga | Timestamp |
|----|--------------|---------------|--------|--------------|-------------|-----------|

### 2. Deploy Google Apps Script

1. Buka [script.google.com](https://script.google.com)
2. Klik **New Project**
3. Hapus kode default, paste seluruh isi `gas.js`
4. Klik **Deploy → New deployment**
5. Pilih type: **Web App**
6. Atur:
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Klik **Deploy**, lalu **Authorize** jika diminta
8. Copy URL yang muncul

### 3. Hubungkan ke Frontend

Buka `config.js`, ganti URL:

```js
// Sebelum
const API_URL = "PASTE_URL_WEB_APP_DI_SINI";

// Sesudah
const API_URL = "https://script.google.com/macros/s/xxxxx/exec";
```

### 4. Jalankan

Buka `index.html` di browser. Tidak perlu server tambahan.

---

## Catatan

- Setiap kali mengubah kode `gas.js`, buat **New deployment** (bukan edit yang lama)
- Pastikan Spreadsheet dan Apps Script dalam akun Google yang sama
- Jika data tidak muncul, cek URL di `config.js` sudah benar
