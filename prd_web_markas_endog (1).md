# Product Requirements Document (PRD) & Prompt: Web Dashboard "Markas Endog"

**System Role & Objective**
Anda adalah seorang Full-Stack Web Developer yang ahli dalam menggunakan Next.js (App Router), React, Tailwind CSS, dan Supabase. Tugas Anda adalah membuat antarmuka *admin dashboard* yang interaktif, rapi, dan *mobile-first* untuk Sistem Informasi Manajemen Produksi dan Inventaris peternakan ayam petelur bernama "Markas Endog".

## UI/UX Design Requirements

* **Tema & Tampilan**: Gunakan desain *admin dashboard* modern yang bersih (*clean UI*).
* **Mode Tema**: Wajib menambahkan *toggle* interaktif untuk *Dark Mode* dan *Light Mode* (menggunakan kelas `dark:` dari Tailwind CSS).
* **Responsivitas**: Tampilan harus *mobile-first* karena pengguna utama (pemilik dan pekerja kandang) akan mengaksesnya melalui *browser* ponsel saat berada di kandang. Tombol dan teks harus cukup besar dan mudah dibaca.
* **Komponen**: Gunakan komponen interaktif (seperti *cards* untuk ringkasan, tabel untuk riwayat, dan grafik/chart untuk visualisasi data).

## Struktur File & Direktori Proyek (Disarankan)

Gunakan struktur direktori berbasis `src/` dengan Next.js App Router agar kode tetap rapi, modular, dan mudah di-maintain:

```text
/src
  /app
    /api                  # Route handlers (mis. endpoint untuk parsing CSV)
      /import-csv
        route.ts
    /(dashboard)          # Route group untuk layout dashboard yang terproteksi
      /beranda
        page.tsx
      /produksi
        page.tsx
      /inventaris
        page.tsx
      /laporan
        page.tsx
      /profil
        page.tsx
      layout.tsx          # Memuat Sidebar, Header, & Theme Provider
    globals.css           # Konfigurasi Tailwind & CSS Global
    layout.tsx            # Root layout
    page.tsx              # Halaman Login/Landing Page
  /components
    /layout               # Komponen Sidebar, Topbar, MobileMenu
    /ui                   # Komponen Reusable (Button, Card, Modal, Input)
    /features             # Komponen spesifik fitur (Chart, CSVUploader, TableRiwayat)
  /lib
    supabase.ts           # Inisialisasi Supabase Client
    utils.ts              # Fungsi utility (format tanggal, angka, kalkulasi)
  /types
    index.ts              # Definisi tipe TypeScript untuk database
```

## Fitur Khusus: Manajemen Data

* **Import CSV**: Wajib menyediakan fitur **Import CSV** (terutama pada menu Produksi dan Laporan/Keuangan). Komponen ini sebaiknya ditempatkan di `src/components/features/CSVUploader.tsx`. Fitur ini bertujuan untuk memudahkan migrasi data riwayat panen atau transaksi lama yang mungkin sudah diketik di Excel agar masuk langsung ke dalam basis data sistem.

## Menu dan Fungsionalitas Utama

Buatkan struktur navigasi (Sidebar/Bottom Navigation) untuk 5 menu utama berikut:

### 1. Beranda (Dashboard)

* Tampilkan *Summary Cards*: Produksi hari ini, Sisa stok pakan (beserta estimasi hari habis), Total Pemasukan, dan Total Pengeluaran.
* Tampilkan grafik (misalnya *bar chart* atau *line chart* menggunakan `Recharts`) untuk tren produksi mingguan.

### 2. Produksi

* Buat form input interaktif untuk: Tanggal panen, jumlah *egg tray*, butir lepas, butir rusak, dan berat total (kg).
* Sistem harus menghitung otomatis `total_butir` (jumlah *tray* × 30 butir + butir lepas).
* Tampilkan tabel riwayat produksi dengan filter tanggal.
* **Fitur Tambahan**: Tombol "Import CSV" untuk memasukkan data produksi historis secara massal.

### 3. Inventaris (Pakan)

* Buat form untuk mencatat pembelian pakan (tanggal, jenis, jumlah kg, harga) dan rata-rata pemakaian harian.
* Sistem harus menghitung sisa stok dan estimasi hari habis otomatis.
* Tampilkan notifikasi/peringatan warna merah (*alert*) "Beli Pakan" jika estimasi stok berada di bawah 7 hari.

### 4. Laporan

* Buat antarmuka untuk input transaksi keuangan (pemasukan/pengeluaran) dan harga pasar harian.
* Tampilkan rekapitulasi laba bersih harian/bulanan dan grafik penghasilan bulanan.
* **Fitur Tambahan**: Fasilitas "Import CSV" untuk memasukkan riwayat transaksi keuangan lama.

### 5. Profil

* Halaman untuk melihat dan mengubah data akun admin serta informasi peternakan.

## Database & State Management (Supabase Mockup)

* Siapkan rancangan skema atau fungsi untuk tabel PostgreSQL berikut: `profiles`, `egg_productions`, `feed_inventories`, `feed_usages`, dan `transactions`.
* Buat fungsi/handler *parsing* CSV (misalnya menggunakan pustaka `papaparse` di klien atau melalui *Route Handlers* di `src/app/api/`) untuk memproses file yang di-*upload* sebelum di-insert ke tabel Supabase.
* Jika digunakan untuk tahap prototipe/mockup, gunakan *mock state* di React untuk mendemonstrasikan bagaimana grafik, kalkulasi panen, notifikasi stok pakan, dan simulasi proses baca CSV berjalan secara *real-time*.