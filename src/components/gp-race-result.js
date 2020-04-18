import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    lapsCell,
    numberCell,
    pointsCell,
    positionCell,
    teamCell,
    timeCell
} from './data-table';

export default function GPRaceResult({results}) {
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        lapsCell,
        timeCell,
        pointsCell
    ];
    const data = [];

    results.forEach(result => {
        const {
            positionText,
            number,
            laps,
            points,
            status,
            Driver,
            Constructor,
            Time
        } = result;
        const {driverId} = Driver;

        data.push({
            positionText, number, laps, points, status,
            Driver, Constructor, Time,
            driverId
        });
    });

    return <DataTable keyField="driverId" {...{columns, data}}/>
}

GPRaceResult.propTypes = {
    results: PropTypes.array.isRequired
};
