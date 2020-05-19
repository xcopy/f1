import React, {Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import {localApi, remoteApi} from '../../API';
import _ from 'lodash';
import Moment from 'react-moment';
import Spinner from '../spinner';
import Alert from '../alert';
import Wiki from '../wiki';
import LinkTeam from '../link/team';
import DriverRecords from './records';
import DriverStandings from './standings';

export default function DriverDetails({match}) {
    const
        [busy, setBusy] = useState(true),
        [data, setData] = useState({});

    useEffect(() => {
        let isMounted = true;
        const {params: {driverId}} = match;
        const api = new URLSearchParams(document.location.search).get('dev')
            ? localApi
            : remoteApi;
        const path = `drivers/${driverId}`;

        api.get(`${path}`).then(response => {
            const {data: {DriverTable: {Drivers: [Driver]}}} = response;

            if (isMounted) {
                setData({Driver});
                setBusy(false);
            }
        });

        axios.all([
            api.get(`${path}/driverStandings`),
            api.get(`${path}/qualifying/1`),
            api.get(`${path}/results`)
        ]).then(axios.spread((S, Q, R) => {
            const {data: {StandingsTable: {StandingsLists: Standings}}} = S;
            const {data: {RaceTable: {Races: QualifyingResults}}} = Q;
            const {data: {RaceTable: {Races: Results}}} = R;

            if (isMounted) {
                setData(prevState => {
                    return {
                        ...prevState,
                        Standings,
                        QualifyingResults,
                        Results
                    };
                });
            }
        }));

        return () => {
            isMounted = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getSeasonsList() {
        const {Standings} = data;

        return (
            <>
                {Standings.length}
                {' '}
                ({Standings.map(({season}) => season).join(', ')})
            </>
        );
    }

    function getTeamsList() {
        const {Standings} = data;

        let constructors = Standings.map(standing => {
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
            {busy ? <Spinner/> : (() => {
                const {Driver, Standings} = data;

                return Driver ? (() => {
                    const {url, familyName, givenName, nationality, dateOfBirth} = Driver;

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
                                        {Standings ? (
                                            <ul className="uk-list uk-margin-remove">
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
                                        ) : <Spinner/>}
                                    </Wiki>
                                </div>
                                <div className="uk-width-1-4">
                                    <div className="uk-card uk-card-default">
                                        <div className="uk-card-header">
                                            <h3 className="uk-card-title">Records</h3>
                                        </div>
                                        <div className="uk-card-body">
                                            {Standings ? <DriverRecords data={data}/> : <Spinner/>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr className="uk-divider-icon"/>
                            {Standings ? <DriverStandings standings={Standings}/> : <Spinner/>}
                        </>
                    );
                })() : <Alert>Driver not found.</Alert>;
            })()}
        </div>
    );
}
