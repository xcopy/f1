import React from 'react';
import seasonWithData from './season-with-data';
import SeasonResultsTable from './season-results-table';

const SeasonResults = (props) => {
    const {match} = props;
    const {year} = match.params;
    const SeasonResultsWithData = seasonWithData(
        SeasonResultsTable,
        `${year}/results/1`
    );

    return (
        <SeasonResultsWithData {...props}/>
    );
}

export default SeasonResults;
