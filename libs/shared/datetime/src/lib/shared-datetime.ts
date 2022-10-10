import 'dayjs/locale/de';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';

import * as dayjs from 'dayjs';
import * as advancedFormat from 'dayjs/plugin/advancedFormat';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as localeData from 'dayjs/plugin/localeData';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as weekday from 'dayjs/plugin/weekday';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(advancedFormat);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(weekday);

export enum DateTimeFormat {
  Short = 'DD.MM.YYYY',
  Long = 'dddd DD.MMMM YYYY',
  Server = 'YYYY-MM-DD',
  TimeZone = 'YYYY-MM-DDTHH:mm:ss.SSS',
  ComparisonFormat = 'DD MMM YYYY HH:mm:ss',
}

export enum DateTimeUnit {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  Hour = 'hour',
  Minute = 'minute',
  Second = 'second',
  Millisecond = 'millisecond',
}

export enum DateTimeInclusionType {
  Inclusive = '[]',
  Exclusive = '()',
  IncludeStartOnly = '[)',
  IncludeEndOnly = '(]',
}

export function datetime(
  date?: string | number | Date,
  format?: string
): DateTime {
  return new DateTime(date, format);
}

export function datetimeUTC(
  date?: string | number | Date,
  format?: string
): DateTime {
  return new DateTime(date, format, true);
}

export function firstDayOfWeek(): number {
  return dayjs.localeData().firstDayOfWeek();
}

export function longMonths(): string[] {
  return dayjs.localeData().months();
}

export function shortMonths(): string[] {
  return dayjs.localeData().monthsShort();
}

export function longDaysOfWeek(): string[] {
  return [...Array(7).keys()].map((i) => dayjs().day(i).format('dddd'));
}

export function shortDaysOfWeek(): string[] {
  return dayjs.localeData().weekdaysShort();
}

export function narrowDaysOfWeek(): string[] {
  return dayjs.localeData().weekdaysMin();
}

export function dateTimeLocale(
  preset?: string | ILocale,
  object?: Partial<ILocale>,
  isLocal?: boolean
): string {
  return dayjs.locale(preset, object, isLocal);
}

export function avoidWeekend(date: DateTime, isAfter: boolean): DateTime {
  switch (date.day()) {
    case 6:
      if (isAfter) {
        return date.add(2, DateTimeUnit.Day);
      } else {
        return date.subtract(1, DateTimeUnit.Day);
      }
    case 0:
      if (isAfter) {
        return date.add(1, DateTimeUnit.Day);
      } else {
        return date.subtract(2, DateTimeUnit.Day);
      }
    default:
      return date;
  }
}

export type { DateTime };

class DateTime {
  private dateTime: dayjs.Dayjs;

  constructor(
    date?: string | number | Date | dayjs.Dayjs,
    format?: string,
    isUTC = false
  ) {
    if (isUTC) {
      this.dateTime = dayjs.utc(date, format);
    } else {
      this.dateTime = dayjs(date, format);
    }
  }

  format(template?: string): string {
    return this.dateTime.format(template);
  }

  valueOf(): number {
    return this.dateTime.valueOf();
  }

  add(value: number, unit: DateTimeUnit): DateTime {
    return new DateTime(this.dateTime.add(value, unit));
  }

  subtract(value: number, unit: DateTimeUnit): DateTime {
    return new DateTime(this.dateTime.subtract(value, unit));
  }

  set(unit: DateTimeUnit, value: number): DateTime {
    return new DateTime(this.dateTime.set(unit as dayjs.UnitType, value));
  }

  nextBusinessDay(): DateTime {
    switch (this.day()) {
      case 5:
        return this.add(3, DateTimeUnit.Day);
      case 6:
        return this.add(2, DateTimeUnit.Day);
      default:
        return this.add(1, DateTimeUnit.Day);
    }
  }

  nextWeekday(isAfter: boolean): DateTime {
    switch (this.day()) {
      case 6:
        if (isAfter) {
          return this.add(2, DateTimeUnit.Day);
        } else {
          return this.subtract(1, DateTimeUnit.Day);
        }
      case 0:
        if (isAfter) {
          return this.add(1, DateTimeUnit.Day);
        } else {
          return this.subtract(2, DateTimeUnit.Day);
        }
      default:
        return this;
    }
  }

  atMonthEnd(isAfter: boolean): DateTime {
    return this.endOf(DateTimeUnit.Month).nextWeekday(isAfter);
  }

  isValid(): boolean {
    return this.dateTime.isValid();
  }

  diff(
    date: string | number | Date | DateTime,
    unit: DateTimeUnit = DateTimeUnit.Millisecond
  ): number {
    return this.dateTime.diff(
      date instanceof DateTime ? date.dateTime : date,
      unit
    );
  }

  isAfter(
    date: string | number | Date | DateTime,
    unit?: DateTimeUnit
  ): boolean {
    return this.dateTime.isAfter(
      date instanceof DateTime ? date.dateTime : date,
      unit
    );
  }

  isBefore(
    date: string | number | Date | DateTime,
    unit?: DateTimeUnit
  ): boolean {
    return this.dateTime.isBefore(
      date instanceof DateTime ? date.dateTime : date,
      unit
    );
  }

  isBetween(
    date1: string | number | Date | DateTime,
    date2: string | number | Date | DateTime,
    unit?: DateTimeUnit,
    inclusionType?: DateTimeInclusionType
  ) {
    return this.dateTime.isBetween(
      date1 instanceof DateTime ? date1.dateTime : date1,
      date2 instanceof DateTime ? date2.dateTime : date2,
      unit,
      inclusionType
    );
  }

  startOf(unit: DateTimeUnit): DateTime {
    return new DateTime(this.dateTime.startOf(unit));
  }

  endOf(unit: DateTimeUnit): DateTime {
    return new DateTime(this.dateTime.endOf(unit));
  }

  year(): number;
  year(year: number): DateTime;
  year(year?: number): number | DateTime {
    if (year === undefined) {
      return this.dateTime.year();
    } else {
      return new DateTime(this.dateTime.year(year));
    }
  }

  month(): number;
  month(month: number): DateTime;
  month(month?: number): number | DateTime {
    if (month === undefined) {
      return this.dateTime.month();
    } else {
      return new DateTime(this.dateTime.month(month));
    }
  }

  date(): number;
  date(date: number): DateTime;
  date(date?: number): number | DateTime {
    if (date === undefined) {
      return this.dateTime.date();
    } else {
      return new DateTime(this.dateTime.date(date));
    }
  }

  toLocal(): DateTime {
    return new DateTime(this.dateTime.local());
  }

  toUtc(): DateTime {
    return new DateTime(this.dateTime.tz('UTC'));
  }

  weekday(value: number): DateTime {
    return new DateTime(this.dateTime.weekday(value));
  }

  hour(): number;
  hour(hour: number): DateTime;
  hour(hour?: number): number | DateTime {
    if (hour === undefined) {
      return this.dateTime.hour();
    } else {
      return new DateTime(this.dateTime.hour(hour));
    }
  }

  day(): number {
    return this.dateTime.day();
  }

  daysInMonth(): number {
    return this.dateTime.daysInMonth();
  }

  clone(): DateTime {
    return new DateTime(this.dateTime.clone());
  }

  toDate(): Date {
    return this.dateTime.toDate();
  }

  toISOString(): string {
    return this.dateTime.toISOString();
  }
}
