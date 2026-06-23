export const HIJRI_MONTH_NAMES = [
  "Muharram",
  "Safar",
  "Rabiulawal",
  "Rabiulakhir",
  "Jamadilawal",
  "Jamadilakhir",
  "Rejab",
  "Syaaban",
  "Ramadhan",
  "Syawal",
  "Zulkaedah",
  "Zulhijjah",
] as const;

export const SHORT_HIJRI_MONTH_NAMES = [
  "Muh",
  "Saf",
  "Raw",
  "Rak",
  "Jaw",
  "Jak",
  "Rej",
  "Syb",
  "Ram",
  "Syw",
  "Zkh",
  "Zhj",
] as const;

export type HijriMonthFormat = "full" | "short";

export interface HijriDateFormatOptions {
  monthFormat?: HijriMonthFormat;
  padDay?: boolean;
  yearSuffix?: string;
}

export interface HijriDateParts {
  hijri_day: number | null;
  hijri_month: number | null;
  hijri_year: number | null;
  hijri_month_name: string | null;
  hijri_month_short: string | null;
}

/**
 * Parses the API Hijri date (`YYYY-MM-DD`) and attaches JAKIM-style month names.
 *
 * Example:
 * parseHijriDate("1448-01-07")
 * // {
 * //   hijri_day: 7,
 * //   hijri_month: 1,
 * //   hijri_year: 1448,
 * //   hijri_month_name: "Muharram",
 * //   hijri_month_short: "Muh",
 * // }
 */
export function parseHijriDate(hijri: string): HijriDateParts {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(hijri);
  if (!match) return emptyHijriDateParts();

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const monthIndex = month - 1;

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day) ||
    monthIndex < 0 ||
    monthIndex >= HIJRI_MONTH_NAMES.length
  ) {
    return emptyHijriDateParts();
  }

  return {
    hijri_day: day,
    hijri_month: month,
    hijri_year: year,
    hijri_month_name: HIJRI_MONTH_NAMES[monthIndex],
    hijri_month_short: SHORT_HIJRI_MONTH_NAMES[monthIndex],
  };
}

/**
 * Formats an API Hijri date for display, falling back to the original value if
 * the date cannot be parsed.
 *
 * Examples:
 * formatHijriDate("1448-01-07") // "07 Muharram 1448"
 * formatHijriDate("1448-01-07", { padDay: false, yearSuffix: "H" })
 * // "7 Muharram 1448H"
 * formatHijriDate("1448-09-07", { monthFormat: "short" }) // "07 Ram 1448"
 */
export function formatHijriDate(
  hijri: string,
  options: HijriMonthFormat | HijriDateFormatOptions = {},
): string {
  const formatOptions =
    typeof options === "string" ? { monthFormat: options } : options;
  const {
    monthFormat = "full",
    padDay = true,
    yearSuffix = "",
  } = formatOptions;
  const parts = parseHijriDate(hijri);
  if (
    parts.hijri_day === null ||
    parts.hijri_year === null ||
    parts.hijri_month_name === null ||
    parts.hijri_month_short === null
  ) {
    return hijri;
  }

  const monthName =
    monthFormat === "short" ? parts.hijri_month_short : parts.hijri_month_name;
  const day = padDay
    ? String(parts.hijri_day).padStart(2, "0")
    : String(parts.hijri_day);

  return `${day} ${monthName} ${parts.hijri_year}${yearSuffix}`;
}

/**
 * Provides null-valued date parts for invalid or unexpected API date strings.
 */
function emptyHijriDateParts(): HijriDateParts {
  return {
    hijri_day: null,
    hijri_month: null,
    hijri_year: null,
    hijri_month_name: null,
    hijri_month_short: null,
  };
}
