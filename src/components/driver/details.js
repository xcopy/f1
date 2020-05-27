import React, {useEffect, useState} from 'react';
import axios from 'axios';
import localforage from 'localforage';
import {localApi, remoteApi} from '../../API';
import _ from 'lodash';
import Moment from 'react-moment';
import Spinner from '../spinner';
import Alert from '../alert';
import Wiki from '../wiki';
import {yearsToStr} from '../../helpers';
import DriverTeams from './teams';
import DriverRecords from './records';
import DriverStandings from './standings';
import DriverResults from './results';

export default function DriverDetails({match}) {
    const
        [busy, setBusy] = useState(true),
        [data, setData] = useState({});

    useEffect(() => {
        let isMounted = true;

        const
            {params: {driverId}} = match,
            key = `drivers/${driverId}`;

        localforage.keys().then(keys => {
            if (keys.indexOf(key) < 0) {
                localApi.get('drivers').then(response => {
                    const
                        {data: {DriverTable: {Drivers}}} = response,
                        Driver = Drivers.find(({driverId: id}) => driverId === id);

                    if (isMounted) {
                        setData({Driver});
                        setBusy(false);
                    }

                    return Driver;
                }).then(Driver => {
                    Driver && axios.all([
                        remoteApi.get(`${key}/driverStandings`),
                        remoteApi.get(`${key}/results`)
                    ]).then(axios.spread((S, R) => {
                        const {data: {StandingsTable: {StandingsLists: Standings}}} = S;
                        const {data: {RaceTable: {Races}}} = R;

                        if (isMounted) {
                            setData(prevState => {
                                const state = {
                                    ...prevState,
                                    Standings,
                                    Races
                                };

                                localforage.setItem(key, state).then(null);

                                return state;
                            });
                        }
                    }));
                })
            } else {
                localforage.getItem(key).then(response => {
                    if (isMounted) {
                        setData(response);
                        setBusy(false);
                    }
                });
            }
        });

        return () => {
            isMounted = false;
        };
    }, [match]);

    function getSeasonsList() {
        const
            {Standings} = data,
            years = Standings.map(({season}) => parseInt(season));

        return `${years.length} (${yearsToStr(years)})`;
    }

    function getTeamsList() {
        const {Standings} = data;

        let teams = Standings.map(standing => {
            const {DriverStandings: [{Constructors}]} = standing;
            return Constructors;
        }).flat();

        teams = _.uniqWith(teams, _.isEqual);

        return <DriverTeams teams={teams}/>;
    }

    return (
        <div className="uk-padding-small">
            {busy ? <Spinner/> : (() => {
                const {Driver, Standings, Races} = data;

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
                                            <div data-uk-grid="" className="uk-grid-small">
                                                <div>
                                                    <b>Born:</b> <Moment format="DD MMMM YYYY">{dateOfBirth}</Moment>
                                                    <br/>
                                                    <b>Nationality:</b> {nationality}
                                                </div>
                                                <div>
                                                    <b>Seasons:</b> {getSeasonsList()}
                                                    <br/>
                                                    <b>Teams:</b> {getTeamsList()}
                                                </div>
                                            </div>
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
                            {Standings ? (
                                <div data-uk-grid="" className="uk-grid-small">
                                    <div className="uk-width-1-6">
                                        <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                            <li>
                                                <a href="/">Standings</a>
                                            </li>
                                            {Standings.map(({season}) =>
                                                <li key={season}>
                                                    <a href="/">Season {season}</a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                    <div className="uk-width-5-6">
                                        <ul id="contents" className="uk-switcher">
                                            <li>
                                                <DriverStandings standings={Standings}/>
                                            </li>
                                            {Standings.map(({season: s}) => {
                                                const races = Races.filter(({season}) => season === s);

                                                return (
                                                    <li key={s}>
                                                        <DriverResults races={races}/>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            ) : <Spinner/>}
                        </>
                    );
                })() : <Alert>Driver not found.</Alert>;
            })()}
        </div>
    );
}
