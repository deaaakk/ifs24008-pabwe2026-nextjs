# Ruang Cerita

Aplikasi komunitas untuk berbagi dan berinteraksi dengan postingan melalui Delcom Open API.

## Menjalankan aplikasi

Pastikan Bun terpasang, salin `.env.example` menjadi `.env`, lalu jalankan:

```bash
bun install
bun run dev
```

Launcher membaca port dari `APP_PORT`. URL Delcom API diatur lewat
`NEXT_PUBLIC_DELCOM_BASEURL`. Aplikasi menggunakan Next.js App Router, TypeScript,
Tailwind CSS v4, dan Redux Toolkit.

## Pemeriksaan

```bash
bun run lint
bun run test
bun run test:coverage
bun run build
```

Laporan coverage menggunakan provider v8 dan mengharuskan threshold 100%.
