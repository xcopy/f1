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
            grids = Results.map(r => parseInt(r.grid));

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