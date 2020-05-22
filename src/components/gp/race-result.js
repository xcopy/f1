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
} from '../data-table';

export default function GPRaceResult({race: {Results}}) {
    const columns = [
        positionCell,
        numberCell,
        driverCell,
        teamCell,
        lapsCell,
        timeCell,
        pointsCell
    ], data = Results.map(result => {
        const {Driver: {driverId}} = result;

        result.driverId = driverId;

        return result;
    });

    return <DataTable keyField="driverId" {...{columns, data}}/>
}

GPRaceResult.propTypes = {
    race: PropTypes.object.isRequired
};
