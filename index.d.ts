interface WithHolidayShift {
    // Whether or not holidays that fall on Saturdays should be
    // shifted to Friday observance. If you don't follow the
    // US federal standard for observing holidays on weekends,
    // you can adjust by setting this value to false.
    // Default value is true.
    shiftSaturdayHolidays: boolean;

    // Whether or not holidays that fall on Sundays should be
    // shifted to Monday observance. If you don't follow the
    // US federal standard for observing holidays on weekends,
    // you can adjust by setting this value to false.
    // Default value is true.
    shiftSundayHolidays: boolean;
}

interface WithUTCDate {
    // Whether to treat the first argument as a UTC date instead
    // of the local time.  Defaults to false.  This is useful if
    // you're generating dates from UTC timestamps or otherwise
    // creating objects from UTC-based dates.
    // Default value is false.
    // This option only applies to the isAHoliday method.
    utc: boolean;
}

export interface Holiday {
    name: string;
    date: Date;
    dateString: string;
}

export function isAHoliday(date?: Date, params?: Partial<WithHolidayShift & WithUTCDate>): boolean;

export function allForYear(year?: number, params?: Partial<WithHolidayShift>): Holiday[];

export function inRange(startDate?: Date, endDate?: Date, params?: Partial<WithHolidayShift>): Holiday[];
