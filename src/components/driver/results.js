import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    roundCell,
    dateCell,
    raceCell,
    teamCell,
    timeCell,
    pointsCell,
    positionCell
} from '../data-table';

export default function DriverResults({races}) {
    const columns = [
        roundCell,
        dateCell,
        raceCell,
        teamCell,
        timeCell,
        pointsCell,
        positionCell
    ];

    const data = races.map(race => {
        const {season, round, date, raceName, Results} = race;
        const {positionText, points, Constructor, Time} = Results[0];

        return {
            positionText, season, round, date, raceName, points,
            Constructor, Time
        };
    });

    return <DataTable keyField="round" {...{columns, data}}/>;
}

DriverResults.propTypes = {
    races: PropTypes.array.isRequired
};
