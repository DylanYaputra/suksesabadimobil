# Sukses Abadi Mobil - Showroom Mobil Bekas

Website catalog mobil bekas profesional untuk showroom Sukses Abadi Mobil.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **ShadCN UI**
- **PostgreSQL**
- **Prisma ORM**
- **NextAuth** (Authentication)
- **Cloudinary** (Image Upload)

## Fitur Utama

### Frontend
- Homepage dengan Hero Section, Featured Cars, Keunggulan, Testimoni, Lokasi
- Katalog mobil dengan filter (merk, tahun, harga, transmisi, bahan bakar, status)
- Detail mobil dengan gallery gambar dan spesifikasi
- WhatsApp floating button

### Admin Dashboard
- Login dengan NextAuth
- CRUD Mobil (nama, merk, model, tahun, harga, kilometer, warna, plat nomor, transmisi, bahan bakar, kapasitas mesin, deskripsi, status, featured, multiple gambar)
- CRUD Merk
- CRUD Testimoni
- Dashboard Statistik

## Setup & Instalasi

### 1. Prasyarat
- Node.js 18+
- PostgreSQL
- Akun Cloudinary

### 2. Instalasi Dependensi

```bash
npm install
```

### 3. Konfigurasi Environment

Copy file `.env.example` menjadi `.env` dan isi variabel berikut:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/sukses_abadi_mobil?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Admin Credentials
ADMIN_EMAIL="admin@suksesabadi.com"
ADMIN_PASSWORD="your-admin-password"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 4. Migrasi Database

```bash
npx prisma migrate dev
```

### 5. Menjalankan Server Development

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

### 6. Login Admin

- Akses `/admin/login`
- Gunakan email dan password yang diatur di `ADMIN_EMAIL` dan `ADMIN_PASSWORD`

## Struktur Folder

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/
│   │   ├── brands/
│   │   ├── cars/
│   │   ├── inquiries/
│   │   ├── stats/
│   │   └── upload/
│   ├── admin/
│   ├── catalog/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── providers.tsx
│   └── whatsapp-button.tsx
└── lib/
    ├── auth.ts
    ├── cloudinary.ts
    ├── db.ts
    └── utils.ts
```
