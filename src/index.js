const T0_GMT = 'T00:00:00Z';

function zeroPad(n) {
  const pad = n < 10 ? '0' : '';

  return pad + n;
}

function getNthDayOf(n, day, month, year) {
  const firstOfMonth = new Date(Date.parse(`${year}-${zeroPad(month)}-01${T0_GMT}`));

  let dayOffset = firstOfMonth.getUTCDay() - day;
  if (dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }
  const initialDay = firstOfMonth.getUTCDate() + dayOffset;

  const finalDay = initialDay + 7 * (n - 1);
  return new Date(Date.parse(`${year}-${zeroPad(month)}-${zeroPad(finalDay)}${T0_GMT}`));
}

function getLastDayOf(day, month, year) {
  const firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  const daysInMonth = new Date(year, month, 0).getUTCDate() - 7;

  let lastOfDay = firstOfDay;
  while (lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse(`${year}-${zeroPad(month)}-${zeroPad(lastOfDay)}${T0_GMT}`));
}

function allFederalHolidaysForYear(
  year = new Date().getFullYear(),
  { shiftSaturdayHolidays = true, shiftSundayHolidays = true } = {}
) {
  const holidays = [];

  // New Year's Day
  holidays.push({
    name: `New Year's Day`,
    date: new Date(Date.parse(`${year}-01-01${T0_GMT}`))
  });

  // Birthday of Martin Luther King, Jr.
  // Third Monday of January; fun fact: actual birthday is January 15
  holidays.push({
    name: `Birthday of Martin Luther King, Jr.`,
    date: getNthDayOf(3, 1, 1, year)
  });

  // Washington's Birthday
  // Third Monday of February; fun fact: actual birthday is February 22
  // Fun fact 2: officially "Washington's Birthday," not "President's Day"
  holidays.push({
    name: `Washington's Birthday`,
    date: getNthDayOf(3, 1, 2, year)
  });

  // Memorial Day
  // Last Monday of May
  holidays.push({
    name: `Memorial Day`,
    date: getLastDayOf(1, 5, year)
  });

  // Juneteenth
  holidays.push({
    name: `Juneteenth`,
    date: new Date(Date.parse(`${year}-06-19${T0_GMT}`))
  });
  
  // Independence Day
  holidays.push({
    name: `Independence Day`,
    date: new Date(Date.parse(`${year}-07-04${T0_GMT}`))
  });

  // Labor Day
  // First Monday in September
  holidays.push({
    name: `Labor Day`,
    date: getNthDayOf(1, 1, 9, year)
  });

  // Columbus Day
  // Second Monday in October
  holidays.push({
    name: `Columbus Day`,
    date: getNthDayOf(2, 1, 10, year)
  });

  // Veterans Day
  holidays.push({
    name: `Veterans Day`,
    date: new Date(Date.parse(`${year}-11-11${T0_GMT}`))
  });

  // Thanksgiving Day
  // Fourth Thursday of November
  holidays.push({
    name: `Thanksgiving Day`,
    date: getNthDayOf(4, 4, 11, year)
  });

  // Christmas Day
  holidays.push({
    name: `Christmas Day`,
    date: new Date(Date.parse(`${year}-12-25${T0_GMT}`))
  });

  if (shiftSaturdayHolidays || shiftSundayHolidays) {
    holidays.forEach(holiday => {
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
    });
  }

  holidays.forEach(holiday => {
    holiday.dateString = `${holiday.date.getUTCFullYear()}-${holiday.date.getUTCMonth() +
      1}-${holiday.date.getUTCDate()}`;
  });

  return holidays;
}

function isAHoliday(
  date = new Date(),
  { shiftSaturdayHolidays = true, shiftSundayHolidays = true, utc = false } = {}
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

function getOneYearFromNow() {
  const future = new Date();
  future.setUTCFullYear(new Date().getUTCFullYear() + 1);
  return future;
}

function federalHolidaysInRange(
  startDate = new Date(),
  endDate = getOneYearFromNow(),
  options
) {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const candidates = [];
  for (let year = startYear; year <= endYear; year += 1) {
    candidates.push(...allFederalHolidaysForYear(year, options));
  }
  return candidates.filter(h => h.date >= startDate && h.date <= endDate);
}

module.exports = {
  isAHoliday,
  allForYear: allFederalHolidaysForYear,
  inRange: federalHolidaysInRange
};
