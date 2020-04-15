import React from 'react';
import seasonWithData from './season-with-data';
import SeasonTeamsTable from './season-teams-table';

const SeasonTeams = (props) => {
    const SeasonTeamsWithData = seasonWithData(
        SeasonTeamsTable,
        `${props.year}/constructorStandings`
    );

    return (
        <SeasonTeamsWithData {...props}/>
    );
}

export default SeasonTeams;
