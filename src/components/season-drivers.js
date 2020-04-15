import React from 'react';
import seasonWithData from './season-with-data';
import SeasonDriversTable from './season-drivers-table';

const SeasonDrivers = (props) => {
    const SeasonDriversWithData = seasonWithData(
        SeasonDriversTable,
        `${props.year}/driverStandings`
    );

    return (
        <SeasonDriversWithData {...props}/>
    );
}

export default SeasonDrivers;
