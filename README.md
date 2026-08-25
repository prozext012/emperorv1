<div align="center">

# 🛒 dixzSTORE — Web Utama

### Etalase toko online real-time berbasis Firebase

Katalog produk, checkout, status/story ala WhatsApp, dan live chat pelanggan —
dibangun murni HTML/CSS/JavaScript tanpa framework berat.

[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)

</div>

---

## 📖 Daftar Isi

- [Tentang Proyek](#-tentang-proyek)
- [Fitur](#-fitur)
- [Struktur Folder](#-struktur-folder)
- [Tumpukan Teknologi](#-tumpukan-teknologi)
- [Instalasi & Setup](#-instalasi--setup)
- [Keamanan](#-keamanan)
- [Repo Terkait](#-repo-terkait)

---

## 🧾 Tentang Proyek

Repo ini adalah **halaman publik toko dixzSTORE** — tempat pelanggan melihat produk,
melakukan checkout, melihat status/story, dan chat langsung dengan admin.

Semua konten (produk, testimoni, notifikasi, profil toko) diambil secara **real-time**
dari Firebase Firestore, dan dikelola dari repo terpisah [`kaisarv2`](#-repo-terkait)
(panel admin) — begitu admin mengubah data, halaman ini otomatis update tanpa reload.

---

## ✨ Fitur

- 📦 **Katalog produk** — grid produk dinamis, sinkron real-time dari Firestore
- 💳 **Checkout & pembayaran** — modal sheet untuk proses transaksi
- 📸 **Status/story** — ala WhatsApp, auto-expire setelah 24 jam
- 💬 **Live chat** — kirim pesan langsung ke admin
- ⭐ **Slider testimoni** — testimoni pelanggan berjalan otomatis
- 🔔 **Notifikasi berjalan** — running text info promo/pengumuman
- 🌐 **Profil toko dinamis** — foto, banner, bio tersinkron dari admin
- 📊 **Tracking pengunjung** — sesi & halaman yang dilihat, terekam otomatis
- 🧹 **Auto-cleanup** — data lama (status kedaluwarsa, log) dibersihkan otomatis

---

## 📁 Struktur Folder

```
kaisarv1/
├── index.html               # Halaman utama toko
├── firabase.js                # Inisialisasi Firebase & seluruh logic halaman
│
├── css/
│   ├── base-reset.css           # Reset & base style
│   ├── checkout-sheet.css         # Modal checkout
│   ├── produk-payment.css          # Kartu produk & pembayaran
│   └── status-story.css             # Tampilan status/story
│
└── js/
    ├── addon-ig-sheet.js          # Sheet tambahan bergaya Instagram
    ├── ig-close.js                 # Handler tombol close
    ├── navigasi-halaman.js          # Navigasi antar halaman
    ├── payment-sheet.js               # Logic sheet pembayaran
    ├── produk-grid.js                  # Render grid produk
    ├── slider-testimoni.js              # Slider testimoni
    ├── status-init.js                    # Inisialisasi status/story
    └── status-viewer.js                   # Viewer status/story
```

---

## 🛠️ Tumpukan Teknologi

| Kategori | Teknologi |
|---|---|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES Modules) |
| **Database** | Firebase Firestore (real-time) |
| **Media** | Cloudinary (gambar & video produk/status) |
| **Hosting** | Vercel |

---

## 🚀 Instalasi & Setup

### 1. Clone repository
```bash
git clone <url-repo-kaisarv1>
cd kaisarv1
```

### 2. Konfigurasi Firebase
Salin config project Firebase (sama dengan yang dipakai di `kaisarv2`) ke `firabase.js`:

```js
const firebaseConfig = {
  apiKey: "xxxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxxxx.firebaseapp.com",
  projectId: "xxxxxxxxxxx",
  storageBucket: "xxxxxxxxxxx.firebasestorage.app",
  messagingSenderId: "xxxxxxxxxxx",
  appId: "xxxxxxxxxxx"
};
```

### 3. Jalankan secara lokal
```bash
npx serve .
```

### 4. Deploy
Deploy folder ini sebagai project Vercel terpisah, arahkan ke domain:
```
dixz-vip.vercel.app
```

---

## 🔐 Keamanan

- 🔑 Kunci API Firebase dibatasi hanya untuk domain resmi (**HTTP referrer restriction**
  di Google Cloud Console)
- 📜 Semua baca/tulis data divalidasi ulang oleh **Firestore Security Rules**
  (dikelola bersama di sisi project Firebase) — publik hanya bisa baca data non-sensitif
  dan menulis data terbatas (chat, tracking kunjungan)
- 🕵️ Data pengunjung (`visitorSessions`, `visitorPageViews`) **tidak bisa dibaca publik**,
  hanya bisa ditulis (satu arah)

> ⚠️ `apiKey` yang terlihat di source code adalah hal normal untuk aplikasi Firebase
> berbasis client — perlindungan sesungguhnya ada di Security Rules, bukan dengan
> menyembunyikan config.

---

## 🔗 Repo Terkait

| Repo | Fungsi | Domain |
|---|---|---|
| **`kaisarv1`** *(repo ini)* | Web utama / etalase toko | `dixz-vip.vercel.app` |
| [`kaisarv2`](#) | Panel admin & dashboard | `notifikasi-dixzvip.vercel.app` |

Kedua repo berbagi satu database Firebase yang sama secara real-time.

---

<div align="center">

Dibuat dengan ❤️ untuk **dixzSTORE**

</div>
