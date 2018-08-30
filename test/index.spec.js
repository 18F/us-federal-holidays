let fedHolidays = require('../src/index.js');
let federalReserveHolidays = require('../test/data/federal_reserve_holidays');

describe('fedHolidays', () => {
  beforeEach(async () => {
  });
  describe('federal reserve holidays', () => {
    it('should match all dates from json file', () => {
       for (let i = 0; i < federalReserveHolidays.length; i++) {
         let dateJSON = federalReserveHolidays[i];
         let calendarDay = new Date(dateJSON.calendar_day + ' 00:00:00');
         let calendarDayUTC = new Date(dateJSON.calendar_day + ' 00:00:00 UTC');
         let isHoliday = dateJSON.is_holiday == true; // type cast to boolean
         let result = fedHolidays.isAHoliday(calendarDay, true);
         let resultUTC = fedHolidays.isAHolidayUTC(calendarDayUTC, true);
         result.should.eql(isHoliday);
         resultUTC.should.eql(isHoliday);
       }
    });
  });
  describe('federal bank holidays', () => {
    it('should return false', async () => {
    });
  });
});
