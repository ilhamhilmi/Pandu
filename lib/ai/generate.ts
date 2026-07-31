const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

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

async function callGeminiAPI(prompt: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("Gemini API returned empty response");
  }

  return text;
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

  const rawText = await callGeminiAPI(prompt);
  const jsonStr = extractJSON(rawText);
  const phases = JSON.parse(jsonStr) as RoadmapPhase[];

  return phases;
}

export async function generateDailyTasks(
  roadmap: RoadmapPhase[],
  day: number,
  totalDays: number
): Promise<DailyTaskItem[]> {
  const roadmapSummary = roadmap
    .map(
      (phase) =>
        `${phase.week} - ${phase.title}: ${phase.topics.join(", ")}`
    )
    .join("\n");

  const prompt = `Kamu adalah seorang mentor programming. Berdasarkan roadmap belajar berikut, buatlah task harian untuk hari ke-${day} dari ${totalDays} hari.

ROADMAP:
${roadmapSummary}

Buatlah 2-4 task yang relevan untuk hari ke-${day}. Setiap task harus memiliki:
- title: Nama task (dalam Bahasa Indonesia, jelas dan spesifik)
- duration_minutes: Estimasi durasi dalam menit (angka, antara 15-120)
- resources: Array sumber belajar (minimal 1, maksimal 2) dengan:
  - type: "video" atau "article"
  - title: Judul sumber (dalam Bahasa Indonesia)
  - url: URL sumber belajar

PENTING - PRIORITAS SUMBER BELAJAR:
1. Untuk video (type: "video"): Prioritaskan channel YouTube INDONESIA seperti:
   - Web Programming UNPAS (Sandhika Galih)
   - Programmer Zaman Now (Eko Kurniawan Khannedy)
   - Dea Afrizal
   - Indonesia Belajar
   - atau channel YouTube Indonesia lainnya yang relevan
   Gunakan URL format: "https://www.youtube.com/watch?v=contoh"

2. Untuk artikel (type: "article"): Prioritaskan dari:
   - w3schools.com (https://www.w3schools.com/...)
   - atau dokumentasi resmi (developer.mozilla.org)

OUTPUT HANYA JSON ARRAY, tanpa markdown, tanpa teks lain. Format:
[
  {
    "title": "Nama Task",
    "duration_minutes": 45,
    "resources": [
      {
        "type": "video",
        "title": "Belajar HTML Dasar - Web Programming UNPAS",
        "url": "https://www.youtube.com/watch?v=contoh"
      },
      {
        "type": "article",
        "title": "HTML Dasar - w3schools",
        "url": "https://www.w3schools.com/html/"
      }
    ]
  }
]`;

  const rawText = await callGeminiAPI(prompt);
  const jsonStr = extractJSON(rawText);
  const tasks = JSON.parse(jsonStr) as DailyTaskItem[];

  // Ensure each task has a resources array
  return tasks.map((task) => ({
    ...task,
    resources: task.resources || [],
  }));
}