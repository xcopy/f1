import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {localApi, remoteApi} from '../../API';
import _ from 'lodash';
import Moment from 'react-moment';
import Alert from '../alert';
import Wiki from '../wiki';
import LinkTeam from '../link/team';
import DriverAchievements from './achievements';

const DriverDetails = ({match}) => {
    const
        [busy, setBusy] = useState(true),
        [data, setData] = useState({});

    useEffect(() => {
        let isMounted = true;
        const {params: {driverId}} = match;

        axios.all([
            // localApi.get(`drivers/${driverId}`),
            // localApi.get(`drivers/${driverId}/driverStandings`)
            remoteApi.get(`drivers/${driverId}`),
            remoteApi.get(`drivers/${driverId}/driverStandings`)
        ]).then(axios.spread((D, S) => {
            const {
                data: {
                    DriverTable: {
                        Drivers: [Driver]
                    }
                }
            } = D;
            const {
                data: {
                    StandingsTable: {
                        StandingsLists: Standings
                    }
                }
            } = S;

            if (isMounted) {
                Driver && setData({
                    driver: Driver,
                    standings: Standings
                });
                setBusy(false);
            }
        }));

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getSeasonsList() {
        const {standings} = data;

        return (
            <>
                {standings.length}
                {' '}
                ({standings.map(({season}) => season).join(', ')})
            </>
        );
    }

    function getTeamsList() {
        const {standings} = data;

        let constructors = standings.map(standing => {
            const {
                DriverStandings: [{Constructors}]
            } = standing;

            return Constructors;
        }).flat();

        constructors = _.uniqWith(constructors, _.isEqual);

        return constructors.map((constructor, i) => {
            return (
                <Fragment key={i}>
                    <LinkTeam constructor={constructor}/>
                    {i === constructors.length - 1 ? '' : ', '}
                </Fragment>
            );
        });
    }

    return (
        <div className="uk-padding-small">
            {busy ? <span data-uk-spinner=""/> : (() => {
                const {driver} = data;

                return driver ? (() => {
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
                                                <b>Seasons:</b> {getSeasonsList()}
                                            </li>
                                            <li>
                                                <b>Teams:</b> {getTeamsList()}
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
                                            <DriverAchievements data={data}/>
                                            <div className="uk-text-muted uk-margin-top">(Records in progress)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="uk-divider-icon"/>
                            <div className="uk-text-muted uk-text-center">(Results in progress)</div>
                        </>
                    );
                })() : <Alert>Driver not found.</Alert>;
            })()}
        </div>
    );
}

export default DriverDetails;
