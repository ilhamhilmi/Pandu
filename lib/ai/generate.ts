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
- resources: Array sumber belajar artikel (minimal 1, maksimal 2) dengan:
  - type: "article"
  - title: Judul artikel (dalam Bahasa Indonesia)
  - url: URL artikel

PRIORITAS SUMBER BELAJAR (HANYA ARTIKEL):
- w3schools.com (https://www.w3schools.com/...)
- atau dokumentasi resmi (developer.mozilla.org)

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
    resources: task.resources || [],
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
 */
export async function generateDailyTasksBatch(
  roadmap: RoadmapPhase[],
  startDay: number,
  daysToGenerate: number = 7,
  totalDays: number
): Promise<DailyTaskBatch[]> {
  const roadmapSummary = roadmap
    .map(
      (phase) => `${phase.week} - ${phase.title}: ${phase.topics.join(", ")}`
    )
    .join("\n");

  const batchEnd = Math.min(startDay + daysToGenerate - 1, totalDays);
  const dayRange =
    startDay === batchEnd
      ? `hari ke-${startDay}`
      : `hari ke-${startDay} sampai hari ke-${batchEnd}`;

  const prompt = `Kamu adalah seorang mentor programming. Berdasarkan roadmap belajar berikut, buatlah task harian untuk ${dayRange} dari total ${totalDays} hari.

ROADMAP:
${roadmapSummary}

Buatlah 2-4 task yang relevan untuk SETIAP hari dalam rentang tersebut. Setiap task harus memiliki:
- title: Nama task (dalam Bahasa Indonesia, jelas dan spesifik)
- duration_minutes: Estimasi durasi dalam menit (angka, antara 15-120)
- resources: Array sumber belajar artikel (minimal 1, maksimal 2) dengan:
  - type: "article"
  - title: Judul artikel (dalam Bahasa Indonesia)
  - url: URL artikel

PRIORITAS SUMBER BELAJAR (HANYA ARTIKEL):
- w3schools.com (https://www.w3schools.com/...)
- atau dokumentasi resmi (developer.mozilla.org)

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
      resources: task.resources || [],
    })),
  }));

  batches.sort((a, b) => a.day - b.day);

  return batches;
}
