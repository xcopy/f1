import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell,
    timeCell
} from '../data-table';

export default function GPStartingGrid({race}) {
    const data = [];
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        timeCell
    ];

    const {QualifyingResults} = race;

    QualifyingResults
        .sort((a, b) => a.position - b.position)
        .forEach(result => {
            const {
                position,
                number,
                Driver,
                Constructor,
                Q1, Q2, Q3
            } = result;
            const {driverId} = Driver;

            data.push({
                position, number,
                Driver, Constructor,
                Time: {
                    time: Q3 || Q2 || Q1
                },
                driverId
            });
        });

    return <DataTable keyField="driverId" {...{columns, data}}/>;
}

GPStartingGrid.propTypes = {
    race: PropTypes.object.isRequired
};
