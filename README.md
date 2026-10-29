# The Living Archive — Dari Barak ke Masyarakat

Pameran digital independen untuk membaca sejarah kepolisian Indonesia, perubahan institusi, dan pengalaman masyarakat. Proyek pendidikan ini bukan situs resmi Polri dan bukan kanal pengaduan.

## Menjalankan lokal

Gunakan Node.js 20 atau lebih baru, lalu jalankan:

```sh
npm start
```

Buka `http://localhost:4173`. Tidak ada paket tambahan yang harus dipasang. Port dapat diubah melalui variabel `PORT`; server hanya mendengarkan pada alamat lokal.

## Membuat paket situs statis

```sh
npm run build
```

Hasilnya berada dalam `dist/`, yang hanya memuat halaman publik, kode antarmuka, dan aset. Berkas kerja, laporan pemeriksaan, serta README tidak ikut dipublikasikan. Konten utama juga tersedia sebagai HTML sehingga tetap terbaca ketika JavaScript tidak berjalan.

Domain publik belum ditetapkan. Build tanpa alamat tidak mengarang canonical URL atau URL gambar sosial. Setelah alamat final tersedia, jalankan ulang:

```sh
npm run build -- --url https://alamat-domain-final/
```

Alamat juga dapat diberikan melalui `SITE_URL`. Gunakan alamat nyata dengan protokol HTTPS dan sertakan subdirektori apabila situs dipasang di dalam subdirektori. Build tersebut menulis canonical URL, Open Graph, dan gambar sosial absolut langsung di HTML serta membuat `sitemap.xml` dan arahan sitemap dalam `robots.txt`. Unggah isi `dist/` ke hosting statis dan atur `404.html` sebagai halaman tidak ditemukan dengan status HTTP 404.

Jika memakai server Node untuk alamat publik, atur `SITE_URL` pada alamat final dan pasang server di belakang pengelola HTTPS. Tanpa `SITE_URL`, server hanya menerima Host lokal. Server lokal menyediakan metadata absolut dari alamat permintaan; metadata tidak bergantung pada JavaScript peramban.

## Pemeriksaan

```sh
npm run check
npm test
```

Pemeriksaan HTTP mencakup halaman publik, tautan internal dan tujuan bagiannya, metadata HTML, MIME, batas berkas publik, metode, path traversal, validasi Host, kompresi, ETag/304, robots, dan sitemap. `npm run test:http` tersedia sebagai perintah yang setara. Pemeriksaan tampilan dan alur interaksi disimpan terpisah di `output/`; hasil pemeriksaan harus menyebut ukuran layar serta versi konten yang benar-benar diuji.

## Struktur proyek

- `index.html` — ruang pamer dan fallback HTML.
- `sources.html` — perpustakaan sumber, status verifikasi, dan kredit.
- `content.mjs` — satu sumber data narasi, koleksi, dan roadmap.
- `render-content.mjs` — pembentukan konten statis dari data narasi.
- `script.js` — peningkatan interaksi, galeri, dialog, timeline, dan simulasi lokal.
- `styles.css` — sistem visual dan aturan berbagai ukuran layar.
- `assets/` — gambar, ilustrasi, font, dan lisensi.
- `build.mjs` — paket publikasi statis dan metadata domain.
- `server.mjs` — server lokal dengan batas berkas publik, kompresi, dan validasi permintaan.
- `source-ledger.md` — catatan editorial internal; halaman publiknya adalah `sources.html`.

## Batas isi dan data

Rekam KTI bersumber dari informasi penyusun yang diberikan untuk proyek; salinan naskah lengkap, bibliografi, dan halaman kutipan belum tersedia. Klaim yang belum memiliki dokumen primer harus tetap diberi status yang jelas. Sumber sekunder tidak disebut sebagai arsip primer. Foto dan ilustrasi mengikuti kredit serta status penggunaan yang dicantumkan pada perpustakaan sumber.

Simulasi memakai kasus fiktif untuk pembelajaran. Pilihan berada dalam memori halaman, tidak dikirim ke institusi mana pun, dan hilang setelah halaman dimuat ulang. Unduhan ringkasan hanya dibuat di perangkat pengguna. Tidak ada akun, pelacak analitik, atau penyimpanan data pribadi dalam proyek ini.

Font lokal didistribusikan bersama lisensi SIL Open Font License. Keterangan hak penggunaan tiap foto tetap mengikuti metadata sumbernya.
