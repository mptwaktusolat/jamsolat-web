import type { V2Prayer } from "./api";

export const PRAYER_KEYS = [
  "fajr",
  "syuruk",
  "dhuhr",
  "asr",
  "maghrib",
  "isha",
] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const PRAYER_NAMES: Record<PrayerKey, string> = {
  fajr: "Subuh",
  syuruk: "Syuruk",
  dhuhr: "Zohor",
  asr: "Asar",
  maghrib: "Maghrib",
  isha: "Isyak",
};

export interface PrayerEntry {
  key: PrayerKey;
  name: string;
  ts: number; // Unix seconds
}

export function getPrayersForDay(
  monthly: { prayers: V2Prayer[] },
  dayOfMonth: number,
): PrayerEntry[] {
  const dayData = monthly.prayers.find((p) => p.day === dayOfMonth);
  if (!dayData) return [];
  return PRAYER_KEYS.map((key) => ({
    key,
    name: PRAYER_NAMES[key],
    ts: dayData[key],
  }));
}

/** Return the next upcoming prayer. */
export function getNextPrayer(
  prayers: PrayerEntry[],
  nowSec: number,
): PrayerEntry | null {
  const upcoming = prayers.filter((p) => p.ts > nowSec);
  return upcoming.length > 0 ? upcoming[0] : null;
}

/** Return the latest prayer whose time has already passed. */
export function getCurrentPrayer(
  prayers: PrayerEntry[],
  nowSec: number,
): PrayerEntry | null {
  const passed = prayers.filter((p) => p.ts <= nowSec);
  return passed.length > 0 ? passed[passed.length - 1] : null;
}

/**
 * Get prayer time remaining as a percentage of the span
 */
export function getPrayerTimeRemaining(
  prevTs: number | null,
  nextTs: number | null,
  nowSec: number,
): number {
  if (nextTs === null) return 0;
  const startTs = prevTs ?? nextTs - 3 * 3600;
  const span = nextTs - startTs;
  if (span <= 0) return 0;
  return Math.min(100, Math.max(0, ((nextTs - nowSec) / span) * 100));
}

/** Seconds remaining until nextPrayer. */
export function getCountdownSeconds(
  nextPrayer: PrayerEntry,
  nowSec: number,
): number {
  return Math.max(0, nextPrayer.ts - nowSec);
}

/** Format countdown to sentence. Eg "1 jam 12 minit 05 saat" */
export function formatCountdownLong(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const parts = h > 0 ? [`${h} jam`] : [];
  parts.push(`${m} minit`, `${String(s).padStart(2, "0")} saat`);
  return parts.join(" ");
}

/** Get the timer color based on the prayer urgency */
export function getCountdownColor(totalSec: number): string {
  if (totalSec <= 9 * 60) return "#dc2626";
  if (totalSec <= 15 * 60) return "#f97316";
  return "";
}
