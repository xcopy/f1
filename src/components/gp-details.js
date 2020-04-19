import React, {useState, useEffect} from 'react';
import axios from 'axios';
import api from '../api';
import Moment from 'react-moment';
import GPRaceResult from './gp-race-result';
import GPQualifying from './gp-qualifying';
import GPFastestLaps from './gp-fastest-laps';
import GPStartingGrid from './gp-starting-grid';

export default function GPDetails({match}) {
    const {params: {year, round}} = match;
    const [busy, setBusy] = useState(true);
    const [races, setRaces] = useState([]);

    useEffect(() => {
        let isMounted = true;

        setRaces([]);
        setBusy(true);

        axios.all([
            api.get(`${year}/${round}/results`),
            api.get(`${year}/${round}/qualifying`)
        ]).then(axios.spread((R, Q) => {
            const {RaceTable: {Races: $races}} = R.data;
            const {RaceTable: {Races: $races_}} = Q.data;

            if (isMounted) {
                $races.length && (
                    $races[0].QualifyingResults = $races_[0]?.QualifyingResults || []
                );

                setRaces($races);
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
                                    <li>+</li>
                                </ul>
                            </div>
                        </div>
                    </>
                )
            })()}
        </>
    );
};
