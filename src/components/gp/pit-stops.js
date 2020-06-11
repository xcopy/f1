import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    numberCell,
    driverCell,
    teamCell,
    timeCell
} from '../data-table';

export default function GPPitStops({race: {Results, PitStops = []}}) {
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
    ], data = PitStops.map(pitStop => {
        const
            {stop, lap, time, duration, driverId} = pitStop,
            {number, Driver, Constructor} = Results.find(({Driver: {driverId: id}}) => id === driverId);

        return {
            id: `${driverId}-${lap}`,
            stop, lap, duration, number,
            Driver, Constructor, Time: {time}
        };
    });

    return <DataTable {...{columns, data}}/>
}

GPPitStops.propTypes = {
    race: PropTypes.object.isRequired
};
