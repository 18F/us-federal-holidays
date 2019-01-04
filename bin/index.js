"use strict";

function getNthDayOf(n, day, month, year) {
  var firstOfMonth = new Date(Date.parse(month + "/1/" + year + " GMT"));

  var dayOffset = firstOfMonth.getUTCDay() - day;
  if (dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }
  var initialDay = firstOfMonth.getUTCDate() + dayOffset;

  var finalDay = initialDay + 7 * (n - 1);
  return new Date(Date.parse(month + "/" + finalDay + "/" + year + " GMT"));
}

function getLastDayOf(day, month, year) {
  var firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  var daysInMonth = new Date(year, month, 0).getUTCDate() - 7;

  var lastOfDay = firstOfDay;
  while (lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse(month + "/" + lastOfDay + "/" + year + " GMT"));
}

function allFederalHolidaysForYear() {
  var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date().getFullYear();

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$shiftSaturdayHol = _ref.shiftSaturdayHolidays,
      shiftSaturdayHolidays = _ref$shiftSaturdayHol === undefined ? true : _ref$shiftSaturdayHol,
      _ref$shiftSundayHolid = _ref.shiftSundayHolidays,
      shiftSundayHolidays = _ref$shiftSundayHolid === undefined ? true : _ref$shiftSundayHolid;

  var holidays = [];

  holidays.push({
    name: "New Year's Day",
    date: new Date(Date.parse("1/1/" + year + " GMT"))
  });

  holidays.push({
    name: "Birthday of Martin Luther King, Jr.",
    date: getNthDayOf(3, 1, 1, year)
  });

  holidays.push({
    name: "Washington's Birthday",
    date: getNthDayOf(3, 1, 2, year)
  });

  holidays.push({
    name: "Memorial Day",
    date: getLastDayOf(1, 5, year)
  });

  holidays.push({
    name: "Independence Day",
    date: new Date(Date.parse("7/4/" + year + " GMT"))
  });

  holidays.push({
    name: "Labor Day",
    date: getNthDayOf(1, 1, 9, year)
  });

  holidays.push({
    name: "Columbus Day",
    date: getNthDayOf(2, 1, 10, year)
  });

  holidays.push({
    name: "Veterans Day",
    date: new Date(Date.parse("11/11/" + year + " GMT"))
  });

  holidays.push({
    name: "Thanksgiving Day",
    date: getNthDayOf(4, 4, 11, year)
  });

  holidays.push({
    name: "Christmas Day",
    date: new Date(Date.parse("12/25/" + year + " GMT"))
  });

  if (shiftSaturdayHolidays || shiftSundayHolidays) {
    holidays.forEach(function (holiday) {

      var dow = holiday.date.getUTCDay();

      if (dow === 0 && shiftSundayHolidays) {
        holiday.date = new Date(Date.UTC(holiday.date.getUTCFullYear(), holiday.date.getUTCMonth(), holiday.date.getUTCDate() + 1));
      } else if (dow === 6 && shiftSaturdayHolidays) {
        holiday.date = new Date(Date.UTC(holiday.date.getUTCFullYear(), holiday.date.getUTCMonth(), holiday.date.getUTCDate() - 1));
      }

      holiday.dateString = holiday.date.getUTCFullYear() + "-" + (holiday.date.getUTCMonth() + 1) + "-" + holiday.date.getUTCDate();
    });
  }

  return holidays;
}

module.exports = {
  isAHoliday: function isAHoliday() {
    var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

    var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref2$shiftSaturdayHo = _ref2.shiftSaturdayHolidays,
        shiftSaturdayHolidays = _ref2$shiftSaturdayHo === undefined ? true : _ref2$shiftSaturdayHo,
        _ref2$shiftSundayHoli = _ref2.shiftSundayHolidays,
        shiftSundayHolidays = _ref2$shiftSundayHoli === undefined ? true : _ref2$shiftSundayHoli,
        _ref2$utc = _ref2.utc,
        utc = _ref2$utc === undefined ? false : _ref2$utc;

    var year = utc ? date.getUTCFullYear() : date.getFullYear();
    var shift = { shiftSaturdayHolidays: shiftSaturdayHolidays, shiftSundayHolidays: shiftSundayHolidays };

    var allForYear = allFederalHolidaysForYear(year, shift);
    var nextYear = allFederalHolidaysForYear(year + 1, shift);
    if (nextYear[0].date.getUTCFullYear() === year) {
      allForYear.push(nextYear[0]);
    }

    var mm = utc ? date.getUTCMonth() : date.getMonth();
    var dd = utc ? date.getUTCDate() : date.getDate();

    return allForYear.some(function (holiday) {
      return holiday.date.getUTCMonth() === mm && holiday.date.getUTCDate() === dd;
    });
  },

  allForYear: allFederalHolidaysForYear
};