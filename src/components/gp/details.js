import React, {useState, useEffect} from 'react';
import axios from 'axios';
import API from '../../API';
import Moment from 'react-moment';
import GPRaceResult from './race-result';
import GPQualifying from './qualifying';
import GPFastestLaps from './fastest-laps';
import GPStartingGrid from './starting-grid';
import GPPitStops from './pit-stops';
import GPV11n from './v11n';

export default function GPDetails({match}) {
    const {params: {year, round}} = match;
    const [busy, setBusy] = useState(true);
    const [races, setRaces] = useState([]);

    useEffect(() => {
        let isMounted = true;

        setRaces([]);
        setBusy(true);

        const basePath = `${year}/${round}`;

        axios.all([
            API.get(`${basePath}/results`),
            API.get(`${basePath}/qualifying`),
            API.get(`${basePath}/pitstops`)
        ]).then(axios.spread((R, Q, P) => {
            const {RaceTable: {Races: $Races}} = R.data;
            const {RaceTable: {Races: $RacesQ}} = Q.data;
            const {RaceTable: {Races: $RacesP}} = P.data;

            if (isMounted) {
                if ($Races.length) {
                    $Races[0].QualifyingResults = $RacesQ[0]?.QualifyingResults || [];
                    $Races[0].PitStops = $RacesP[0]?.PitStops || [];
                }

                setRaces($Races);
                setBusy(false);
            }
        }));

        return () => {
            isMounted = false;
        };
    }, [year, round]);

    return (
        <>
            {busy ? <div data-uk-spinner=""/> : (() => {
                if (!races.length) {
                    return 'There are no results to display';
                }

                const [race] = races;
                const {
                    season,
                    date,
                    raceName,
                    Circuit: {
                        circuitName,
                        Location: {country, locality}
                    }
                } = race;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{season} {raceName}</h1>
                        <div className="uk-margin-medium-bottom">
                            <span data-uk-icon="calendar"/>{' '}
                            <Moment format="DD MMM YYYY" className="uk-text-bold">{date}</Moment> / Round {round}
                            <div>
                                <span data-uk-icon="location"/>{' '}
                                {circuitName} / {locality}, {country}
                            </div>
                        </div>
                        <div data-uk-grid="">
                            <div className="uk-width-1-6">
                                <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                    <li><a href="/">Visualization</a></li>
                                    <li><a href="/">Race Result</a></li>
                                    <li><a href="/">Qualifying</a></li>
                                    <li><a href="/">Starting Grid</a></li>
                                    <li><a href="/">Fastest Laps</a></li>
                                    <li><a href="/">Pit Stop Summary</a></li>
                                </ul>
                            </div>
                            <div className="uk-width-5-6">
                                <ul id="contents" className="uk-switcher">
                                    <li>
                                        <GPV11n race={race}/>
                                    </li>
                                    <li>
                                        <GPRaceResult race={race}/>
                                    </li>
                                    <li>
                                        <GPQualifying race={race}/>
                                    </li>
                                    <li>
                                        <GPStartingGrid race={race}/>
                                    </li>
                                    <li>
                                        <GPFastestLaps race={race}/>
                                    </li>
                                    <li>
                                        <GPPitStops race={race}/>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </>
                )
            })()}
        </>
    );
};
