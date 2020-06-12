import React, {useState, useEffect} from 'react';
import _ from 'lodash';
import {remoteApi} from '../../API';
import Alert from '../alert';
import Wiki from '../wiki';
import Card from '../card';
import Spinner from '../spinner';
import Standings from '../standings';
import ActiveYears from '../active-years';
import TeamDrivers from './drivers';
import DriverRecords from '../driver/records';

export default function TeamDetails({match}) {
    const
        {params: {teamId}} = match,
        [busy, setBusy] = useState(true),
        [team, setTeam] = useState(),
        [standings, setStandings] = useState({busy: true, data: []}),
        [races, setRaces] = useState({busy: true, data: []});

    useEffect(() => {
        let isMounted = true;

        remoteApi.get(`constructors/${teamId}`).then(response => {
            const {data: {ConstructorTable: {Constructors: [Team]}}} = response;

            if (isMounted) {
                setTeam(Team);
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [teamId]);

    function getDriversList() {
        const {data} = races;

        let drivers = data
            .map(({Results}) => Results.map(({Driver}) => Driver))
            .flat();

        drivers = _.sortBy(_.uniqWith(drivers, _.isEqual), 'familyName');

        return <TeamDrivers drivers={drivers}/>;
    }

    return (
        <div className="uk-padding-small">
            {busy ? <Spinner text="Loading team details"/> : (() => {
                return team ? (() => {
                    const {url, name, nationality} = team;

                    return (
                        <>
                            <h1 className="uk-text-uppercase">{name}</h1>
                            <hr className="uk-divider-icon"/>
                            <div
                                data-uk-grid=""
                                data-uk-height-match="target: > div > .uk-card"
                                className="uk-grid-small">
                                <div className="uk-width-3-4">
                                    <Card title="Summary">
                                        <Wiki url={url}>
                                            {(() => {
                                                const {busy, data} = standings;

                                                return busy ? <Spinner/> : (
                                                    <>
                                                        <b>Nationality:</b> {nationality}
                                                        <br/>
                                                        <b>Seasons:</b> <ActiveYears standings={data}/>
                                                        <br/>
                                                        <b>Drivers:</b> {getDriversList()}
                                                    </>
                                                );
                                            })()}
                                        </Wiki>
                                    </Card>
                                </div>
                                <div className="uk-width-1-4">
                                    <DriverRecords standings={standings} races={races}/>
                                </div>
                            </div>
                            <Standings
                                input={{id: teamId, model: 'constructor'}}
                                onReady={({standings, races}) => {
                                    setStandings(standings);
                                    setRaces(races);
                                }}
                            />
                        </>
                    );
                })() : <Alert>Team not found.</Alert>
            })()}
        </div>
    );
}
