import React from 'react';
import seasonWithData from './season-with-data';
import SeasonTeamsTable from './season-teams-table';

const SeasonTeams = (props) => {
    const {match} = props;
    const {year} = match.params;
    const SeasonTeamsWithData = seasonWithData(
        SeasonTeamsTable,
        `${year}/constructorStandings`
    );

    return (
        <SeasonTeamsWithData {...props}/>
    );
}

export default SeasonTeams;
