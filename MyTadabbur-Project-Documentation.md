# MyTadabbur — Dokumentasi Projek Penuh

**Versi:** 1.0
**Tarikh:** 10 Mac 2026
**Pembangun:** Danish

---

## 1. Pengenalan

MyTadabbur adalah aplikasi jurnal Al-Quran yang membolehkan pengguna menulis catatan harian dengan memilih surah, memasukkan ayat tertentu, dan mencatat refleksi atau pengajaran yang diperoleh, di samping menyimpan semua catatan yang boleh ditapis mengikut surah, diedit atau dipadam, serta menjejak progress bacaan Al-Quran mengikut Juz (1–30) atau Surah (1–114) lengkap dengan progress bar — sesuai digunakan sepanjang Ramadan atau bila-bila masa untuk membina kebiasaan tadabbur harian.

**Visi:** Membina platform digital yang membantu umat Islam merenungi (tadabbur) Al-Quran secara sistematik dengan pengalaman pengguna yang moden, pantas, dan type-safe.

---

## 2. Tech Stack Penuh

### 2.1 Core Framework & UI

| Komponen | Teknologi | Justifikasi |
|----------|-----------|-------------|
| Framework | **TanStack Start** (berasaskan React) | Full-stack capabilities — server functions, SSR, routing dalam satu pakej. Menggabungkan CSR dan SSR dengan kawalan penuh pada state melalui TanStack Router. |
| Styling | **Tailwind CSS** | Wajib untuk Shadcn UI. Utility-first CSS yang laju untuk prototaip dan production. |
| UI Components | **Shadcn UI** | Komponen accessible dan customizable. Sesuai untuk dashboard jurnal, progress bar, form input ayat, dan dialog. |
| Icons | **Lucide React** | Ikon clean dan konsisten — pen (jurnal), kitab (Al-Quran), chart (statistik), bookmark, search, dan lain-lain. |
| Typography | **Google Fonts** | Font utama: *Amiri* (untuk teks Arab) + *Plus Jakarta Sans* (untuk UI Melayu/English). |

### 2.2 Backend & Database

| Komponen | Teknologi | Justifikasi |
|----------|-----------|-------------|
| Database | **PostgreSQL** | Paling stabil untuk urus relationship antara Surah, Ayat, Jurnal, dan Progress. Support JSON columns untuk metadata fleksibel. |
| ORM | **Drizzle ORM** | Lebih laju dari Prisma, lightweight, TypeScript-first. Sangat ngam dengan TanStack Start. Schema-as-code, zero runtime overhead. |
| Hosting DB | **Neon** (utama) / **Supabase** (alternatif) | Free tier yang luas. Neon — serverless PostgreSQL dengan branching untuk dev/staging. Supabase — tambahan auth dan realtime kalau perlu. |
| API Data Quran | **api.alquran.cloud** + **JSON Static Cache** | Fetch data surah/ayat dari API luar, simpan dalam cache TanStack Query. Backup JSON static untuk offline/PWA. |

### 2.3 Data Management ("The Brain")

| Komponen | Teknologi | Justifikasi |
|----------|-----------|-------------|
| State Management | **TanStack Query (React Query)** | Dah sedia ada dalam ekosistem TanStack. Penting untuk caching data Al-Quran supaya user tak perlu tunggu lama bila tukar surah. Auto background refetch, stale-while-revalidate. |
| Routing & URL State | **TanStack Router** | Search params dalam URL (cth: `?surah=al-baqarah&juz=15`) supaya bila user refresh, filter tak hilang. Type-safe routing. |
| Form Handling | **React Hook Form + Zod** | Validate input refleksi, pastikan user masukkan no. ayat/surah yang betul. Zod untuk schema validation yang type-safe. |

### 2.4 Auth & Keselamatan

| Komponen | Teknologi | Justifikasi |
|----------|-----------|-------------|
| Authentication | **Clerk** (utama) / **Kinde Auth** (alternatif) | Paling senang nak setup. Social login (Google, Apple), email/password, dan magic link. Clerk ada React SDK yang mature. |
| Authorization | **Row Level Security (RLS)** pada PostgreSQL | Pastikan user hanya boleh akses data jurnal mereka sendiri. |

### 2.5 Deployment & DevOps

| Komponen | Teknologi | Justifikasi |
|----------|-----------|-------------|
| Hosting | **Vercel** atau **Netlify** | Optimized untuk framework React/TanStack. Edge functions untuk SSR. |
| CI/CD | **GitHub Actions** | Auto deploy on push to main. Lint, type-check, dan test sebelum deploy. |
| Monitoring | **Vercel Analytics** | Track performance, Web Vitals, dan usage patterns. |

---

## 3. Seni Bina Aplikasi (Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Jurnal   │  │ Catatan  │  │ Penjejak │  │Statistik│ │
│  │  (Write)  │  │ (Read)   │  │(Tracker) │  │ (Stats) │ │
│  └─────┬─────┘  └─────┬────┘  └────┬─────┘  └────┬────┘ │
│        │              │            │              │       │
│  ┌─────┴──────────────┴────────────┴──────────────┴────┐ │
│  │              TanStack Query (Cache Layer)            │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌─────────────────────┴───────────────────────────────┐ │
│  │              TanStack Router (URL State)             │ │
│  └─────────────────────┬───────────────────────────────┘ │
└────────────────────────┼─────────────────────────────────┘
                         │
                    SSR / Server Functions
                         │
┌────────────────────────┼─────────────────────────────────┐
│                   SERVER (TanStack Start)                  │
│                        │                                  │
│  ┌─────────────────────┴───────────────────────────────┐ │
│  │              Drizzle ORM (Type-Safe Queries)         │ │
│  └─────────────────────┬───────────────────────────────┘ │
│                        │                                  │
│  ┌──────────┐  ┌───────┴────────┐  ┌───────────────────┐ │
│  │  Clerk   │  │  PostgreSQL    │  │  api.alquran.cloud │ │
│  │  (Auth)  │  │  (Neon)        │  │  (Quran Data)      │ │
│  └──────────┘  └────────────────┘  └───────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Database Schema (Drizzle ORM)

### 4.1 Jadual Utama

```typescript
// schema/users.ts
import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

```typescript
// schema/journal-entries.ts
import { pgTable, uuid, varchar, text, integer, date, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const journalEntries = pgTable("journal_entries", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  surahNumber: integer("surah_number").notNull(),       // 1-114
  surahName: varchar("surah_name", { length: 100 }).notNull(),
  ayahStart: integer("ayah_start"),                      // nullable — boleh log tanpa ayat spesifik
  ayahEnd: integer("ayah_end"),                          // nullable
  reflection: text("reflection").notNull(),              // Pengajaran / refleksi
  mood: varchar("mood", { length: 50 }),                 // "grateful", "reflective", "motivated", dll
  tags: varchar("tags", { length: 500 }),                // comma-separated tags
  date: date("date").notNull(),                          // tarikh catatan
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

```typescript
// schema/reading-progress.ts
import { pgTable, uuid, varchar, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const readingProgress = pgTable("reading_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: varchar("type", { length: 10 }).notNull(),      // "juz" atau "surah"
  number: integer("number").notNull(),                    // Juz 1-30 atau Surah 1-114
  completed: boolean("completed").default(false).notNull(),
  completedDate: date("completed_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

```typescript
// schema/khatam-cycles.ts
import { pgTable, uuid, varchar, integer, date, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const khatamCycles = pgTable("khatam_cycles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  cycleNumber: integer("cycle_number").notNull(),          // Khatam ke-berapa
  label: varchar("label", { length: 100 }),                // cth: "Ramadan 2026", "Khatam Pertama"
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),                               // null = masih dalam progress
  totalDays: integer("total_days"),                        // auto-calculate bila selesai
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

```typescript
// schema/daily-streaks.ts
import { pgTable, uuid, date, integer, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const dailyStreaks = pgTable("daily_streaks", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  date: date("date").notNull(),
  pagesRead: integer("pages_read").default(0),
  minutesSpent: integer("minutes_spent").default(0),       // anggaran masa tadabbur
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
```

### 4.2 ER Diagram

```
users
  │
  ├──< journal_entries     (1 user → banyak catatan)
  ├──< reading_progress    (1 user → banyak progress juz/surah)
  ├──< khatam_cycles       (1 user → banyak kitaran khatam)
  └──< daily_streaks       (1 user → banyak rekod harian)
```

---

## 5. Struktur Folder Projek

```
mytadabbur/
├── app/
│   ├── routes/
│   │   ├── __root.tsx                # Root layout — navbar, sidebar, footer
│   │   ├── index.tsx                 # Landing page / Dashboard
│   │   ├── journal/
│   │   │   ├── index.tsx             # Senarai catatan
│   │   │   ├── new.tsx               # Tulis catatan baru
│   │   │   └── $entryId.tsx          # Lihat/edit catatan spesifik
│   │   ├── tracker/
│   │   │   ├── index.tsx             # Penjejak utama (Juz + Surah grid)
│   │   │   └── khatam.tsx            # Kitaran khatam
│   │   ├── stats/
│   │   │   └── index.tsx             # Statistik & analitik
│   │   ├── quran/
│   │   │   ├── index.tsx             # Senarai surah
│   │   │   └── $surahNumber.tsx      # Baca surah (dari API)
│   │   └── settings/
│   │       └── index.tsx             # Tetapan profil
│   ├── components/
│   │   ├── ui/                       # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── calendar.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── journal/
│   │   │   ├── JournalForm.tsx       # Form tulis/edit catatan
│   │   │   ├── JournalCard.tsx       # Card paparan catatan
│   │   │   ├── JournalList.tsx       # Senarai catatan + filter
│   │   │   ├── SurahSelector.tsx     # Dropdown cari surah
│   │   │   ├── AyahRangeInput.tsx    # Input julat ayat
│   │   │   ├── MoodSelector.tsx      # Pilih mood/perasaan
│   │   │   └── TagInput.tsx          # Input tags
│   │   ├── tracker/
│   │   │   ├── JuzGrid.tsx           # Grid 30 Juz
│   │   │   ├── SurahGrid.tsx         # Grid 114 Surah
│   │   │   ├── ProgressRing.tsx      # Ring chart progress
│   │   │   ├── KhatamTimeline.tsx    # Timeline kitaran khatam
│   │   │   └── StreakCalendar.tsx     # Heatmap kalendar harian
│   │   ├── stats/
│   │   │   ├── StatsOverview.tsx     # Ringkasan statistik
│   │   │   ├── MonthlyChart.tsx      # Chart bulanan
│   │   │   └── TopSurahChart.tsx     # Surah paling kerap dibaca
│   │   └── shared/
│   │       ├── Bismillah.tsx         # Komponen ﷽ header
│   │       ├── ArabicText.tsx        # Wrapper teks Arab (font Amiri)
│   │       ├── EmptyState.tsx        # Paparan kosong
│   │       └── LoadingSpinner.tsx    # Loading state
│   ├── lib/
│   │   ├── db/
│   │   │   ├── index.ts             # Drizzle client connection
│   │   │   ├── schema.ts            # Export semua schema
│   │   │   └── migrations/          # Drizzle migration files
│   │   ├── quran/
│   │   │   ├── api.ts               # Fetch dari api.alquran.cloud
│   │   │   ├── surahs.ts            # Data static senarai 114 surah
│   │   │   └── types.ts             # TypeScript types untuk Quran data
│   │   ├── auth/
│   │   │   └── clerk.ts             # Clerk configuration
│   │   ├── validators/
│   │   │   ├── journal.ts           # Zod schema — journal entries
│   │   │   └── tracker.ts           # Zod schema — tracker input
│   │   └── utils/
│   │       ├── dates.ts             # Helper tarikh Hijri/Masihi
│   │       ├── hijri.ts             # Penukaran tarikh Hijri
│   │       └── constants.ts         # Constant values
│   ├── server/
│   │   ├── functions/
│   │   │   ├── journal.ts           # Server functions — CRUD jurnal
│   │   │   ├── tracker.ts           # Server functions — progress tracker
│   │   │   ├── khatam.ts            # Server functions — kitaran khatam
│   │   │   └── stats.ts             # Server functions — query statistik
│   │   └── middleware/
│   │       └── auth.ts              # Middleware — verify Clerk session
│   └── styles/
│       └── globals.css              # Tailwind base + custom CSS
├── public/
│   ├── icons/                       # PWA icons
│   ├── quran-data/                  # JSON static backup surah
│   └── manifest.json                # PWA manifest
├── drizzle.config.ts                # Drizzle ORM config
├── tailwind.config.ts               # Tailwind config
├── tsconfig.json
├── package.json
└── README.md
```

---

## 6. Feature Breakdown Terperinci

### 6.1 Modul Jurnal (📝)

**Tulis Catatan Baru:**
- Pilih surah melalui searchable dropdown (cari by nama atau nombor).
- Masukkan julat ayat (pilihan) — contoh: "255" atau "1-10".
- Tulis refleksi / pengajaran dalam textarea yang luas.
- Pilih mood: Bersyukur, Renungan, Bermotivasi, Insaf, Tenang, Kagum.
- Tambah tags (pilihan): "Ramadan", "Qiyamullail", "Tadabbur Pagi", custom tag.
- Auto-save draft setiap 30 saat menggunakan TanStack Query mutation.

**Edit & Padam:**
- Edit mana-mana catatan sedia ada.
- Soft delete dengan confirmasi dialog (Shadcn AlertDialog).
- Undo delete dalam 5 saat (toast notification).

### 6.2 Modul Catatan (📚)

**Senarai & Penapisan:**
- Senarai semua catatan dalam format kad (card layout).
- Tapis mengikut: surah, tarikh (range), mood, tags.
- Search bar untuk cari dalam teks refleksi.
- Sort: terbaru dahulu, surah A-Z, atau surah mengikut turutan mushaf.
- URL state via TanStack Router — `?surah=al-baqarah&mood=grateful&sort=newest`.

**Paparan Catatan:**
- Modal atau halaman penuh untuk baca catatan lengkap.
- Papar ayat Arab berkaitan (fetch dari API).
- Terjemahan Melayu (dari api.alquran.cloud — edition: `ms.basmeih`).

### 6.3 Modul Penjejak (📊)

**Penjejak Juz:**
- Grid 30 kotak — klik untuk tandakan selesai.
- Progress bar: "15/30 Juz (50%)".
- Visual: warna hijau untuk selesai, kelabu untuk belum.

**Penjejak Surah:**
- Grid 114 surah — klik untuk tandakan.
- Progress bar: "80/114 Surah (70%)".
- Filter: Makkiyyah / Madaniyyah.

**Kitaran Khatam:**
- Mulakan kitaran khatam baru dengan label (cth: "Ramadan 1447H").
- Track progress dalam kitaran semasa.
- Sejarah khatam sebelum ini dengan jumlah hari.
- Sambung dari mana yang berhenti.

### 6.4 Modul Statistik (📈)

**Dashboard Ringkasan:**
- Jumlah catatan bulan ini vs bulan lepas.
- Streak berturut-turut hari (consecutive days).
- Surah paling kerap dibaca (top 5).
- Purata catatan per minggu.

**Heatmap Kalendar:**
- Macam GitHub contribution graph — hijau gelap untuk hari aktif.
- Klik pada tarikh untuk lihat catatan hari tersebut.

**Chart Bulanan:**
- Bar chart bilangan catatan per bulan (Recharts).
- Highlight bulan Ramadan dengan warna khas.

### 6.5 Modul Al-Quran (📖)

**Senarai Surah:**
- Grid/list 114 surah dengan info ringkas (bilangan ayat, Makkiyyah/Madaniyyah).
- Boleh terus tulis catatan dari sini.

**Baca Surah:**
- Fetch teks Arab + terjemahan Basmeih dari api.alquran.cloud.
- Cache dalam TanStack Query (staleTime: 24 jam).
- Klik mana-mana ayat untuk terus buka form jurnal dengan surah + ayat pre-filled.

---

## 7. Pemetaan Stack ↔ Feature

| Ciri MyTadabbur | Komponen Stack | Sebab |
|----------------|----------------|-------|
| Progress Bar | Shadcn UI `<Progress>` | Komponen siap guna, tinggal masukkan value %. |
| Filter Surah | TanStack Router | Search params dalam URL supaya filter kekal selepas refresh. |
| Catatan Harian | Drizzle + PostgreSQL | Query mudah: "semua tadabbur dalam bulan Ramadan". |
| Data Al-Quran | API + TanStack Query | Fetch sekali, cache lama. Background revalidation. |
| Form Input | React Hook Form + Zod | Validation type-safe. Error messages mesra pengguna. |
| Grid Tracker | Shadcn UI + Tailwind | Grid responsive dengan CSS Grid. Toggle state pantas. |
| Auth | Clerk | Setup 15 minit. Social login + email. Protected routes. |
| Heatmap | Recharts / Custom SVG | Visualisasi streak harian ala GitHub. |
| PWA | Vite PWA Plugin | Install di phone. Offline capable dengan cached Quran data. |

---

## 8. API & Data Al-Quran

### 8.1 Sumber Data

**API Utama:** `https://api.alquran.cloud/v1/`

Endpoint yang diperlukan:

| Endpoint | Kegunaan |
|----------|----------|
| `GET /surah` | Senarai semua 114 surah (nama, bilangan ayat, jenis) |
| `GET /surah/{number}` | Teks Arab surah penuh |
| `GET /surah/{number}/ms.basmeih` | Terjemahan Melayu (Basmeih) |
| `GET /ayah/{surah}:{ayah}/ar.alafasy` | Audio recitation (bonus) |

### 8.2 Strategi Caching

```typescript
// lib/quran/api.ts
import { queryOptions } from "@tanstack/react-query";

export const surahListQuery = queryOptions({
  queryKey: ["surahs"],
  queryFn: async () => {
    const res = await fetch("https://api.alquran.cloud/v1/surah");
    const data = await res.json();
    return data.data;
  },
  staleTime: 1000 * 60 * 60 * 24,    // 24 jam — data surah tak berubah
  gcTime: 1000 * 60 * 60 * 24 * 7,   // Cache selama 7 hari
});

export const surahDetailQuery = (number: number) =>
  queryOptions({
    queryKey: ["surah", number],
    queryFn: async () => {
      const [arabic, malay] = await Promise.all([
        fetch(`https://api.alquran.cloud/v1/surah/${number}`).then(r => r.json()),
        fetch(`https://api.alquran.cloud/v1/surah/${number}/ms.basmeih`).then(r => r.json()),
      ]);
      return { arabic: arabic.data, malay: malay.data };
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
```

### 8.3 Backup Static JSON

Untuk PWA offline, simpan JSON static dalam `/public/quran-data/`:

```
public/quran-data/
├── surahs-meta.json          # Metadata 114 surah
├── surah-001-arabic.json     # Teks Arab Al-Fatihah
├── surah-001-malay.json      # Terjemahan Basmeih Al-Fatihah
├── ...
└── surah-114-malay.json
```

Service worker akan serve dari cache kalau offline.

---

## 9. Aliran Pengguna (User Flows)

### 9.1 Flow Tulis Catatan

```
User buka app
  → Dashboard (lihat ringkasan + streak)
  → Klik "Tulis Catatan Baru"
  → Form muncul:
      1. Cari & pilih surah (searchable dropdown)
      2. Masukkan julat ayat (optional)
      3. Lihat preview ayat Arab + terjemahan (auto-fetch)
      4. Tulis refleksi dalam textarea
      5. Pilih mood (emoji selector)
      6. Tambah tags (optional)
  → Klik "Simpan"
  → Toast: "Catatan berjaya disimpan! ✨"
  → Redirect ke senarai catatan
```

### 9.2 Flow Penjejak Ramadan

```
User buka Penjejak
  → Klik "Mulakan Khatam Baru"
  → Masukkan label: "Ramadan 1447H"
  → Grid 30 Juz dipaparkan
  → Setiap hari, user klik Juz yang telah dibaca
  → Progress bar update: "10/30 (33%)"
  → Heatmap kalendar menunjukkan hari aktif
  → Bila semua 30 Juz ditandakan:
      → Konfetti animation 🎉
      → Dialog: "Tahniah! Anda telah khatam Al-Quran!"
      → Record disimpan dalam sejarah khatam
```

---

## 10. PWA (Progressive Web App)

### 10.1 Konfigurasi

```typescript
// vite.config.ts (atau app.config.ts untuk TanStack Start)
import { VitePWA } from "vite-plugin-pwa";

export default {
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "MyTadabbur — Jurnal Al-Quran",
        short_name: "MyTadabbur",
        description: "Catatan harian & penjejak bacaan Al-Quran",
        theme_color: "#1a3a2a",
        background_color: "#faf8f4",
        display: "standalone",
        orientation: "portrait",
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.alquran\.cloud\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "quran-api-cache",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
};
```

### 10.2 Capability

- Install di homescreen (Android & iOS).
- Offline reading untuk surah yang pernah dibuka.
- Background sync untuk catatan yang ditulis offline.
- Push notification untuk daily reminder (fasa seterusnya).

---

## 11. Roadmap Pembangunan

### Fasa 1 — Foundation (Minggu 1–2)

- Setup TanStack Start project + Tailwind + Shadcn UI.
- Konfigurasi Drizzle ORM + Neon PostgreSQL.
- Setup Clerk auth (sign up, login, protected routes).
- Database migration — create semua jadual.
- Bina komponen shared: Bismillah, ArabicText, layout.
- Data static surah (senarai 114 surah).

### Fasa 2 — Core Features (Minggu 3–4)

- Modul Jurnal: form tulis catatan, CRUD penuh.
- Modul Catatan: senarai, filter, search, sort.
- Integrasi api.alquran.cloud — fetch ayat + terjemahan.
- SurahSelector component dengan search.
- React Hook Form + Zod validation.

### Fasa 3 — Tracker & Progress (Minggu 5–6)

- Modul Penjejak: grid Juz + grid Surah.
- Progress bar dan ring chart.
- Kitaran Khatam: mula, track, selesai.
- Streak harian + heatmap kalendar.

### Fasa 4 — Stats & Polish (Minggu 7–8)

- Dashboard statistik: chart bulanan, top surah, streak.
- Modul Baca Quran: papar ayat Arab + terjemahan.
- UI polish: animasi, responsive design, dark mode.
- Error handling dan loading states.

### Fasa 5 — PWA & Launch (Minggu 9–10)

- Setup PWA: manifest, service worker, offline cache.
- Testing menyeluruh (mobile + desktop).
- Performance optimization (lazy loading, code splitting).
- Soft launch — kongsi dengan kawan/keluarga untuk feedback.
- Bug fixes dan iterasi.

### Fasa Bonus (Selepas Launch)

- Audio recitation (Al-Afasy).
- Daily reminder notification.
- Export catatan ke PDF.
- Sharing catatan ke media sosial.
- Community features: kongsi refleksi (opt-in).
- Tarikh Hijri integration.
- Multi-language support (English + Bahasa Melayu).

---

## 12. Anggaran Kos

| Item | Kos | Nota |
|------|-----|------|
| Neon PostgreSQL | **Percuma** | Free tier: 0.5 GB storage, 100 hours compute |
| Clerk Auth | **Percuma** | Free tier: 10,000 MAU |
| Vercel Hosting | **Percuma** | Free tier: 100 GB bandwidth |
| Domain (.com) | **~RM50/tahun** | mytadabbur.com |
| api.alquran.cloud | **Percuma** | Open API, tiada had |
| **Jumlah** | **~RM50/tahun** | Boleh launch dengan hampir percuma! |

---

## 13. Penutup

MyTadabbur bukan sekadar app — ia adalah alat untuk membina hubungan yang lebih mendalam dengan Al-Quran. Dengan stack moden yang type-safe dan performant (TanStack Start + Drizzle + Shadcn UI), kita boleh bina pengalaman pengguna yang setaraf dengan app-app antarabangsa, sambil mengekalkan konteks dan keperluan pengguna Muslim Malaysia.

**رَبِّ زِدْنِي عِلْمًا**
*"Ya Tuhanku, tambahkanlah ilmuku."* — Surah Ta-Ha: 114

---

*Dokumen ini adalah rujukan hidup (living document) yang akan dikemaskini sepanjang proses pembangunan.*
