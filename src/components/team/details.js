import React, {useState, useEffect} from 'react';
import {localApi} from '../../API';
import Alert from '../alert';
import Wiki from '../wiki';
import Spinner from '../spinner';
import Standings from '../standings';
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

        localApi.get('constructors').then(response => {
            const {data: {ConstructorTable: {Constructors}}} = response;

            if (isMounted) {
                setTeam(Constructors.find(({constructorId}) => constructorId === teamId));
                setBusy(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, [teamId]);

    return (
        <div className="uk-padding-small">
            {busy ? <Spinner text="Loading team details"/> : (() => {
                return team ? (() => {
                    const {url, name} = team;

                    return (
                        <>
                            <h1 className="uk-text-uppercase">{name}</h1>
                            <hr className="uk-divider-icon"/>
                            <div
                                data-uk-grid=""
                                data-uk-height-match="target: > div > .uk-card"
                                className="uk-grid-small">
                                <div className="uk-width-3-4">
                                    <Wiki url={url}/>
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
