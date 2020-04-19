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

export default function GPRaceResult({race}) {
    const data = [];
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        lapsCell,
        timeCell,
        pointsCell
    ];

    const {Results: results} = race;

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
    race: PropTypes.object.isRequired
};
