function getNthDayOf(n, day, month, year) {
  const firstOfMonth = new Date(Date.parse(`${month}/1/${year} GMT`));

  let dayOffset = (firstOfMonth.getUTCDay() - day);
  if(dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }
  const initialDay = firstOfMonth.getUTCDate() + dayOffset;

  const finalDay = initialDay + (7 * (n - 1));
  return new Date(Date.parse(`${month}/${finalDay}/${year} GMT`));
}

function getLastDayOf(day, month, year) {
  const firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  const daysInMonth = (new Date(year, month, 0)).getUTCDate() - 7;

  let lastOfDay = firstOfDay;
  while(lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse(`${month}/${lastOfDay}/${year} GMT`));
}

function allFederalHolidaysForYear(year = (new Date().getFullYear()), shiftSaturdays = true, shiftSundays = true) {
  const holidays = [ ];

  //const firstDay = new Date(Date.parse(`1/1/${year} GMT`));

  // New Year's Day
  holidays.push({
    name: `New Year's Day`,
    date: new Date(Date.parse(`1/1/${year} GMT`))
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

  // Independence Day
  holidays.push({
    name: `Independence Day`,
    date: new Date(Date.parse(`7/4/${year} GMT`))
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
    date: new Date(Date.parse(`11/11/${year} GMT`))
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
    date: new Date(Date.parse(`12/25/${year} GMT`))
  });

  for(let holiday of holidays) {
    const dow = holiday.date.getUTCDay();

    if(dow == 0) {
      if (shiftSundays) {
        // Actual holiday falls on Sunday.  Shift
        // the observed date forward to Monday.
        holiday.date = new Date(Date.UTC(holiday.date.getUTCFullYear(), holiday.date.getUTCMonth(), holiday.date.getUTCDate() + 1));
      }
    } else if(dow == 6) {
      if (shiftSaturdays) {
        // Actual holiday falls on Saturday.  Shift
        // the observed date backward to Friday.
        holiday.date = new Date(Date.UTC(holiday.date.getUTCFullYear(), holiday.date.getUTCMonth(), holiday.date.getUTCDate() - 1));
      }
    }

    holiday.dateString = `${holiday.date.getUTCFullYear()}-${holiday.date.getUTCMonth() + 1}-${holiday.date.getUTCDate()}`;
  }

  return holidays;
}

function isAHolidayBase(year, month, day, shiftSaturdays = true, shiftSundays = true) {
  let isHoliday = false;

  const allForCurrentYear = allFederalHolidaysForYear(year, shiftSaturdays, shiftSundays);
  const allForNextYear = allFederalHolidaysForYear(year + 1, shiftSaturdays, shiftSundays);
  const allForYear = allForCurrentYear.concat(allForNextYear[0]);

  for(let holiday of allForYear) {
    if(holiday.date.getUTCMonth() == month && holiday.date.getUTCDate() == day) {
      isHoliday = true;
      break;
    }
    if(holiday.date.getUTCMonth() > month) {
      break;
    }
  }
  return isHoliday;
}

function isAHoliday(date = new Date(), shiftSaturdays = true, shiftSundays = true) {
  let year = date.getFullYear();
  let month = date.getMonth();
  let day = date.getDate();
  return isAHolidayBase(year, month, day, shiftSaturdays, shiftSundays); 
}

function isAHolidayUTC(date = new Date(), shiftSaturdays = true, shiftSundays = true) {
  let year = date.getUTCFullYear();
  let month = date.getUTCMonth();
  let day = date.getUTCDate();
  return isAHolidayBase(year, month, day, shiftSaturdays, shiftSundays); 
}

module.exports = {
  isAHoliday: isAHoliday,
  isAHolidayUTC: isAHolidayUTC,
  allForYear: allFederalHolidaysForYear
};
