import { NextResponse } from "next/server";

// ============================================
// DATA PERPUSTAKAAN - EDIT DI SINI
// Tambah/hapus video & artikel di array di bawah.
// Frontend otomatis update karena pakai .map()
// ============================================

const LIBRARY_VIDEOS = [
  {
    // TODO: ganti url di bawah dengan URL YouTube milikmu (mis. pakai ID playlist/video).
    url: "https://youtube.com/playlist?list=PLFIM0718LjIX-K5eeHRImnZhPUMhsw9A7&si=u9_X5YRL-z85mByk",
    title: "Apa itu HTML5? | Belajar HTML5",
    channel: "WPU",
    duration: "Playlist",
  },
  {
    url: "https://youtube.com/playlist?list=PLFIM0718LjIVCmrSWbZPKCccCkfFw-Naa&si=Iq7j0yPIoD8oCc7F",
    title: "CSS3",
    channel: "WPU",
    duration: "Playlist",
  },
  {
    url: "https://youtube.com/playlist?list=PLFIM0718LjIUHFRMzPJ0wGjx9_NlC5d1h&si=dWB6LIWpa4jfRx5F",
    title: "Belajar TAILWINDCSS",
    channel: "WPU",
    duration: "Playlist",
  },
  {
    url: "https://youtube.com/playlist?list=PLFIM0718LjIWXagluzROrA-iBY9eeUt4w&si=MmOfdG6MS6l4lh5N",
    title: "Dasar Pemrograman dengan Javascript",
    channel: "WPU",
    duration: "Playlist",
  },
  {
    url: "https://youtu.be/SDROba_M42g?si=7lGcsOak2bzfu6Fq",
    title: "TUTORIAL JAVASCRIPT DASAR BAHASA INDONESIA",
    channel: "Programmer Zaman Now",
    duration: "8:03:52",
  },
  {
    url: "https://youtube.com/playlist?list=PL-CtdCApEFH9540Fr7MvF9t-vG6pR9vjw&si=NMhEOKgYqukDGk9-",
    title: "Tutorial NodeJS",
    channel: "Programmer Zaman Now",
    duration: "Playlist",
  },
  {
    url: "https://youtu.be/VcwN0nms30I?si=W874HNcGkGaoHdYm",
    title: "Roadmap FULLSTACK Developer 2025",
    channel: "WPU",
    duration: "24:17",
  },
  {
    url: "https://youtube.com/playlist?list=PLTbTZ9z52SzMi5EmUGqVceaIVGuk426on&si=J4GksO4RnpSvCmOl",
    title: "BELAJAR SQL UNTUK PEMULA",
    channel: "Anas Wicaksono",
    duration: "Playlist",
  },
  {
    url: "https://youtube.com/playlist?list=PLFIM0718LjIVknj6sgsSceMqlq242-jNf&si=nhvUi7qCQZEdyjGM",
    title: "GIT & GITHUB",
    channel: "WPU",
    duration: "Playlist",
  },
  {
    url: "https://youtube.com/playlist?list=PLZS-MHyEIRo59lUBwU-XHH7Ymmb04ffOY&si=chgR5Y1eC_PxtfTM",
    title: "Belajar Python Bahasa Indonesia [Versi Baru]",
    channel: "Kelas Terbuka",
    duration: "Playlist",
  },
];

const LIBRARY_ARTICLES = [
  {
    title: "HTML Tutorial",
    url: "https://www.w3schools.com/html/",
    source: "w3schools",
    description:
      "Belajar HTML dari dasar sampai lanjutan dengan contoh interaktif.",
  },
  {
    title: "CSS Tutorial",
    url: "https://www.w3schools.com/css/",
    source: "w3schools",
    description: "Belajar CSS untuk styling halaman web.",
  },
  {
    title: "JavaScript Tutorial",
    url: "https://www.w3schools.com/js/",
    source: "w3schools",
    description: "Belajar JavaScript untuk interaktivitas web.",
  },
  {
    title: "React Tutorial",
    url: "https://www.w3schools.com/react/",
    source: "w3schools",
    description: "Belajar React untuk membangun UI modern.",
  },
  {
    title: "Node.js Tutorial",
    url: "https://www.w3schools.com/nodejs/",
    source: "w3schools",
    description: "Belajar Node.js untuk backend JavaScript.",
  },
  {
    title: "SQL Tutorial",
    url: "https://www.w3schools.com/sql/",
    source: "w3schools",
    description: "Belajar SQL untuk mengelola database.",
  },
  {
    title: "Python Tutorial",
    url: "https://www.w3schools.com/python/",
    source: "w3schools",
    description: "Belajar Python untuk berbagai keperluan.",
  },
  {
    title: "MDN Web Docs - HTML",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    source: "MDN",
    description: "Dokumentasi resmi HTML dari Mozilla Developer Network.",
  },
  {
    title: "MDN Web Docs - CSS",
    url: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    source: "MDN",
    description: "Dokumentasi resmi CSS dari Mozilla Developer Network.",
  },
  {
    title: "MDN Web Docs - JavaScript",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    source: "MDN",
    description: "Dokumentasi resmi JavaScript dari Mozilla Developer Network.",
  },
];

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: {
        videos: LIBRARY_VIDEOS,
        articles: LIBRARY_ARTICLES,
      },
    },
    { status: 200 }
  );
}