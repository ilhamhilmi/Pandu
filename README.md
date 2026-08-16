# Pandu: Belajar Programming Lebih Terarah Dengan AI

Aplikasi web untuk membuat **roadmap belajar programming yang dipersonalisasi dengan AI**. Pengguna mengisi preferensi belajar, lalu AI akan menyusun rencana belajar harian yang terstruktur dan progresif.

## ❓ Apa itu Pandu?

Pandu membantu pemula yang ingin belajar programming secara otodidak agar tidak lagi bingung
*"harus mulai dari mana"*. Alur kerjanya sederhana:

1. Pengguna **mengisi preferensi** belajar (goal, target waktu, skill saat ini, jam belajar/hari).
2. **AI membuat roadmap** belajar yang dibagi menjadi beberapa fase/topik.
3. **AI membuat task harian** (to-do list) yang actionable, lengkap dengan estimasi durasi dan sumber belajar.
4. Pengguna belajar **hari demi hari** sambil memantau progress, streak, dan menyelesaikan task.

Pandu adalah **kurator & perencana**, bukan pembuat konten, ia mengarahkan pengguna ke sumber belajar
yang sudah ada di internet (w3schools, MDN, YouTube, dsb).

## 🎯 Target Pengguna

| Persona | Deskripsi |
|---------|-----------|
| **Pemula Total** | Belum pernah coding, bingung mulai dari mana |
| **Pembelajar Otodidak yang Stuck** | Sudah belajar sedikit tapi tidak terstruktur, sering "tutorial hopping" |
| **Pindah Bidang** | Ingin pindah bidang dalam ranah teknologi, butuh referensi gambaran pembelajaran yang jelas dan terstruktur |

## 💡 Tujuan Proyek
- Mendukung pembelajar otodidak menentukan arah belajar programming sesuai dengan tujuan, kemampuan, dan waktu yang dimiliki.
- Membantu membuat roadmap belajar yang terstruktur dan personal agar pengguna dapat menentukan atau urutan materi yang harus dipelajari.
- Membantu pengguna menjaga arah pembelajaran agar tetap fokus pada materi yang relevan dengan tujuan, tanpa melebar ke topik yang belum diperlukan.

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **Personalisasi** | Form preferensi belajar: goal, target waktu, skill, jam belajar/hari |
| **AI Roadmap** | Generate roadmap belajar berfase menggunakan Gemini AI (`gemini-3.6-flash`) |
| **To Do Harian** | Task harian per fase 7 hari yang dibuat AI dengan sistem lock/unlock berbasis penyelesaian |
| **AI Syntax Puzzle** | Latihan Puzzle Sintaks yang dibuat oleh AI untuk kamu, menyesuaikan target belajar kamu |

## ⚙️ Teknologi yang Digunakan

| Lapisan | Teknologi |
| --- | --- |
| **Frontend** | Next.js 15.5.7 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend** | Next.js API Route Handlers, Prisma ORM, Supabase Auth |
| **Database & AI** | PostgreSQL (Supabase), Gemini API (Gemini 3.6 Flash) |
