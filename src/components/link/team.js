import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

LinkTeam.propTypes = {
    team: PropTypes.object.isRequired
};

export default function LinkTeam({team}) {
    const {constructorId, name} = team;

    return (
        <Link to={`/teams/${constructorId}`}>{name}</Link>
    );
};
