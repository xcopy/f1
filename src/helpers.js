import moment from 'moment';
import _ from 'lodash';

function isZero(r) {
    const {grid} = r;
    return parseInt(grid) === 0;
}

// todo: sort by qualifying results
export function normalizeResults(race) {
    const {Results /*QualifyingResults*/} = race;

    Results.forEach(r => {
        const
            {grid} = r,
            // need to re-calculate after update
            grids = Results.map(({grid}) => parseInt(grid));

        if (parseInt(grid) === 0) {
            r.grid = (Math.max(...grids) + 1).toString();
        }
    });

    Results.sort((next, current) => {
        const
            c = parseInt(current.grid),
            n = parseInt(next.grid);

        return (n > c)
            ? 1
            : (n < c) ? -1 : 0;
    });

    return Results
        .filter(r => !isZero(r))
        .concat(Results.filter(r => isZero(r)));
}

/**
 * @param {array} races
 * @returns {array}
 */
export function normalizeRaces(races = []) {
    const arr = [];

    // merge duplicate races with different results
    races.forEach(race => {
        const
            {season, round} = race,
            find = arr.find(({season: s, round: r}) => {
                return s === season && r === round;
            }),
            i = arr.indexOf(find);

        if (find) {
            const {Results: r1} = find, {Results: r2} = race;
            arr[i] = {...find, Results: r1.concat(r2)}; // merge results for the one race
        } else {
            arr.push(race);
        }
    });

    return arr;
}

/**
 * Converts time string to ms
 *
 * Examples:
 * "0.234"     ->     234
 * "1.234"     ->    1234
 * "1:1.234"   ->   61234
 * "1:1:1.234" -> 3661234
 * etc.
 *
 * @param {string} timeString
 * @returns {number} milliseconds
 */
export function timeToMs(timeString) {
    let [hms, ms] = timeString.split('.');
    const parts = hms.split(':');

    for (let i = 0; i < 3 - parts.length; i++) {
        hms = '0:' + hms;
    }

    return moment.duration(`${hms}.${ms}`).as('ms');
}

/**
 * Converts array of seasons (years) to string
 *
 * Examples:
 * [2001] -> "2001"
 * [2001, 2010] -> "2001, 2010"
 * [2001, 2002, 2003] -> "2001-2003"
 * [2001, 2005, 2006, 2007] -> "2001, 2005-2007"
 *
 * @param {array} years
 * @returns {string}
 */
export function yearsToStr(years) {
    const
        minYear = Math.min(...years),
        maxYear = Math.max(...years),
        diff = _.difference(_.range(minYear, maxYear), years);

    let ranges = [];

    diff.unshift(minYear - 1);
    diff.push(maxYear + 1);

    for (let i = 0; i < diff.length; i++) {
        const
            curr = diff[i], next = diff[i + 1],
            sum = curr + 1, sub = next - 1;

        if (next && sub >= sum) {
            ranges[i] = [sum, sub]
                .filter((v, i, a) => a.indexOf(v) === i);
        }
    }

    return ranges
        .filter(Boolean) // remove empty elements
        .map(a => a.join('–'))
        .join(', ');
}

/**
 * @param {array} standings
 * @returns {array}
 */
export function getDecades(standings) {
    const
        years = standings.map(standing => standing.season), 
        min = Math.min(...years),
        max = Math.max(...years);

    return _.range(
        min - (min % 10),
        max - (max % 10) + 10,
        10
    );
}
