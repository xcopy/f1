import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

LinkTeam.propTypes = {
    constructor: PropTypes.object.isRequired
};

export default function LinkTeam({constructor}) {
    const {constructorId, name} = constructor;

    return (
        <Link to={`/teams/${constructorId}`}>{name}</Link>
    );
};
