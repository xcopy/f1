import React from 'react';
import {Link} from 'react-router-dom';

export function linkToDriver(driver) {
    const {driverId, givenName, familyName} = driver;
    return <Link to={`/drivers/${driverId}`}>{givenName} {familyName}</Link>;
}

export function linkToTeam(constructor) {
    const {constructorId, name} = constructor;
    return <Link to={`/teams/${constructorId}`}>{name}</Link>
}
