# Product Requirements Document (PRD)
## LearnPath AI — Personalized Learning Roadmap Generator untuk Pemula Programming

**Versi:** 1.0
**Tanggal:** 31 Juli 2026
**Status:** Draft untuk Kompetisi (Deadline: ~20 hari)

---

## 1. Latar Belakang & Masalah

Pemula yang ingin belajar programming secara otodidak sering menghadapi masalah **"paradox of choice"**:
- Terlalu banyak sumber belajar (YouTube, artikel, kursus) tanpa tahu urutan yang tepat.
- Tidak tahu skill apa yang relevan dengan goals mereka (misal: "jadi web developer" vs "jadi data analyst").
- Tidak ada struktur harian yang jelas, sehingga mudah kehilangan motivasi/konsistensi.
- Banyak platform belajar menyediakan *materi* (kursus berbayar), tapi sedikit yang fokus menyediakan **arah/roadmap** yang dipersonalisasi dan gratis/terjangkau.

**LearnPath AI** memposisikan diri sebagai *"perantara pintar"* antara user dan lautan konten belajar yang sudah ada di internet — bukan pembuat konten, melainkan **kurator & perencana** yang dipersonalisasi menggunakan AI.

---

## 2. Tujuan Produk (Goals)

1. Membantu pemula mendapatkan **roadmap belajar programming yang personal** berdasarkan goals, waktu, dan skill awal mereka.
2. Mengubah roadmap besar menjadi **to-do list harian yang actionable**, sehingga user tidak overwhelmed.
3. Memberikan rekomendasi sumber belajar (video, artikel) yang **relevan dan terkini**, bukan static database.
4. Menyediakan UI/UX yang sederhana, ramah pemula, dan mendorong konsistensi belajar.

### Non-Goals (Di luar cakupan MVP)
- Tidak membuat/menghosting materi belajar sendiri (kursus video, artikel, dsb).
- Tidak menyediakan sistem sertifikasi resmi.
- Tidak ada fitur pembayaran/monetisasi di tahap MVP.

---

## 3. Target Pengguna

| Persona | Deskripsi |
|---|---|
| **Pemula Total** | Belum pernah coding sama sekali, bingung mulai dari mana. |
| **Self-taught yang Stuck** | Sudah belajar sedikit-sedikit tapi tidak terstruktur, sering "tutorial hopping". |
| **Career Switcher** | Ingin pindah karier ke tech, butuh target waktu jelas (misal: 30/60/90 hari). |

---

## 4. User Flow (Alur Utama)

```
[Landing Page]
      ↓
[Register / Login]
      ↓
[Dashboard Kosong] → CTA besar "Mulai Sekarang"
      ↓                         ↓
[Skip] ----------------→ [Form Preferensi]
                          - Goals (mis: "Web Developer", "Data Analyst")
                          - Target waktu (7 / 30 / 60 / 90 hari, custom)
                          - Skill saat ini (checklist / free text)
                          - (opsional) Waktu belajar per hari (jam)
                                ↓
                    [AI Generate Roadmap] (loading state)
                                ↓
                    [Halaman Roadmap] (milestone/topik besar per minggu)
                                ↓
                    [AI Generate Daily To-Do List] (N hari sesuai target)
                                ↓
                    [Dashboard Utama]
                    - Progress bar keseluruhan
                    - To-do hari ini (checklist)
                    - Link referensi belajar (YouTube/artikel) per task
                    - Streak counter
```

**Catatan penting:** Jika user skip preferensi saat register, dashboard tetap menampilkan CTA "Mulai Sekarang" yang mengarah ke form yang sama. Tidak ada jalur berbeda — cukup satu entry point untuk generate roadmap.

---

## 5. Core Features (MVP — Wajib Ada)

### 5.1 Autentikasi
- Register/Login (email + password, atau OAuth Google untuk mempercepat dev).
- Session management sederhana.

### 5.2 Form Preferensi Onboarding
- Goals (dropdown/select + free text opsional agar fleksibel: "Web Dev", "Mobile Dev", "Data Science", "Lainnya").
- Target waktu belajar (preset: 7/30/60/90 hari + custom input).
- Skill saat ini (multi-select: "Belum tahu apa-apa", "HTML/CSS", "Basic logic", dst).
- Estimasi jam belajar per hari (opsional, untuk kalibrasi beban to-do harian).

### 5.3 AI Roadmap Generator
- Input: data preferensi user.
- Output: roadmap terstruktur per fase/minggu (mis: Minggu 1: Fundamental, Minggu 2: Bahasa Pemrograman, dst) dalam format terstruktur (JSON) agar mudah dirender di UI.
- Roadmap disimpan di database, terkait dengan user_id.

### 5.4 AI Daily To-Do List Generator
- Berdasarkan roadmap + target hari, generate breakdown harian (misal 30 hari → 30 entri).
- Setiap hari berisi 2-4 task singkat + estimasi durasi.
- Setiap task idealnya menyertakan **rekomendasi sumber belajar** (lihat 5.5).

### 5.5 Fetching Referensi Belajar dari Internet
- Untuk setiap topik/task, sistem mencari referensi (video YouTube / artikel) yang relevan.
- Bisa menggunakan API pencarian (YouTube Data API untuk video, atau web search API untuk artikel).
- Tampilkan sebagai card kecil (thumbnail, judul, sumber) di bawah task terkait.

### 5.6 Dashboard & Progress Tracking
- Checklist harian (centang task selesai).
- Progress bar keseluruhan (%) berdasarkan task selesai / total task.
- Tampilan roadmap (read-only) yang bisa dilihat kapan saja.

---

## 6. Saran Fitur Inovatif Tapi Ringan (Diferensiator untuk Lomba)

Karena waktu terbatas (20 hari), saya sarankan pilih **2-3 saja** dari daftar ini yang paling mudah dan paling "wow" untuk demo:

| Fitur | Kenapa Menarik | Estimasi Kompleksitas |
|---|---|---|
| **Streak & Motivational Nudge** | Gamifikasi ringan (streak counter, badge kecil "3 hari beruntun!") — meningkatkan retensi, mudah diimplementasi hanya dengan logic tanggal. | Rendah |
| **Adaptive Re-plan** | Jika user skip beberapa hari atau tandai task "terlalu sulit", AI menawarkan untuk regenerate sisa roadmap. Menunjukkan AI "hidup", bukan statis. | Sedang |
| **Chat Mentor Mini** | Chat box kecil di dashboard: user bisa tanya "Kenapa hari ini belajar closure?" dan AI jelaskan alasan urutan roadmap. Menambah kesan personal. | Sedang |
| **Weekly Reflection Prompt** | Setiap akhir minggu, muncul 1 pertanyaan refleksi singkat ("Topik apa yang paling sulit minggu ini?") yang dipakai untuk kalibrasi roadmap. | Rendah |
| **Public Roadmap Share Card** | User bisa generate gambar/kartu ringkasan roadmap untuk dishare ke medsos (growth hack + demo visual yang bagus untuk juri). | Sedang |
| **Skill Confidence Check-in** | Sebelum mulai, quick 3-5 pertanyaan kuis singkat (bukan tes formal) untuk memvalidasi level skill self-report user, supaya roadmap lebih akurat. | Rendah |

**Rekomendasi saya untuk demo lomba:** Streak & Motivational Nudge + Weekly Reflection Prompt + Public Roadmap Share Card. Ketiganya murah secara implementasi tapi sangat efektif untuk "cerita produk" saat presentasi (menunjukkan aspek retensi, personalisasi berkelanjutan, dan growth/virality).

---

## 7. Kebutuhan Non-Fungsional

- **Usability:** Onboarding harus terasa cepat (< 2 menit untuk isi preferensi).
- **Performance:** Generate roadmap idealnya < 15 detik (tampilkan loading state dengan progress/skeleton agar tidak terasa lama).
- **Reliability:** Jika API AI/pencarian gagal, sediakan fallback (retry button / pesan error yang ramah).
- **Scalability:** Tidak jadi prioritas untuk MVP lomba, cukup handle beberapa ratus user.

---

## 8. Saran Tech Stack (Ringan & Cepat Dibangun)

| Layer | Rekomendasi |
|---|---|
| Frontend | Next.js / React + Tailwind CSS (cepat untuk UI rapi) |
| Backend | Next.js API Routes atau Node.js + Express (satu repo, lebih cepat untuk 20 hari) |
| Database | Supabase / PostgreSQL (sudah termasuk auth, mempercepat development) atau Firebase |
| AI Generation | Claude API / OpenAI API untuk generate roadmap & to-do list (output di-*prompt* agar berbentuk JSON terstruktur) |
| Referensi Konten | YouTube Data API (video) + web search API (artikel) |
| Hosting | Vercel (frontend+API) — gratis dan cepat deploy |

---

## 9. Metrik Keberhasilan (untuk Demo/Lomba)

- Waktu onboarding rata-rata (< 2 menit).
- % user yang menyelesaikan minimal 1 task setelah roadmap dibuat.
- Kualitas relevansi roadmap (dinilai kualitatif saat demo/juri mencoba).
- Retensi streak (jika sempat diuji dengan beberapa user nyata sebelum submit).

---

## 10. Estimasi Timeline 20 Hari

| Hari | Fokus |
|---|---|
| 1-2 | Finalisasi PRD, wireframe UI/UX, setup repo & tech stack |
| 3-5 | Autentikasi + struktur database + form preferensi |
| 6-9 | Integrasi AI roadmap generator + daily to-do generator (prompt engineering) |
| 10-12 | Integrasi fetching referensi belajar (YouTube/artikel) |
| 13-15 | Dashboard, progress tracking, checklist harian |
| 16-17 | Implementasi 2-3 fitur diferensiator (streak, reflection, share card) |
| 18-19 | Polish UI/UX, testing, perbaikan bug |
| 20 | Buffer, persiapan demo & submission |

---

## 11. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| AI generate roadmap tidak konsisten formatnya | Gunakan structured output/JSON schema yang ketat di prompt, validasi response sebelum simpan ke DB |
| API pencarian video/artikel kena rate limit | Cache hasil pencarian per topik agar tidak fetch berulang untuk topik yang sama |
| Waktu 20 hari mepet untuk semua fitur | Prioritaskan MVP inti (section 5) dulu, fitur diferensiator (section 6) hanya jika waktu tersisa |

---

## 12. Lampiran: Struktur Data Sederhana (Contoh)

```json
// User Preference
{
  "user_id": "uuid",
  "goal": "Web Developer",
  "target_days": 30,
  "current_skills": ["basic logic"],
  "hours_per_day": 1.5
}

// Roadmap
{
  "roadmap_id": "uuid",
  "user_id": "uuid",
  "phases": [
    {
      "title": "Minggu 1: Fundamental Web",
      "topics": ["HTML dasar", "CSS dasar", "Struktur halaman"]
  ]
}

// Daily Task
{
  "day": 1,
  "tasks": [
    {
      "title": "Belajar struktur HTML",
      "duration_minutes": 45,
      "resources": [
        { "type": "video", "title": "...", "url": "..." },
        { "type": "article", "title": "...", "url": "..." }
      ],
      "completed": false
    }
  ]
}
```