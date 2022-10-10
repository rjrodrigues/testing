import { DateAdapter } from '@angular/material/core';
import {
  datetime,
  DateTimeUnit,
  longDaysOfWeek,
  longMonths,
  narrowDaysOfWeek,
  shortDaysOfWeek,
  shortMonths,
} from '@app/shared/datetime';

export class DateTimeAdapter extends DateAdapter<Date> {
  getYear(date: Date): number {
    return datetime(date).year();
  }

  getMonth(date: Date): number {
    return datetime(date).month();
  }

  getDate(date: Date): number {
    return datetime(date).date();
  }

  getDayOfWeek(date: Date): number {
    return datetime(date).day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return style === 'long' ? longMonths() : shortMonths();
  }

  getDateNames(): string[] {
    return [...Array(31).keys()].map((i) => String(i + 1));
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (style === 'long') {
      return longDaysOfWeek();
    }
    if (style === 'short') {
      return shortDaysOfWeek();
    }
    return narrowDaysOfWeek();
  }

  getYearName(date: Date): string {
    return datetime(date).format('YYYY');
  }

  getFirstDayOfWeek(): number {
    return 1;
    // TODO: return first day of the week based on locale
    // return firstDayOfWeek();
  }

  getNumDaysInMonth(date: Date): number {
    return datetime(date).daysInMonth();
  }

  clone(date: Date): Date {
    return datetime(date).clone().toDate();
  }

  createDate(year: number, month: number, date: number): Date {
    return datetime().year(year).month(month).date(date).toDate();
  }

  today(): Date {
    return datetime().toDate();
  }

  parse(value: any, parseFormat: any): Date | null {
    if (value && typeof value === 'string') {
      return datetime(value, parseFormat).toDate();
    }
    return value ? datetime(value).toDate() : null;
  }

  format(date: Date, displayFormat: any): string {
    if (!this.isValid(date)) {
      throw new Error('Cannot format invalid date');
    }
    return datetime(date).format(displayFormat);
  }

  addCalendarYears(date: Date, years: number): Date {
    return datetime(date).add(years, DateTimeUnit.Year).toDate();
  }

  addCalendarMonths(date: Date, months: number): Date {
    return datetime(date).add(months, DateTimeUnit.Month).toDate();
  }

  addCalendarDays(date: Date, days: number): Date {
    return datetime(date).add(days, DateTimeUnit.Day).toDate();
  }

  toIso8601(date: Date): string {
    return datetime(date).toISOString();
  }

  isDateInstance(obj: any): boolean {
    return obj instanceof Date;
  }

  isValid(date: Date): boolean {
    return datetime(date).isValid();
  }

  invalid(): Date {
    return datetime(null).toDate();
  }
}
