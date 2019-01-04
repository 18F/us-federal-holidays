# US Federal Holidays

Builds and returns a list of all US federal holidays for a given year, and provides a helper method to determine if a given date is a US federal holiday. Handles shifting holidays to the nearest weekday if the holiday falls on a weekend.

US federal holidays are [as defined by OPM](https://www.opm.gov/fedhol/).

### Installation

```
npm install @18f/us-federal-holidays
```

### Usage

To get a list of all US federal holidays in a given year, use the `allForYear` method. If no year is passed in, uses the current year.

```javascript
const fedHolidays = require('@18f/us-federal-holidays');

const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true };
const holidays = fedHolidays.allForYear(2016, options);

// Returns
[ { name: 'New Year\'s Day',
    date: 2016-01-01T00:00:00.000Z,
    dateString: '2016-1-1' },
  { name: 'Birthday of Martin Luther King, Jr.',
    date: 2016-01-18T00:00:00.000Z,
    dateString: '2016-1-18' },
  { name: 'Washington\'s Birthday',
    date: 2016-02-15T00:00:00.000Z,
    dateString: '2016-2-15' },
  { name: 'Memorial Day',
    date: 2016-05-30T00:00:00.000Z,
    dateString: '2016-5-30' },
  { name: 'Independence Day',
    date: 2016-07-04T00:00:00.000Z,
    dateString: '2016-7-4' },
  { name: 'Labor Day',
    date: 2016-09-05T00:00:00.000Z,
    dateString: '2016-9-5' },
  { name: 'Columbus Day',
    date: 2016-10-10T00:00:00.000Z,
    dateString: '2016-10-10' },
  { name: 'Veterans Day',
    date: 2016-11-11T00:00:00.000Z,
    dateString: '2016-11-11' },
  { name: 'Thanksgiving Day',
    date: 2016-11-24T00:00:00.000Z,
    dateString: '2016-11-24' },
  { name: 'Christmas Day',
    date: 2016-12-26T00:00:00.000Z,
    dateString: '2016-12-26' } ]
```

To determine if a date is a federal holiday, use the `isAHoliday` method. If no argument is provided, defaults to the current date:

```javascript
const fedHolidays = require('@18f/us-federal-holidays');

const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true, utc: false };
const isAHoliday = fedHolidays.isAHoliday(myDate, options);
// Returns true or false
```

Both methods take `options` as a second argument. This argument is a plain object which accepts the following properties:

```javascript
{
  // Whether or not holidays that fall on Saturdays should be
  // shifted to Friday observance. If you don't follow the
  // US federal standard for observing holidays on weekends,
  // you can adjust by setting this value to false.
  // Default value is true.
  shiftSaturdayHolidays: boolean,

  // Whether or not holidays that fall on Sundays should be
  // shifted to Monday observance. If you don't follow the
  // US federal standard for observing holidays on weekends,
  // you can adjust by setting this value to false.
  // Default value is true.
  shiftSundayHolidays: boolean,

  // Whether to treat the first argument as a UTC date instead
  // of the local time.  Defaults to false.  This is useful if
  // you're generating dates from UTC timestamps or otherwise
  // creating objects from UTC-based dates.
  // Default value is false.
  // This option only applies to the isAHoliday method.
  utc: boolean
}
```

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
