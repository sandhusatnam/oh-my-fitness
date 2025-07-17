import { format, toZonedTime } from 'date-fns-tz';

export const TIME_ZONE = 'America/New_York';

export function formatDateYMD(date: Date | string): string {
  const zoned = toZonedTime(new Date(date), TIME_ZONE);
  return format(zoned, 'yyyy-MM-dd', { timeZone: TIME_ZONE });
}

export function parseDateYMD(dateStr: string): Date {
  return toZonedTime(dateStr, TIME_ZONE);
}

export function formatDateLong(date: Date | string): string {
  const zoned = toZonedTime(new Date(date), TIME_ZONE);
  return format(zoned, 'MMMM d, yyyy', { timeZone: TIME_ZONE });
}