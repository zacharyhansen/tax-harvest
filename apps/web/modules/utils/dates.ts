export function parseDate<T extends string | Date | null | undefined>(
  date: T
): T extends null | undefined ? Date | null : Date {
  // We have to cast to any here since TypeScript has trouble figuring out that
  // the runtime code and the generics match up.
  if (date == null) return null as any;

  return typeof date === 'string' && !date.includes('T')
    ? new Date(`${date}T00:00:00`)
    : new Date(date);
}

const defaultFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'numeric',
  day: 'numeric',
  year: 'numeric',
});

export function formatDate(
  date: string | Date | null | undefined | number,
  formatter = defaultFormatter
) {
  return date == null
    ? null
    : formatter.format(
        typeof date === 'number' ? new Date(date) : parseDate(date)
      );
}

const pad = (n: number) => String(n).padStart(2, '0');

export function formatISODate<T extends string | Date | null | undefined>(
  date: T
): T extends null | undefined ? string | null : string {
  // We have to cast to any here since TypeScript has trouble figuring out that
  // the runtime code and the generics match up.
  if (date == null) return null as any;

  const d = parseDate(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export type DateShift = 'end' | 'none' | 'start';

export const fromToday = (days: number, shift: DateShift = 'none') => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  // If an shift is provided, set the time to the start or end of the day
  if (shift === 'start') {
    date.setHours(0, 0, 0, 0);
  } else if (shift === 'end') {
    date.setHours(23, 59, 59, 999);
  }

  return date;
};

export function isOlderThanOneYear(date: string | Date | null | undefined) {
  // Get the current date
  const currentDate = new Date();

  // Get the date one year ago from today
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

  // Compare the given date with the date one year ago
  return date && parseDate(date) < oneYearAgo;
}
