import React from 'react';
import PropTypes from 'prop-types';
import DataTable, {
    driverCell,
    numberCell,
    positionCell,
    teamCell
} from '../data-table';

export default function GPQualifying({race: {QualifyingResults}}) {
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        {name: 'Q1', selector: 'Q1'},
        {name: 'Q2', selector: 'Q2'},
        {name: 'Q3', selector: 'Q3'}
    ], data = QualifyingResults.map(result => {
        const {Driver: {driverId}} = result;

        result.driverId = driverId;

        return result;
    });

    return <DataTable keyField="driverId" {...{columns, data}}/>
}

GPQualifying.propTypes = {
    race: PropTypes.object.isRequired
};
