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

export const PRAYER_COLORS: Record<PrayerKey, string> = {
  fajr: "#0078D4",
  syuruk: "#DA3B01",
  dhuhr: "#038387",
  asr: "#744DA9",
  maghrib: "#C50F1F",
  isha: "#5C2D91",
};

export interface PrayerEntry {
  key: PrayerKey;
  name: string;
  ts: number; // Unix seconds
  color: string;
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
    color: PRAYER_COLORS[key],
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

/** Seconds remaining until nextPrayer. */
export function getCountdownSeconds(
  nextPrayer: PrayerEntry,
  nowSec: number,
): number {
  return Math.max(0, nextPrayer.ts - nowSec);
}

/** Format seconds as MM:SS when < 1hr, or HH:MM:SS. */
export function formatCountdown(totalSec: number): string {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  if (h > 0) return `${h}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

/** Compute the angle (degrees, from 12 o'clock) for a given time on a 12-hr clock face. */
export function timeToClockAngle(tsSec: number): number {
  const d = new Date(tsSec * 1000);
  const h = d.getHours() % 12;
  const m = d.getMinutes();
  return (h / 12) * 360 + (m / 60) * 30;
}
