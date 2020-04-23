import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell,
    timeCell
} from '../data-table';

export default function GPFastestLaps({race}) {
    const data = [];
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        {
            name: 'Lap',
            selector: 'lap'
        },
        timeCell,
        {
            name: 'Avg Speed (kph)',
            selector: 'speed'
        }
    ];

    const {Results} = race;
    const results = Results.filter(result => result.FastestLap);

    results
        .sort((a, b) => a.FastestLap.rank - b.FastestLap.rank)
        .forEach(result => {
            const {
                number,
                Driver,
                Constructor,
                FastestLap: {
                    rank,
                    lap,
                    Time,
                    AverageSpeed: {speed}
                }
            } = result;
            const {driverId} = Driver;

            data.push({
                position: rank,
                number, lap, speed,
                Driver, Constructor, Time,
                driverId
            });
        });

    return <DataTable keyField="driverId" {...{columns, data}}/>
}

GPFastestLaps.propTypes = {
    race: PropTypes.object.isRequired
};
