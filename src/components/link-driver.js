import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';

LinkDriver.propTypes = {
    driver: PropTypes.object.isRequired
};

export default function LinkDriver({driver}) {
    const {driverId, givenName, familyName} = driver;

    return (
        <Link to={`/drivers/${driverId}`}>{givenName} {familyName}</Link>
    );
};
