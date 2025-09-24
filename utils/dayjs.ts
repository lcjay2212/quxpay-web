import dayjs, { type Dayjs, type ManipulateType, type OpUnitType } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Common date formats
export const DATE_FORMATS = {
  FULL_DATE_TIME: 'MMM DD, YYYY HH:mm:ss',
  FULL_DATE_TIME_UTC: 'MMM DD, YYYY HH:mm:ss A',
  DATE_ONLY: 'MMM DD, YYYY',
  TIME_ONLY: 'HH:mm:ss',
  TIME_WITH_AM_PM: 'HH:mm:ss A',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_TIME: 'HH:mm A',
} as const;

// Type definitions
type DateInput = string | Date | Dayjs | null | undefined;

// Utility functions
export const dayjsUtils = {
  now: (): Dayjs => dayjs().utc(),

  nowLocal: (): Dayjs => dayjs(),

  formatUTC: (date: DateInput, format: string = DATE_FORMATS.FULL_DATE_TIME_UTC): string => {
    return dayjs(date).utc().format(format);
  },

  formatLocal: (date: DateInput, format: string = DATE_FORMATS.FULL_DATE_TIME): string => {
    return dayjs(date).format(format);
  },

  toUTC: (date: DateInput): Dayjs => {
    return dayjs(date).utc();
  },

  fromUTC: (date: DateInput): Dayjs => {
    return dayjs.utc(date).local();
  },

  fromNow: (date: DateInput): string => {
    return dayjs(date).fromNow();
  },

  fromNowUTC: (date: DateInput): string => {
    return dayjs.utc(date).fromNow();
  },

  isToday: (date: DateInput): boolean => {
    return dayjs(date).isSame(dayjs(), 'day');
  },

  isPast: (date: DateInput): boolean => {
    return dayjs(date).isBefore(dayjs());
  },

  isFuture: (date: DateInput): boolean => {
    return dayjs(date).isAfter(dayjs());
  },

  add: (date: DateInput, amount: number, unit: ManipulateType): Dayjs => {
    return dayjs(date).add(amount, unit);
  },

  subtract: (date: DateInput, amount: number, unit: ManipulateType): Dayjs => {
    return dayjs(date).subtract(amount, unit);
  },

  startOfDayUTC: (date?: DateInput): Dayjs => {
    return dayjs(date).utc().startOf('day');
  },

  endOfDayUTC: (date?: DateInput): Dayjs => {
    return dayjs(date).utc().endOf('day');
  },

  parse: (date: string, format: string): Dayjs => {
    return dayjs(date, format);
  },

  isValid: (date: DateInput): boolean => {
    return dayjs(date).isValid();
  },

  getTimezoneOffset: (): number => {
    return dayjs().utcOffset();
  },

  toTimezone: (date: DateInput, timezone: string): Dayjs => {
    return dayjs(date).tz(timezone);
  },

  diff: (date1: DateInput, date2: DateInput, unit: OpUnitType = 'millisecond'): number => {
    return dayjs(date1).diff(dayjs(date2), unit);
  },

  isBetween: (date: DateInput, start: DateInput, end: DateInput): boolean => {
    const dateObj = dayjs(date);
    const startObj = dayjs(start);
    const endObj = dayjs(end);
    return dateObj.isAfter(startObj) && dateObj.isBefore(endObj);
  },

  startOfWeekUTC: (date?: DateInput): Dayjs => {
    return dayjs(date).utc().startOf('week');
  },

  endOfWeekUTC: (date?: DateInput): Dayjs => {
    return dayjs(date).utc().endOf('week');
  },

  startOfMonthUTC: (date?: DateInput): Dayjs => {
    return dayjs(date).utc().startOf('month');
  },

  endOfMonthUTC: (date?: DateInput): Dayjs => {
    return dayjs(date).utc().endOf('month');
  },
};

// Export dayjs instance with plugins
export default dayjs;
