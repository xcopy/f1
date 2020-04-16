import React from 'react';
import seasonWithData from './season-with-data';
import SeasonDriversTable from './season-drivers-table';

const SeasonDrivers = (props) => {
    const {match} = props;
    const {year} = match.params;
    const SeasonDriversWithData = seasonWithData(
        SeasonDriversTable,
        `${year}/driverStandings`
    );

    return (
        <SeasonDriversWithData {...props}/>
    );
}

export default SeasonDrivers;
