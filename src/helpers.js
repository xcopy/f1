import moment from 'moment';

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
 * Returns array of consecutive numbers
 *
 * @param {number} start
 * @param {number|null} end
 * @returns {array}
 */
export const range = (start, end = null) => {
    let x = end ? start : 1;
    let y = end || start;

    return Array.from(function* () {
        while (x <= y) yield x++;
    }());
};
