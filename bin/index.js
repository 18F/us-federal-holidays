"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var T0_GMT = 'T00:00:00Z';

function zeroPad(n) {
  var pad = n < 10 ? '0' : '';
  return pad + n;
}

function getNthDayOf(n, day, month, year) {
  var firstOfMonth = new Date(Date.parse("".concat(year, "-").concat(zeroPad(month), "-01").concat(T0_GMT)));
  var dayOffset = firstOfMonth.getUTCDay() - day;

  if (dayOffset > 0) {
    dayOffset = 7 - dayOffset;
  } else {
    dayOffset = -dayOffset;
  }

  var initialDay = firstOfMonth.getUTCDate() + dayOffset;
  var finalDay = initialDay + 7 * (n - 1);
  return new Date(Date.parse("".concat(year, "-").concat(zeroPad(month), "-").concat(zeroPad(finalDay)).concat(T0_GMT)));
}

function getLastDayOf(day, month, year) {
  var firstOfDay = getNthDayOf(1, day, month, year).getUTCDate();
  var daysInMonth = new Date(year, month, 0).getUTCDate() - 7;
  var lastOfDay = firstOfDay;

  while (lastOfDay <= daysInMonth) {
    lastOfDay += 7;
  }

  return new Date(Date.parse("".concat(year, "-").concat(zeroPad(month), "-").concat(zeroPad(lastOfDay)).concat(T0_GMT)));
}

function allFederalHolidaysForYear() {
  var year = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date().getFullYear();

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$shiftSaturdayHol = _ref.shiftSaturdayHolidays,
      shiftSaturdayHolidays = _ref$shiftSaturdayHol === void 0 ? true : _ref$shiftSaturdayHol,
      _ref$shiftSundayHolid = _ref.shiftSundayHolidays,
      shiftSundayHolidays = _ref$shiftSundayHolid === void 0 ? true : _ref$shiftSundayHolid;

  var holidays = [];
  holidays.push({
    name: "New Year's Day",
    date: new Date(Date.parse("".concat(year, "-01-01").concat(T0_GMT)))
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
    name: "Juneteenth",
    date: new Date(Date.parse("".concat(year, "-06-19").concat(T0_GMT)))
  });
  holidays.push({
    name: "Independence Day",
    date: new Date(Date.parse("".concat(year, "-07-04").concat(T0_GMT)))
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
    date: new Date(Date.parse("".concat(year, "-11-11").concat(T0_GMT)))
  });
  holidays.push({
    name: "Thanksgiving Day",
    date: getNthDayOf(4, 4, 11, year)
  });
  holidays.push({
    name: "Christmas Day",
    date: new Date(Date.parse("".concat(year, "-12-25").concat(T0_GMT)))
  });

  if (shiftSaturdayHolidays || shiftSundayHolidays) {
    holidays.forEach(function (holiday) {
      var dow = holiday.date.getUTCDay();

      if (dow === 0 && shiftSundayHolidays) {
        holiday.date = new Date(Date.UTC(holiday.date.getUTCFullYear(), holiday.date.getUTCMonth(), holiday.date.getUTCDate() + 1));
      } else if (dow === 6 && shiftSaturdayHolidays) {
        holiday.date = new Date(Date.UTC(holiday.date.getUTCFullYear(), holiday.date.getUTCMonth(), holiday.date.getUTCDate() - 1));
      }
    });
  }

  holidays.forEach(function (holiday) {
    holiday.dateString = "".concat(holiday.date.getUTCFullYear(), "-").concat(holiday.date.getUTCMonth() + 1, "-").concat(holiday.date.getUTCDate());
  });
  return holidays;
}

function isAHoliday() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();

  var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref2$shiftSaturdayHo = _ref2.shiftSaturdayHolidays,
      shiftSaturdayHolidays = _ref2$shiftSaturdayHo === void 0 ? true : _ref2$shiftSaturdayHo,
      _ref2$shiftSundayHoli = _ref2.shiftSundayHolidays,
      shiftSundayHolidays = _ref2$shiftSundayHoli === void 0 ? true : _ref2$shiftSundayHoli,
      _ref2$utc = _ref2.utc,
      utc = _ref2$utc === void 0 ? false : _ref2$utc;

  var year = utc ? date.getUTCFullYear() : date.getFullYear();
  var shift = {
    shiftSaturdayHolidays: shiftSaturdayHolidays,
    shiftSundayHolidays: shiftSundayHolidays
  };
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
}

function getOneYearFromNow() {
  var future = new Date();
  future.setUTCFullYear(new Date().getUTCFullYear() + 1);
  return future;
}

function federalHolidaysInRange() {
  var startDate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  var endDate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getOneYearFromNow();
  var options = arguments.length > 2 ? arguments[2] : undefined;
  var startYear = startDate.getFullYear();
  var endYear = endDate.getFullYear();
  var candidates = [];

  for (var year = startYear; year <= endYear; year += 1) {
    candidates.push.apply(candidates, _toConsumableArray(allFederalHolidaysForYear(year, options)));
  }

  return candidates.filter(function (h) {
    return h.date >= startDate && h.date <= endDate;
  });
}

module.exports = {
  isAHoliday: isAHoliday,
  allForYear: allFederalHolidaysForYear,
  inRange: federalHolidaysInRange
};