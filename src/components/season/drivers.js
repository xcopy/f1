import React from 'react';
import seasonWithData from './with-data';
import SeasonDriversTable from './drivers-table';

const SeasonDrivers = (props) => {
    const {match: {params: {year}}} = props;
    const SeasonDriversWithData = seasonWithData(
        SeasonDriversTable,
        `${year}/driverStandings`
    );

    return (
        <SeasonDriversWithData {...props}/>
    );
}

export default SeasonDrivers;
