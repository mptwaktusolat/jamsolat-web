import { getCached, setCached } from "./cache";
import { parseHijriDate, type HijriDateParts } from "./hijri";

const BASE = "https://api.waktusolat.app";

export interface V2Prayer extends HijriDateParts {
  day: number;
  hijri: string;
  imsak: number;
  fajr: number;
  syuruk: number;
  dhuha: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface V2Response {
  zone: string;
  year: number;
  month: string;
  month_number: number;
  last_updated: string | null;
  prayers: V2Prayer[];
}

export interface ZoneInfo {
  jakimCode: string;
  negeri: string;
  daerah: string;
}

export async function fetchPrayerTimes(
  zone: string,
  year: number,
  month: number,
): Promise<V2Response> {
  const cacheKey = `jsolat-prayers-${zone}-${year}-${month}`;
  const cached = getCached<V2Response>(cacheKey);
  if (cached) return withHijriMonthNames(cached);

  const url = `${BASE}/v2/solat/${encodeURIComponent(zone)}?year=${year}&month=${month}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status} for zone ${zone}`);
  const data: V2Response = await res.json();
  const normalized = withHijriMonthNames(data);
  setCached(cacheKey, normalized);
  return normalized;
}

export async function fetchPrayerTimesByGPS(
  lat: number,
  lon: number,
  year: number,
  month: number,
): Promise<V2Response> {
  const url = `${BASE}/v2/solat/gps/${lat}/${lon}?year=${year}&month=${month}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GPS API error ${res.status}`);
  const data: V2Response = await res.json();
  const normalized = withHijriMonthNames(data);
  // Cache by zone so subsequent zone-based requests hit cache too
  const cacheKey = `jsolat-prayers-${normalized.zone}-${year}-${month}`;
  setCached(cacheKey, normalized);
  return normalized;
}

export async function fetchAllZones(): Promise<ZoneInfo[]> {
  const cacheKey = "jsolat-zones";
  const cached = getCached<ZoneInfo[]>(cacheKey);
  if (cached) return cached;

  const res = await fetch(`${BASE}/zones`);
  if (!res.ok) throw new Error(`Zones API error ${res.status}`);
  const data: ZoneInfo[] = await res.json();
  // Cache zones for 7 days
  setCached(cacheKey, data, 7 * 24 * 60 * 60 * 1000);
  return data;
}

function withHijriMonthNames(data: V2Response): V2Response {
  return {
    ...data,
    prayers: data.prayers.map((prayer) => ({
      ...prayer,
      ...parseHijriDate(prayer.hijri),
    })),
  };
}
