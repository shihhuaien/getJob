type RelativeTimeTranslator = (
  key:
    | "justNow"
    | "secondsAgo"
    | "minutesAgo"
    | "hoursAgo"
    | "daysAgo"
    | "weeksAgo"
    | "monthsAgo"
    | "yearsAgo",
  values?: { count: number }
) => string;

export function formatRelativeTime(
  from: string | number | Date,
  t: RelativeTimeTranslator,
  now: Date = new Date()
): string {
  const target = from instanceof Date ? from : new Date(from);
  const diffSeconds = Math.max(0, Math.floor((now.getTime() - target.getTime()) / 1000));

  if (diffSeconds < 10) return t("justNow");
  if (diffSeconds < 60) return t("secondsAgo", { count: diffSeconds });

  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return t("minutesAgo", { count: minutes });

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t("hoursAgo", { count: hours });

  const days = Math.floor(hours / 24);
  if (days < 7) return t("daysAgo", { count: days });

  const weeks = Math.floor(days / 7);
  if (days < 30) return t("weeksAgo", { count: weeks });

  const months = Math.floor(days / 30);
  if (months < 12) return t("monthsAgo", { count: months });

  const years = Math.floor(days / 365);
  return t("yearsAgo", { count: years });
}
