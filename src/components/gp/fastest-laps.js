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
    const results = Results.filter(result => {
        const {FastestLap} = result;
        return FastestLap;
    });

    results
        .sort((next, current) => {
            const {FastestLap: {rank: rank1}} = next;
            const {FastestLap: {rank: rank2}} = current;
            return rank1 - rank2;
        })
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
