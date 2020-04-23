import React from 'react';
import seasonWithData from './with-data';
import SeasonTeamsTable from './teams-table';

const SeasonTeams = (props) => {
    const {match: {params: {year}}} = props;
    const SeasonTeamsWithData = seasonWithData(
        SeasonTeamsTable,
        `${year}/constructorStandings`
    );

    return (
        <SeasonTeamsWithData {...props}/>
    );
}

export default SeasonTeams;
