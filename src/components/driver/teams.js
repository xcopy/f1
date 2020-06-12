import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import LinkTeam from '../link/team';

export default function DriverTeams({teams}) {
    return teams.map((team, i) => {
        const {constructorId} = team;

        return (
            <Fragment key={constructorId}>
                <LinkTeam team={team}/>
                {i === teams.length - 1 ? '' : ', '}
            </Fragment>
        );
    });
}

DriverTeams.propTypes = {
    teams: PropTypes.array.isRequired
};
