import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import LinkDriver from '../link/driver';

export default function TeamDrivers({drivers}) {
    return drivers.map((driver, i) => {
        const {driverId} = driver;

        return (
            <Fragment key={driverId}>
                <LinkDriver driver={driver}/>
                {i === drivers.length - 1 ? '' : ', '}
            </Fragment>
        );
    });
}

TeamDrivers.propTypes = {
    drivers: PropTypes.array.isRequired
};
