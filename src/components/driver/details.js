import React, {useEffect, useState} from 'react';
import {localApi} from '../../API';
import Alert from '../alert';
import Moment from 'react-moment';
import Wiki from '../wiki';
import DriverAchievements from './achievements';

const DriverDetails = ({match}) => {
    const
        [busy, setBusy] = useState(true),
        [driver, setDriver] = useState();

    useEffect(() => {
        let isMounted = true;
        const {params: {id}} = match;

        localApi.get('drivers').then(response => {
            const
                {data: {DriverTable: {Drivers}}} = response,
                Driver = Drivers.find(({driverId}) => driverId === id);

            if (isMounted) {
                setDriver(Driver);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : driver ? (() => {
                const {url, familyName, givenName, nationality, dateOfBirth} = driver;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                        <hr className="uk-divider-icon"/>
                        <div
                            data-uk-grid=""
                            data-uk-height-match="target: > div > .uk-card"
                            className="uk-grid-small">
                            <div className="uk-width-3-4">
                                <Wiki url={url}>
                                    <ul className="uk-list">
                                        <li>
                                            Born <Moment format="DD MMMM YYYY">{dateOfBirth}</Moment>, {nationality}
                                        </li>
                                        <li>
                                            <b>Seasons:</b> 0
                                        </li>
                                        <li>
                                            <b>Teams:</b> 0
                                        </li>
                                    </ul>
                                </Wiki>
                            </div>
                            <div className="uk-width-1-4">
                                <div className="uk-card uk-card-default">
                                    <div className="uk-card-header">
                                        <h3 className="uk-card-title">Records</h3>
                                    </div>
                                    <div className="uk-card-body">
                                        <DriverAchievements/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                );
            })() : <Alert>Driver not found.</Alert>}
        </div>
    );
}

export default DriverDetails;
