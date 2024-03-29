import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import moment from 'moment';
import Moment from 'react-moment';
import {remoteApi} from '../../API';
import Spinner from '../spinner';
import Alert from '../alert';
import Wiki from '../wiki';
import Card from '../card';
import DriverTeams from './teams';
import DriverRecords from './records';
import Standings from '../standings';
import ActiveYears from '../active-years';

export default function DriverDetails({match}) {
    const
        {params: {driverId}} = match,
        [busy, setBusy] = useState(true),
        [driver, setDriver] = useState(),
        [standings, setStandings] = useState({busy: true, data: []}),
        [races, setRaces] = useState({busy: true, data: []});

    useEffect(() => {
        let isMounted = true;

        remoteApi.get(`drivers/${driverId}`).then(response => {
            const {data: {DriverTable: {Drivers: [Driver]}}} = response;

            if (isMounted) {
                setDriver(Driver);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [driverId]);

    function getTeamsList() {
        const {data} = standings;

        let teams = data
            .map(({DriverStandings: [{Constructors}]}) => Constructors)
            .flat();

        teams = _.sortBy(_.uniqWith(teams, _.isEqual), 'name');

        return teams.length ? <DriverTeams teams={teams}/> : '-';
    }

    return (
        <div className="uk-padding-small">
            {busy ? <Spinner text="Loading driver details"/> : (() => {
                return driver ? (() => {
                    const {url, familyName, givenName, nationality, dateOfBirth} = driver;
                    const age = moment().diff(moment(dateOfBirth), 'years');

                    return (
                        <>
                            <h1 className="uk-text-uppercase">{givenName} {familyName}</h1>
                            <hr className="uk-divider-icon"/>
                            <div
                                data-uk-grid=""
                                data-uk-height-match="target: > div > .uk-card"
                                className="uk-grid-small">
                                <div className="uk-width-3-4@m">
                                    <Card title="Summary">
                                        <Wiki url={url}>
                                            {(() => {
                                                const {busy, data} = standings;

                                                return busy ? <Spinner text="Loading personal info..."/> : (
                                                    <div data-uk-grid="" className="uk-grid-small">
                                                        <div className="uk-width-auto@m">
                                                            <b>Born:</b>
                                                            {' '}
                                                            <Moment format="DD MMMM YYYY">{dateOfBirth}</Moment>
                                                            {' '}
                                                            <span className="uk-text-muted">(age {age})</span>
                                                            <br/>
                                                            <b>Nationality:</b> {nationality}
                                                        </div>
                                                        <div className="uk-width-expand">
                                                            <b>Seasons:</b> <ActiveYears standings={data}/>
                                                            <br/>
                                                            <b>Teams:</b> {getTeamsList()}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </Wiki>
                                    </Card>
                                </div>
                                <div className="uk-width-1-4@m">
                                    <DriverRecords standings={standings} races={races}/>
                                </div>
                            </div>
                            <Standings
                                input={{id: driverId, model: 'driver'}}
                                onReady={({standings, races}) => {
                                    setStandings(standings);
                                    setRaces(races);
                                }}
                            />
                        </>
                    );
                })() : <Alert>Driver not found.</Alert>
            })()}
        </div>
    )
}
