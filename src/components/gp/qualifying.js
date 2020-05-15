import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell
} from '../data-table';

export default function GPQualifying({race}) {
    const {QualifyingResults} = race;
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        {name: 'Q1', selector: 'Q1'},
        {name: 'Q2', selector: 'Q2'},
        {name: 'Q3', selector: 'Q3'}
    ];
    const data = QualifyingResults.map(result => {
        const {number, position, Driver, Constructor, Q1, Q2, Q3} = result;
        const {driverId} = Driver;

        return {
            number, position,
            Driver, Constructor,
            Q1, Q2, Q3,
            driverId
        };
    });

    return <DataTable keyField="driverId" {...{columns, data}}/>
}

GPQualifying.propTypes = {
    race: PropTypes.object.isRequired
};
