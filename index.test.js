const tap = require("tap");

const federalHolidays = require("./index");

const getDate = dateString => new Date(`${dateString} 00:00:00`);

const getDateUTC = dateString => new Date(`${dateString}T00:00:00Z`);

tap.test("handles standard federal holidays", async tests => {
  tests.test(
    "gets observed holidays, accounting for actual holidays on weekends",
    async test => {
      [
        "2010-12-31", // New Year's Day falls on a Saturday, observed before
        "2012-01-02", // New Year's Day falls on a Sunday, observed after
        "2014-01-01",
        "2014-01-20",
        "2014-02-17",
        "2014-05-26",
        "2014-07-04",
        "2014-09-01",
        "2014-10-13",
        "2014-11-11",
        "2014-11-27",
        "2014-12-25",
        "2015-07-03", // Independence Day falls on a Saturday, observed before
        "2016-12-26", // Christmas Day falls on a Sunday, observed after
        "2017-12-25",
        "2021-05-31" // https://github.com/18F/us-federal-holidays/issues/28
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
    "actual holidays on weekends are not listed as observed holidays",
    async test => {
      [
        "2011-01-01", // New Year's Day falls on a Saturday, so is not a holiday
        "2012-01-01", // New Year's Day falls on a Sunday, so is not a holiday
        "2015-07-04", // Independence Day falls on a Saturday, so is not a holiday
        "2016-12-25", // Christmas Day falls on a Sunday, so is not a holiday
        "2021-05-24" // https://github.com/18F/us-federal-holidays/issues/28
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

  tests.test("Juneteenth is only included from 2021 onwards", async test => {
    test.notOk(
      federalHolidays.isAHoliday(getDate("2020-06-19")),
      "Juneteenth is not a holiday in 2020"
    );

    // In 2021, Juneteenth fell on a Saturday, so the observed holiday was the
    // 18th instead of the 19th.
    test.ok(
      federalHolidays.isAHoliday(getDate("2021-06-18")),
      "Juneteenth is a holiday in 2021"
    );

    // 2023 is the first year that the observation of Juneteenth falls on the
    // actual holiday.
    test.ok(
      federalHolidays.isAHoliday(getDate("2023-06-19")),
      "Juneteenth is a holiday in 2023"
    );

    test.notOk(
      federalHolidays
        .allForYear(2020)
        .some(({ name }) => name === "Juneteenth National Independence Day"),
      "Juneteenth is not included in the list of holidays for 2020"
    );

    test.ok(
      federalHolidays
        .allForYear(2021)
        .some(({ name }) => name === "Juneteenth National Independence Day"),
      "Juneteenth is included in the list of holidays for 2021"
    );
  });

  tests.test(
    "honors requests not to shift holidays on weekends",
    async test => {
      test.ok(
        federalHolidays.isAHoliday(getDate("2011-01-01"), {
          shiftSaturdayHolidays: false
        }),
        `2011-01-01 is a holiday if Sundays are not shifted`
      );
      test.ok(
        federalHolidays.isAHoliday(getDate("2012-01-01"), {
          shiftSundayHolidays: false
        }),
        `2012-01-01 is a holiday if Sundays are not shifted`
      );
      test.ok(
        federalHolidays.isAHoliday(getDate("2015-07-04"), {
          shiftSaturdayHolidays: false
        }),
        `2015-07-04 is a holiday if Saturdays are not shifted`
      );
      test.ok(
        federalHolidays.isAHoliday(getDate("2016-12-25"), {
          shiftSundayHolidays: false
        }),
        `2016-12-25 is a holiday if Saturdays are not shifted`
      );
    }
  );

  tests.test(
    "handles federal holidays within a range (Saturday and Sunday holidays shifted)",
    async test => {
      const holidays = federalHolidays.inRange(
        new Date("2015-07-03"),
        new Date("2016-12-26")
      );
      holidays.forEach(holiday => {
        test.ok(
          federalHolidays.isAHoliday(getDate(holiday.dateString)),
          `${holiday.dateString} is a holiday (observed)`
        );

        // Make sure the alsoObservedAs property gets pulled through
        if (
          holiday.name === "Washington's Birthday" ||
          holiday.name === "Columbus Day"
        ) {
          test.ok(holiday.alsoObservedAs);
        }
      });
    }
  );

  tests.test(
    "handles federal holidays within a range (Saturday shifted only)",
    async test => {
      const shiftSaturdayHolidays = true;
      const shiftSundayHolidays = false;
      const holidays = federalHolidays.inRange(
        new Date("2015-07-03"),
        new Date("2016-12-26"),
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
    "handles federal holidays within a range (Sunday shifted only)",
    async test => {
      const shiftSaturdayHolidays = false;
      const shiftSundayHolidays = true;
      const holidays = federalHolidays.inRange(
        new Date("2015-07-03"),
        new Date("2016-12-26"),
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
    "handles federal holidays within a range (none shifted)",
    async test => {
      const shiftSaturdayHolidays = false;
      const shiftSundayHolidays = false;
      const holidays = federalHolidays.inRange(
        new Date("2015-07-03"),
        new Date("2016-12-26"),
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

  tests.test("handles default dates and ranges", async defaultTests => {
    const testYear = 2000;
    let GlobalDate;

    // Create a proxy for the global Date object. This way we can control the
    // date that is created for default arguments.
    defaultTests.beforeEach(() => {
      GlobalDate = global.Date;

      const ProxiedDate = new Proxy(Date, {
        construct: (_, args) => {
          // We only want to override the constructor if there aren't any
          // arguments. In that case, use our magic date of July 1. Otherwise,
          // pass the arguments on to the real Date constructor.
          if (args.length === 0) {
            return new GlobalDate(`${testYear}-07-01T00:00:00.000Z`);
          }
          return new GlobalDate(...args);
        }
      });

      global.Date = ProxiedDate;
    });

    defaultTests.afterEach(() => {
      // Put the real Date object back.
      global.Date = GlobalDate;
    });

    // We've already tested isAHoliday and allForYear with args, so let's assume
    // they're correct. If not, our earlier tests should have caught that. If
    // they didn't... uhoh.

    defaultTests.test("indicates whether today is a holiday", async test => {
      // July 1 should not be a holiday in any year.
      test.same(federalHolidays.isAHoliday(), false, "is not a holiday");
    });

    defaultTests.test(
      "fetches all holidays for the current year",
      async test => {
        const expected = federalHolidays.allForYear(testYear);

        const holidays = federalHolidays.allForYear();
        test.match(holidays, expected, "gets the expected holidays");
        test.same(
          holidays.length,
          expected.length,
          "gets exactly the expected holidays"
        );
      }
    );

    defaultTests.test(
      "defaults to a range from now to one year from now",
      async test => {
        const holidays = federalHolidays.inRange();

        // Safe-ify these tests against changing test years. In 2021, Juneteenth
        // was added to the holiday calendar. If the test year is before 2020,
        // there are 4 holidays preceding July 1, so we start our slice at
        // holiday #5 (index 4). From 2021 onwards, there are 5 holidays before
        // July 1, so we start our slice at holiday #6 (index 5).
        const slice = testYear > 2020 ? 5 : 4;

        const expected = [
          ...federalHolidays.allForYear(testYear).slice(slice),
          ...federalHolidays.allForYear(testYear + 1).slice(0, slice)
        ];

        test.match(holidays, expected, "get the expected holidays");
        test.same(
          holidays.length,
          expected.length,
          "gets exactly the expected holidays"
        );
      }
    );
  });
});
