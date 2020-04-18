import React from 'react';
import PropTypes from "prop-types";
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell
} from './data-table';

export default function GPQualifying({results}) {
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        {name: 'Q1', selector: 'Q1'},
        {name: 'Q2', selector: 'Q2'},
        {name: 'Q3', selector: 'Q3'}
    ];
    const data = [];

    results.forEach(result => {
        const {number, position, Driver, Constructor, Q1, Q2, Q3} = result;
        const {driverId} = Driver;

        data.push({
            number, position,
            Driver, Constructor,
            Q1, Q2, Q3,
            driverId
        });
    });

    return <DataTable keyField="driverId" {...{columns, data}}/>
}

GPQualifying.propTypes = {
    results: PropTypes.array.isRequired
};
