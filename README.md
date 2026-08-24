# 🛍️ dixzSTORE — Web Kasir & Warung

> Sistem kasir & etalase online, real-time sync pakai Firebase Firestore + Cloudinary buat semua media.

**Live:** [dixz-vip.vercel.app](https://dixz-vip.vercel.app)

---

## 📦 Soal Struktur Folder Ini

Ya, ini emang sengaja dibikin berantakan 😁 3 file inti web ini (`style.css`, `script.js`, `firabase.js`) **dipecah jadi 18 potongan file**, nama & folder-nya diacak (gak ada hubungan sama isinya), ditaruh di cabang folder yang beda arah dan dalam:

- **`style.css`** → 1 file, disamarkan namanya, ditaruh 4 level dalam
- **`script.js`** → dipecah jadi **8 potongan** `.js`, dipanggil lewat 8 tag `<script>` berurutan di `index.html`. Ini "classic script" biasa, jadi semua potongan otomatis nyambung balik lewat scope global browser — asal urutan tag-nya gak diubah.
- **`firabase.js`** → dipecah jadi **9 potongan** `.mjs` (ES Module), saling terhubung lewat `import`/`export` eksplisit antar file (bukan cuma numpuk doang) — supaya kalau salah satu potongan hilang pas di-*clone* asal-asalan, error-nya langsung ketauan (bukan diem-diem salah harga/salah data).

**Kenapa direkayasa serumit ini?** Supaya kalau ada yang asal *copy-paste*/`git clone` sebagian doang (skip folder, ambil cuma yang "kelihatan penting"), web-nya **gak akan jalan sama sekali** — bukan cuma tampilannya rusak, tapi bakal blank/error total, jadi ketauan ada yang kurang.

> ⚠️ **Catatan jujur:** ini tetap bukan proteksi anti-pencurian yang sesungguhnya. Begitu web jalan di browser pengunjung, SEMUA potongan file (di path manapun) otomatis ke-download — orang yang niat serius pakai DevTools/Network tab tetap bisa kumpulin semuanya. Proteksi yang benar-benar menutup celah ada di bagian [🔒 Keamanan](#-keamanan) di bawah. Anggap struktur ini sebagai "pagar duri" ekstra buat nyusahin yang asal comot, bukan gembok utama.

### ✅ Sudah divalidasi ketat sebelum di-zip

Karena mecah file serumit ini gampang bikin kode putus nyambung (apalagi `firabase.js` yang modul ES, punya variabel `db` dkk yang dipakai di banyak bagian), setiap potongan sudah melalui:

1. **Cek sintaks** (`node --check`) di tiap file, satu per satu
2. **Analisa jalur variabel** — dicek variabel/fungsi mana yang dipakai lintas-file, otomatis ditambahin `export`/`import` yang presisi
3. **Tes eksekusi sungguhan** — semua potongan dijalankan beneran secara berurutan (pakai Node + SDK Firebase tiruan), dipastikan tidak ada "variabel tidak ditemukan" sama sekali
4. **Rekonstruksi ulang** — semua potongan digabung lagi, dicocokkan persis sama file aslinya

---

## 🚀 Cara Deploy ke Vercel (lewat GitHub)

1. **Push repo ini ke GitHub** (private repo disarankan):
   ```bash
   git init
   git add .
   git commit -m "init: dixzSTORE"
   git branch -M main
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git push -u origin main
   ```
2. **Buka [vercel.com](https://vercel.com) → New Project → Import** repo ini.
3. Vercel otomatis kedeteksi sebagai **static site** — biarin Build Command & Output Directory kosong/default.
4. Klik **Deploy**. Semua path di `index.html` udah lengkap mengarah ke lokasi potongan file yang benar, jadi gak perlu setting tambahan apapun.

> ⚠️ **JANGAN** ubah/pindahkan nama file atau folder manapun di dalam `assets/` secara manual — semua path di `index.html` sudah presisi mengarah ke lokasi & nama file yang persis seperti ini. Kalau perlu reorganisasi ulang, minta dibuatkan versi baru daripada ngedit manual.

---

## 🔒 Keamanan

Proteksi yang **beneran** menutup celah (bukan cuma struktur folder):

- ✅ **Firestore Security Rules** sudah dipasang & dipublish
- ✅ **API key Firebase dibatasi per-domain** (`dixz-vip.vercel.app/*`) via Google Cloud Console — kunci gak bisa dipanggil dari domain lain walau kecolongan
- ✅ Semua gambar disimpan di **Cloudinary**, bukan base64 di Firestore
- ✅ Checkout **dikunci** sampai harga tersinkron dari server (anti bug harga basi)
- ✅ Data awal produk **tidak lagi hardcoded** di source

---

## 🗂️ File yang **TIDAK** ikut di-hosting publik

- `legacy_products_backup.json` — backup data produk lama, dipakai manual lewat tombol import di admin, **jangan** ikut di-push ke repo
- `firestore.rules.txt` — dokumentasi rules, sudah dipublish langsung di Firebase Console

---

Made with 🔥 Firebase, ☁️ Cloudinary, dan niat jahil yang sangat terstruktur~
