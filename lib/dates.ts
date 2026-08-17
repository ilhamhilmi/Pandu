/**
 * Utilitas tanggal berbasis timezone (IANA) untuk fitur "streak" harian.
 * Semua fungsi bekerja dengan format tanggal "YYYY-MM-DD" di timezone tertentu.
 */

export const DEFAULT_TIMEZONE = "Asia/Jakarta";

/**
 * Format tanggal "hari ini" (YYYY-MM-DD) di timezone tertentu.
 * Menggunakan en-CA locale yang menghasilkan format ISO (YYYY-MM-DD).
 */
export function todayInTimezone(timezone: string | null | undefined, now = new Date()): string {
  const tz = timezone || DEFAULT_TIMEZONE;
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(now);
}

/**
 * Tambahkan/kurangi N hari dari string tanggal YYYY-MM-DD (bekerja tanpa timezone,
 * hari dihitung sebagai integer). Mengembalikan string YYYY-MM-DD.
 */
export function addDaysToString(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(dt.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

/**
 * Menghitung panjang streak (hari beruntun) dari kumpulan tanggal aktif.
 *
 * Aturan (gaya TikTok):
 * - Jika "hari ini" aktif -> anchor = hari ini.
 * - Jika tidak, tetapi "kemarin" aktif -> anchor = kemarin (streak masih hidup,
 *   karena hari ini belum berakhir).
 * - Selain itu -> streak = 0 (sudah putus).
 * - Berlaku mundur dari anchor selama tanggal-tanggal berurutan semuanya aktif.
 */
export function calculateStreak(
  activeDates: string[],
  timezone: string | null | undefined,
  now = new Date()
): number {
  const today = todayInTimezone(timezone, now);
  const yesterday = addDaysToString(today, -1);

  const activeSet = new Set(activeDates);

  // Tentukan anchor (hari terakhir dalam rentang streak aktif).
  let anchor: string | null = null;
  if (activeSet.has(today)) {
    anchor = today;
  } else if (activeSet.has(yesterday)) {
    anchor = yesterday;
  }

  if (!anchor) return 0;

  // Hitung mundur selama tanggal berurutan semuanya aktif.
  let streak = 0;
  let cursor = anchor;
  while (activeSet.has(cursor)) {
    streak++;
    cursor = addDaysToString(cursor, -1);
  }
  return streak;
}
