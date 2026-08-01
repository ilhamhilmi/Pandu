import { NextResponse } from "next/server";

// ============================================
// DATA PERPUSTAKAAN - EDIT DI SINI
// Tambah/hapus video & artikel di array di bawah.
// Frontend otomatis update karena pakai .map()
// ============================================

const LIBRARY_VIDEOS = [
  {
    id: "",
    title: "Belajar HTML Dasar - Web Programming UNPAS",
    channel: "Web Programming UNPAS",
    duration: "1:22:45",
  },
  {
    id: "O5WovXIF-ig",
    title: "Belajar CSS Dasar - Web Programming UNPAS",
    channel: "Web Programming UNPAS",
    duration: "1:45:30",
  },
  {
    id: "RUTV_5m4VeI",
    title: "Belajar JavaScript Dasar - Web Programming UNPAS",
    channel: "Web Programming UNPAS",
    duration: "2:10:15",
  },
  {
    id: "l1mER1bV0N0",
    title: "Belajar React JS - Web Programming UNPAS",
    channel: "Web Programming UNPAS",
    duration: "1:55:20",
  },
  {
    id: "RkcJtFb8v1E",
    title: "Belajar Node.js - Programmer Zaman Now",
    channel: "Programmer Zaman Now",
    duration: "2:30:45",
  },
  {
    id: "x4da1PWvP_U",
    title: "Belajar Git & GitHub - Programmer Zaman Now",
    channel: "Programmer Zaman Now",
    duration: "1:40:10",
  },
  {
    id: "k2qgadSv3U4",
    title: "Belajar Database MySQL - Programmer Zaman Now",
    channel: "Programmer Zaman Now",
    duration: "2:15:30",
  },
  {
    id: "VlPiVmYuoqw",
    title: "Belajar Python Dasar - Programmer Zaman Now",
    channel: "Programmer Zaman Now",
    duration: "3:05:00",
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