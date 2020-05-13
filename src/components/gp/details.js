import React, {useState, useEffect} from 'react';
import axios from 'axios';
import API from '../../API';
import Alert from '../alert';
import Moment from 'react-moment';
import GPRaceResult from './race-result';
import GPQualifying from './qualifying';
import GPFastestLaps from './fastest-laps';
import GPStartingGrid from './starting-grid';
import GPPitStops from './pit-stops';
import GPV11n from './v11n';
import GPHighlights from './highlights';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCalendar} from '@fortawesome/free-regular-svg-icons';
import {faMapMarkerAlt, faPlayCircle} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

export default function GPDetails({match}) {
    const
        {params: {year, round}} = match,
        [busy, setBusy] = useState(true),
        [race, setRace] = useState(null),
        [wiki, setWiki] = useState(null);

    useEffect(() => {
        let isMounted = true;

        setRace(null);
        setBusy(true);

        const basePath = `${year}/${round}`;

        axios.all([
            // the first 3 are always there
            API.get(`${basePath}/results`),
            API.get(`${basePath}/qualifying`),
            API.get(`${basePath}/pitstops`),
            // except the laps
            API.get(`${basePath}/laps`).catch(() => null)
        ]).then(responses => {
            const objects = [];

            responses.forEach(response => {
                const {
                    data: {
                        RaceTable: {
                            Races: [obj] = []
                        } = {}
                    } = {}
                } = response || {};

                obj && objects.push(obj);
            });

            let state = {};

            if (isMounted && objects.length) {
                state = Object.assign({}, ...objects);
                setRace(state);
            }

            return state;
        }).then((state) => {
            if (!_.isEmpty(state)) {
                const
                    {url} = state,
                    {pathname} = new URL(url),
                    [, , path] = pathname.split('/');

                axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${path}`)
                    .then(response => {
                        const {data} = response;

                        setWiki(data);
                        setBusy(false);
                    });
            } else {
                setBusy(false);
            }
        }).catch((/*error*/) => {
            // const {response: {status}} = error;
            setBusy(false);
        });

        return () => {
            isMounted = false;
        };
    }, [year, round]);

    return (
        <>
            {busy ? <span data-uk-spinner=""/> : (() => {
                if (!race) {
                    return <Alert/>;
                }

                const {
                    url,
                    season,
                    date,
                    raceName,
                    Circuit: {
                        circuitName,
                        Location: {country, locality}
                    },
                    Laps = []
                } = race;

                return (
                    <>
                        <h1 className="uk-text-uppercase">{season} {raceName}</h1>
                        <FontAwesomeIcon icon={faCalendar}/>{' '}
                        <Moment format="DD MMM YYYY" className="uk-text-bold">{date}</Moment> / Round {round}
                        <div>
                            <FontAwesomeIcon icon={faMapMarkerAlt}/>{' '}
                            {circuitName} / {locality}, {country}
                        </div>
                        <hr className="uk-divider-icon"/>
                        {wiki && (() => {
                            const {extract_html, thumbnail: {source}} = wiki;

                            return (
                                <>
                                    <div data-uk-grid="" className="uk-grid-small">
                                        <div className="uk-width-expand">
                                            <div dangerouslySetInnerHTML={{__html: extract_html}}/>
                                        </div>
                                        <div className="uk-width-auto">
                                            <a href={url} title={raceName}>
                                                <img data-src={source} data-uk-img="" alt={circuitName}/>
                                            </a>
                                        </div>
                                    </div>
                                    <hr className="uk-divider-icon"/>
                                </>
                            );
                        })()}
                        <div data-uk-grid="">
                            <div className="uk-width-1-6">
                                <ul className="uk-tab-left" data-uk-tab="connect: #contents; animation: uk-animation-fade">
                                    <li><a href="/">Race Result</a></li>
                                    <li><a href="/">Qualifying</a></li>
                                    <li><a href="/">Starting Grid</a></li>
                                    <li><a href="/">Fastest Laps</a></li>
                                    <li><a href="/">Pit Stop Summary</a></li>
                                    <li><a href="/">Highlights</a></li>
                                </ul>

                                {Laps.length > 0 && (
                                    <>
                                        <button
                                            data-uk-toggle="target: #modal"
                                            type="button"
                                            className="uk-button uk-button-secondary uk-button-small">
                                            <FontAwesomeIcon icon={faPlayCircle}/>
                                            {' '}Visualization
                                            {' '}<span className="uk-text-lowercase">&beta;</span>
                                        </button>
                                        <div data-uk-modal="" id="modal" className="uk-modal-container">
                                            <div className="uk-modal-dialog uk-modal-body">
                                                <GPV11n race={race}/>
                                            </div>
                                        </div>
                                    </>
                                )}
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
                                    <li>
                                        <GPPitStops race={race}/>
                                    </li>
                                    <li>
                                        <GPHighlights race={race}/>
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
