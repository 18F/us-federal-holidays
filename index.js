const dayjs = require("dayjs");
const utcPlugin = require("dayjs/plugin/utc");

dayjs.extend(utcPlugin);

const getDateFor = ({ day = 1, month, year }) =>
  dayjs(`${year}-${month}-${day}`, "YYYY-MM-DD");

const getNthDayOf = (n, day, month, year) => {
  let result = dayjs(getDateFor({ month, year })).day(day);

  // dayjs.day(x) can return a time in the past (relative to the date being
  // operated on), because it returns a time from within the operand date's
  // current week. E.g.:
  //
  // date = July 1, 2021 # Thursday
  // dayjs(date).day(0)  # Get Sunday
  // # returns June 27, 2021
  if (result.month() !== month - 1) {
    result = result.add(1, "week");
  }

  result = result.add(n - 1, "week");

  return result;
};

const getLastDayOf = (day, month, year) => {
  const daysInMonth = dayjs(getDateFor({ month, year })).daysInMonth();
  const lastDayOfMonth = dayjs(`${year}-${month}-${daysInMonth}`, "YYYY-MM-DD");

  let result = lastDayOfMonth.day(day);

  // See above comment for more details. TL;DR is dayjs.day(x) is not
  // constrained to the same month as the operand object.
  if (result.month() !== month - 1) {
    result = result.subtract(1, "week");
  }

  return result;
};

const allFederalHolidaysForYear = (
  year = new Date().getFullYear(),
  { shiftSaturdayHolidays = true, shiftSundayHolidays = true } = {}
) => {
  const holidays = [];

  // New Year's Day
  holidays.push({
    name: `New Year's Day`,
    date: getDateFor({ day: 1, month: 1, year })
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
    alsoObservedAs: "Presidents' Day",
    date: getNthDayOf(3, 1, 2, year)
  });

  // Memorial Day
  // Last Monday of May
  holidays.push({
    name: `Memorial Day`,
    date: getLastDayOf(1, 5, year)
  });

  if (year > 2020) {
    // Juneteenth
    holidays.push({
      name: `Juneteenth National Independence Day`,
      date: getDateFor({ day: 19, month: 6, year })
    });
  }

  // Independence Day
  holidays.push({
    name: `Independence Day`,
    date: getDateFor({ day: 4, month: 7, year })
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
    alsoObservedAs: "Indigenous Peoples' Day",
    date: getNthDayOf(2, 1, 10, year)
  });

  // Veterans Day
  holidays.push({
    name: `Veterans Day`,
    date: getDateFor({ day: 11, month: 11, year })
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
    date: getDateFor({ day: 25, month: 12, year })
  });

  return holidays.map(holiday => {
    let date = dayjs(holiday.date);

    if (date.day() === 0 && shiftSundayHolidays) {
      // Actual holiday falls on Sunday. Shift the observed date forward to
      // Monday.
      date = date.add(1, "day");
    }

    if (date.day() === 6 && shiftSaturdayHolidays) {
      // Actual holiday falls on Saturday. Shift the observed date backward
      // to Friday.
      date = date.subtract(1, "day");
    }

    return {
      name: holiday.name,
      alsoObservedAs: holiday.alsoObservedAs,
      date: date.toDate(),
      dateString: date.format("YYYY-MM-DD")
    };
  });
};

const isAHoliday = (
  date = new Date(),
  { shiftSaturdayHolidays = true, shiftSundayHolidays = true, utc = false } = {}
) => {
  const newDate = utc ? dayjs.utc(date) : dayjs(date);
  const year = newDate.year();

  const shift = { shiftSaturdayHolidays, shiftSundayHolidays };

  // Get the holidays this year, plus check if New Year's Day of next year is
  // observed on December 31 and if so, add it to this year's list.
  const allForYear = allFederalHolidaysForYear(year, shift);
  const nextYear = allFederalHolidaysForYear(year + 1, shift);
  allForYear.push(nextYear[0]);

  // If any dates in this year's holiday list match the one passed in, then
  // the passed-in date is a holiday.  Otherwise, it is not.
  return allForYear.some(
    holiday => holiday.dateString === newDate.format("YYYY-MM-DD")
  );
};

const getOneYearFromNow = () => {
  const future = new Date();
  future.setUTCFullYear(future.getUTCFullYear() + 1);
  return future;
};

const federalHolidaysInRange = (
  startDate = new Date(),
  endDate = getOneYearFromNow(),
  options = undefined
) => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const candidates = [];
  for (let year = startYear; year <= endYear; year += 1) {
    candidates.push(...allFederalHolidaysForYear(year, options));
  }
  return candidates.filter(h => h.date >= startDate && h.date <= endDate);
};

module.exports = {
  isAHoliday,
  allForYear: allFederalHolidaysForYear,
  inRange: federalHolidaysInRange
};
