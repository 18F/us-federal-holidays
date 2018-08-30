let fedHolidays = require('../src/index.js');
let federalReserveHolidays = require('../test/data/federal_reserve_holidays');

describe('fedHolidays', () => {
  beforeEach(async () => {
  });
  describe('isAHoliday and isAHolidayUTC', () => {
    describe('federal reserve holidays', () => {
      it('should match all dates from json file', () => {
        for (let i = 0; i < federalReserveHolidays.length; i++) {
          let dateJSON = federalReserveHolidays[i];
          let calendarDay = new Date(dateJSON.calendar_day + ' 00:00:00');
          let calendarDayUTC = new Date(dateJSON.calendar_day + ' 00:00:00 UTC');
          let isHoliday = dateJSON.is_holiday == true; // type cast to boolean
          let result = fedHolidays.isAHoliday(calendarDay, true);
          let resultUTC = fedHolidays.isAHolidayUTC(calendarDayUTC, true);
          console.assert(
            result == isHoliday,
            isHoliday,
            calendarDay,
            fedHolidays.allForYear(calendarDay.getFullYear(),true),
            fedHolidays.allForYear(calendarDay.getFullYear() + 1,true)[0]
          );
          console.assert(resultUTC == isHoliday, calendarDay);
        }
      });
    });
    describe('federal bank holidays', () => {
      describe('observing Saturday on previous Friday', () => {
        it('should return true for the day before Independence Day, Friday 2020-07-03', async () => {
          let date_s = '2020-07-03';
          let date = new Date(`${date_s} 00:00:00`);
          let dateUTC = new Date(`${date_s} 00:00:00 UTC`);
          let result = fedHolidays.isAHoliday(date);
          result.should.be.true();
          let resultUTC = fedHolidays.isAHolidayUTC(dateUTC);
          resultUTC.should.be.true();
        });
        it('should return false for Independence Day, Saturday 2020-07-04', async () => {
          let date_s = '2020-07-04';
          let date = new Date(`${date_s} 00:00:00`);
          let dateUTC = new Date(`${date_s} 00:00:00 UTC`);
          let result = fedHolidays.isAHoliday(date);
          result.should.be.false();
          let resultUTC = fedHolidays.isAHolidayUTC(dateUTC);
          resultUTC.should.be.false();
        });
        it('should return true for the day before New Years Day, Friday 2021-12-31', async () => {
          let date_s = '2021-12-31';
          let date = new Date(`${date_s} 00:00:00`);
          let dateUTC = new Date(`${date_s} 00:00:00 UTC`);
          let result = fedHolidays.isAHoliday(date);
          result.should.be.true();
          let resultUTC = fedHolidays.isAHolidayUTC(dateUTC);
          resultUTC.should.be.true();
        });
        it('should return false for New Years Day, Saturday 2022-01-01', async () => {
          let date_s = '2022-01-01';
          let date = new Date(`${date_s} 00:00:00`);
          let dateUTC = new Date(`${date_s} 00:00:00 UTC`);
          let result = fedHolidays.isAHoliday(date);
          result.should.be.false();
          let resultUTC = fedHolidays.isAHolidayUTC(dateUTC);
          resultUTC.should.be.false();
        });
      });
    });
  });
});
