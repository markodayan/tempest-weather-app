// dateString is a plain "YYYY-MM-DD" from the Forecast API, already resolved to the
// location's own timezone - parsed and formatted in UTC throughout so the browser's local
// timezone can never shift it to the wrong calendar day. Locale is fixed to en-GB (rather
// than the environment's default) both for a consistent day-before-month reading (e.g.
// "9 July") and so formatting is deterministic across machines/CI.
function parseIsoDateUtc(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

// Used by WeatherDays tiles, e.g. "Thu 9 Jul"
export function formatDayLabelShort(dateString: string, isToday: boolean): string {
  if (isToday) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(parseIsoDateUtc(dateString));
}

// Used by WeatherDays tiles on narrow viewports, e.g. "Thu 9" - drops the month that
// formatDayLabelShort includes, since the two-column mobile layout has less room per tile.
export function formatDayLabelCompact(dateString: string, isToday: boolean): string {
  if (isToday) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(parseIsoDateUtc(dateString));
}

// Used by SelectedDayReport's header, e.g. "Thursday 9 July"
export function formatDayLabelLong(dateString: string, isToday: boolean): string {
  if (isToday) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(parseIsoDateUtc(dateString));
}

// sunrise/sunset come back as "YYYY-MM-DDTHH:mm", already resolved to the
// location's own timezone - no Date parsing needed, just take the time half.
export function formatTimeOfDay(isoDateTimeString: string): string {
  return isoDateTimeString.split('T')[1];
}

// Used by DayPreview's heading, e.g. "Friday" (no day/month, unlike the other labels)
export function formatWeekdayLabel(dateString: string, isToday: boolean): string {
  if (isToday) {
    return 'Today';
  }

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    timeZone: 'UTC',
  }).format(parseIsoDateUtc(dateString));
}
