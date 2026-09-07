# 🎯 RASTA Petanque (Rasyo Technology Analysis Petanque)

[![Live App](https://img.shields.io/badge/Live_Demo-rasta--petanque.vercel.app-002395?style=for-the-badge&logo=vercel)](https://rasta-petanque.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-mrbrightsides%2Frasta-181717?style=for-the-badge&logo=github)](https://github.com/mrbrightsides/rasta.git)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Storage](https://img.shields.io/badge/Storage-100%25_LocalStorage_Offline-10B981?style=for-the-badge&logo=databricks)](https://github.com/mrbrightsides/rasta.git)

> **RASTA Petanque (Rasyo Technology Analysis Petanque)** adalah platform analisis performa olahraga petanque berbasis web dan mobile yang dirancang untuk pelatih, atlet, wasit turnamen, pengurus cabang (FOPI), dan peneliti olahraga.
> 
> Dikembangkan atas dasar kerangka ilmiah dan riset disertasi Doktoral **Rasyono, S.Pd., M.Pd.** (NIM. 25344021) pada Program Pascasarjana Doktor Ilmu Keolahragaan, **Universitas Negeri Padang (UNP)**.

---

## 🌐 Tautan Cepat / Quick Links

- **Repository GitHub**: [https://github.com/mrbrightsides/rasta.git](https://github.com/mrbrightsides/rasta.git)
- **Live Demo Aplikasi**: [https://rasta-petanque.vercel.app](https://rasta-petanque.vercel.app)

---

## 📖 Latar Belakang Ilmiah & Motivasi Riset (Disertasi UNP)

Evaluasi tradisional dalam olahraga petanque sering kali bergantung pada catatan manual berbasis kertas (*pen-and-paper*), ingatan pelatih pasca-tanding, atau sekadar skor akhir tanpa membedah detail teknis setiap lemparan. Melalui riset disertasi **Rasyono** di Universitas Negeri Padang dengan judul:
> *“Analisis Performa Atlet Berbasis Aplikasi Dalam Permainan Olahraga Petanque”*

Sistem RASTA mengonversi seluruh data observasi fisik (*Score Sheet*) menjadi sistem telemetri digital real-time dengan parameter:

1. **Micro-Scoring Biner & Terdistribusi**: Menilai keberhasilan ($1$ sukses, $0$ gagal) berdasarkan situasi lemparan (*Pointing* vs *Shooting*).
2. **Diferensiasi Sub-Teknik Lemparan** (*Kajian Teori Bab II Hal 17–21*):
   - **Pointing**: *Rolling* (gesur / menyusur tanah), *Soft-Lob / Half-Lob* (parabola sedang), dan *High-Lob* (parabola tinggi).
   - **Shooting**: *Au Fer* (langsung tepat mengenai bola sasaran), *Short Shot* (jatuh 20–30 cm di depan sasaran), dan *Ground Shot* (rasant / menyusur tanah).
3. **Analisis Berdasarkan Jarak Resmi FIPJP/FOPI**: Jarak target terstandar dari **6m, 7m, 8m, 9m, hingga 10m**.
4. **Metrik Proksimitas Jack (Dispersi Jarak)**: Pencatatan deviasi jarak bola ke jack (*boka*) dalam centimeter (cm) untuk analisis akurasi pointing tingkat lanjut.
5. **Konversi Carreau**: Deteksi khusus lemparan *carreau* (bola tembakan menggantikan posisi bola sasaran secara sempurna).
6. **Modul Resmi Precision Shooting (Tembakan Presisi 60 Poin)**: Replika lembar skor resmi FOPI / FIPJP dengan evaluasi benchmark medali SEA Games & World Games.

---

## ✨ Modul Utama Platform

### 1. 🎯 Precision Shooting (Score Sheet FOPI & Disertasi UNP)
- **Replika Autentik Format Excel**: Mengacu langsung pada berkas *Score Sheet Precision Shooting.xlsx*.
- **5 Figure / Station & 4 Jarak Lemparan**:
  - Figure 1: *Boule Alone* (Bola Sasaran Tunggal)
  - Figure 2: *Boule Behind Jack* (Bola Sasaran Dibelakang Jack)
  - Figure 3: *Between Two Boules* (Bola Sasaran Diantara Dua Bola Penghalang)
  - Figure 4: *Jump Over Boule* (Bola Sasaran Dibelakang Bola Penghalang)
  - Figure 5: *Jack / Boka* (Sasaran Jack)
  - Jarak FIPJP: **6.5m, 7.5m, 8.5m, dan 9.5m** (Total 20 lemparan).
- **Skor FOPI Cepat**: Tombol skor 5P (*Carreau*), 3P (*Frappe/Kena*), 1P (*Senggol/Touched*), dan 0P (*Gagal/Missed*).
- **Standar Evaluasi Medali SEA Games (Slide Disertasi)**:
  - 🥇 **$\ge 90\%$ (Skor $\ge 54$ Poin)**: **Medali Emas** — Kategori *Sangat Baik* (*"Emas berani kita targetkan"*).
  - 🥈 **$80\% - 89\%$ (Skor $48 - 53$ Poin)**: **Medali Perak** — Kategori *Baik* (*"Dipastikan medali perak"*).
  - 🥉 **$70\% - 79\%$ (Skor $42 - 47$ Poin)**: **Medali Perunggu** — Kategori *Cukup Baik* (*"Bisa bicara medali perunggu"*).
  - ⚠️ **$< 70\%$ (Skor $< 42$ Poin)**: **Kategori Evaluasi** (di bawah rata-rata podium SEA Games).
- **Multi-Sheet Management**: Buat lembar baru, duplikat lembar, ganti antar babak (*Qualification, 2nd Chance, Quarter Final, Semi Final, Final*), serta tanda tangan wasit & atlet.

### 2. 📱 Sideline Mobile Scorer (Konsol Lapangan)
- **Alur Cepat 5-Tap**: Tim $\rightarrow$ Atlet $\rightarrow$ Aksi & Sub-Teknik $\rightarrow$ Jarak Target $\rightarrow$ Hasil Lemparan.
- **Validasi Kuota Bola**: Penghitung otomatis sisa bola per babak (misal 6 bola per tim pada Triple) dan pembatasan ketat maksimal 2 bola per atlet per end.
- **Preset Proksimitas Centimeter**: Pilihan cepat (5cm, 10cm, 20cm, 30cm, 50cm, >1m) atau input kustom jarak ke jack.
- **Undo 1-Sentuhan & Finalisasi Babak**: Koreksi instan jika salah input dan dialog skor resmi akhir end.

### 3. 📑 Excel Performance Sheet (Replika Digital Tabel 1.1)
- Representasi digital tabel observasi lapangan Tabel 1.1 dari riset Disertasi.
- Visual kode warna: Biru untuk Pointing, Merah Muda untuk Shooting, Hijau untuk Ringkasan Tim.
- Penanganan nol matematis akurat (`#DIV/0!` untuk kategori tanpa percobaan, menghindari pembiasan nilai 0%).
- Fitur ekspor berkas CSV instan yang kompatibel dengan Microsoft Excel, SPSS, dan R Studio.

### 4. 📊 Live Dashboard & Telemetri
- Papan skor real-time dengan perbedaan skor dinamis dan indikator end aktif.
- Gauge efisiensi pointing dan akurasi shooting tim.
- Log berurutan setiap bola yang dilempar secara kronologis.

### 5. 👥 Head-to-Head & Team Full-Time Analysis
- Perbandingan komparatif Tim A vs Tim B di seluruh indikator utama.
- Kurva momentum perolehan poin per-babak (*end-by-end*).
- Distribusi tingkat keberhasilan berdasarkan jarak target lemparan.

### 6. 📈 Radar Profiling & Analitik Atlet
- Grafik Radar Multi-Sumbu (Recharts) mengevaluasi:
  - Akurasi Pointing
  - Akurasi Shooting
  - Rasio Carreau
  - Kontrol Jarak (Distance Control)
  - Efektivitas Keseluruhan (Overall Match Effectiveness)
- Matriks sub-teknik (*Rolling vs Half-Lob vs High-Lob*, *Au Fer vs Short Shot vs Ground Shot*).

### 7. 💾 Sistem Penyimpanan LocalStorage (100% Offline-First)
- **Penyimpanan Lokal Otomatis**: Seluruh data pertandingan, atlet, dan lembar skor Precision Shooting otomatis tersimpan di `localStorage` browser tanpa ketergantungan koneksi server.
- **Cadangan & Pemulihan (Backup & Restore JSON)**: Unduh seluruh basis data lokal ke berkas `.json` dan pulihkan kembali kapan saja di perangkat mana pun.
- **Modal Metrik LocalStorage**: Menampilkan jumlah pertandingan, jumlah lembar presisi, dan estimasi penggunaan memori browser.

---

## 🧮 Rumus & Formulasi Perhitungan (Game Match)

### 1. Efisiensi Pointing (Pointing Efficiency)
$$\text{Eff}_{\text{point}} = \begin{cases} \left( \frac{\sum P_{\text{success}}}{\sum P_{\text{total}}} \right) \times 100\%, & \text{jika } \sum P_{\text{total}} > 0 \\ \text{N/A} \ (\#\text{DIV/0!}), & \text{jika } \sum P_{\text{total}} = 0 \end{cases}$$

### 2. Akurasi Shooting (Shooting Accuracy)
$$\text{Acc}_{\text{shoot}} = \begin{cases} \left( \frac{\sum S_{\text{success}}}{\sum S_{\text{total}}} \right) \times 100\%, & \text{jika } \sum S_{\text{total}} > 0 \\ \text{N/A} \ (\#\text{DIV/0!}), & \text{jika } \sum S_{\text{total}} = 0 \end{cases}$$

### 3. Rasio Konversi Carreau (Carreau Rate)
$$\text{Rate}_{\text{carreau}} = \begin{cases} \left( \frac{\sum S_{\text{carreau}}}{\sum S_{\text{total}}} \right) \times 100\%, & \text{jika } \sum S_{\text{total}} > 0 \\ \text{N/A} \ (\#\text{DIV/0!}), & \text{jika } \sum S_{\text{total}} = 0 \end{cases}$$

### 4. Rata-rata Jarak ke Jack (Distance Control)
$$\bar{D}_{\text{jack}} = \frac{1}{N} \sum_{i=1}^{N} d_i \quad (\text{satuan centimeter})$$

### 5. Efektivitas Keseluruhan Pertandingan (Overall Match Effectiveness)
$$\text{Eff}_{\text{overall}} = \left( \frac{\sum P_{\text{success}} + \sum S_{\text{success}}}{\sum P_{\text{total}} + \sum S_{\text{total}}} \right) \times 100\%$$

---

## 🎯 Standar Evaluasi & Benchmark Prestasi

### Standar Game Match (Pointing & Shooting)
| Kategori Medali | Efektivitas Keseluruhan | Target Pointing | Target Shooting | Keterangan |
|:---|:---:|:---:|:---:|:---|
| 🥇 **Emas / Juara Dunia** | $\ge 90.0\%$ | $\ge 90.0\%$ | $\ge 85.0\%$ | Sangat Baik / Standar Juara Dunia |
| 🥈 **Perak / Finalis** | $80.0\% - 89.9\%$ | $80.0\% - 89.9\%$ | $75.0\% - 84.9\%$ | Baik / Standar Finalis Turnamen |
| 🥉 **Perunggu / Semifinalis** | $70.0\% - 79.9\%$ | $70.0\% - 79.9\%$ | $65.0\% - 74.9\%$ | Cukup / Standar Semifinal |
| ⚠️ **Evaluasi Teknis** | $< 70.0\%$ | $< 70.0\%$ | $< 65.0\%$ | Perlu Penajaman Drill Fisik & Teknik |

### Standar Precision Shooting (FOPI & Riset Disertasi UNP)
- **Skor Maksimal Teoretis**: 100 Poin (5 poin × 20 lemparan)
- **Skor Realistis Maksimal**: 60 Poin (3 poin × 20 lemparan di World Games = 100% kapasitas atlet)
- **Rentang Peraih Medali SEA Games**: 42 s.d 54 Poin

| Capaian Skor | Persentase | Prediksi Medali | Kategori Disertasi | Status Analisis |
|:---|:---:|:---:|:---:|:---|
| **$\ge 54$ Poin** | **$\ge 90\%$** | 🥇 **Medali Emas** | **Sangat Baik** | *"Emas berani kita targetkan"* |
| **$48 - 53$ Poin** | **$80\% - 89\%$** | 🥈 **Medali Perak** | **Baik** | *"Dipastikan medali perak"* |
| **$42 - 47$ Poin** | **$70\% - 79\%$** | 🥉 **Medali Perunggu** | **Cukup Baik** | *"Bisa bicara medali perunggu"* |
| **$< 42$ Poin** | **$< 70\%$** | ⚠️ Evaluasi | Kurang | Di bawah rata-rata podium SEA Games |

---

## 💻 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Visualisasi Data**: [Recharts](https://recharts.org/), [Lucide React](https://lucide.dev/)
- **Animasi & Transisi**: [Motion](https://motion.dev/)
- **Penyimpanan**: 100% Client-Side LocalStorage dengan opsi ekspor/impor JSON
- **Backend / Dev Server**: [Express](https://expressjs.com/) dengan Vite middleware
- **Deployment**: [Vercel](https://vercel.com/) / Cloud Run Container

---

## 🚀 Panduan Memulai (Getting Started)

### Kebutuhan Sistem
- Node.js (versi 18.x atau lebih baru)
- npm atau yarn

### Instalasi & Menjalankan

1. **Clone repository**:
   ```bash
   git clone https://github.com/mrbrightsides/rasta.git
   cd rasta
   ```

2. **Instal dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan development server**:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

4. **Kompilasi produksi (Build)**:
   ```bash
   npm run build
   ```

5. **Linting & Type Check**:
   ```bash
   npm run lint
   ```

---

## 📂 Struktur Proyek

```
rasta/
├── public/
│   ├── favicon.svg                # Favicon aplikasi RASTA Petanque
│   └── petanque-logo.png          # Logo resmi UNP & RASTA Petanque
├── src/
│   ├── components/
│   │   ├── Header.tsx                 # Navigasi utama, status live, & modal trigger
│   │   ├── PrecisionShooting.tsx      # Lembar skor resmi Precision Shooting (FOPI 60P)
│   │   ├── ExcelPerformanceSheet.tsx  # Replika digital Tabel 1.1 dengan ekspor CSV
│   │   ├── MobileScorer.tsx           # Konsol pencatat lemparan cepat di tepi lapangan
│   │   ├── LiveDashboard.tsx          # Telemetri pertandingan live & log kronologis
│   │   ├── TeamFullTime.tsx           # Analisis tim komprehensif & statistik FIPJP
│   │   ├── HeadToHead.tsx             # Matriks perbandingan H2H & kurva momentum
│   │   ├── AthleteAnalytics.tsx       # Profil individu & radar chart Recharts
│   │   ├── PostMatchReport.tsx        # Laporan komprehensif pasca pertandingan
│   │   ├── MatchManager.tsx           # Manajemen pertandingan & data riset resmi
│   │   ├── AcademicFrameworkModal.tsx # Kerangka ilmiah Disertasi S3 UNP (Rasyono)
│   │   └── LocalStorageModal.tsx      # Kontrol LocalStorage & backup/restore JSON
│   ├── lib/
│   │   ├── api.ts                     # Engine penyimpanan LocalStorage & API bridge
│   │   ├── calculations.ts            # Rumus matematika performa petanque
│   │   ├── rasyonoStandards.ts        # Ambang batas prestasi & benchmark SEA Games
│   │   └── mockData.ts                # Data kanonikal resmi disertasi (Tabel 1.1)
│   ├── types.ts                       # Definisi antarmuka TypeScript domain petanque
│   ├── App.tsx                        # Master layout, state management, & routing
│   ├── main.tsx                       # Entry point aplikasi React
│   └── index.css                      # Konfigurasi Tailwind CSS v4
├── index.html                         # Entry HTML dengan metadata RASTA
├── metadata.json                      # Konfigurasi metadata aplikasi
├── package.json                       # Dependensi dan script build
├── server.ts                          # Express server dengan Vite middleware
└── README.md                          # Dokumentasi lengkap sistem RASTA
```

---

## 📜 Sitasi & Referensi Akademik

Jika Anda menggunakan RASTA Petanque dalam penelitian, skripsi, tesis, disertasi, atau program pelatihan petanque, silakan sitasi:

```bibtex
@phdthesis{rasyono2026rasta,
  title={Analisis Performa Atlet Berbasis Aplikasi Dalam Permainan Olahraga Petanque (Rasyo Technology Analysis Petanque)},
  author={Rasyono},
  year={2026},
  school={Program Pascasarjana Doktor Ilmu Keolahragaan, Universitas Negeri Padang (UNP)},
  type={Doctoral Dissertation},
  address={Padang, Indonesia}
}
```

---

## 📄 Hak Cipta & Lisensi

Dikembangkan untuk kemajuan akademik, pembinaan prestasi atlet nasional, dan olahraga petanque Indonesia di bawah arahan **Rasyono, S.Pd., M.Pd.** (NIM. 25344021) — Universitas Negeri Padang (UNP).  
© 2026 RASTA Petanque (Rasyo Technology Analysis Petanque). All rights reserved.
