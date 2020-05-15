import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell,
    timeCell
} from '../data-table';
import {normalizeResults} from '../../helpers';

export default function GPStartingGrid({race}) {
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        timeCell
    ];

    const
        {QualifyingResults} = race,
        results = normalizeResults(race);

    const data = results
        .map(result => {
            const {
                grid,
                number,
                Driver,
                Constructor
            } = result;
            const {driverId} = Driver;
            const {Q1, Q2, Q3} = QualifyingResults.find(r => {
                const {Driver: {driverId: driverId$}} = r;
                return driverId$ === driverId;
            }) || {};

            return {
                position: grid, number,
                Driver, Constructor,
                Time: {
                    time: Q3 || Q2 || Q1
                },
                driverId
            };
        });

    return <DataTable keyField="driverId" {...{columns, data}}/>;
}

GPStartingGrid.propTypes = {
    race: PropTypes.object.isRequired
};
