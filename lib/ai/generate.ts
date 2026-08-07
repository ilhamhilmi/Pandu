const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";

interface UserPreference {
  goal: string;
  goalCustom?: string | null;
  targetDays: number;
  selectedSkills: string[];
  hoursPerDay?: number | null;
}

interface RoadmapPhase {
  title: string;
  week: string;
  order: number;
  topics: string[];
  duration: string;
}

interface TaskResource {
  type: "video" | "article";
  title: string;
  url: string;
}

interface DailyTaskItem {
  title: string;
  duration_minutes: number;
  resources: TaskResource[];
}

interface DailyTaskBatch {
  day: number;
  tasks: DailyTaskItem[];
}

async function callGroqAPI(
  prompt: string,
  options?: { maxRetries?: number; maxTokens?: number }
): Promise<string> {
  const maxRetries = options?.maxRetries ?? 2;
  const maxTokens = options?.maxTokens ?? 8192;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: maxTokens,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("Groq API returned empty response");
      }

      return text;
    }

    // If rate limited (429) and we have retries left, wait and retry
    if (response.status === 429 && attempt < maxRetries) {
      const errorText = await response.text();
      console.warn(
        `Groq API rate limited (429). Retry ${attempt + 1}/${maxRetries} after delay...`,
        errorText
      );
      // Exponential backoff: 5s, then 10s
      const delay = 5000 * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    // Non-retryable error or out of retries
    const errorText = await response.text();

    // Friendly message for rate limit (429) instead of exposing the raw Groq payload
    if (response.status === 429) {
      throw new Error("Coba lagi beberapa saat ya.");
    }

    throw new Error(`Groq API error (${response.status}): ${errorText}`);
  }

  throw new Error("Groq API failed after max retries");
}

function extractJSON(text: string): string {
  // Try to find JSON between triple backticks
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    return jsonMatch[1].trim();
  }

  // Try to find JSON array directly
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    return arrayMatch[0].trim();
  }

  // Try to find JSON object directly
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    return objectMatch[0].trim();
  }

  return text.trim();
}

// Allowlist of known, trusted programming/documentation sites (incl. Indonesian)
// to prevent the AI from returning hallucinated/fake URLs.
const ALLOWED_RESOURCE_HOSTS = new Set([
  "w3schools.com",
  "www.w3schools.com",
  "developer.mozilla.org",
  "freecodecamp.org",
  "www.freecodecamp.org",
  "geeksforgeeks.org",
  "www.geeksforgeeks.org",
  "learn.microsoft.com",
  "react.dev",
  "vuejs.org",
  "javascripttutorial.net",
  "petanikode.com",
  "www.petanikode.com",
  "dicoding.com",
  "www.dicoding.com",
  "malasngoding.com",
  "www.malasngoding.com",
]);

function isAllowedResourceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    return ALLOWED_RESOURCE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

/**
 * Keep only resources whose URL is valid and from an approved domain,
 * capping at 2 per task (matching the prompt). Removes fake/hallucinated URLs.
 */
function sanitizeResources(resources?: TaskResource[]): TaskResource[] {
  if (!Array.isArray(resources)) {
    return [];
  }
  return resources
    .filter(
      (r) => r && typeof r.url === "string" && isAllowedResourceUrl(r.url)
    )
    .slice(0, 2);
}

/**
 * Guidance untuk kepadatan task harian berdasarkan jam belajar user.
 * Semakin banyak jam/hari → semakin banyak & padat task; semakin sedikit → lebih ringan.
 */
interface DailyTaskGuidance {
  minTasks: number;
  maxTasks: number;
  targetDailyMinutes: number;
  maxPerTask: number;
}

function buildDailyTaskGuidance(hoursPerDay?: number | null): DailyTaskGuidance {
  const hours = hoursPerDay && hoursPerDay > 0 ? Math.min(hoursPerDay, 8) : 1;

  // Total estimasi durasi belajar per hari (target)
  const targetDailyMinutes = Math.round(hours * 60);

  // Jumlah task naik seiring jam belajar (dibatasi rentang 1-6)
  const minTasks = 2 + Math.min(2, Math.floor(hours - 1));
  const maxTasks = 2 + Math.min(4, Math.floor(hours));

  // Batas maksimal durasi per task agar total harian bisa tercapai merata
  const maxPerTask = Math.min(
    120,
    Math.max(45, Math.ceil(targetDailyMinutes / minTasks))
  );

  return { minTasks, maxTasks, targetDailyMinutes, maxPerTask };
}

/**
 * Membangun paragraf panduan kepadatan + feedback kesulitan untuk prompt task.
 */
function buildTaskGuidancePrompt(
  hoursPerDay?: number | null,
  difficultyFeedback?: string
): string {
  const g = buildDailyTaskGuidance(hoursPerDay);

  const lines = [
    `- Buatlah ${g.minTasks}-${g.maxTasks} task yang relevan untuk SETIAP hari.`,
    `- Total estimasi durasi task dalam sehari harus mendekati ${g.targetDailyMinutes} menit (±10 menit). Sebar duration_minutes tiap task (antara 15-${g.maxPerTask} menit) agar total harian tercapai secara merata.`,
    `- Sesuaikan kepadatan: karena user belajar sekitar ${g.targetDailyMinutes} menit/hari, buat task secukupnya (jika waktu banyak → task lebih banyak & terperinci; jika sedikit → task lebih sedikit, padat, dan fokus pada hal terpenting).`,
  ];

  const feedback = difficultyFeedback?.trim();
  if (feedback) {
    lines.push(
      `- KESULITAN USER DI FASE SEBELUMNYA: "${feedback}". Perhatikan masukan ini saat menyusun task fase berikutnya: perjelas kembali konsep yang sulit, tambahkan contoh & latihan bertahap, dan sesuaikan tingkat kesulitan agar lebih mudah dipahami.`
    );
  }

  return lines.join("\n");
}

export async function generateRoadmap(
  preference: UserPreference
): Promise<RoadmapPhase[]> {
  const goalLabel =
    preference.goal === "lainnya" ? preference.goalCustom : preference.goal;
  const skills = preference.selectedSkills.join(", ");
  const hoursPerDay = preference.hoursPerDay
    ? `${preference.hoursPerDay} jam per hari`
    : "waktu fleksibel";

  const prompt = `Kamu adalah seorang mentor programming yang berpengalaman. Buatkan roadmap belajar yang terstruktur untuk seseorang dengan detail berikut:

Goal: ${goalLabel}
Target waktu: ${preference.targetDays} hari
Skill saat ini: ${skills || "Belum tahu apa-apa"}
Waktu belajar: ${hoursPerDay}

Buatlah roadmap yang terdiri dari beberapa fase/minggu. Setiap fase harus memiliki:
- title: Nama fase (dalam Bahasa Indonesia)
- week: Label minggu (contoh: "Minggu 1", "Minggu 2", dll)
- order: Nomor urut fase (1, 2, 3, ...)
- topics: Array topik yang dipelajari di fase ini (minimal 3-4 topik)
- duration: Durasi fase (contoh: "7 hari")

OUTPUT HANYA JSON ARRAY, tanpa markdown, tanpa teks lain. Format:
[
  {
    "title": "Nama Fase",
    "week": "Minggu 1",
    "order": 1,
    "topics": ["Topik 1", "Topik 2", "Topik 3"],
    "duration": "7 hari"
  }
]`;

  const rawText = await callGroqAPI(prompt);
  const jsonStr = extractJSON(rawText);
  const phases = JSON.parse(jsonStr) as RoadmapPhase[];

  return phases;
}

export async function generateDailyTasks(
  roadmap: RoadmapPhase[],
  day: number,
  totalDays: number,
  hoursPerDay?: number | null,
  difficultyFeedback?: string
): Promise<DailyTaskItem[]> {
  const roadmapSummary = roadmap
    .map(
      (phase) =>
        `${phase.week} - ${phase.title}: ${phase.topics.join(", ")}`
    )
    .join("\n");

  const g = buildDailyTaskGuidance(hoursPerDay);

  const guidance = buildTaskGuidancePrompt(hoursPerDay, difficultyFeedback);

  const prompt = `Kamu adalah seorang mentor programming. Berdasarkan roadmap belajar berikut, buatlah task harian untuk hari ke-${day} dari ${totalDays} hari.

ROADMAP:
${roadmapSummary}

${guidance}
Setiap task harus memiliki:
- title: Nama task dalam Bahasa Indonesia. Tulis sebagai PERINTAH yang jelas dan bisa langsung diikuti pemula (otodidak). Mulai dengan kata kerja aksi seperti "Pelajari...", "Coba...", "Baca...", "Praktikkan...", "Buat...", "Tonton...", atau "Latih..." diikuti objek yang konkret (konsep/materi).
  - CONTOH BENAR: "Pelajari Konsep HTML", "Coba buat halaman web pertama dengan HTML", "Praktikkan membuat tabel dan formulir di HTML".
  - CONTOH SALAH (terlalu umum/ambigu, JANGAN dipakai): "Konfigurasi HTML", "Membuat komponen sederhana", "Setup environment".
- duration_minutes: Estimasi durasi dalam menit (angka, antara 15-${g.maxPerTask})
- resources: Array sumber belajar artikel (minimal 1, maksimal 2) dengan:
  - type: "article"
  - title: Judul artikel (dalam Bahasa Indonesia)
  - url: URL artikel

PENTING UNTUK URL SUMBER BELAJAR (HANYA ARTIKEL):
- Hanya gunakan URL dari situs terpercaya berikut (pilih yang relevan):
  - w3schools.com (contoh: https://www.w3schools.com/html/)
  - developer.mozilla.org (MDN Web Docs)
  - freecodecamp.org
  - geeksforgeeks.org
  - learn.microsoft.com
  - react.dev, vuejs.org, javascripttutorial.net
  - Artikel Indonesia: petanikode.com, dicoding.com, malasngoding.com
- Tulis URL yang LENGKAP dan PASTIKAN URL tersebut BENAR-BENAR ADA serta dapat diakses. JANGAN membuat atau mengarang URL palsu, dan jangan menebak path yang tidak ada.
- Jika ragu suatu URL valid, lebih baik TIDAK menyertakannya daripada mengarang URL.
- Prioritaskan dokumentasi resmi dan artikel berbahasa Indonesia.

OUTPUT HANYA JSON ARRAY, tanpa markdown, tanpa teks lain. Format:
[
  {
    "title": "Nama Task",
    "duration_minutes": 45,
    "resources": [
      {
        "type": "article",
        "title": "HTML Dasar - w3schools",
        "url": "https://www.w3schools.com/html/"
      }
    ]
  }
]`;

  const rawText = await callGroqAPI(prompt);
  const jsonStr = extractJSON(rawText);
  const tasks = JSON.parse(jsonStr) as DailyTaskItem[];

  // Ensure each task has a resources array
  return tasks.map((task) => ({
    ...task,
    resources: sanitizeResources(task.resources),
  }));
}

/**
 * Generate daily tasks for a BATCH of days (default 7 days) in a single API call.
 * This avoids generating all tasks upfront — instead, tasks are generated on-demand
 * when the user clicks "Mulai Fase Berikutnya".
 *
 * @param roadmap - The roadmap phases
 * @param startDay - First day to generate (1, 8, 15, ...)
 * @param daysToGenerate - How many days to generate in this batch (default 7)
 * @param totalDays - Total target days from the roadmap
 * @param hoursPerDay - User's daily study hours (drives task density)
 * @param difficultyFeedback - Optional user feedback on difficulties (used in prompt)
 */
export async function generateDailyTasksBatch(
  roadmap: RoadmapPhase[],
  startDay: number,
  daysToGenerate: number = 7,
  totalDays: number,
  hoursPerDay?: number | null,
  difficultyFeedback?: string
): Promise<DailyTaskBatch[]> {
  const roadmapSummary = roadmap
    .map(
      (phase) => `${phase.week} - ${phase.title}: ${phase.topics.join(", ")}`
    )
    .join("\n");

  const g = buildDailyTaskGuidance(hoursPerDay);
  const guidance = buildTaskGuidancePrompt(hoursPerDay, difficultyFeedback);

  const batchEnd = Math.min(startDay + daysToGenerate - 1, totalDays);
  const dayRange =
    startDay === batchEnd
      ? `hari ke-${startDay}`
      : `hari ke-${startDay} sampai hari ke-${batchEnd}`;

  const prompt = `Kamu adalah seorang mentor programming. Berdasarkan roadmap belajar berikut, buatlah task harian untuk ${dayRange} dari total ${totalDays} hari.

ROADMAP:
${roadmapSummary}

${guidance}
Setiap task harus memiliki:
- title: Nama task dalam Bahasa Indonesia. Tulis sebagai PERINTAH yang jelas dan bisa langsung diikuti pemula (otodidak). Mulai dengan kata kerja aksi seperti "Pelajari...", "Coba...", "Baca...", "Praktikkan...", "Buat...", "Tonton...", atau "Latih..." diikuti objek yang konkret (konsep/materi).
  - CONTOH BENAR: "Pelajari Konsep HTML", "Coba buat halaman web pertama dengan HTML", "Praktikkan membuat tabel dan formulir di HTML".
  - CONTOH SALAH (terlalu umum/ambigu, JANGAN dipakai): "Konfigurasi HTML", "Membuat komponen sederhana", "Setup environment".
- duration_minutes: Estimasi durasi dalam menit (angka, antara 15-${g.maxPerTask})
- resources: Array sumber belajar artikel (minimal 1, maksimal 2) dengan:
  - type: "article"
  - title: Judul artikel (dalam Bahasa Indonesia)
  - url: URL artikel

PENTING UNTUK URL SUMBER BELAJAR (HANYA ARTIKEL):
- Hanya gunakan URL dari situs terpercaya berikut (pilih yang relevan):
  - w3schools.com (contoh: https://www.w3schools.com/html/)
  - developer.mozilla.org (MDN Web Docs)
  - freecodecamp.org
  - geeksforgeeks.org
  - learn.microsoft.com
  - react.dev, vuejs.org, javascripttutorial.net
  - Artikel Indonesia: petanikode.com, dicoding.com, malasngoding.com
- Tulis URL yang LENGKAP dan PASTIKAN URL tersebut BENAR-BENAR ADA serta dapat diakses. JANGAN membuat atau mengarang URL palsu, dan jangan menebak path yang tidak ada.
- Jika ragu suatu URL valid, lebih baik TIDAK menyertakannya daripada mengarang URL.
- Prioritaskan dokumentasi resmi dan artikel berbahasa Indonesia.

OUTPUT HANYA JSON ARRAY, tanpa markdown, tanpa teks lain. Format:
[
  {
    "day": ${startDay},
    "tasks": [
      {
        "title": "Nama Task",
        "duration_minutes": 45,
        "resources": [
          {
            "type": "article",
            "title": "HTML Dasar - w3schools",
            "url": "https://www.w3schools.com/html/"
          }
        ]
      }
    ]
  }
]

Pastikan setiap hari dari ${startDay} sampai ${batchEnd} ada dalam output. Buat progres yang logis mengikuti roadmap.`;

  const rawText = await callGroqAPI(prompt, { maxTokens: 8192 });
  const jsonStr = extractJSON(rawText);
  const batchResult = JSON.parse(jsonStr) as DailyTaskBatch[];

  // Ensure each task has a resources array and sort by day
  const batches = batchResult.map((batch) => ({
    day: batch.day,
    tasks: batch.tasks.map((task) => ({
      ...task,
      resources: sanitizeResources(task.resources),
    })),
  }));

  batches.sort((a, b) => a.day - b.day);

  return batches;
}

export interface PracticeQuestion {
  id: number;
  code: string;
  language?: string;
  instruction?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Minimal sanitization untuk soal latihan hasil AI.
 * Memastikan setiap soal punya struktur yang valid dan dapat dirender oleh UI.
 */
function sanitizePracticeQuestion(
  q: PracticeQuestion,
  index: number
): PracticeQuestion | null {
  if (!q || typeof q.code !== "string" || !q.code.trim()) return null;
  if (!q.code.includes("____")) return null; // harus punya celah rumpang
  if (!Array.isArray(q.options) || q.options.length < 2) return null;
  if (
    typeof q.correctIndex !== "number" ||
    q.correctIndex < 0 ||
    q.correctIndex >= q.options.length
  ) {
    return null;
  }
  if (typeof q.explanation !== "string" || !q.explanation.trim()) return null;

  return {
    id: index + 1,
    code: q.code,
    language: q.language ?? undefined,
    instruction: q.instruction ?? undefined,
    options: q.options.slice(0, 4), // maksimal 4 opsi
    correctIndex: q.correctIndex,
    explanation: q.explanation,
  };
}

/**
 * Generate "Syntax Puzzle" (soal melengkapi sintaks rumpang) berdasarkan
 * goal dan topik belajar pengguna. Dihasilkan on-demand setiap kali user
 * menekan "Mulai latihan" / "Latihan lagi".
 *
 * @param input.goal   - Goal belajar yang dipilih pengguna
 * @param input.topics - Topik dari roadmap (referensi materi soal)
 */
export async function generatePracticeQuestions(input: {
  goal: string;
  topics: string[];
}): Promise<PracticeQuestion[]> {
  const topicsSummary =
    input.topics && input.topics.length > 0
      ? input.topics.join(", ")
      : "belum ada topik spesifik, gunakan materi dasar dari goal";

  const prompt = `Kamu adalah mentor programming. Buatkan "Syntax Puzzle" untuk latihan melengkapi sintaks yang rumpang (atau sebagian kode yang hilang) berdasarkan GOAL dan TOPIK belajar pengguna berikut.

GOAL PENGGUNA: ${input.goal}
TOPIK REFERENSI: ${topicsSummary}

PERSYARATAN:
- Buat 5 soal berbeda dari soal sebelumnya.
- Setiap soal menampilkan potongan kode (code) yang RELEVAN dengan goal/topik di atas. Gunakan bahasa yang sesuai (contoh: HTML, CSS, JavaScript, Python, SQL atau lainnya sesuai dengan goal pengguna).
- Di dalam code terdapat SATU bagian rumpang yang dilambangkan dengan empat garis bawah: "____". Bagian yang dirumpang bisa berupa nama tag, atribut, properti CSS, keyword, method, dsb.
- Setiap soal memiliki 2-3 pilihan jawaban (options) sebagai array string.
- Tepat SATU jawaban benar terletak pada indeks correctIndex (0-based) di dalam array options. Pilihan-pilihan selain benar harus TIDAK PLASIBEL (Mutlak Salah).
- explanation: Jelaskan dengan bahasa Indonesia (ringkas namun jelas) KENAPA jawaban tersebut benar, dan bila perlu mengapa pilihan lain salah.
- instruction (opsional): instruksi singkat untuk soal, contoh: "Lengkapi sintaks berikut menggunakan CSS Flexbox untuk pusatkan elemen secara horizontal.".
- Blank harus memiliki jawaban yang TIDAK ambigu — pastikan hanya satu opsi yang benar secara sintaks maupun konteks kode di sekitarnya.
- JANGAN membuat soal yang bagian rumpangnya merupakan identifier yang dapat ditentukan bebas oleh programmer, seperti nama variabel, fungsi, class, parameter, object, maupun file.
- BUAT JAWABAN YANG MEMANG MUTLAK ADANYA.
- JANGAN BUAT SOAL YANG SAMA TIAP DI GENERATE
OUTPUT HANYA JSON ARRAY, tanpa markdown, tanpa teks lain. Format setiap elemen:
{
  "code": "display: ____;",
  "language": "CSS",
  "instruction": "Lengkapi properti CSS agar elemen menjadi flex container.",
  "options": ["flex", "block", "grid", "inline"],
  "correctIndex": 0,
  "explanation": "Jawaban 'flex' benar karena menetapkan elemen sebagai flex container sehingga kita bisa mengatur tata letak anak-anak elemen dengan flexbox..."
}

Pastikan variasi bahasa sesuai goal, tingkat kesulitan wajar untuk pemula (otodidak), dan setiap soal benar-benar bisa dijawab dari materi goal/topik.`;

  const rawText = await callGroqAPI(prompt, { maxTokens: 4096 });
  const jsonStr = extractJSON(rawText);
  const parsed = JSON.parse(jsonStr) as PracticeQuestion[];

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Gagal membuat soal latihan. Coba lagi.");
  }

  const questions = parsed
    .map((q, i) => sanitizePracticeQuestion(q, i))
    .filter((q): q is PracticeQuestion => q !== null);

  if (questions.length === 0) {
    throw new Error("Gagal membuat soal latihan. Coba lagi.");
  }

  return questions.slice(0, 10);
}
