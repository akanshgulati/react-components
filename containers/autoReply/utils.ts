import { c } from 'ttag';
import { AutoReplyDuration } from 'proton-shared/lib/constants';
import { findTimeZone, getUTCOffset, listTimeZones } from 'timezone-support';

export const DAY_SECONDS = 24 * 60 * 60;
export const HOUR_SECONDS = 60 * 60;
export const MINUTES_SECONDS = 60;

export const getDurationOptions = () => [
    {
        text: c('Option').t`Fixed duration`,
        value: AutoReplyDuration.FIXED
    },
    {
        text: c('Option').t`Repeat daily`,
        value: AutoReplyDuration.DAILY
    },
    {
        text: c('Option').t`Repeat weekly`,
        value: AutoReplyDuration.WEEKLY
    },
    {
        text: c('Option').t`Repeat monthly`,
        value: AutoReplyDuration.MONTHLY
    },
    {
        text: c('Option').t`Permanent`,
        value: AutoReplyDuration.PERMANENT
    }
];

export const getMatchingTimezone = (timezone, timezoneOptions) => {
    const fullMatch = timezoneOptions.find(({ value }) => {
        return value === timezone;
    });
    if (fullMatch) {
        return fullMatch;
    }
    // Can be stored as "Singapore", now expecting Asia/Singapore
    const otherMatch = timezoneOptions.find(({ value }) => {
        return value.includes(timezone);
    });
    if (otherMatch) {
        return otherMatch;
    }
};

/**
 * Get a list of all IANA time zones
 * @return {Array<Object>}      [{ text: 'Africa/Nairobi: UTC +03:00', value: 'Africa/Nairobi'}, ...]
 */
export const getTimeZoneOptions = () => {
    const dummyDate = new Date(); // recent date required for proper use

    return listTimeZones().map((name) => {
        const { offset } = getUTCOffset(dummyDate, findTimeZone(name));
        // offset comes with the opposite sign in the timezone-support library
        const sign = Math.sign(offset) === 1 ? '-' : '+';
        const minutes = `${Math.abs(offset % 60)}`;
        const hours = `${(Math.abs(offset) - minutes) / 60}`;
        const mm = minutes.length === 1 ? `0${minutes}` : `${minutes}`;
        const hh = hours.length === 1 ? `0${hours}` : `${hours}`;

        return {
            text: `${name}: UTC ${sign}${hh}:${mm}`,
            value: name
        };
    });
};

/**
 * Get a list with the days of the month and their
 * index position (in the week) according to current locale
 *
 * @return {Object} [{ text: 'name of day', value: index position in week }]
 */
export const getDaysOfMonthOptions = () => [
    { text: c('Option').t`1st of the month`, value: 0 },
    { text: c('Option').t`2nd of the month`, value: 1 },
    { text: c('Option').t`3rd of the month`, value: 2 },
    { text: c('Option').t`4th of the month`, value: 3 },
    { text: c('Option').t`5th of the month`, value: 4 },
    { text: c('Option').t`6th of the month`, value: 5 },
    { text: c('Option').t`7th of the month`, value: 6 },
    { text: c('Option').t`8th of the month`, value: 7 },
    { text: c('Option').t`9th of the month`, value: 8 },
    { text: c('Option').t`10th of the month`, value: 9 },
    { text: c('Option').t`11th of the month`, value: 10 },
    { text: c('Option').t`12th of the month`, value: 11 },
    { text: c('Option').t`13th of the month`, value: 12 },
    { text: c('Option').t`14th of the month`, value: 13 },
    { text: c('Option').t`15th of the month`, value: 14 },
    { text: c('Option').t`16th of the month`, value: 15 },
    { text: c('Option').t`17th of the month`, value: 16 },
    { text: c('Option').t`18th of the month`, value: 17 },
    { text: c('Option').t`19th of the month`, value: 18 },
    { text: c('Option').t`20th of the month`, value: 19 },
    { text: c('Option').t`21st of the month`, value: 20 },
    { text: c('Option').t`22nd of the month`, value: 21 },
    { text: c('Option').t`23rd of the month`, value: 22 },
    { text: c('Option').t`24th of the month`, value: 23 },
    { text: c('Option').t`25th of the month`, value: 24 },
    { text: c('Option').t`26th of the month`, value: 25 },
    { text: c('Option').t`27th of the month`, value: 26 },
    { text: c('Option').t`28th of the month`, value: 27 },
    { text: c('Option').t`29th of the month`, value: 28 },
    { text: c('Option').t`30th of the month`, value: 29 },
    { text: c('Option').t`31st of the month`, value: 30 }
];
<<<<<<< HEAD:containers/autoReply/utils.ts

export const getRoundedHours = (time: moment.MomentInput) => {
    const startOfDay = moment(time).startOf('day');

    return moment(moment(time).diff(startOfDay))
        .startOf('hour')
        .add(30 * Math.floor(moment(time).minutes() / 30), 'minutes')
        .valueOf();
};

export const startOfDay = (date: moment.MomentInput) =>
    moment(date)
        .startOf('day')
        .valueOf();
=======
>>>>>>> Add date locales:containers/autoReply/utils.js
