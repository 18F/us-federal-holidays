function getDay(date) {
  return new Date(Date.parse(`${date} GMT`));
}

function getNthDayOf(n, day, month, year) {
  const firstOfMonth = new Date(Date.parse(`${month}/1/${year} GMT`));

  let dayOffset = firstOfMonth.getUTCDay() - day;
  if (dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }
  const initialDay = firstOfMonth.getUTCDate() + dayOffset;

  const finalDay = initialDay + 7 * (n - 1);
  return new Date(Date.parse(`${month}/${finalDay}/${year} GMT`));
}

function getLastDayOf(day, month, year) {
  const firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  const daysInMonth = new Date(year, month, 0).getUTCDate() - 7;

  let lastOfDay = firstOfDay;
  while (lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse(`${month}/${lastOfDay}/${year} GMT`));
}

function createHolidayElementWithRange({
  start,
  end, 
  year,
  name,
  date
}) {
  const isInRange = !!year || date >= start && date <= end;
  
  if (isInRange) {
    return {
      name,
      date
    };
  }

  return '';
}

function holidaysInYear({
  start,
  end,
  year
}) {
  const holidays = [];

  let scrutinizedYear = year;
  if (year) {
    scrutinizedYear = year;
  } else {
    scrutinizedYear = start.getUTCFullYear()
  }

  // New Year's Day
  holidays.push(createHolidayElementWithRange({
    name: `New Year's Day`,
    date: getDay(`1/1/${scrutinizedYear}`),
    start,
    end,
    year
  }));

  // Birthday of Martin Luther King, Jr.
  // Third Monday of January; fun fact: actual birthday is January 15
  holidays.push(createHolidayElementWithRange({
    name: `Birthday of Martin Luther King, Jr.`,
    date: getNthDayOf(3, 1, 1, scrutinizedYear),
    start,
    end,
    year
  }));

  // Washington's Birthday
  // Third Monday of February; fun fact: actual birthday is February 22
  // Fun fact 2: officially "Washington's Birthday," not "President's Day"
  holidays.push(createHolidayElementWithRange({
    name: `Washington's Birthday`,
    date: getNthDayOf(3, 1, 2, scrutinizedYear),
    start,
    end,
    year
  }));

  // Memorial Day
  // Last Monday of May
  holidays.push(createHolidayElementWithRange({
    name: `Memorial Day`,
    date: getLastDayOf(1, 5, scrutinizedYear),
    start,
    end,
    year
  }));

  // Independence Day
  holidays.push(createHolidayElementWithRange({
    name: `Independence Day`,
    date: getDay(`7/4/${scrutinizedYear}`),
    start,
    end,
    year
  }));

  // Labor Day
  // First Monday in September
  holidays.push(createHolidayElementWithRange({
    name: `Labor Day`,
    date: getNthDayOf(1, 1, 9, scrutinizedYear),
    start,
    end,
    year
  }));

  // Columbus Day
  // Second Monday in October
  holidays.push(createHolidayElementWithRange({
    name: `Columbus Day`,
    date: getNthDayOf(2, 1, 10, scrutinizedYear),
    start,
    end,
    year
  }));

  // Veterans Day
  holidays.push(createHolidayElementWithRange({
    name: `Veterans Day`,
    date: getDay(`11/11/${scrutinizedYear}`),
    start,
    end,
    year
  }));

  // Thanksgiving Day
  // Fourth Thursday of November
  holidays.push(createHolidayElementWithRange({
    name: `Thanksgiving Day`,
    date: getNthDayOf(4, 4, 11, scrutinizedYear),
    start,
    end,
    year
  }));

  // Christmas Day
  holidays.push(createHolidayElementWithRange({
    name: `Christmas Day`,
    date: getDay(`12/25/${scrutinizedYear} GMT`),
    start,
    end,
    year
  }));

  return holidays.filter(Boolean);
}

function shiftHolidays({
  holidays,
  shiftSaturdayHolidays,
  shiftSundayHolidays
}) {
    holidays.forEach(holiday => {
      if (shiftSaturdayHolidays || shiftSundayHolidays) {
        // Allow the holiday objects to be modified inside this loop:
        /* eslint-disable no-param-reassign */

        const dow = holiday.date.getUTCDay();

        if (dow === 0 && shiftSundayHolidays) {
          // Actual holiday falls on Sunday. Shift the observed date forward to
          // Monday.
          holiday.date = new Date(
            Date.UTC(
              holiday.date.getUTCFullYear(),
              holiday.date.getUTCMonth(),
              holiday.date.getUTCDate() + 1
            )
          );
        } else if (dow === 6 && shiftSaturdayHolidays) {
          // Actual holiday falls on Saturday. Shift the observed date backward
          // to Friday.
          holiday.date = new Date(
            Date.UTC(
              holiday.date.getUTCFullYear(),
              holiday.date.getUTCMonth(),
              holiday.date.getUTCDate() - 1
            )
          );
        }
      }
      holiday.dateString = `${holiday.date.getUTCFullYear()}-${holiday.date.getUTCMonth() +
      1}-${holiday.date.getUTCDate()}`;
    });

  return holidays;
}

function allFederalHolidaysForYear(
  year = new Date().getFullYear(),
  {
    shiftSaturdayHolidays = true,
    shiftSundayHolidays = true
  } = {}
) {
  const holidays = holidaysInYear({ year });

  return shiftHolidays({ holidays, shiftSaturdayHolidays, shiftSundayHolidays });
}

function isAHoliday(
  date = new Date(),
  {
    shiftSaturdayHolidays = true,
    shiftSundayHolidays = true,
    utc = false
  } = {}
) {
  const year = utc ? date.getUTCFullYear() : date.getFullYear();
  const shift = { shiftSaturdayHolidays, shiftSundayHolidays };

  // Get the holidays this year, plus check if New Year's Day of next year is
  // observed on December 31 and if so, add it to this year's list.
  const allForYear = allFederalHolidaysForYear(year, shift);
  const nextYear = allFederalHolidaysForYear(year + 1, shift);
  if (nextYear[0].date.getUTCFullYear() === year) {
    allForYear.push(nextYear[0]);
  }

  const mm = utc ? date.getUTCMonth() : date.getMonth();
  const dd = utc ? date.getUTCDate() : date.getDate();

  // If any dates in this year's holiday list match the one passed in, then
  // the passed-in date is a holiday.  Otherwise, it is not.
  return allForYear.some(
    holiday =>
      holiday.date.getUTCMonth() === mm && holiday.date.getUTCDate() === dd
  );
}

function federalHolidaysInRange(
  {
    start = new Date(),
    end
  } = {},
  {
    shiftSaturdayHolidays = true,
    shiftSundayHolidays = true,
  } = {}
) {
  if (!end) {
    end = new Date()
    end.setUTCFullYear((new Date()).getUTCFullYear() + 1);
  }

  // console.log({ shiftSaturdayHolidays, shiftSundayHolidays });

  const yearDiff = end.getUTCFullYear() - start.getUTCFullYear();

  let holidays = [];
  for (let i = 0; i <= yearDiff; i++) {
    const intervalStart = i === 0 ? start : new Date(Date.parse(`1/1/${start.getUTCFullYear() + i} GMT`));
    const intervalEnd = i === yearDiff ? end : new Date(Date.parse(`12/31/${start.getUTCFullYear() + i} 23:59:59.999 GMT`))
    holidays = [
      ...holidays,
      ...holidaysInYear({ start: intervalStart, end: intervalEnd })
    ];
  }

  return shiftHolidays({ holidays, shiftSaturdayHolidays, shiftSundayHolidays });
}

module.exports = {
  isAHoliday,
  allForYear: allFederalHolidaysForYear,
  inRange: federalHolidaysInRange
};
