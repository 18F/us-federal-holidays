const tap = require('tap');

const federalHolidays = require('./src/index');

const getDate = dateString => new Date(`${dateString} 00:00:00`);

const getDateUTC = dateString => new Date(`${dateString}T00:00:00Z`);

tap.test('handles standard federal holidays', async tests => {
  tests.test(
    'gets observed holidays, accounting for actual holidays on weekends',
    async test => {
      [
        '2010-12-31', // New Year's Day falls on a Saturday, observed before
        '2012-01-02', // New Year's Day falls on a Sunday, observed after
        '2014-01-01',
        '2014-01-20',
        '2014-02-17',
        '2014-05-26',
        '2014-07-04',
        '2014-09-01',
        '2014-10-13',
        '2014-11-11',
        '2014-11-27',
        '2014-12-25',
        '2015-07-03', // Independence Day falls on a Saturday, observed before
        '2016-12-26', // Christmas Day falls on a Sunday, observed after
        '2017-12-25'
      ].forEach(dateString => {
        const date = getDate(dateString);
        const utcDate = getDateUTC(dateString);

        test.ok(
          federalHolidays.isAHoliday(date),
          `${dateString} is a holiday (observed)`
        );

        test.ok(
          federalHolidays.isAHoliday(utcDate, { utc: true }),
          `${dateString} UTC is a holiday (observed)`
        );
      });
    }
  );

  tests.test(
    'actual holidays on weekends are not listed as observed holidays',
    async test => {
      [
        '2011-01-01', // New Year's Day falls on a Saturday, so is not a holiday
        '2012-01-01', // New Year's Day falls on a Sunday, so is not a holiday
        '2015-07-04', // Independence Day falls on a Saturday, so is not a holiday
        '2016-12-25' // Christmas Day falls on a Sunday, so is not a holiday
      ].forEach(dateString => {
        const date = getDate(dateString);
        const utcDate = getDateUTC(dateString);

        test.notOk(
          federalHolidays.isAHoliday(date),
          `${dateString} is not a holiday (observed)`
        );

        test.notOk(
          federalHolidays.isAHoliday(utcDate, { utc: true }),
          `${dateString} UTC is not a holiday (observed)`
        );
      });
    }
  );

  tests.test(
    'honors requests not to shift holidays on weekends',
    async test => {
      test.ok(
        federalHolidays.isAHoliday(getDate('2011-01-01'), {
          shiftSaturdayHolidays: false
        }),
        `2011-01-01 is a holiday if Sundays are not shifted`
      );
      test.ok(
        federalHolidays.isAHoliday(getDate('2012-01-01'), {
          shiftSundayHolidays: false
        }),
        `2012-01-01 is a holiday if Sundays are not shifted`
      );
      test.ok(
        federalHolidays.isAHoliday(getDate('2015-07-04'), {
          shiftSaturdayHolidays: false
        }),
        `2015-07-04 is a holiday if Saturdays are not shifted`
      );
      test.ok(
        federalHolidays.isAHoliday(getDate('2016-12-25'), {
          shiftSundayHolidays: false
        }),
        `2016-12-25 is a holiday if Saturdays are not shifted`
      );
    }
  );

  tests.test(
    'handles federal holidays within a range (Saturday and Sunday holidays shifted)',
    async test => {
      const holidays = federalHolidays.inRange(
        new Date('2015-07-03'),
        new Date('2016-12-26')
      );
      holidays.forEach(holiday => {
        test.ok(
          federalHolidays.isAHoliday(getDate(holiday.dateString)),
          `${holiday.dateString} is a holiday (observed)`
        );
      });
    }
  );

  tests.test(
    'handles federal holidays within a range (Saturday shifted only)',
    async test => {
      const shiftSaturdayHolidays = true;
      const shiftSundayHolidays = false;
      const holidays = federalHolidays.inRange(
        new Date('2015-07-03'),
        new Date('2016-12-26'),
        { shiftSaturdayHolidays, shiftSundayHolidays }
      );
      holidays.forEach(holiday => {
        test.ok(
          federalHolidays.isAHoliday(getDate(holiday.dateString), {
            shiftSaturdayHolidays,
            shiftSundayHolidays
          }),
          `${holiday.dateString} is a holiday (observed)`
        );
      });
    }
  );

  tests.test(
    'handles federal holidays within a range (Sunday shifted only)',
    async test => {
      const shiftSaturdayHolidays = false;
      const shiftSundayHolidays = true;
      const holidays = federalHolidays.inRange(
        new Date('2015-07-03'),
        new Date('2016-12-26'),
        { shiftSaturdayHolidays, shiftSundayHolidays }
      );
      holidays.forEach(holiday => {
        test.ok(
          federalHolidays.isAHoliday(getDate(holiday.dateString), {
            shiftSaturdayHolidays,
            shiftSundayHolidays
          }),
          `${holiday.dateString} is a holiday (observed)`
        );
      });
    }
  );

  tests.test(
    'handles federal holidays within a range (none shifted)',
    async test => {
      const shiftSaturdayHolidays = false;
      const shiftSundayHolidays = false;
      const holidays = federalHolidays.inRange(
        new Date('2015-07-03'),
        new Date('2016-12-26'),
        { shiftSaturdayHolidays, shiftSundayHolidays }
      );
      holidays.forEach(holiday => {
        test.ok(
          federalHolidays.isAHoliday(getDate(holiday.dateString), {
            shiftSaturdayHolidays,
            shiftSundayHolidays
          }),
          `${holiday.dateString} is a holiday (observed)`
        );
      });
    }
  );
});
