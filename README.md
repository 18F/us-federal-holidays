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
var fedHolidays = require('us-federal-holidays');
var holidays = fedHolidays.allForYear(2016);

// Returns
[ { name: 'New Year\'s Day',
    date: Thu Dec 31 2015 18:00:00 GMT-0600 (CST),
    dateString: '2016-1-1' },
  { name: 'Birthday of Martin Luther King, Jr.',
    date: Sun Jan 17 2016 18:00:00 GMT-0600 (CST),
    dateString: '2016-1-18' },
  { name: 'Washington\'s Birthday',
    date: Sun Feb 14 2016 18:00:00 GMT-0600 (CST),
    dateString: '2016-2-15' },
  { name: 'Memorial Day',
    date: Sun May 29 2016 19:00:00 GMT-0500 (CDT),
    dateString: '2016-5-30' },
  { name: 'Independence Day',
    date: Sun Jul 03 2016 19:00:00 GMT-0500 (CDT),
    dateString: '2016-7-4' },
  { name: 'Labor Day',
    date: Sun Sep 04 2016 19:00:00 GMT-0500 (CDT),
    dateString: '2016-9-5' },
  { name: 'Columbus Day',
    date: Sun Oct 09 2016 19:00:00 GMT-0500 (CDT),
    dateString: '2016-10-10' },
  { name: 'Veterans Day',
    date: Thu Nov 10 2016 18:00:00 GMT-0600 (CST),
    dateString: '2016-11-11' },
  { name: 'Thanksgiving Day',
    date: Wed Nov 23 2016 18:00:00 GMT-0600 (CST),
    dateString: '2016-11-24' },
  { name: 'Christmas Day',
    date: Sun Dec 25 2016 18:00:00 GMT-0600 (CST),
    dateString: '2016-12-26' } ]
```

To determine if a date is a federal holiday, use the `isAHoliday` method. If no argument is provided, defaults to the current date:

```javascript
var fedHolidays = require('us-federal-holidays');
var isAHoliday = fedHolidays.isAHoliday(myDate, opts);
// Returns true or false
```

The options is a plain object:

```javascript
{
  // Whether or not holidays that fall on Saturdays should be
  // shifted to Friday observance.  Defaults to true, but if
  // you don't follow the US federal standard for observing
  // holidays on weekends, you can adjust!
  shiftSaturdayHolidays: boolean,

  // Whether or not holidays that fall on Sundays should be
  // shifted to Monday observance.  Defaults to true, but if
  // you don't follow the US federal standard for observing
  // holidays on weekends, you can adjust!
  shiftSundayHolidays: boolean,

  // Whether to treat the first argument as a UTC date instead
  // of the local time.  Defaults to false.  This is useful if
  // you're generating dates from UTC timestamps or otherwise
  // creating objects from UTC-based dates.
  utc: boolean
}
```

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
