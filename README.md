# FitPlanner - Personal Gym Planner

FitPlanner adalah aplikasi web berbasis React untuk membantu pengguna menyusun rutinitas gym, mempelajari gerakan, membuat jadwal latihan, dan mencatat perkembangan kebugaran. Rekomendasi awal menggunakan data profil, hasil BMI dewasa, tingkat pengalaman, serta frekuensi latihan yang dipilih pengguna.

> FitPlanner adalah proyek praktikum dan alat pencatatan kebugaran sederhana. Rencana yang ditampilkan merupakan titik awal, bukan diagnosis medis atau pengganti arahan pelatih.

## Fitur

- **Onboarding profil:** nama, usia, gender, berat badan, tinggi badan, tingkat pengalaman, dan frekuensi gym.
- **Kalkulator BMI:** menghitung BMI dari berat dan tinggi. Untuk usia di bawah 20 tahun, aplikasi tidak memberi label kategori BMI dewasa.
- **Rekomendasi latihan:** menyesuaikan fokus dan dosis latihan awal berdasarkan BMI, pengalaman, serta frekuensi yang dipilih.
- **Exercise Library:** 13 gerakan yang dapat dicari dan difilter, lengkap dengan petunjuk serta tautan video demonstrasi.
- **Workout Plan:** membuat, mengubah, mencari, dan menghapus program; pengguna dapat memilih gerakan yang masuk ke program.
- **Jadwal latihan:** menambahkan jadwal, mengubahnya, menghapusnya, dan menandai sesi selesai.
- **Riwayat latihan:** menampilkan sesi yang telah ditandai selesai.
- **Progress Tracking:** mencatat berat badan dan menampilkan grafik dari catatan yang benar-benar dimasukkan.
- **Target kebugaran:** mengatur target frekuensi mingguan dan target berat badan opsional.
- **Profil:** memperbarui informasi yang digunakan untuk personalisasi.
- **Mentor:** satu mentor per gender untuk level Pemula dan Menengah, dengan pesan berdasarkan riwayat latihan dan check-in mingguan.
- **Template logo dan foto mentor:** lihat bagian di bawah.

## Teknologi

- React 18 dan Vite
- JavaScript (JSX)
- React Router DOM
- React Hooks dan Context API
- Props dan PropTypes
- Lucide React
- CSS responsif
- `localStorage` untuk penyimpanan di browser

## Menjalankan proyek

Pastikan Node.js dan npm sudah terpasang. Buka terminal pada folder yang berisi `package.json`, lalu jalankan:

```bash
npm install
npm run dev
```

Buka URL lokal yang ditampilkan Vite, biasanya `http://localhost:5173/`.

Untuk membuat build produksi dan melihat hasilnya:

```bash
npm run build
npm run preview
```

## Alur penggunaan

1. Isi profil dasar.
2. Masukkan tinggi dan berat badan untuk menghitung BMI.
3. Pilih tingkat pengalaman serta jumlah hari gym per minggu.
4. Tinjau fokus latihan dan rencana mingguan awal.
5. Buka Exercise Library untuk mencari gerakan, membaca petunjuk, dan melihat video demonstrasi.
6. Buat Workout Plan dengan memilih gerakan yang ingin digunakan.
7. Jadwalkan program latihan.
8. Tandai sesi yang selesai agar masuk ke Workout History.
9. Catat pengukuran berat badan secara berkala untuk melihat grafik Progress.

## Catatan personalisasi dan BMI

- Gender disimpan sebagai bagian dari profil, tetapi tidak digunakan sebagai aturan tunggal untuk menetapkan beban, set, atau repetisi. Penyesuaian lebih mengutamakan pengalaman, frekuensi latihan, jenis gerakan, dan kemampuan pengguna.
- Kategori BMI dewasa hanya digunakan untuk pengguna berusia 20 tahun ke atas. Untuk usia 2–19 tahun, penilaian membutuhkan persentil BMI berdasarkan usia dan gender. Aplikasi tetap menampilkan nilai BMI tanpa memberi label kategori dewasa.
- BMI adalah alat skrining, bukan diagnosis dan bukan ukuran langsung komposisi tubuh.
- Dosis pada kartu latihan adalah panduan awal. Pilih beban yang masih dapat dikontrol, sisakan waktu pemulihan, dan minta bantuan instruktur untuk mempelajari teknik baru.

## Penyimpanan data

Data profil, program, jadwal, riwayat, target, dan pengukuran disimpan di `localStorage` pada browser yang digunakan. Data tidak tersinkronisasi antarperangkat karena proyek ini belum memakai backend atau database online.

Untuk mengulang onboarding dari awal, buka Developer Tools di browser, pilih **Application → Local Storage → alamat localhost**, lalu hapus key `fitplanner-data-v1`. Tindakan ini menghapus data aplikasi yang tersimpan pada browser tersebut.

Jika browser menolak akses penyimpanan, aplikasi menampilkan pemberitahuan dan perubahan mungkin tidak bertahan setelah halaman ditutup.

## Memasang logo dan foto mentor

1. Logo: simpan sebagai `public/brand/logo.png` (panduan di `public/brand/BACA-INI.txt`). Nama file diatur di `src/config/brand.js`.
2. Foto mentor: simpan empat file di `public/mentors/`: `pemula-pria.jpg`, `pemula-wanita.jpg`, `menengah-pria.jpg`, `menengah-wanita.jpg`.
3. Nama mentor: isi field `name` di `src/data/mentors.js`. Kata-kata mentor ada di file yang sama.
4. Selama file belum ada, aplikasi menampilkan placeholder yang jelas, bukan gambar palsu.

## Font dan favicon

- Heading menggunakan **Bebas** dan teks antarmuka menggunakan **Roboto**.
- File `.ttf` tidak disertakan dalam paket. Ikuti `FONT-INSTALLATION.md`, lalu letakkan file font di `public/fonts/`.
- Tanpa file font tersebut, aplikasi menggunakan font fallback dan tetap dapat dibuka.
- Favicon khusus milik pemilik proyek perlu diletakkan di `public/` dan direferensikan dari `index.html`. Pastikan nama file pada HTML sama persis dengan nama file gambar.

## Struktur folder

```text
fitplanner/
├── public/
│   └── fonts/
├── src/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── layouts/
│   ├── pages/
│   ├── utils/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── FONT-INSTALLATION.md
├── DESIGN.md
├── index.html
├── package.json
└── vite.config.js
```

## Jika halaman tidak tampil

1. Pastikan terminal masih menjalankan `npm run dev` dan tidak menampilkan error.
2. Periksa alamat localhost yang benar-benar dicetak Vite.
3. Lakukan hard refresh dengan `Ctrl + Shift + R`.
4. Jika halaman masih putih, buka Developer Tools (`F12`) → **Console** dan periksa pesan merah pertama.
5. Jika masalah mengarah ke data lokal yang rusak, hapus key `fitplanner-data-v1` melalui Application → Local Storage. Ini akan mereset profil dan data latihan lokal.

## Developer

**Yohanes Tambunan**  
Program Studi S1 Teknik Informatika  
Universitas Riau  

Proyek praktikum pengembangan web menggunakan React.

---

**FITPLANNER - Bangun rutinitas, catat progres, dan berlatih dengan terarah.**
