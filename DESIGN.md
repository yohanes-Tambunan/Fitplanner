# Design Notes

Dokumen ini mencatat keputusan desain dan standar implementasi FitPlanner agar perubahan berikutnya tetap konsisten.

## Arah visual

- **Nuansa:** ruang latihan yang tenang, tegas, dan fokus; bukan dashboard korporat generik.
- **Warna utama:** charcoal/forest gelap sebagai latar, hijau lime sebagai aksen interaksi dan penanda fokus.
- **Tipografi:** Bebas untuk judul display; Roboto untuk teks antarmuka dan isi.
- **Komposisi:** informasi mengikuti konteks halaman. Dashboard menampilkan ringkasan, Exercise Library memprioritaskan pencarian dan detail gerakan, sedangkan Progress memprioritaskan catatan dan grafik.
- **Dekorasi:** ornamen digunakan seperlunya. Informasi latihan tetap menjadi fokus utama.

## Aturan konten

- Angka statistik berasal dari data aplikasi, bukan klaim contoh yang disamarkan sebagai hasil pengguna.
- Program bawaan diberi label **Contoh Program**. Program baru diberi label **Program Pribadi**.
- Keadaan kosong menjelaskan langkah selanjutnya, bukan mengisi halaman dengan data palsu.
- Video adalah konten pihak ketiga. Pengguna mendapat opsi membuka video langsung di YouTube jika pemutar embed tidak tersedia.
- Profil onboarding bukan sistem autentikasi. Jangan menyebutnya sebagai login akun dengan password.
- Gender disimpan pada profil, tetapi dosis latihan tidak ditetapkan hanya dari gender.

## Interaksi dan aksesibilitas

- Tombol navigasi menuju halaman atau tindakan yang benar.
- Dialog mendukung Escape, pengelolaan fokus, dan pengembalian fokus ke elemen sebelumnya.
- Grup pilihan onboarding menggunakan `fieldset`/`legend` dan menyatakan pilihan aktif dengan `aria-pressed`.
- Tersedia tautan lewati navigasi, penanda fokus keyboard, dan pemberitahuan penyimpanan.
- Kontrol penting memiliki area sentuh minimal sekitar 44 piksel.
- Layout mengecil pada layar ponsel tanpa memaksa pengguna menggulir horizontal.
- Animasi menghormati preferensi `prefers-reduced-motion`.

## Data dan keamanan klaim

- Data disimpan pada `localStorage` browser, bukan server.
- BMI diperlakukan sebagai alat skrining. Kategori BMI dewasa tidak diterapkan pada pengguna di bawah 20 tahun.
- Rekomendasi latihan adalah titik awal dan perlu disesuaikan dengan kemampuan serta kondisi pengguna.
- Jangan menambahkan testimoni, jumlah pengguna, kalori terbakar, atau pencapaian yang tidak berasal dari data nyata.

## Pemeriksaan sebelum rilis

- Jalankan `npm install` dan `npm run build`.
- Jalankan aplikasi dan periksa seluruh rute.
- Uji tambah, edit, hapus, dan tandai selesai pada program/jadwal.
- Refresh browser untuk memastikan localStorage berjalan.
- Uji onboarding pada usia dewasa dan di bawah 20 tahun.
- Uji layout pada lebar desktop, tablet, dan ponsel.
- Cek keyboard, label input, fokus, empty state, dan Console browser.

## Logo dan mentor (ditambahkan dengan antislop mode DURING)

Design Read: aplikasi pencatat latihan untuk pengguna Pemula dan Menengah, bahasa visual forest gelap + lime yang sudah ada. Dial: ENERGY 2 / RHYTHM 2 / MOTION 1.

- **Logo:** `src/config/brand.js` menunjuk ke `public/brand/logo.png`. Alasan: logo harus milik pemilik, bukan buatan agen (R-23). Bila file belum ada, tampil nama produk sebagai teks.
- **Foto mentor:** empat file di `public/mentors/`. Alasan: foto orang tidak boleh dibuat atau diasumsikan (R-23, R-38). Bila belum ada, tampil kotak placeholder berlabel "Foto mentor belum dipasang".
- **Nama dan kata-kata mentor:** di `src/data/mentors.js`. Kalimatnya panduan tertulis, bukan klaim sertifikasi atau pengalaman seseorang (R-36). Isi `name` dengan nama asli sebelum rilis.
- **Satu mentor per gender di Pemula dan Menengah:** pilihan pemilik. Gender hanya memilih suara mentor, tidak mengubah dosis latihan. Isi panduan setiap level sama untuk kedua gender. Pengguna dapat mengganti mentor di halaman Mentor, termasuk yang memilih tidak menjawab gender atau level Berpengalaman.
- **Fungsi mentor:** pesan di Dashboard dan halaman Mentor dipilih dari data riwayat nyata (sesi minggu ini dibanding target). Check-in mingguan menyimpan rasa latihan (ringan, pas, berat) ke `localStorage`, lalu menampilkan balasan tertulis sesuai pilihan. Balasan bukan percakapan langsung dan diberi keterangan itu.
- **Mengapa mentor ada:** akuntabilitas dan check-in berkala menjaga pengguna tetap berlatih, orientasi dan rencana pendek mengurangi rasa canggung pemula di gym, dan catatan beban serta minggu ringan membantu level menengah keluar dari plateau. Sumbernya ACE Fitness, PureGym, ScienceAlert, Barbell Medicine, Breaking Muscle, HubFit, Trainwell, dan 1FIT.
- **Layout:** halaman Mentor memakai foto besar dan satu kolom pesan, lalu dua kolom tidak sama lebar (daftar fokus lebih lebar dari form). Dashboard memakai satu strip horizontal, bukan kartu tambahan yang sama dengan kartu lain.
- **Warna dan teks:** tidak ada warna baru. Lime hanya menandai pilihan aktif dan angka penting. Semua teks baru 13px ke atas, kontras terendah 7.79:1.

## Revisi tampilan (logo, foto, gerak)

Satu alasan untuk tiap keputusan besar:

- **Ukuran fluid:** `html { font-size: clamp(15px, 0.35vw + 11.5px, 22px) }` dan seluruh stylesheet memakai rem. Alasan: saat jendela diperbesar, logo dan seluruh antarmuka ikut membesar, tidak tertinggal kecil.
- **Logo menggantikan dumbbell hijau** di hero Dashboard. Logo (`public/brand/logo.png`, 1396x1040, transparan) punya varian `sidebar`, `hero`, `aside`, `compact` (`.brand-logo-*` di `src/styles/components.css`). Alasan: identitas merek menjadi satu-satunya ornamen utama.
- **Referensi Refero "Wise" (arah, bukan salinan):** latar hijau hutan gelap, satu aksen lime yang sama dengan warna logo (#d5d731), panel datar dengan garis tipis, tanpa gradien dan bayangan berat. Alasan: kontras tinggi dan tidak ramai.
- **Dial:** ENERGY 2, RHYTHM 2, MOTION 2.
- **Foto gerakan:** Wikimedia Commons (lisensi terbuka), dimuat langsung dari sumbernya dengan kredit dan tautan lisensi di detail gerakan (`src/data/exerciseMedia.js`). Alasan: kredit wajib, dan berkas tidak digandakan. Bila foto gagal dimuat, tampil kotak berlabel. Rowing berupa foto alat saja, triceps pushdown dan RDL berupa ilustrasi; semuanya diberi label jenisnya.
- **Gerak (R-19):** hover dan tekan pada tombol, gelombang dari titik sentuh, dialog masuk dan keluar 160 ms, notifikasi masuk dan keluar, perpindahan halaman, kartu program menyusut saat dihapus. Semua mati pada `prefers-reduced-motion`.
- **Dihapus:** strip info di bawah halaman, panah dekoratif, ikon kalender dan chip pengguna di topbar, ilustrasi dumbbell di kartu program, statistik ganda di grafik, varian warna oranye dan biru.
