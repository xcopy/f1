import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    numberCell,
    driverCell,
    teamCell,
    timeCell
} from './data-table';

export default function GPPitStops({race}) {
    const data = [];
    const columns = [
        {
            name: 'Stops',
            selector: 'stop',
            center: true,
            grow: 0
        },
        numberCell,
        driverCell,
        teamCell,
        {
            name: 'Lap',
            selector: 'lap',
            center: true
        },
        timeCell,
        {
            name: 'Duration',
            selector: 'duration'
        }
    ];

    const {Results, PitStops} = race;

    PitStops.forEach(pitStop => {
        const {stop, lap, time, duration, driverId} = pitStop;
        const {number, Driver, Constructor} = Results.find(result => {
            const {Driver: {driverId: id}} = result;
            return id === driverId;
        });

        data.push({
            id: `${driverId}-${lap}`,
            stop, lap, duration, number,
            Driver, Constructor, Time: {time}
        });
    });

    return <DataTable {...{columns, data}}/>
}

GPPitStops.propTypes = {
    race: PropTypes.object.isRequired
};
