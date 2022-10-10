import {
  datetime,
  DateTimeInclusionType,
  dateTimeLocale,
  DateTimeUnit,
  firstDayOfWeek,
  longDaysOfWeek,
  longMonths,
  narrowDaysOfWeek,
  shortDaysOfWeek,
  shortMonths,
} from './shared-datetime';

describe('DateTimeUtil', () => {
  it('should return the first day of the week', () => {
    expect(firstDayOfWeek()).toBe(0);
  });

  it('should return the names of the months long', () => {
    const months = longMonths();
    expect(months.length).toBe(12);
    expect(months[0]).toBe('January');
  });

  it('should return the names of the months short', () => {
    const months = shortMonths();
    expect(months.length).toBe(12);
    expect(months[0]).toBe('Jan');
  });

  it('should return the names of the week long', () => {
    const days = longDaysOfWeek();
    expect(days.length).toBe(7);
    expect(days[0]).toBe('Sunday');
  });

  it('should return the names of the week short', () => {
    const days = shortDaysOfWeek();
    expect(days.length).toBe(7);
    expect(days[0]).toBe('Sun');
  });

  it('should return the names of the week narrow', () => {
    const days = narrowDaysOfWeek();
    expect(days.length).toBe(7);
    expect(days[0]).toBe('Su');
  });

  it('should change the language when changing the locale', () => {
    dateTimeLocale('de');
    expect(longMonths()[0]).toBe('Januar');
    dateTimeLocale('en');
    expect(longMonths()[0]).toBe('January');
  });

  it('should format', () => {
    const date = datetime('2020-11-22').format();
    expect(date).not.toBe(null);
  });

  it('should format with special formats', () => {
    const date = datetime('2020-11-22');
    const swissFormat = date.format('DD.MM.YYYY');
    const germanFormat = date.format('DD-MM-YYYY');

    expect(swissFormat).toBe('22.11.2020');
    expect(germanFormat).toBe('22-11-2020');
  });

  it('should return the number of milliseconds of a date', () => {
    const date = new Date('2020-11-22');
    expect(datetime(date).valueOf()).toBe(date.valueOf());
  });

  it('should add a number of units to the date', () => {
    const date = datetime('2020-11-22');
    expect(date.add(5, DateTimeUnit.Day)).toStrictEqual(datetime('2020-11-27'));
    expect(date.add(2, DateTimeUnit.Year)).toStrictEqual(
      datetime('2022-11-22')
    );
  });

  it('should subtract a number of units from the date', () => {
    const date = datetime('2020-11-22');
    expect(date.subtract(5, DateTimeUnit.Day)).toStrictEqual(
      datetime('2020-11-17')
    );
    expect(date.subtract(2, DateTimeUnit.Year)).toStrictEqual(
      datetime('2018-11-22')
    );
  });

  it('should return the next business day', () => {
    const monday = datetime('2021-10-18');
    const tuesday = datetime('2021-10-19');
    const wednesday = datetime('2021-10-20');
    const thursday = datetime('2021-10-21');
    const friday = datetime('2021-10-22');
    const saturday = datetime('2021-10-23');
    const sunday = datetime('2021-10-24');
    const monday2 = datetime('2021-10-25');

    expect(monday.nextBusinessDay()).toStrictEqual(tuesday);
    expect(tuesday.nextBusinessDay()).toStrictEqual(wednesday);
    expect(wednesday.nextBusinessDay()).toStrictEqual(thursday);
    expect(thursday.nextBusinessDay()).toStrictEqual(friday);
    expect(friday.nextBusinessDay()).toStrictEqual(monday2);
    expect(saturday.nextBusinessDay()).toStrictEqual(monday2);
    expect(sunday.nextBusinessDay()).toStrictEqual(monday2);
  });

  it('should return true when datetime is a valid date or undefined, and false when datetime is null', () => {
    expect(datetime(new Date()).isValid()).toBeTruthy();
    expect(datetime(undefined).isValid()).toBeTruthy();
    expect(datetime(null).isValid()).toBeFalsy();
  });

  it('should know which date is after', () => {
    const before = datetime('2020-11-22');
    const after = datetime('2020-12-22');

    expect(after.isAfter(before)).toBeTruthy();
    expect(before.isAfter(after)).toBeFalsy();

    expect(after.isAfter(before, DateTimeUnit.Month)).toBeTruthy();
    expect(after.isAfter(before, DateTimeUnit.Year)).toBeFalsy();
  });

  it('should know which date is before', () => {
    const before = datetime('2020-11-22');
    const after = datetime('2020-12-22');

    expect(before.isBefore(after)).toBeTruthy();
    expect(after.isBefore(before)).toBeFalsy();

    expect(before.isBefore(after, DateTimeUnit.Month)).toBeTruthy();
    expect(before.isBefore(after, DateTimeUnit.Year)).toBeFalsy();
  });

  it('should know if a date is between two dates', () => {
    const before = datetime('2020-05-01');
    const between = datetime('2020-11-22');
    const after = datetime('2021-01-01');

    expect(before.isBetween(between, after)).toBeFalsy();
    expect(between.isBetween(before, after)).toBeTruthy();
    expect(after.isBetween(before, between)).toBeFalsy();

    expect(between.isBetween(before, after, DateTimeUnit.Year)).toBeFalsy();
    expect(between.isBetween(before, after, DateTimeUnit.Month)).toBeTruthy();

    expect(
      between.isBetween(between, after, null, DateTimeInclusionType.Inclusive)
    ).toBeTruthy();
    expect(
      after.isBetween(between, after, null, DateTimeInclusionType.Inclusive)
    ).toBeTruthy();

    expect(
      between.isBetween(between, after, null, DateTimeInclusionType.Exclusive)
    ).toBeFalsy();
    expect(
      after.isBetween(between, after, null, DateTimeInclusionType.Exclusive)
    ).toBeFalsy();

    expect(
      between.isBetween(
        between,
        after,
        null,
        DateTimeInclusionType.IncludeStartOnly
      )
    ).toBeTruthy();
    expect(
      after.isBetween(
        between,
        after,
        null,
        DateTimeInclusionType.IncludeStartOnly
      )
    ).toBeFalsy();

    expect(
      between.isBetween(
        between,
        after,
        null,
        DateTimeInclusionType.IncludeEndOnly
      )
    ).toBeFalsy();
    expect(
      after.isBetween(
        between,
        after,
        null,
        DateTimeInclusionType.IncludeEndOnly
      )
    ).toBeTruthy();
  });

  it('should return the start date of a unit', () => {
    const date = datetime('2020-11-22');
    expect(date.startOf(DateTimeUnit.Year)).toStrictEqual(
      datetime('2020-01-01')
    );
    expect(date.startOf(DateTimeUnit.Month)).toStrictEqual(
      datetime('2020-11-01')
    );
  });

  it('should return the end date of a unit', () => {
    const date = datetime('2020-11-22');
    expect(date.endOf(DateTimeUnit.Year)).toStrictEqual(
      datetime('2021-01-01').subtract(1, DateTimeUnit.Millisecond)
    );
    expect(date.endOf(DateTimeUnit.Month)).toStrictEqual(
      datetime('2020-12-01').subtract(1, DateTimeUnit.Millisecond)
    );
  });

  it('should return the year of the date', () => {
    expect(datetime('2020-11-22').year()).toBe(2020);
  });

  it('should set the year of the date', () => {
    const date = datetime('2020-11-22');
    expect(date.year(2021)).toStrictEqual(datetime('2021-11-22'));
  });

  it('should return the month of the date', () => {
    expect(datetime('2020-11-22').month()).toBe(10);
  });

  it('should set the month of the date', () => {
    const date = datetime('2020-11-22');
    expect(date.month(5)).toStrictEqual(datetime('2020-06-22'));
  });

  it('should return the day of the date', () => {
    expect(datetime('2020-11-22').date()).toBe(22);
  });

  it('should set the day of the date', () => {
    const date = datetime('2020-11-22');
    expect(date.date(7)).toStrictEqual(datetime('2020-11-07'));
  });

  it('should return the hour of the date', () => {
    const date = datetime('2020-11-22 20:00:00', 'YYYY-MM-DD HH:mm:ss');
    expect(date.hour()).toBe(20);
  });

  it('should set the hour of the date', () => {
    const evening = datetime('2020-11-22 20:00:00', 'YYYY-MM-DD HH:mm:ss');
    const noon = datetime('2020-11-22 12:00:00', 'YYYY-MM-DD HH:mm:ss');
    expect(evening.hour(12).valueOf()).toStrictEqual(noon.valueOf());
  });

  it('should know the weekday of a date', () => {
    const friday = datetime('2021-10-22');
    expect(friday.day()).toBe(5);
  });

  it('should know the number of days in a month', () => {
    expect(datetime('2019-02-22').daysInMonth()).toBe(28);
    expect(datetime('2020-02-22').daysInMonth()).toBe(29);
  });

  it('should convert back to date format', () => {
    const date = new Date();
    expect(datetime(date).toDate()).toStrictEqual(date);
  });

  it('should be able to convert a date to an ISO string', () => {
    const date = new Date('2020-11-22');
    expect(datetime(date).toISOString()).toBe(date.toISOString());
  });

  it('should return Sunday a week ago', () => {
    const date = new Date('2021-12-20');
    const expectedResult = new Date('2021-12-12');
    expect(datetime(date).weekday(-7)).toStrictEqual(datetime(expectedResult));
  });

  it('should return last Sunday', () => {
    const date = new Date('2021-12-20');
    const expectedResult = new Date('2021-12-19');
    expect(datetime(date).weekday(0)).toStrictEqual(datetime(expectedResult));
  });

  it('should return next Friday', () => {
    const date = new Date('2021-12-20');
    const expectedResult = new Date('2021-12-24');
    expect(datetime(date).weekday(5)).toStrictEqual(datetime(expectedResult));
  });

  it('should return last day in month', () => {
    const date = new Date('2022-05-13');
    expect(datetime(date).atMonthEnd(true).date()).toBe(31);
    expect(datetime(date).atMonthEnd(true).month()).toBe(4);
  });

  it('should return last workday in month', () => {
    const date = new Date('2022-07-13');
    expect(datetime(date).atMonthEnd(false).date()).toBe(29);
    expect(datetime(date).atMonthEnd(false).month()).toBe(6);
  });

  it('should return first workday in next month', () => {
    const date = new Date('2022-07-13');
    expect(datetime(date).atMonthEnd(true).date()).toBe(1);
    expect(datetime(date).atMonthEnd(true).month()).toBe(7);
  });

  it('should not change the date', () => {
    const date = new Date('2022-05-13');
    const result = datetime(date).nextWeekday(true);
    expect(result.date()).toBe(13);
    expect(result.month()).toBe(4);
  });

  it('should return friday before weekend', () => {
    const date = new Date('2022-05-14');
    const result = datetime(date).nextWeekday(false);
    expect(result.date()).toBe(13);
    expect(result.month()).toBe(4);
  });

  it('should return monday after weekend', () => {
    const date = new Date('2022-05-14');
    const result = datetime(date).nextWeekday(true);
    expect(result.date()).toBe(16);
    expect(result.month()).toBe(4);
  });
});
